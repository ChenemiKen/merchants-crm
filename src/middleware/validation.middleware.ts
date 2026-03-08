import { ValidationException } from '@/constants/exceptions';
import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

/**
 * Validation middleware for request data using Zod
 */
export const validateRequest = (schema: ZodSchema<unknown>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      throw new ValidationException("Input Validation Failed",
        validationResult.error.flatten().fieldErrors)
    }

    req.body = validationResult.data;
    next();
  };
};
