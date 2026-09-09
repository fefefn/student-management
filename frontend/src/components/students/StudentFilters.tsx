import { Search, X } from "lucide-react";
import type { Course, Gender, StudentStatus } from "../../types";
import { GENDER_OPTIONS, STATUS_OPTIONS } from "../../utils/constants";
import { Button } from "../ui/Button";
import { fieldClasses } from "../ui/fieldStyles";

export interface StudentFilterValues {
  search: string;
  status: StudentStatus | "";
  gender: Gender | "";
  course: string;
}

interface StudentFiltersProps {
  values: StudentFilterValues;
  courses: Course[];
  onChange: (field: keyof StudentFilterValues, value: string) => void;
  onReset: () => void;
}

export function StudentFilters({ values, courses, onChange, onReset }: StudentFiltersProps) {
  const hasActiveFilters = Boolean(values.search || values.status || values.gender || values.course);

  return (
    <div className="grid gap-3 border-b border-line p-4 md:grid-cols-[2fr_1fr_1fr_1fr_auto]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={values.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Search by name, email, ID or phone"
          aria-label="Search students"
          className={fieldClasses(false, "h-10 pl-9")}
        />
      </div>

      <select
        value={values.status}
        onChange={(event) => onChange("status", event.target.value)}
        aria-label="Filter by status"
        className={fieldClasses(false, "h-10")}
      >
        <option value="">All statuses</option>
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={values.gender}
        onChange={(event) => onChange("gender", event.target.value)}
        aria-label="Filter by gender"
        className={fieldClasses(false, "h-10")}
      >
        <option value="">All genders</option>
        {GENDER_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={values.course}
        onChange={(event) => onChange("course", event.target.value)}
        aria-label="Filter by course"
        className={fieldClasses(false, "h-10")}
      >
        <option value="">All courses</option>
        {courses.map((course) => (
          <option key={course._id} value={course._id}>
            {course.name}
          </option>
        ))}
      </select>

      {hasActiveFilters ? (
        <Button variant="ghost" onClick={onReset} leftIcon={<X className="size-4" />}>
          Clear
        </Button>
      ) : (
        <div className="hidden md:block" />
      )}
    </div>
  );
}
