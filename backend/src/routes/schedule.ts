import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All schedule routes require authentication
router.use(authenticate);

// GET /     — both roles (employee sees own shifts only), supports ?weekOf query → scheduleController.get

// PUT /     — employer only, validate body → scheduleController.update

export default router;
