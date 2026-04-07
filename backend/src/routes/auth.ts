import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../schema.js';
import * as authController from '../controllers/auth.js';

const router = Router();

// Rate-limit login to 10 attempts per minute per IP
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later' },
});

// POST /auth/login — validate body with loginSchema, call authController.login
router.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  authController.login,
);

export default router;
