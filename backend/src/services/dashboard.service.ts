import { Course } from "../models/Course";
import { Student, STUDENT_STATUSES, StudentStatus } from "../models/Student";

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalCourses: number;
  statusBreakdown: Record<StudentStatus, number>;
  recentStudents: unknown[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const [totalStudents, totalCourses, statusCounts, recentStudents] = await Promise.all([
    Student.countDocuments(),
    Course.countDocuments(),
    Student.aggregate<{ _id: StudentStatus; count: number }>([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Student.find().sort({ createdAt: -1 }).limit(5).populate("course", "name"),
  ]);

  const statusBreakdown = Object.fromEntries(
    STUDENT_STATUSES.map((status) => [status, 0])
  ) as Record<StudentStatus, number>;
  for (const entry of statusCounts) {
    statusBreakdown[entry._id] = entry.count;
  }

  return {
    totalStudents,
    activeStudents: statusBreakdown.active,
    totalCourses,
    statusBreakdown,
    recentStudents,
  };
};
