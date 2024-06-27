import { defineConfig } from 'drizzle-kit';
import { DATABASE_URL } from './src/constants';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema.ts',
  out: './migrations',
  dbCredentials: {
    url: DATABASE_URL,
  },
});
