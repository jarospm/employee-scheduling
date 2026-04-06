import type { Request, Response } from 'express';

export function get(_req: Request, res: Response): void {
  res.status(501).json({ error: 'Not implemented' });
}

export function update(_req: Request, res: Response): void {
  res.status(501).json({ error: 'Not implemented' });
}
