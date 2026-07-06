import { defineConfig } from 'prisma/config';

// Prisma v7 uses `datasource: { url }` — NOT `datasourceUrl`
export default defineConfig({
  datasource: {
    url:
      process.env.DATABASE_URL ??
      'postgresql://ftax_user:ftax_password@localhost:5432/ftax_db',
  },
});
