import { Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service";
import { sendSuccess } from "../utils/apiResponse";

/** GET /api/dashboard/stats */
export const getStats = async (_req: Request, res: Response): Promise<void> => {
  const stats = await dashboardService.getDashboardStats();
  sendSuccess(res, stats);
};
