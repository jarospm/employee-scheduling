import type { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

// Global error handler — registered once in index.ts after all routes:
//   app.use(errorHandler)

// Catches any error thrown or passed via next(error):
//   - Known errors (e.g. with a statusCode property): return that status + message
//   - Unknown errors: log the stack trace, return 500 + generic message
//   - Always returns JSON: { "error": "message" }
export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  if (err.statusCode) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
}

export function createError(statusCode: number, message: string): AppError {
  const err: AppError = new Error(message);
  err.statusCode = statusCode;
  return err;
}
