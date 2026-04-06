import type { Request, Response } from 'express';

export function getAll(_req: Request, res: Response): void {
  res.status(501).json({ error: 'Not implemented' });
}

export function create(_req: Request, res: Response): void {
  res.status(501).json({ error: 'Not implemented' });
}

export function getById(_req: Request, res: Response): void {
  res.status(501).json({ error: 'Not implemented' });
}
