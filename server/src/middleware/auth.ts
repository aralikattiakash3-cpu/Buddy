import { Request, Response, NextFunction } from 'express';
import { isSupabaseConfigured, createScopedClient } from '../config/supabase.js';
import '../types/index.js';

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication token missing or invalid',
        data: null,
        error: {
          code: 'UNAUTHORIZED',
        },
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!isSupabaseConfigured()) {
      // In development environments prior to providing Supabase credentials,
      // allow development testing if token is a dev token, otherwise report setup needed.
      if (process.env.NODE_ENV === 'development' && token.startsWith('dev-user-')) {
        req.user = {
          id: token.replace('dev-user-', ''),
          email: 'farmer@example.com',
        };
        req.rawToken = token;
        return next();
      }

      res.status(503).json({
        success: false,
        message: 'Authentication service is not configured. Please configure SUPABASE_URL and SUPABASE_ANON_KEY.',
        data: null,
        error: {
          code: 'AUTH_SERVICE_UNCONFIGURED',
        },
      });
      return;
    }

    const scopedClient = createScopedClient(token);
    const { data, error } = await scopedClient.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication session',
        data: null,
        error: {
          code: 'INVALID_TOKEN',
          details: error?.message,
        },
      });
      return;
    }

    req.user = {
      id: data.user.id,
      email: data.user.email,
    };
    req.scopedSupabase = scopedClient;
    req.rawToken = token;

    next();
  } catch (err: any) {
    next(err);
  }
};
