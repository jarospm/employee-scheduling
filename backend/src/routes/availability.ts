import { Router } from 'express';
import type { RequestHandler } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

const getAvailability: RequestHandler = (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
};

const updateAvailability: RequestHandler = (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
};

// GET /:employeeId    — both roles (employee can only view own) → availabilityController.get
router.get('/:employeeId', authenticate, getAvailability);

// PUT /:employeeId    — employee only (own data), validate body → availabilityController.update
router.put(
  '/:employeeId',
  authenticate,
  requireRole('EMPLOYEE'),
  updateAvailability,
);

export default router;
