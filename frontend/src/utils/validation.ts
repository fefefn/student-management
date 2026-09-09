import type { CourseFormValues, LoginCredentials, RegisterData, StudentFormValues } from "../types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9][0-9\s-]{6,14}$/;

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export const validateLogin = (values: LoginCredentials): FormErrors<LoginCredentials> => {
  const errors: FormErrors<LoginCredentials> = {};
  if (!values.email.trim()) errors.email = "Email is required";
  else if (!EMAIL_REGEX.test(values.email.trim())) errors.email = "Enter a valid email address";
  if (!values.password) errors.password = "Password is required";
  return errors;
};

export const validateRegister = (
  values: RegisterData & { confirmPassword: string }
): FormErrors<RegisterData & { confirmPassword: string }> => {
  const errors: FormErrors<RegisterData & { confirmPassword: string }> = validateLogin(values);
  if (!values.name.trim()) errors.name = "Name is required";
  else if (values.name.trim().length < 2) errors.name = "Name must be at least 2 characters";
  if (values.password && values.password.length < 6) errors.password = "Password must be at least 6 characters";
  if (values.confirmPassword !== values.password) errors.confirmPassword = "Passwords do not match";
  return errors;
};

export const validateStudent = (values: StudentFormValues): FormErrors<StudentFormValues> => {
  const errors: FormErrors<StudentFormValues> = {};

  if (!values.name.trim()) errors.name = "Name is required";
  else if (values.name.trim().length < 2) errors.name = "Name must be at least 2 characters";

  if (!values.email.trim()) errors.email = "Email is required";
  else if (!EMAIL_REGEX.test(values.email.trim())) errors.email = "Enter a valid email address";

  if (!values.phone.trim()) errors.phone = "Phone number is required";
  else if (!PHONE_REGEX.test(values.phone.trim())) errors.phone = "Enter a valid phone number";

  if (!values.gender) errors.gender = "Select a gender";

  if (!values.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
  else if (new Date(values.dateOfBirth) >= new Date()) errors.dateOfBirth = "Date of birth must be in the past";

  if (!values.address.trim()) errors.address = "Address is required";
  else if (values.address.trim().length < 5) errors.address = "Address must be at least 5 characters";

  if (!values.course) errors.course = "Select a course";

  if (!values.enrollmentDate) errors.enrollmentDate = "Enrollment date is required";

  return errors;
};

export const validateCourse = (values: CourseFormValues): FormErrors<CourseFormValues> => {
  const errors: FormErrors<CourseFormValues> = {};

  if (!values.name.trim()) errors.name = "Course name is required";
  else if (values.name.trim().length < 2) errors.name = "Course name must be at least 2 characters";

  if (!values.description.trim()) errors.description = "Description is required";
  else if (values.description.trim().length < 10) errors.description = "Description must be at least 10 characters";

  if (!values.duration.trim()) errors.duration = "Duration is required";

  if (values.fees === "") errors.fees = "Fees are required";
  else if (Number.isNaN(Number(values.fees)) || Number(values.fees) < 0) errors.fees = "Fees must be 0 or more";

  return errors;
};
