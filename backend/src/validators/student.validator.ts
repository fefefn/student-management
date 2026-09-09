import { z } from "zod";
import { GENDERS, STUDENT_STATUSES } from "../models/Student";
import { PHONE_REGEX } from "../utils/helpers";
import { objectIdSchema } from "./common.validator";

const dateSchema = z.coerce.date({
  required_error: "Date is required",
  invalid_type_error: "Please provide a valid date (YYYY-MM-DD)",
});

export const createStudentSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),
  phone: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .regex(PHONE_REGEX, "Please provide a valid phone number"),
  gender: z.enum(GENDERS, {
    required_error: "Gender is required",
    invalid_type_error: "Gender must be male, female or other",
  }),
  dateOfBirth: dateSchema.refine((date) => date < new Date(), {
    message: "Date of birth must be in the past",
  }),
  address: z
    .string({ required_error: "Address is required" })
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(300, "Address cannot exceed 300 characters"),
  course: objectIdSchema,
  enrollmentDate: dateSchema.optional(),
  status: z
    .enum(STUDENT_STATUSES, { invalid_type_error: "Status must be active, inactive or graduated" })
    .optional(),
});

export const updateStudentSchema = createStudentSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: "At least one field is required" });

export const listStudentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(100).optional(),
  status: z.enum(STUDENT_STATUSES).optional(),
  gender: z.enum(GENDERS).optional(),
  course: objectIdSchema.optional(),
  sortBy: z.enum(["createdAt", "name", "enrollmentDate", "studentId"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type ListStudentsQuery = z.infer<typeof listStudentsQuerySchema>;
