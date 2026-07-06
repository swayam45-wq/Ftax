import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend | null = null;
  private readonly fromAddress: string;
  private readonly isDev: boolean;

  constructor(private readonly config: ConfigService) {
    this.isDev = config.get<string>('NODE_ENV') !== 'production';
    this.fromAddress = config.get<string>('MAIL_FROM') || 'onboarding@resend.dev';

    const apiKey = config.get<string>('RESEND_API_KEY');

    if (apiKey && apiKey !== 're_your_api_key_here') {
      this.resend = new Resend(apiKey);
      this.logger.log('✅ Resend mail service ready');
    } else {
      this.logger.warn(
        '⚠️  RESEND_API_KEY not set — OTPs will be printed to the terminal in development.',
      );
    }
  }

  // ─── Public Methods ───────────────────────────────────────────────────────

  async sendOtp(email: string, otp: string) {
    // Always log OTP to console in dev so you can test without email
    if (this.isDev) {
      this.logger.log(
        `\n${'='.repeat(52)}\n📧  OTP EMAIL  →  ${email}\n🔑  Code       →  ${otp}\n⏱️  Expires in 10 minutes\n${'='.repeat(52)}`,
      );
    }

    await this.send({
      to: email,
      subject: `${otp} — Your FTax verification code`,
      html: this.otpTemplate(otp),
    });
  }

  async sendEmailVerification(email: string, firstName: string, token: string) {
    const frontendUrl = this.config.get<string>('APP_URL') || 'http://localhost:3000';
    const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;

    await this.send({
      to: email,
      subject: 'Verify your FTax account',
      html: this.emailVerificationTemplate(firstName, verifyUrl),
    });
  }

  async sendPasswordReset(email: string, firstName: string, token: string) {
    const frontendUrl = this.config.get<string>('APP_URL') || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    await this.send({
      to: email,
      subject: 'Reset your FTax password',
      html: this.passwordResetTemplate(firstName, resetUrl),
    });
  }

  // ─── Core Send ────────────────────────────────────────────────────────────

  private async send(options: { to: string; subject: string; html: string }) {
    if (!this.resend) {
      // No Resend key — silently succeed (OTP already logged to console)
      return;
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromAddress,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      if (error) {
        this.logger.error(`Resend error sending to ${options.to}: ${JSON.stringify(error)}`);
      } else {
        this.logger.log(`Email sent to ${options.to} (id: ${data?.id})`);
      }
    } catch (err) {
      this.logger.error(`Failed to send email to ${options.to}: ${(err as Error).message}`);
      // Never throw — email errors must not crash the app
    }
  }

  // ─── Email Templates ──────────────────────────────────────────────────────

  private otpTemplate(otp: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f5; margin: 0; padding: 20px; }
            .container { max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .header { background: #0f172a; padding: 28px 32px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 22px; letter-spacing: -0.5px; }
            .header span { color: #3b82f6; }
            .body { padding: 32px; text-align: center; }
            .subtitle { font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 12px; }
            .desc { color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 24px; }
            .otp-box { display: inline-block; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px 48px; }
            .otp-code { font-size: 44px; font-weight: 800; letter-spacing: 12px; color: #0f172a; font-family: 'Courier New', Courier, monospace; }
            .expiry { color: #6b7280; font-size: 12px; margin-top: 8px; }
            .note { font-size: 12px; color: #9ca3af; margin: 24px 0 0; }
            .footer { padding: 20px 32px; border-top: 1px solid #f1f5f9; text-align: center; }
            .footer p { color: #9ca3af; font-size: 11px; margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>F<span>Tax</span></h1>
            </div>
            <div class="body">
              <p class="subtitle">Your UIC verification code</p>
              <p class="desc">Enter this code to verify your @uic.edu email address and create your FTax account.</p>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <div class="expiry">⏱ Expires in 10 minutes</div>
              </div>
              <p class="note">If you didn't request this, you can safely ignore this email.<br>Do not share this code with anyone.</p>
            </div>
            <div class="footer">
              <p>University of Illinois Chicago &middot; International Student Tax Assistant</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private emailVerificationTemplate(firstName: string, verifyUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f5; margin: 0; padding: 20px; }
            .container { max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .header { background: #0f172a; padding: 32px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .header span { color: #3b82f6; }
            .body { padding: 32px; }
            .body p { color: #374151; line-height: 1.6; margin: 0 0 16px; font-size: 14px; }
            .btn { display: inline-block; background: #3b82f6; color: white !important; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 8px 0; }
            .footer { padding: 24px 32px; border-top: 1px solid #f1f5f9; }
            .footer p { color: #9ca3af; font-size: 11px; margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>F<span>Tax</span></h1></div>
            <div class="body">
              <p>Hi ${firstName},</p>
              <p>Please verify your email address to get started with FTax.</p>
              <a href="${verifyUrl}" class="btn">Verify Email Address</a>
              <p style="margin-top:16px;">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
            </div>
            <div class="footer"><p>University of Illinois Chicago &middot; International Student Tax Assistant</p></div>
          </div>
        </body>
      </html>
    `;
  }

  private passwordResetTemplate(firstName: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f5; margin: 0; padding: 20px; }
            .container { max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .header { background: #0f172a; padding: 32px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .header span { color: #3b82f6; }
            .body { padding: 32px; }
            .body p { color: #374151; line-height: 1.6; margin: 0 0 16px; font-size: 14px; }
            .btn { display: inline-block; background: #ef4444; color: white !important; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 8px 0; }
            .footer { padding: 24px 32px; border-top: 1px solid #f1f5f9; }
            .footer p { color: #9ca3af; font-size: 11px; margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>F<span>Tax</span></h1></div>
            <div class="body">
              <p>Hi ${firstName},</p>
              <p>We received a request to reset your FTax password. Click below to set a new one.</p>
              <a href="${resetUrl}" class="btn">Reset Password</a>
              <p style="margin-top:16px;">⚠️ This link expires in 1 hour. If you didn't request this, your account is safe — just ignore this email.</p>
            </div>
            <div class="footer"><p>University of Illinois Chicago &middot; International Student Tax Assistant</p></div>
          </div>
        </body>
      </html>
    `;
  }
}
