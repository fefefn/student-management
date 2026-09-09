import type { StudentStatus } from "../../types";
import { cn } from "../../utils/cn";
import { capitalize } from "../../utils/formatters";

const statusClasses: Record<StudentStatus, { badge: string; dot: string }> = {
  active: { badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  inactive: { badge: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
  graduated: { badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
};

export function StatusBadge({ status }: { status: StudentStatus }) {
  const styles = statusClasses[status] ?? statusClasses.inactive;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", styles.badge)}>
      <span className={cn("size-1.5 rounded-full", styles.dot)} aria-hidden="true" />
      {capitalize(status)}
    </span>
  );
}
