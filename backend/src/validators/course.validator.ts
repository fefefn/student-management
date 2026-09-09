import { z } from "zod";

export const createCourseSchema = z.object({
  name: z
    .string({ required_error: "Course name is required" })
    .trim()
    .min(2, "Course name must be at least 2 characters")
    .max(100, "Course name cannot exceed 100 characters"),
  description: z
    .string({ required_error: "Description is required" })
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
  duration: z
    .string({ required_error: "Duration is required" })
    .trim()
    .min(1, "Duration is required")
    .max(50, "Duration cannot exceed 50 characters"),
  fees: z.coerce
    .number({ required_error: "Fees are required", invalid_type_error: "Fees must be a number" })
    .min(0, "Fees cannot be negative"),
});

export const updateCourseSchema = createCourseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: "At least one field is required" });

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
