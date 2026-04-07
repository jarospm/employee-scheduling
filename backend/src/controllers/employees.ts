import type { Request, Response, NextFunction } from 'express';
import * as employeesService from '../services/employees.js';
import type { CreateEmployeeInput } from '../schema.js';

// getAll
export async function getAll(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const employees = await employeesService.getAll();
    res.json({ employees });
  } catch (err) {
    next(err);
  }
}

// create
export async function create(
  req: Request<object, object, CreateEmployeeInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const employee = await employeesService.create(req.body);
    res.status(201).json({ employee });
  } catch (err) {
    next(err);
  }
}

// getById
export async function getById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const employee = await employeesService.getById(req.params.id);
    res.json({ employee });
  } catch (err) {
    next(err);
  }
}
