import type { RequestHandler } from 'express';

export const get: RequestHandler = (_req, res): void => {
  res.status(501).json({ error: 'Not implemented' });
};

export const update: RequestHandler = (_req, res): void => {
  res.status(501).json({ error: 'Not implemented' });
};
