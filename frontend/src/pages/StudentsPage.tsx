import { GraduationCap, Plus, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";
import { StudentFilters, type StudentFilterValues } from "../components/students/StudentFilters";
import { StudentTable } from "../components/students/StudentTable";
import { Button, buttonClasses } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { PageHeader } from "../components/ui/PageHeader";
import { Pagination } from "../components/ui/Pagination";
import { useApi } from "../hooks/useApi";
import { useDebounce } from "../hooks/useDebounce";
import { courseService } from "../services/course.service";
import { studentService } from "../services/student.service";
import type { Gender, Student, StudentStatus } from "../types";
import { PAGE_SIZE } from "../utils/constants";
import { getErrorMessage } from "../utils/errors";

export function StudentsPage() {
  // Filters and pagination live in the URL so they survive refresh and back/forward
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const search = searchParams.get("search") ?? "";
  const status = (searchParams.get("status") ?? "") as StudentStatus | "";
  const gender = (searchParams.get("gender") ?? "") as Gender | "";
  const course = searchParams.get("course") ?? "";

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const updateParams = (updates: Record<string, string>) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        Object.entries(updates).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
        return next;
      },
      { replace: true }
    );
  };

  // Push the debounced search box value into the URL (and reset to page 1)
  useEffect(() => {
    if (debouncedSearch !== search) updateParams({ search: debouncedSearch, page: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const {
    data: result,
    isLoading,
    error,
    refetch,
  } = useApi(
    () => studentService.getAll({ page, limit: PAGE_SIZE, search, status, gender, course }),
    [page, search, status, gender, course]
  );
  const { data: courses } = useApi(() => courseService.getAll(), []);

  const filterValues: StudentFilterValues = { search: searchInput, status, gender, course };
  const hasActiveFilters = Boolean(search || status || gender || course);

  const handleFilterChange = (field: keyof StudentFilterValues, value: string) => {
    if (field === "search") {
      setSearchInput(value);
      return;
    }
    updateParams({ [field]: value, page: "" });
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearchParams({}, { replace: true });
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      await studentService.remove(studentToDelete._id);
      toast.success(`${studentToDelete.name} deleted`);
      setStudentToDelete(null);
      // If we removed the last row of a later page, step back one page
      if (result && result.data.length === 1 && page > 1) {
        updateParams({ page: String(page - 1) });
      } else {
        refetch();
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const students = result?.data ?? [];

  return (
    <div>
      <PageHeader
        title="Students"
        description={result ? `${result.pagination.total} students in total` : "All enrolled students"}
        actions={
          <Link to="/students/new" className={buttonClasses("primary")}>
            <Plus className="size-4" />
            Add student
          </Link>
        }
      />

      <Card>
        <StudentFilters values={filterValues} courses={courses ?? []} onChange={handleFilterChange} onReset={handleResetFilters} />

        {isLoading && <LoadingState label="Loading students…" />}
        {error && <ErrorState message={error} onRetry={refetch} />}

        {result && !isLoading && !error && (
          <>
            {students.length === 0 ? (
              hasActiveFilters ? (
                <EmptyState
                  icon={SearchX}
                  title="No students match these filters"
                  description="Try a different search term or clear the filters to see everyone."
                  action={
                    <Button variant="secondary" onClick={handleResetFilters}>
                      Clear filters
                    </Button>
                  }
                />
              ) : (
                <EmptyState
                  icon={GraduationCap}
                  title="No students yet"
                  description="Add your first student to start building your records."
                  action={
                    <Link to="/students/new" className={buttonClasses("primary")}>
                      <Plus className="size-4" />
                      Add student
                    </Link>
                  }
                />
              )
            ) : (
              <>
                <StudentTable students={students} onDelete={setStudentToDelete} />
                <Pagination pagination={result.pagination} onPageChange={(next) => updateParams({ page: String(next) })} />
              </>
            )}
          </>
        )}
      </Card>

      <ConfirmDialog
        isOpen={Boolean(studentToDelete)}
        title="Delete student"
        message={`This will permanently remove ${studentToDelete?.name ?? "this student"} (${studentToDelete?.studentId ?? ""}) and their enrollment details. This cannot be undone.`}
        confirmLabel="Delete student"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setStudentToDelete(null)}
      />
    </div>
  );
}
