import type { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err.statusCode) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}
