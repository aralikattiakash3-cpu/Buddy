import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((v) => parseInt(v, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  SUPABASE_URL: z.string().default('https://placeholder.supabase.co'),
  SUPABASE_SECRET_KEY: z.string().default('placeholder-secret-key'),
  GEMINI_API_KEY: z.string().default('placeholder-gemini-key'),
  GEMINI_MODEL: z.string().default('gemini-3.8-flash'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
