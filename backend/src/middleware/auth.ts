import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

interface JwtUserPayload {
  userId: string;
  role: string;
  [key: string]: unknown;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtUserPayload;
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ error: 'Missing or invalid Authorization header' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Invalid Authorization header' });
  }

  const token = parts[1]!; // 👈 FIX 1

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof decoded === 'string') {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    if (!decoded.userId || !decoded.role) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    req.user = decoded as unknown as JwtUserPayload; // 👈 FIX 2

    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden: Insufficient role' });
    }
    next();
  };
}
