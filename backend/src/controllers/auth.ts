import type { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.js';
import type { LoginInput } from '../schema.js';

export async function login(
  req: Request<object, object, LoginInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
