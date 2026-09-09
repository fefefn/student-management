import type { ApiResponse, Course, CourseFormValues } from "../types";
import { api } from "./api";

const toPayload = (values: CourseFormValues) => ({
  name: values.name.trim(),
  description: values.description.trim(),
  duration: values.duration.trim(),
  fees: Number(values.fees),
});

export const courseService = {
  async getAll(): Promise<Course[]> {
    const { data } = await api.get<ApiResponse<Course[]>>("/courses");
    return data.data;
  },

  async getById(id: string): Promise<Course> {
    const { data } = await api.get<ApiResponse<Course>>(`/courses/${id}`);
    return data.data;
  },

  async create(values: CourseFormValues): Promise<Course> {
    const { data } = await api.post<ApiResponse<Course>>("/courses", toPayload(values));
    return data.data;
  },

  async update(id: string, values: CourseFormValues): Promise<Course> {
    const { data } = await api.put<ApiResponse<Course>>(`/courses/${id}`, toPayload(values));
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/courses/${id}`);
  },
};
