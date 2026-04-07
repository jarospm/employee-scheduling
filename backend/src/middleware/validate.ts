import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

// validate(schema) — generic factory, returns middleware that:
//   - Parses req.body against the given Zod schema
//   - On success: replaces req.body with parsed data (strips unknown fields), calls next()
//   - On failure: returns 400 with Zod error details
//
// Usage in routes: router.post('/', validate(createEmployeeSchema), controller.create)
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.issues });
      return;
    }
    req.body = result.data;
    next();
  };
}
