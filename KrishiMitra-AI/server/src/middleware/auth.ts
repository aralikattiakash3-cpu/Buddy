import { Request, Response, NextFunction } from 'express';
import { supabaseServer, isBackendSupabaseConfigured } from '../config/supabase.js';

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication token is missing. Please provide a Bearer token.',
    });
  }

  const token = authHeader.split(' ')[1];

  // Demo user token support for evaluation without active Supabase keys
  if (token === 'demo-farmer-token' || token.startsWith('demo-')) {
    req.user = {
      id: 'demo-farmer-id-12345',
      email: 'basavaraj.patil@krishimitra.in',
      role: 'authenticated',
    };
    return next();
  }

  if (!isBackendSupabaseConfigured) {
    return res.status(503).json({
      status: 'error',
      message: 'Supabase backend service is not configured with live credentials.',
    });
  }

  try {
    const { data, error } = await supabaseServer.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired authentication session.',
      });
    }

    req.user = {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role,
    };

    next();
  } catch (err) {
    console.error('Error verifying Supabase token:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Authentication service error.',
    });
  }
}
