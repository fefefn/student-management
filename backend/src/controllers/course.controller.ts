import { Request, Response } from "express";
import * as courseService from "../services/course.service";
import { sendSuccess } from "../utils/apiResponse";
import { idParamSchema } from "../validators/common.validator";

/** GET /api/courses */
export const getCourses = async (_req: Request, res: Response): Promise<void> => {
  const courses = await courseService.listCourses();
  sendSuccess(res, courses);
};

/** GET /api/courses/:id */
export const getCourse = async (req: Request, res: Response): Promise<void> => {
  const { id } = idParamSchema.parse(req.params);
  const course = await courseService.getCourseById(id);
  sendSuccess(res, course);
};

/** POST /api/courses */
export const createCourse = async (req: Request, res: Response): Promise<void> => {
  const course = await courseService.createCourse(req.body);
  sendSuccess(res, course, 201, "Course created successfully");
};

/** PUT /api/courses/:id */
export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  const { id } = idParamSchema.parse(req.params);
  const course = await courseService.updateCourse(id, req.body);
  sendSuccess(res, course, 200, "Course updated successfully");
};

/** DELETE /api/courses/:id */
export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  const { id } = idParamSchema.parse(req.params);
  await courseService.deleteCourse(id);
  sendSuccess(res, null, 200, "Course deleted successfully");
};
