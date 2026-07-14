import { defineConfig } from 'prisma/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Explicitly load .env from apps/api directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  datasource: {
    url:
      process.env.DATABASE_URL ??
      'postgresql://ftax_user:ftax_password@localhost:5432/ftax_db',
  },
});
