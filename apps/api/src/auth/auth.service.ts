import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { AuditService } from '../audit/audit.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private readonly BCRYPT_ROUNDS = 12;
  private readonly ACCESS_TOKEN_EXPIRY = '15m';
  private readonly REFRESH_TOKEN_EXPIRY_DAYS = 7;
  private readonly EMAIL_VERIFY_EXPIRY_HOURS = 24;
  private readonly PASSWORD_RESET_EXPIRY_HOURS = 1;
  private readonly OTP_EXPIRY_MINUTES = 10;
  private readonly OTP_MAX_ATTEMPTS = 5;
  private readonly OTP_VERIFIED_TOKEN_EXPIRY_MINUTES = 30;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mailService: MailService,
    private readonly auditService: AuditService,
  ) {}

  // ─── Send OTP ─────────────────────────────────────────────────────────────

  async sendOtp(email: string, ipAddress?: string) {
    const normalised = email.toLowerCase().trim();

    // Enforce @uic.edu domain
    if (!normalised.endsWith('@uic.edu')) {
      throw new ForbiddenException(
        'Only University of Illinois Chicago email addresses (@uic.edu) are allowed to register.',
      );
    }

    // Don't let someone who already has an account re-use OTP flow
    const existing = await this.prisma.user.findUnique({ where: { email: normalised } });
    if (existing) {
      throw new ConflictException('An account with this UIC email already exists. Please log in.');
    }

    // Rate-limit: invalidate any unexpired OTPs for this email first
    await this.prisma.emailOtp.updateMany({
      where: { email: normalised, verified: false, usedAt: null },
      data: { usedAt: new Date() }, // mark old ones as consumed
    });

    // Generate a cryptographically secure 6-digit OTP
    const otp = this.generateSixDigitOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    // Also create a pre-verified token (used AFTER OTP confirmed)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

    await this.prisma.emailOtp.create({
      data: { email: normalised, otpHash, token, expiresAt },
    });

    // Send OTP email
    await this.mailService.sendOtp(normalised, otp);

    await this.auditService.log({
      action: 'OTP_SENT',
      resource: 'EmailOtp',
      metadata: { email: normalised },
      ipAddress,
    });

    return {
      message: `A 6-digit verification code has been sent to ${normalised}. It expires in ${this.OTP_EXPIRY_MINUTES} minutes.`,
    };
  }

  // ─── Verify OTP ───────────────────────────────────────────────────────────

  async verifyOtp(email: string, otp: string, ipAddress?: string) {
    const normalised = email.toLowerCase().trim();

    // Find the most recent valid OTP record for this email
    const record = await this.prisma.emailOtp.findFirst({
      where: {
        email: normalised,
        verified: false,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BadRequestException(
        'No valid OTP found for this email. Please request a new one.',
      );
    }

    // Brute-force guard
    if (record.attempts >= this.OTP_MAX_ATTEMPTS) {
      await this.prisma.emailOtp.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      });
      throw new BadRequestException(
        'Too many incorrect attempts. Please request a new OTP.',
      );
    }

    const isCorrect = await bcrypt.compare(otp, record.otpHash);

    if (!isCorrect) {
      // Increment attempts
      await this.prisma.emailOtp.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      const remaining = this.OTP_MAX_ATTEMPTS - (record.attempts + 1);
      throw new BadRequestException(
        `Incorrect code. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
      );
    }

    // Mark OTP as verified, extend token expiry to 30 min for account creation
    const verifiedTokenExpiry = new Date(
      Date.now() + this.OTP_VERIFIED_TOKEN_EXPIRY_MINUTES * 60 * 1000,
    );
    await this.prisma.emailOtp.update({
      where: { id: record.id },
      data: { verified: true, expiresAt: verifiedTokenExpiry },
    });

    await this.auditService.log({
      action: 'OTP_VERIFIED',
      metadata: { email: normalised },
      ipAddress,
    });

    return {
      message: 'Email verified successfully. You can now create your account.',
      otpToken: record.token, // frontend passes this to /register
    };
  }

  // ─── Register ─────────────────────────────────────────────────────────────

  async register(dto: RegisterDto, ipAddress?: string) {
    const normalised = dto.email.toLowerCase().trim();

    // 1. Enforce @uic.edu domain (disabled in dev for testing)
    if (process.env.NODE_ENV === 'production' && !normalised.endsWith('@uic.edu')) {
      throw new ForbiddenException(
        'Only University of Illinois Chicago email addresses (@uic.edu) are allowed to register.',
      );
    }

    // 2. Check duplicate email
    const existing = await this.prisma.user.findUnique({ where: { email: normalised } });
    if (existing) {
      throw new ConflictException('An account with this UIC email already exists. Please log in.');
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(dto.password, this.BCRYPT_ROUNDS);

    // 4. Create user + profile
    const user = await this.prisma.user.create({
      data: {
        email: normalised,
        passwordHash,
        emailVerified: true, // @uic.edu domain is trusted — no OTP needed
        profile: {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            university: 'University of Illinois Chicago',
          },
        },
      },
    });

    await this.auditService.log({
      userId: user.id,
      action: 'USER_REGISTERED',
      resource: 'User',
      resourceId: user.id,
      ipAddress,
    });

    return {
      message: 'Account created successfully. You can now log in.',
      userId: user.id,
    };
  }

  // ─── Validate User (for LocalStrategy) ───────────────────────────────────

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  // ─── Login ────────────────────────────────────────────────────────────────

  async login(
    user: { id: string; email: string; role: string },
    ipAddress?: string,
    userAgent?: string,
  ) {
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.generateAccessToken(user.id, user.email, user.role);
    const refreshToken = await this.generateRefreshToken(user.id, ipAddress, userAgent);

    await this.auditService.log({ userId: user.id, action: 'USER_LOGIN', ipAddress });

    return { accessToken, refreshToken };
  }

  // ─── Refresh Token ────────────────────────────────────────────────────────

  async refresh(refreshToken: string, ipAddress?: string) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    const newAccessToken = this.generateAccessToken(
      storedToken.user.id,
      storedToken.user.email,
      storedToken.user.role,
    );
    const newRefreshToken = await this.generateRefreshToken(storedToken.user.id, ipAddress);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  // ─── Logout ───────────────────────────────────────────────────────────────

  async logout(refreshToken: string, userId: string) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, userId },
      data: { isRevoked: true },
    });

    await this.auditService.log({ userId, action: 'USER_LOGOUT' });
  }

  // ─── Forgot Password ──────────────────────────────────────────────────────

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
    });

    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(
        Date.now() + this.PASSWORD_RESET_EXPIRY_HOURS * 60 * 60 * 1000,
      );

      await this.prisma.passwordReset.create({
        data: { userId: user.id, token, expiresAt },
      });

      await this.mailService.sendPasswordReset(
        user.email,
        user.profile?.firstName || 'Student',
        token,
      );

      await this.auditService.log({ userId: user.id, action: 'PASSWORD_RESET_REQUESTED' });
    }

    return { message: 'If this email is registered, a password reset link has been sent.' };
  }

  // ─── Reset Password ───────────────────────────────────────────────────────

  async resetPassword(dto: ResetPasswordDto) {
    const record = await this.prisma.passwordReset.findUnique({ where: { token: dto.token } });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset link');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.BCRYPT_ROUNDS);

    await this.prisma.$transaction([
      this.prisma.passwordReset.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId: record.userId },
        data: { isRevoked: true },
      }),
    ]);

    await this.auditService.log({ userId: record.userId, action: 'PASSWORD_RESET_COMPLETED' });

    return { message: 'Password reset successfully. Please log in with your new password.' };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private generateSixDigitOtp(): string {
    // Cryptographically random 6-digit code (000000–999999)
    const bytes = crypto.randomBytes(3);
    const num = (bytes.readUIntBE(0, 3) % 1000000).toString().padStart(6, '0');
    return num;
  }

  private generateAccessToken(userId: string, email: string, role: string) {
    return this.jwtService.sign({ sub: userId, email, role });
  }

  private async generateRefreshToken(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const token = crypto.randomBytes(40).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(
      Date.now() + this.REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    );

    await this.prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt, ipAddress, userAgent },
    });

    return token;
  }
}
