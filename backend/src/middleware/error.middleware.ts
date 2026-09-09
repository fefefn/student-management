import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { ApiError, FieldError } from "../utils/ApiError";
import { capitalize } from "../utils/helpers";
import { isDevelopment } from "../config/env";

/** 404 for any route that was not matched. */
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

interface MongoDuplicateKeyError extends Error {
  code: number;
  keyValue?: Record<string, unknown>;
}

const isDuplicateKeyError = (error: unknown): error is MongoDuplicateKeyError => {
  return error instanceof Error && "code" in error && (error as { code: unknown }).code === 11000;
};

/**
 * Global error handler. Converts every known error type into the same
 * JSON shape: { success: false, message, errors?: [{ field, message }] }
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = "Something went wrong on the server";
  let errors: FieldError[] | undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errors = err.issues.map((issue) => ({
      field: issue.path.join(".") || "body",
      message: issue.message,
    }));
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
  } else if (isDuplicateKeyError(err)) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? "field";
    statusCode = 409;
    message = `${capitalize(field)} already exists`;
    errors = [{ field, message }];
  } else if (err instanceof SyntaxError && "body" in err) {
    statusCode = 400;
    message = "Request body is not valid JSON";
  }

  if (statusCode === 500) {
    console.error("Unhandled error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(isDevelopment && statusCode === 500 && err instanceof Error ? { stack: err.stack } : {}),
  });
};
