import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { sendSuccess } from "../utils/apiResponse";

/** POST /api/auth/register */
export const register = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.registerUser(req.body);
  sendSuccess(res, result, 201, "Account created successfully");
};

/** POST /api/auth/login */
export const login = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.loginUser(req.body);
  sendSuccess(res, result, 200, "Logged in successfully");
};

/** GET /api/auth/profile (protected) */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  sendSuccess(res, req.user);
};
