export interface FieldError {
  field: string;
  message: string;
}

/**
 * Error type thrown by services/controllers. The global error handler
 * turns it into a consistent JSON response.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors?: FieldError[];

  constructor(statusCode: number, message: string, errors?: FieldError[]) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errors?: FieldError[]): ApiError {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Not authorized"): ApiError {
    return new ApiError(401, message);
  }

  static notFound(message = "Resource not found"): ApiError {
    return new ApiError(404, message);
  }

  static conflict(message: string, errors?: FieldError[]): ApiError {
    return new ApiError(409, message, errors);
  }
}
