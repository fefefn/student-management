import { Request, Response } from "express";
import * as studentService from "../services/student.service";
import { sendPaginated, sendSuccess } from "../utils/apiResponse";
import { idParamSchema } from "../validators/common.validator";
import { listStudentsQuerySchema } from "../validators/student.validator";

/** GET /api/students?page=1&limit=10&search=&status=&gender=&course= */
export const getStudents = async (req: Request, res: Response): Promise<void> => {
  const query = listStudentsQuerySchema.parse(req.query);
  const { students, pagination } = await studentService.listStudents(query);
  sendPaginated(res, students, pagination);
};

/** GET /api/students/:id */
export const getStudent = async (req: Request, res: Response): Promise<void> => {
  const { id } = idParamSchema.parse(req.params);
  const student = await studentService.getStudentById(id);
  sendSuccess(res, student);
};

/** POST /api/students */
export const createStudent = async (req: Request, res: Response): Promise<void> => {
  const student = await studentService.createStudent(req.body);
  sendSuccess(res, student, 201, "Student added successfully");
};

/** PUT /api/students/:id */
export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  const { id } = idParamSchema.parse(req.params);
  const student = await studentService.updateStudent(id, req.body);
  sendSuccess(res, student, 200, "Student updated successfully");
};

/** DELETE /api/students/:id */
export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  const { id } = idParamSchema.parse(req.params);
  await studentService.deleteStudent(id);
  sendSuccess(res, null, 200, "Student deleted successfully");
};
