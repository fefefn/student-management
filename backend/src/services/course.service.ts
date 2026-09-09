import { Course, ICourse } from "../models/Course";
import { Student } from "../models/Student";
import { ApiError } from "../utils/ApiError";
import { CreateCourseInput, UpdateCourseInput } from "../validators/course.validator";

export interface CourseWithCount {
  course: ICourse;
  studentCount: number;
}

/** All courses (alphabetical) with how many students are enrolled in each. */
export const listCourses = async (): Promise<Record<string, unknown>[]> => {
  const [courses, counts] = await Promise.all([
    Course.find().sort({ name: 1 }),
    Student.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$course", count: { $sum: 1 } } },
    ]),
  ]);

  const countByCourse = new Map(counts.map((c) => [String(c._id), c.count]));

  return courses.map((course) => ({
    ...course.toJSON(),
    studentCount: countByCourse.get(course.id) ?? 0,
  }));
};

export const getCourseById = async (id: string): Promise<Record<string, unknown>> => {
  const course = await Course.findById(id);
  if (!course) throw ApiError.notFound("Course not found");

  const studentCount = await Student.countDocuments({ course: course._id });
  return { ...course.toJSON(), studentCount };
};

export const createCourse = async (input: CreateCourseInput): Promise<ICourse> => {
  return Course.create(input);
};

export const updateCourse = async (id: string, input: UpdateCourseInput): Promise<ICourse> => {
  const course = await Course.findByIdAndUpdate(id, input, { new: true, runValidators: true });
  if (!course) throw ApiError.notFound("Course not found");
  return course;
};

export const deleteCourse = async (id: string): Promise<void> => {
  const course = await Course.findById(id);
  if (!course) throw ApiError.notFound("Course not found");

  const enrolled = await Student.countDocuments({ course: course._id });
  if (enrolled > 0) {
    throw ApiError.conflict(
      `Cannot delete "${course.name}" because ${enrolled} student${enrolled === 1 ? " is" : "s are"} enrolled in it. Reassign or remove them first.`
    );
  }

  await course.deleteOne();
};
