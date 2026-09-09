import { BookOpen } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { emptyStudentValues, StudentForm } from "../components/students/StudentForm";
import { Alert } from "../components/ui/Alert";
import { buttonClasses } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { PageHeader } from "../components/ui/PageHeader";
import { useApi } from "../hooks/useApi";
import { courseService } from "../services/course.service";
import { studentService } from "../services/student.service";
import type { Student, StudentFormValues } from "../types";
import { getErrorMessage, getFieldErrors } from "../utils/errors";
import { toDateInputValue } from "../utils/formatters";

const toFormValues = (student: Student): StudentFormValues => ({
  name: student.name,
  email: student.email,
  phone: student.phone,
  gender: student.gender,
  dateOfBirth: toDateInputValue(student.dateOfBirth),
  address: student.address,
  course: student.course?._id ?? "",
  enrollmentDate: toDateInputValue(student.enrollmentDate),
  status: student.status,
});

/** Handles both /students/new and /students/:id/edit */
export function StudentFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>({});

  const student = useApi(() => (id ? studentService.getById(id) : Promise.resolve(null)), [id]);
  const courses = useApi(() => courseService.getAll(), []);

  const handleSubmit = async (values: StudentFormValues) => {
    setIsSubmitting(true);
    setServerError(null);
    setServerFieldErrors({});
    try {
      const saved = id ? await studentService.update(id, values) : await studentService.create(values);
      toast.success(id ? "Student updated" : "Student added");
      navigate(`/students/${saved._id}`);
    } catch (error) {
      const fieldErrors = getFieldErrors(error);
      setServerFieldErrors(fieldErrors);
      if (Object.keys(fieldErrors).length === 0) setServerError(getErrorMessage(error));
      else setServerError("Please fix the highlighted fields.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = student.isLoading || courses.isLoading;
  const loadError = student.error ?? courses.error;
  const courseList = courses.data ?? [];

  return (
    <div>
      <PageHeader
        title={isEditing ? "Edit student" : "Add student"}
        description={isEditing ? "Update the student’s personal, course or enrollment details." : "Fill in the details to enroll a new student."}
        backTo={isEditing && id ? { to: `/students/${id}`, label: "Back to profile" } : { to: "/students", label: "Back to students" }}
      />

      <Card className="mx-auto max-w-3xl p-6">
        {isLoading && <LoadingState label="Loading form…" />}
        {loadError && !isLoading && (
          <ErrorState
            message={loadError}
            onRetry={() => {
              student.refetch();
              courses.refetch();
            }}
          />
        )}

        {!isLoading && !loadError && courseList.length === 0 && (
          <EmptyState
            icon={BookOpen}
            title="Create a course first"
            description="Every student must be enrolled in a course. Add at least one course, then come back to add students."
            action={
              <Link to="/courses" className={buttonClasses("primary")}>
                Go to courses
              </Link>
            }
          />
        )}

        {!isLoading && !loadError && courseList.length > 0 && (!isEditing || student.data) && (
          <div className="space-y-6">
            {serverError && <Alert message={serverError} />}
            <StudentForm
              initialValues={student.data ? toFormValues(student.data) : emptyStudentValues}
              courses={courseList}
              isSubmitting={isSubmitting}
              submitLabel={isEditing ? "Save changes" : "Add student"}
              serverErrors={serverFieldErrors}
              onSubmit={handleSubmit}
              onCancel={() => navigate(isEditing && id ? `/students/${id}` : "/students")}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
