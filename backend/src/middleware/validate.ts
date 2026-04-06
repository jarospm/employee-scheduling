// validate(schema) — generic factory, returns middleware that:
//   - Parses req.body against the given Zod schema
//   - On success: replaces req.body with parsed data (strips unknown fields), calls next()
//   - On failure: returns 400 with Zod error details
//
// Usage in routes: router.post('/', validate(createEmployeeSchema), controller.create)
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export function validate(schema: z.ZodType<unknown>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: 'Validation error',
        details: result.error.flatten(),
      });
      return;
    }

    req.body = result.data;
    next();
  };
}
