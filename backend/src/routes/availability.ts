import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All availability routes require authentication
router.use(authenticate);

// GET /:employeeId    — both roles (employee can only view own) → availabilityController.get

// PUT /:employeeId    — employee only (own data), validate body → availabilityController.update

export default router;
