export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export type Gender = "male" | "female" | "other";
export type StudentStatus = "active" | "inactive" | "graduated";

export interface Course {
  _id: string;
  name: string;
  description: string;
  duration: string;
  fees: number;
  studentCount?: number;
  createdAt: string;
  updatedAt: string;
}

/** Shape of `student.course` after the API populates it. */
export interface CourseRef {
  _id: string;
  name: string;
  duration?: string;
  fees?: number;
  description?: string;
}

export interface Student {
  _id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  course: CourseRef | null;
  enrollmentDate: string;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
}

/** Values managed by the student form (all strings so they bind cleanly to inputs). */
export interface StudentFormValues {
  name: string;
  email: string;
  phone: string;
  gender: Gender | "";
  dateOfBirth: string;
  address: string;
  course: string;
  enrollmentDate: string;
  status: StudentStatus;
}

export interface CourseFormValues {
  name: string;
  description: string;
  duration: string;
  fees: string;
}

export interface StudentListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: StudentStatus | "";
  gender?: Gender | "";
  course?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: true;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: Pagination;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: ApiFieldError[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalCourses: number;
  statusBreakdown: Record<StudentStatus, number>;
  recentStudents: Student[];
}
