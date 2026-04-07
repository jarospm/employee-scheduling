import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../schema.js';
import * as authController from '../controllers/auth.js';

const router = Router();

// POST /auth/login — validate body with loginSchema, call authController.login
router.post('/login', validate(loginSchema), authController.login);

export default router;
