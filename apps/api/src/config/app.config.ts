import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.API_PORT || '3001', 10),
  url: process.env.API_URL || 'http://localhost:3001',
  frontendUrl: process.env.APP_URL || 'http://localhost:3000',
  appName: process.env.APP_NAME || 'FTax',
  encryptionKey: process.env.ENCRYPTION_KEY || '',
}));
