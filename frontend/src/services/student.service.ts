import type { ApiResponse, PaginatedResponse, Student, StudentFormValues, StudentListParams } from "../types";
import { api } from "./api";

/** Removes empty filter values so they are not sent as `?status=` */
const cleanParams = (params: StudentListParams): Record<string, string | number> =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== "" && value !== undefined && value !== null)
  ) as Record<string, string | number>;

export const studentService = {
  async getAll(params: StudentListParams = {}): Promise<PaginatedResponse<Student>> {
    const { data } = await api.get<PaginatedResponse<Student>>("/students", { params: cleanParams(params) });
    return data;
  },

  async getById(id: string): Promise<Student> {
    const { data } = await api.get<ApiResponse<Student>>(`/students/${id}`);
    return data.data;
  },

  async create(payload: StudentFormValues): Promise<Student> {
    const { data } = await api.post<ApiResponse<Student>>("/students", payload);
    return data.data;
  },

  async update(id: string, payload: StudentFormValues): Promise<Student> {
    const { data } = await api.put<ApiResponse<Student>>(`/students/${id}`, payload);
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/students/${id}`);
  },
};
