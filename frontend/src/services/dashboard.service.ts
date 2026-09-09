import type { ApiResponse, DashboardStats } from "../types";
import { api } from "./api";

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const { data } = await api.get<ApiResponse<DashboardStats>>("/dashboard/stats");
    return data.data;
  },
};
