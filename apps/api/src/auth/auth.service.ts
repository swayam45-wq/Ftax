import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { AuditService } from '../audit/audit.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private readonly BCRYPT_ROUNDS = 12;
  private readonly ACCESS_TOKEN_EXPIRY = '15m';
  private readonly REFRESH_TOKEN_EXPIRY_DAYS = 7;
  private readonly EMAIL_VERIFY_EXPIRY_HOURS = 24;
  private readonly PASSWORD_RESET_EXPIRY_HOURS = 1;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mailService: MailService,
    private readonly auditService: AuditService,
  ) {}

  // ─── Register ─────────────────────────────────────────────────────────────

  async register(dto: RegisterDto, ipAddress?: string) {
    // Check if email already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, this.BCRYPT_ROUNDS);

    // Create user + profile in a transaction
    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: dto.email.toLowerCase(),
          passwordHash,
          profile: {
            create: {
              firstName: dto.firstName,
              lastName: dto.lastName,
              university: 'University of Illinois Chicago',
            },
          },
        },
      });

      // Create email verification token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(
        Date.now() + this.EMAIL_VERIFY_EXPIRY_HOURS * 60 * 60 * 1000,
      );

      await tx.emailVerification.create({
        data: { userId: newUser.id, token, expiresAt },
      });

      return { user: newUser, verificationToken: token };
    });

    // Send verification email
    await this.mailService.sendEmailVerification(
      dto.email,
      dto.firstName,
      user.verificationToken,
    );

    // Audit log
    await this.auditService.log({
      userId: user.user.id,
      action: 'USER_REGISTERED',
      resource: 'User',
      resourceId: user.user.id,
      ipAddress,
    });

    return {
      message: 'Account created. Please check your email to verify your account.',
      userId: user.user.id,
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

  async login(user: { id: string; email: string; role: string }, ipAddress?: string, userAgent?: string) {
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.generateAccessToken(user.id, user.email, user.role);
    const refreshToken = await this.generateRefreshToken(user.id, ipAddress, userAgent);

    await this.auditService.log({
      userId: user.id,
      action: 'USER_LOGIN',
      ipAddress,
    });

    return { accessToken, refreshToken };
  }

  // ─── Refresh Token ────────────────────────────────────────────────────────

  async refresh(refreshToken: string, ipAddress?: string) {
    // Hash the incoming token to compare with stored hash
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Rotate: revoke old, issue new
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    const newAccessToken = this.generateAccessToken(
      storedToken.user.id,
      storedToken.user.email,
      storedToken.user.role,
    );
    const newRefreshToken = await this.generateRefreshToken(
      storedToken.user.id,
      ipAddress,
    );

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

  // ─── Email Verification ───────────────────────────────────────────────────

  async verifyEmail(token: string) {
    const record = await this.prisma.emailVerification.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired verification link');
    }

    await this.prisma.$transaction([
      this.prisma.emailVerification.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: record.userId },
        data: { emailVerified: true },
      }),
    ]);

    await this.auditService.log({
      userId: record.userId,
      action: 'EMAIL_VERIFIED',
    });

    return { message: 'Email verified successfully. You can now log in.' };
  }

  // ─── Resend Verification ──────────────────────────────────────────────────

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
    });

    if (!user) {
      // Don't reveal if email exists
      return { message: 'If this email is registered, a verification link has been sent.' };
    }

    if (user.emailVerified) {
      return { message: 'Email is already verified.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + this.EMAIL_VERIFY_EXPIRY_HOURS * 60 * 60 * 1000);

    await this.prisma.emailVerification.create({
      data: { userId: user.id, token, expiresAt },
    });

    await this.mailService.sendEmailVerification(
      user.email,
      user.profile?.firstName || 'Student',
      token,
    );

    return { message: 'If this email is registered, a verification link has been sent.' };
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
    const record = await this.prisma.passwordReset.findUnique({
      where: { token: dto.token },
    });

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
      // Revoke all refresh tokens for security
      this.prisma.refreshToken.updateMany({
        where: { userId: record.userId },
        data: { isRevoked: true },
      }),
    ]);

    await this.auditService.log({ userId: record.userId, action: 'PASSWORD_RESET_COMPLETED' });

    return { message: 'Password reset successfully. Please log in with your new password.' };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private generateAccessToken(userId: string, email: string, role: string) {
    return this.jwtService.sign({ sub: userId, email, role });
  }

  private async generateRefreshToken(userId: string, ipAddress?: string, userAgent?: string) {
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
