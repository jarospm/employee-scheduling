import type { RequestHandler } from 'express';
import type { UpdateScheduleInput } from '../schema.js';
import { updateSchedule } from '../services/schedule.js';

export const get: RequestHandler = (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
};

export const update: RequestHandler<
  Record<string, never>,
  unknown,
  UpdateScheduleInput
> = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const result = await updateSchedule(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'Employee not found') {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};
