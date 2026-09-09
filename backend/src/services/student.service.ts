import { FilterQuery } from "mongoose";
import { Course } from "../models/Course";
import { IStudent, Student } from "../models/Student";
import { ApiError } from "../utils/ApiError";
import { buildPagination, Pagination } from "../utils/apiResponse";
import { escapeRegex } from "../utils/helpers";
import {
  CreateStudentInput,
  ListStudentsQuery,
  UpdateStudentInput,
} from "../validators/student.validator";

const COURSE_FIELDS = "name duration fees";

/** Generates the next sequential ID for the current year, e.g. STU-2026-0007 */
const generateStudentId = async (): Promise<string> => {
  const prefix = `STU-${new Date().getFullYear()}-`;
  const last = await Student.findOne({ studentId: new RegExp(`^${prefix}`) })
    .sort({ studentId: -1 })
    .select("studentId")
    .lean();

  const lastNumber = last ? Number(last.studentId.slice(prefix.length)) || 0 : 0;
  return `${prefix}${String(lastNumber + 1).padStart(4, "0")}`;
};

const ensureCourseExists = async (courseId: string): Promise<void> => {
  const exists = await Course.exists({ _id: courseId });
  if (!exists) {
    throw ApiError.badRequest("Selected course does not exist", [
      { field: "course", message: "Selected course does not exist" },
    ]);
  }
};

export const listStudents = async (
  query: ListStudentsQuery
): Promise<{ students: IStudent[]; pagination: Pagination }> => {
  const { page, limit, search, status, gender, course, sortBy, sortOrder } = query;

  const filter: FilterQuery<IStudent> = {};
  if (status) filter.status = status;
  if (gender) filter.gender = gender;
  if (course) filter.course = course;
  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ name: regex }, { email: regex }, { studentId: regex }, { phone: regex }];
  }

  const [students, total] = await Promise.all([
    Student.find(filter)
      .populate("course", COURSE_FIELDS)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Student.countDocuments(filter),
  ]);

  return { students, pagination: buildPagination(page, limit, total) };
};

export const getStudentById = async (id: string): Promise<IStudent> => {
  const student = await Student.findById(id).populate("course", `${COURSE_FIELDS} description`);
  if (!student) throw ApiError.notFound("Student not found");
  return student;
};

export const createStudent = async (input: CreateStudentInput): Promise<IStudent> => {
  await ensureCourseExists(input.course);

  const studentId = await generateStudentId();
  const student = await Student.create({ ...input, studentId });
  return student.populate("course", COURSE_FIELDS);
};

export const updateStudent = async (id: string, input: UpdateStudentInput): Promise<IStudent> => {
  if (input.course) await ensureCourseExists(input.course);

  const student = await Student.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  }).populate("course", COURSE_FIELDS);

  if (!student) throw ApiError.notFound("Student not found");
  return student;
};

export const deleteStudent = async (id: string): Promise<void> => {
  const student = await Student.findByIdAndDelete(id);
  if (!student) throw ApiError.notFound("Student not found");
};
