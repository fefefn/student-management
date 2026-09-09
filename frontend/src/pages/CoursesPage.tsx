import { BookOpen, Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { CourseCard } from "../components/courses/CourseCard";
import { CourseForm, emptyCourseValues } from "../components/courses/CourseForm";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { Modal } from "../components/ui/Modal";
import { PageHeader } from "../components/ui/PageHeader";
import { useApi } from "../hooks/useApi";
import { courseService } from "../services/course.service";
import type { Course, CourseFormValues } from "../types";
import { getErrorMessage, getFieldErrors } from "../utils/errors";

type ModalState = { mode: "create" } | { mode: "edit"; course: Course } | null;

export function CoursesPage() {
  const { data: courses, isLoading, error, refetch } = useApi(() => courseService.getAll(), []);

  const [modal, setModal] = useState<ModalState>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>({});

  const closeModal = () => {
    setModal(null);
    setServerError(null);
    setServerFieldErrors({});
  };

  const handleSave = async (values: CourseFormValues) => {
    if (!modal) return;
    setIsSaving(true);
    setServerError(null);
    setServerFieldErrors({});
    try {
      if (modal.mode === "edit") {
        await courseService.update(modal.course._id, values);
        toast.success("Course updated");
      } else {
        await courseService.create(values);
        toast.success("Course created");
      }
      closeModal();
      refetch();
    } catch (err) {
      const fieldErrors = getFieldErrors(err);
      setServerFieldErrors(fieldErrors);
      setServerError(Object.keys(fieldErrors).length ? "Please fix the highlighted fields." : getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;
    setIsDeleting(true);
    try {
      await courseService.remove(courseToDelete._id);
      toast.success(`${courseToDelete.name} deleted`);
      setCourseToDelete(null);
      refetch();
    } catch (err) {
      // e.g. 409 when students are still enrolled - the API explains why
      toast.error(getErrorMessage(err), { duration: 6000 });
      setCourseToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const initialValues: CourseFormValues =
    modal?.mode === "edit"
      ? {
          name: modal.course.name,
          description: modal.course.description,
          duration: modal.course.duration,
          fees: String(modal.course.fees),
        }
      : emptyCourseValues;

  return (
    <div>
      <PageHeader
        title="Courses"
        description={courses ? `${courses.length} ${courses.length === 1 ? "course" : "courses"} available` : "Programs students can enroll in"}
        actions={
          <Button onClick={() => setModal({ mode: "create" })} leftIcon={<Plus className="size-4" />}>
            Add course
          </Button>
        }
      />

      {isLoading && <LoadingState label="Loading courses…" />}
      {error && (
        <Card>
          <ErrorState message={error} onRetry={refetch} />
        </Card>
      )}

      {courses && !isLoading && !error && (
        courses.length === 0 ? (
          <Card>
            <EmptyState
              icon={BookOpen}
              title="No courses yet"
              description="Courses are what students enroll in. Create your first one to get started."
              action={
                <Button onClick={() => setModal({ mode: "create" })} leftIcon={<Plus className="size-4" />}>
                  Add course
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                onEdit={(selected) => setModal({ mode: "edit", course: selected })}
                onDelete={setCourseToDelete}
              />
            ))}
          </div>
        )
      )}

      <Modal
        isOpen={Boolean(modal)}
        onClose={closeModal}
        title={modal?.mode === "edit" ? "Edit course" : "Add course"}
        description={modal?.mode === "edit" ? "Changes apply to every student enrolled in this course." : "Students can be enrolled in this course once it is saved."}
      >
        {modal && (
          <div className="space-y-5">
            {serverError && <Alert message={serverError} />}
            <CourseForm
              key={modal.mode === "edit" ? modal.course._id : "create"}
              initialValues={initialValues}
              isSubmitting={isSaving}
              submitLabel={modal.mode === "edit" ? "Save changes" : "Create course"}
              serverErrors={serverFieldErrors}
              onSubmit={handleSave}
              onCancel={closeModal}
            />
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(courseToDelete)}
        title="Delete course"
        message={`This will permanently remove "${courseToDelete?.name ?? ""}". Courses with enrolled students cannot be deleted until those students are reassigned or removed.`}
        confirmLabel="Delete course"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setCourseToDelete(null)}
      />
    </div>
  );
}
