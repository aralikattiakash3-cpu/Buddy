import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.js';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    env.SUPABASE_URL &&
    !env.SUPABASE_URL.includes('placeholder') &&
    env.SUPABASE_ANON_KEY &&
    !env.SUPABASE_ANON_KEY.includes('placeholder')
  );
};

export const getSupabaseAdmin = (): SupabaseClient => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please supply valid SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }

  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;
  return createClient(env.SUPABASE_URL, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export const createScopedClient = (accessToken: string): SupabaseClient => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured.');
  }

  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
