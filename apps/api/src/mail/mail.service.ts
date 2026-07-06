import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('mail.host'),
      port: this.config.get<number>('mail.port'),
      auth: {
        user: this.config.get<string>('mail.user'),
        pass: this.config.get<string>('mail.pass'),
      },
    });
  }

  async sendEmailVerification(email: string, firstName: string, token: string) {
    const frontendUrl = this.config.get<string>('app.frontendUrl');
    const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;

    await this.send({
      to: email,
      subject: 'Verify your FTax account',
      html: this.emailVerificationTemplate(firstName, verifyUrl),
    });
  }

  async sendOtp(email: string, otp: string) {
    await this.send({
      to: email,
      subject: `${otp} — Your FTax verification code`,
      html: this.otpTemplate(otp),
    });
  }

  async sendPasswordReset(email: string, firstName: string, token: string) {
    const frontendUrl = this.config.get<string>('app.frontendUrl');
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    await this.send({
      to: email,
      subject: 'Reset your FTax password',
      html: this.passwordResetTemplate(firstName, resetUrl),
    });
  }

  private async send(options: { to: string; subject: string; html: string }) {
    try {
      await this.transporter.sendMail({
        from: `FTax <${this.config.get<string>('mail.from')}>`,
        ...options,
      });
      this.logger.log(`Email sent to ${options.to}: ${options.subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}`, error);
      // Don't throw — email failures shouldn't break the app flow
    }
  }

  // ─── Email Templates ──────────────────────────────────────────────────────

  private otpTemplate(otp: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f5; margin: 0; padding: 20px; }
            .container { max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .header { background: #0f172a; padding: 28px 32px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 22px; letter-spacing: -0.5px; }
            .header span { color: #3b82f6; }
            .body { padding: 32px; text-align: center; }
            .body p { color: #374151; line-height: 1.6; margin: 0 0 16px; }
            .otp-box { display: inline-block; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px 40px; margin: 20px 0; }
            .otp-code { font-size: 42px; font-weight: 800; letter-spacing: 10px; color: #0f172a; font-family: 'Courier New', monospace; }
            .expiry { color: #6b7280; font-size: 13px; margin-top: 4px; }
            .footer { padding: 20px 32px; border-top: 1px solid #e5e7eb; text-align: center; }
            .footer p { color: #9ca3af; font-size: 12px; margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>F<span>Tax</span></h1>
            </div>
            <div class="body">
              <p style="font-size:16px; font-weight:600; color:#0f172a;">Your UIC verification code</p>
              <p>Enter this code to verify your @uic.edu email and create your FTax account.</p>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <div class="expiry">Expires in 10 minutes</div>
              </div>
              <p style="font-size:13px; color:#6b7280;">If you didn't request this, you can safely ignore this email. Do not share this code with anyone.</p>
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
            .header h1 { color: white; margin: 0; font-size: 24px; letter-spacing: -0.5px; }
            .header span { color: #3b82f6; }
            .body { padding: 32px; }
            .body p { color: #374151; line-height: 1.6; margin: 0 0 16px; }
            .btn { display: inline-block; background: #3b82f6; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
            .footer { padding: 24px 32px; border-top: 1px solid #e5e7eb; }
            .footer p { color: #9ca3af; font-size: 12px; margin: 0; }
            .url { word-break: break-all; color: #6b7280; font-size: 12px; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>F<span>Tax</span></h1>
            </div>
            <div class="body">
              <p>Hi ${firstName},</p>
              <p>Welcome to FTax — the F-1 student tax assistant for UIC. Please verify your email address to get started.</p>
              <a href="${verifyUrl}" class="btn">Verify Email Address</a>
              <p>This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
              <p class="url">Or copy this link: ${verifyUrl}</p>
            </div>
            <div class="footer">
              <p>University of Illinois Chicago · International Student Tax Assistant</p>
            </div>
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
            .header h1 { color: white; margin: 0; font-size: 24px; letter-spacing: -0.5px; }
            .header span { color: #3b82f6; }
            .body { padding: 32px; }
            .body p { color: #374151; line-height: 1.6; margin: 0 0 16px; }
            .btn { display: inline-block; background: #ef4444; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
            .footer { padding: 24px 32px; border-top: 1px solid #e5e7eb; }
            .footer p { color: #9ca3af; font-size: 12px; margin: 0; }
            .warning { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 12px; margin: 16px 0; }
            .warning p { color: #92400e; font-size: 14px; margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>F<span>Tax</span></h1>
            </div>
            <div class="body">
              <p>Hi ${firstName},</p>
              <p>We received a request to reset your FTax password. Click below to choose a new password.</p>
              <a href="${resetUrl}" class="btn">Reset Password</a>
              <div class="warning">
                <p>⚠️ This link expires in 1 hour. If you didn't request a password reset, please ignore this email — your account remains secure.</p>
              </div>
            </div>
            <div class="footer">
              <p>University of Illinois Chicago · International Student Tax Assistant</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
