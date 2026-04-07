import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// All employee routes require authentication and EMPLOYER role
router.use(authenticate, requireRole('EMPLOYER'));

// GET /        — employer only → employeesController.getAll

// POST /       — employer only, validate body with createEmployeeSchema → employeesController.create

// GET /:id     — employer only → employeesController.getById

export default router;
