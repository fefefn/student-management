import { Clock, Pencil, Trash2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { Course } from "../../types";
import { formatCurrency } from "../../utils/formatters";
import { Card } from "../ui/Card";

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

export function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  const studentCount = course.studentCount ?? 0;

  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold leading-snug text-ink">{course.name}</h3>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(course)}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-slate-100 hover:text-ink"
            aria-label={`Edit ${course.name}`}
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(course)}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-rose-50 hover:text-rose-600"
            aria-label={`Delete ${course.name}`}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-muted">{course.description}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-1.5 text-muted">
          <Clock className="size-4" />
          {course.duration}
        </span>
        <Link
          to={`/students?course=${course._id}`}
          className="inline-flex items-center gap-1.5 text-muted hover:text-brand-600"
        >
          <Users className="size-4" />
          {studentCount} {studentCount === 1 ? "student" : "students"}
        </Link>
        <span className="ml-auto font-bold text-ink">{formatCurrency(course.fees)}</span>
      </div>
    </Card>
  );
}
