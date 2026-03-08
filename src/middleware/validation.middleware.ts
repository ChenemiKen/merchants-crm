import { NextFunction, Request, Response } from 'express';
// import { unifiedResponse } from 'uni-response';
import { ZodSchema } from 'zod';

/**
 * Validation middleware for request data using Zod
 */
export const validateRequest = (schema: ZodSchema<unknown>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      // Extract error messages
      // const errorMessages = validationResult.error.flatten()
      // .fieldErrors .map(err => ({
      //   path: err.path.join('.'),
      //   message: err.message,
      // }));

      // Send a response if validation fails
      res.status(400).json({
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors
      });

      return;
    }

    // Attach parsed data to the request object (optional, but useful)
    req.body = validationResult.data;

    // Call next middleware if validation passes
    next();
  };
};
