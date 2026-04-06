import { Router } from 'express';
import * as scheduleController from '../controllers/schedule.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /     — both roles (employee sees own shifts only), supports ?weekOf query → scheduleController.get
router.get('/', authenticate, scheduleController.get);

// PUT /     — employer only, validate body → scheduleController.update
router.put(
  '/',
  authenticate,
  requireRole('EMPLOYER'),
  scheduleController.update,
);

export default router;
