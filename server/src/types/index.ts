import { SupabaseClient } from '@supabase/supabase-js';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  error: {
    code: string;
    details?: any;
  } | null;
}

export interface AuthenticatedUser {
  id: string;
  email?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      scopedSupabase?: SupabaseClient;
      rawToken?: string;
    }
  }
}
