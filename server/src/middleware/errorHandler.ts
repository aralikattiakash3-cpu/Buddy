import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || (err instanceof ZodError ? 400 : 500);

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed for request data',
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        details: err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    });
    return;
  }

  const isDevelopment = process.env.NODE_ENV !== 'production';

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An internal server error occurred',
    data: null,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      ...(isDevelopment && err.details ? { details: err.details } : {}),
      ...(isDevelopment && err.stack ? { stack: err.stack } : {}),
    },
  });
};
