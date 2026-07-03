import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasourceUrl: process.env.DATABASE_URL ?? 'postgresql://ftax_user:ftax_password@localhost:5432/ftax_db',
});
