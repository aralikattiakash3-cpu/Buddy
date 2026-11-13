import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(val => parseInt(val, 10)).default('5000'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  
  SUPABASE_URL: z.string().url().or(z.string().min(1)).default('https://placeholder.supabase.co'),
  SUPABASE_ANON_KEY: z.string().default('placeholder-anon-key'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default('placeholder-service-key'),
  
  GEMINI_API_KEY: z.string().default('placeholder-gemini-key'),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  
  MAX_IMAGE_SIZE_MB: z.string().transform(val => parseInt(val, 10)).default('8'),
  RATE_LIMIT_WINDOW_MS: z.string().transform(val => parseInt(val, 10)).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(val => parseInt(val, 10)).default('60'),
  LOG_LEVEL: z.string().default('info')
});

export const env = envSchema.parse(process.env);
