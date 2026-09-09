import { Request, Response, NextFunction } from "express";

/** Minimal request logger for development: METHOD url status - duration */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
};
