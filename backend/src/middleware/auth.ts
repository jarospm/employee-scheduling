import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  userId: string;
  role: 'EMPLOYER' | 'EMPLOYEE';
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

// authenticate — reads "Authorization: Bearer <token>" header
//   - Verifies JWT with process.env.JWT_SECRET
//   - Attaches decoded payload (userId, role) to req.user
//   - Returns 401 if token is missing or invalid
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const token = header.slice(7);
  const secret = process.env['JWT_SECRET'];
  if (!secret) {
    res.status(500).json({ error: 'Server misconfiguration' });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Not authenticated' });
  }
}

// requireRole(role) — returns middleware that checks req.user.role
//   - Returns 403 if the user's role doesn't match
//   - Must run after authenticate
export function requireRole(role: 'EMPLOYER' | 'EMPLOYEE') {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.role !== role) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    next();
  };
}
