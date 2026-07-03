import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { TaxModule } from './tax/tax.module';
import { MailModule } from './mail/mail.module';
import { AuditModule } from './audit/audit.module';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import mailConfig from './config/mail.config';

@Module({
  imports: [
    // ─── Config ───────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, mailConfig],
      envFilePath: ['.env'],
    }),

    // ─── Rate Limiting ────────────────────────────────────────────────────
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          name: 'short',
          ttl: 1000,
          limit: 10,
        },
        {
          name: 'medium',
          ttl: 10000,
          limit: 50,
        },
        {
          name: 'long',
          ttl: 60000,
          limit: 200,
        },
      ],
    }),

    // ─── Core Modules ──────────────────────────────────────────────────────
    PrismaModule,
    MailModule,
    AuditModule,

    // ─── Feature Modules ───────────────────────────────────────────────────
    AuthModule,
    ProfileModule,
    TaxModule,
  ],
})
export class AppModule {}
