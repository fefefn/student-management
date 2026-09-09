import type { ApiResponse, AuthResponse, LoginCredentials, RegisterData, User } from "../types";
import { api } from "./api";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/login", credentials);
    return data.data;
  },

  async register(payload: RegisterData): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/register", payload);
    return data.data;
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>("/auth/profile");
    return data.data;
  },
};
