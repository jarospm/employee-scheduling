import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import type { LoginInput } from '../schema.js';

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    const err = new Error('Invalid credentials') as Error & {
      statusCode: number;
    };
    err.statusCode = 401;
    throw err;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Server misconfiguration: JWT_SECRET not set');
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, secret, {
    expiresIn: '8h',
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}
