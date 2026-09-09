import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Course, StudentFormValues } from "../../types";
import { GENDER_OPTIONS, STATUS_OPTIONS } from "../../utils/constants";
import { validateStudent, type FormErrors } from "../../utils/validation";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";

export const emptyStudentValues: StudentFormValues = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  address: "",
  course: "",
  enrollmentDate: new Date().toISOString().slice(0, 10),
  status: "active",
};

interface StudentFormProps {
  initialValues: StudentFormValues;
  courses: Course[];
  isSubmitting: boolean;
  submitLabel: string;
  /** Field-level errors returned by the API (e.g. duplicate email). */
  serverErrors?: Record<string, string>;
  onSubmit: (values: StudentFormValues) => void;
  onCancel: () => void;
}

export function StudentForm({
  initialValues,
  courses,
  isSubmitting,
  submitLabel,
  serverErrors,
  onSubmit,
  onCancel,
}: StudentFormProps) {
  const [values, setValues] = useState<StudentFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors<StudentFormValues>>({});

  // Surface API validation errors next to the matching fields
  useEffect(() => {
    if (serverErrors && Object.keys(serverErrors).length > 0) {
      setErrors((current) => ({ ...current, ...serverErrors }));
    }
  }, [serverErrors]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name as keyof StudentFormValues]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateStudent(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onSubmit(values);
  };

  const courseOptions = courses.map((course) => ({ value: course._id, label: course.name }));
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Full name" name="name" value={values.name} onChange={handleChange} error={errors.name} placeholder="Aarav Sharma" autoComplete="off" />
        <Input label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} placeholder="aarav@example.com" autoComplete="off" />
        <Input label="Phone" name="phone" type="tel" value={values.phone} onChange={handleChange} error={errors.phone} placeholder="+91 98765 43210" />
        <Select label="Gender" name="gender" value={values.gender} onChange={handleChange} error={errors.gender} options={GENDER_OPTIONS} placeholder="Select gender" />
        <Input label="Date of birth" name="dateOfBirth" type="date" max={today} value={values.dateOfBirth} onChange={handleChange} error={errors.dateOfBirth} />
        <Select
          label="Course"
          name="course"
          value={values.course}
          onChange={handleChange}
          error={errors.course}
          options={courseOptions}
          placeholder={courses.length ? "Select course" : "No courses available"}
          disabled={courses.length === 0}
        />
        <Input label="Enrollment date" name="enrollmentDate" type="date" value={values.enrollmentDate} onChange={handleChange} error={errors.enrollmentDate} />
        <Select label="Status" name="status" value={values.status} onChange={handleChange} error={errors.status} options={STATUS_OPTIONS} />
        <Textarea
          label="Address"
          name="address"
          value={values.address}
          onChange={handleChange}
          error={errors.address}
          placeholder="Street, city, state"
          containerClassName="sm:col-span-2"
        />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
