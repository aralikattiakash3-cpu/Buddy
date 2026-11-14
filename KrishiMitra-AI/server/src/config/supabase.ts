import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.js';

export const isBackendSupabaseConfigured = Boolean(
  env.SUPABASE_URL &&
  env.SUPABASE_SECRET_KEY &&
  !env.SUPABASE_URL.includes('placeholder') &&
  !env.SUPABASE_SECRET_KEY.includes('placeholder') &&
  env.SUPABASE_URL.startsWith('https://')
);

export const supabaseServer: SupabaseClient = createClient(
  isBackendSupabaseConfigured ? env.SUPABASE_URL : 'https://placeholder.supabase.co',
  isBackendSupabaseConfigured ? env.SUPABASE_SECRET_KEY : 'placeholder-secret-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
