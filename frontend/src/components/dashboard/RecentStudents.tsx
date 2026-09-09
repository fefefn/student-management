import { GraduationCap, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import type { Student } from "../../types";
import { formatDate, getInitials } from "../../utils/formatters";
import { buttonClasses } from "../ui/Button";
import { Card } from "../ui/Card";
import { EmptyState } from "../ui/EmptyState";
import { StatusBadge } from "../ui/StatusBadge";

export function RecentStudents({ students }: { students: Student[] }) {
  return (
    <Card>
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <h2 className="text-base font-bold text-ink">Recent students</h2>
          <p className="text-sm text-muted">The last five students added</p>
        </div>
        <Link to="/students" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
          View all
        </Link>
      </div>

      {students.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No students yet"
          description="Add your first student and they will show up here."
          action={
            <Link to="/students/new" className={buttonClasses("primary", "sm")}>
              <Plus className="size-4" />
              Add student
            </Link>
          }
        />
      ) : (
        <ul className="divide-y divide-line">
          {students.map((student) => (
            <li key={student._id} className="flex items-center gap-4 px-5 py-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                {getInitials(student.name)}
              </div>
              <div className="min-w-0 flex-1">
                <Link to={`/students/${student._id}`} className="block truncate text-sm font-semibold text-ink hover:text-brand-600">
                  {student.name}
                </Link>
                <p className="truncate text-xs text-muted">
                  {student.studentId} · {student.course?.name ?? "No course"}
                </p>
              </div>
              <div className="hidden text-right text-xs text-muted sm:block">
                Added {formatDate(student.createdAt)}
              </div>
              <StatusBadge status={student.status} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
