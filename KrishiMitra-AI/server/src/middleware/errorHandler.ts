import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Handle Zod Schema Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Handle SyntaxError (e.g. malformed JSON body)
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      status: 'error',
      message: 'Malformed JSON payload provided',
    });
  }

  // Catch-all internal server error (never leak sensitive stack traces)
  console.error('Unhandled server error:', err);
  return res.status(500).json({
    status: 'error',
    message: 'An internal server error occurred. Please try again later.',
  });
}
