import type { StudentStatus } from "../../types";
import { STATUS_OPTIONS } from "../../utils/constants";
import { cn } from "../../utils/cn";
import { Card } from "../ui/Card";

const barClasses: Record<StudentStatus, string> = {
  active: "bg-emerald-500",
  inactive: "bg-slate-400",
  graduated: "bg-amber-500",
};

interface StatusBreakdownProps {
  breakdown: Record<StudentStatus, number>;
  total: number;
}

export function StatusBreakdown({ breakdown, total }: StatusBreakdownProps) {
  return (
    <Card className="p-5">
      <h2 className="text-base font-bold text-ink">Students by status</h2>
      <p className="text-sm text-muted">Share of all {total.toLocaleString()} students</p>

      <ul className="mt-5 space-y-4">
        {STATUS_OPTIONS.map(({ value, label }) => {
          const count = breakdown[value] ?? 0;
          const percent = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <li key={value}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-ink">{label}</span>
                <span className="text-muted">
                  {count} · {percent}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100" role="presentation">
                <div
                  className={cn("h-full rounded-full transition-[width] duration-500", barClasses[value])}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
