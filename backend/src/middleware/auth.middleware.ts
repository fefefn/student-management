import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { verifyToken } from "../utils/jwt";

/**
 * Protects a route: requires a valid `Authorization: Bearer <token>` header.
 * On success the authenticated user is available as `req.user`.
 */
export const protect = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Not authorized. Please log in.");
  }

  const token = header.split(" ")[1];

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw ApiError.unauthorized("Session is invalid or has expired. Please log in again.");
  }

  const user = await User.findById(payload.id);
  if (!user) {
    throw ApiError.unauthorized("The user belonging to this token no longer exists.");
  }

  req.user = user;
  next();
};
