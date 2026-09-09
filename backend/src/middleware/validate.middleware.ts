import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Validates and sanitises `req.body` against a Zod schema.
 * A ZodError is thrown on failure and converted to a 400 by the error handler.
 */
export const validateBody =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    req.body = schema.parse(req.body ?? {});
    next();
  };
