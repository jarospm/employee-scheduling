import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import { createError } from '../middleware/errorHandler.js';
import type { CreateEmployeeInput } from '../schema.js';

const SALT_ROUNDS = 12;

// getAll — return all employee profiles
export async function getAll() {
  const employees = await prisma.employee.findMany({
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: 'asc' },
  });

  return employees.map((e) => ({
    id: e.id,
    firstName: e.firstName,
    lastName: e.lastName,
    email: e.user.email,
    phone: e.phone ?? undefined,
    position: e.position ?? undefined,
    avatar: e.avatar ?? undefined,
  }));
}

// getById — return a single employee profile, or throw if not found
export async function getById(id: string) {
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: { user: { select: { email: true } } },
  });

  if (!employee) {
    throw createError(404, 'Employee not found');
  }

  return {
    id: employee.id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.user.email,
    phone: employee.phone ?? undefined,
    position: employee.position ?? undefined,
    avatar: employee.avatar ?? undefined,
  };
}

// create — create a new user account and employee profile
export async function create(input: CreateEmployeeInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw createError(409, 'Email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      role: 'EMPLOYEE',
      employee: {
        create: {
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          position: input.position,
          avatar: input.avatar,
        },
      },
    },
    include: { employee: true },
  });

  const employee = user.employee;
  if (!employee) {
    throw createError(500, 'Failed to create employee profile');
  }

  return {
    id: employee.id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: user.email,
    phone: employee.phone ?? undefined,
    position: employee.position ?? undefined,
    avatar: employee.avatar ?? undefined,
  };
}
