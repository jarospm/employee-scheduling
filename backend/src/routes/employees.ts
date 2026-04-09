import { Router } from 'express';
import {
  getAllEmployees,
  createEmployee,
  getEmployeeById,
} from '../controllers/employees.js';
import { requireRole } from '../middleware/auth.js';

const router = Router();

// GET /employees — list all (employer only)
router.get('/', requireRole('employer'), getAllEmployees);

// POST /employees — create user + profile, employer sets initial password (employer only)
router.post('/', requireRole('employer'), createEmployee);

// GET /employees/:id — single profile (employer only)
router.get('/:id', requireRole('employer'), getEmployeeById);

export default router;
