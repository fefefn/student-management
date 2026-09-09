import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Student } from "../../types";
import { formatDate, getInitials } from "../../utils/formatters";
import { StatusBadge } from "../ui/StatusBadge";

interface StudentTableProps {
  students: Student[];
  onDelete: (student: Student) => void;
}

const actionButtonClasses =
  "rounded-lg p-2 text-muted transition-colors hover:bg-slate-100 hover:text-ink";

export function StudentTable({ students, onDelete }: StudentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs text-muted">
            <th className="px-4 py-3 font-semibold">Student</th>
            <th className="px-4 py-3 font-semibold">Student ID</th>
            <th className="px-4 py-3 font-semibold">Course</th>
            <th className="px-4 py-3 font-semibold">Phone</th>
            <th className="px-4 py-3 font-semibold">Enrolled</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {students.map((student) => (
            <tr key={student._id} className="transition-colors hover:bg-slate-50/70">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                    {getInitials(student.name)}
                  </div>
                  <div className="min-w-0">
                    <Link
                      to={`/students/${student._id}`}
                      className="block truncate font-semibold text-ink hover:text-brand-600"
                    >
                      {student.name}
                    </Link>
                    <p className="truncate text-xs text-muted">{student.email}</p>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-muted">{student.studentId}</td>
              <td className="px-4 py-3 text-ink">{student.course?.name ?? "—"}</td>
              <td className="whitespace-nowrap px-4 py-3 text-muted">{student.phone}</td>
              <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(student.enrollmentDate)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={student.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link to={`/students/${student._id}`} className={actionButtonClasses} aria-label={`View ${student.name}`}>
                    <Eye className="size-4" />
                  </Link>
                  <Link to={`/students/${student._id}/edit`} className={actionButtonClasses} aria-label={`Edit ${student.name}`}>
                    <Pencil className="size-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(student)}
                    className={`${actionButtonClasses} hover:bg-rose-50 hover:text-rose-600`}
                    aria-label={`Delete ${student.name}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
