import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { CourseFormValues } from "../../types";
import { validateCourse, type FormErrors } from "../../utils/validation";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

export const emptyCourseValues: CourseFormValues = { name: "", description: "", duration: "", fees: "" };

interface CourseFormProps {
  initialValues: CourseFormValues;
  isSubmitting: boolean;
  submitLabel: string;
  serverErrors?: Record<string, string>;
  onSubmit: (values: CourseFormValues) => void;
  onCancel: () => void;
}

export function CourseForm({ initialValues, isSubmitting, submitLabel, serverErrors, onSubmit, onCancel }: CourseFormProps) {
  const [values, setValues] = useState<CourseFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors<CourseFormValues>>({});

  useEffect(() => {
    if (serverErrors && Object.keys(serverErrors).length > 0) {
      setErrors((current) => ({ ...current, ...serverErrors }));
    }
  }, [serverErrors]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name as keyof CourseFormValues]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateCourse(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Input label="Course name" name="name" value={values.name} onChange={handleChange} error={errors.name} placeholder="Full Stack Web Development" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Duration" name="duration" value={values.duration} onChange={handleChange} error={errors.duration} placeholder="6 months" />
        <Input label="Fees" name="fees" type="number" min={0} step="1" value={values.fees} onChange={handleChange} error={errors.fees} placeholder="45000" />
      </div>
      <Textarea label="Description" name="description" value={values.description} onChange={handleChange} error={errors.description} placeholder="What students will learn in this course" />
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
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
