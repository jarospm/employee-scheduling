import { z } from 'zod';

// loginSchema — POST /auth/login (email, password)
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;

// createEmployeeSchema — POST /employees (firstName, lastName, email, password, phone?, position?, avatar?)
export const createEmployeeSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  phone: z.string().optional(),
  position: z.string().optional(),
  avatar: z.string().url().optional(),
});
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

// updateAvailabilitySchema — PUT /availability/:employeeId
export const updateAvailabilitySchema = z.object({
  entries: z.array(
    z.object({
      date: z.string().date(),
      shiftType: z.enum(['MORNING', 'AFTERNOON', 'NIGHT']),
      isAvailable: z.boolean(),
    }),
  ),
});
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>;

// updateScheduleSchema — PUT /schedule
export const updateScheduleSchema = z.object({
  entries: z.array(
    z.object({
      date: z.string().date(),
      shiftType: z.enum(['MORNING', 'AFTERNOON', 'NIGHT']),
      employeeId: z.string().uuid(),
    }),
  ),
});
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
