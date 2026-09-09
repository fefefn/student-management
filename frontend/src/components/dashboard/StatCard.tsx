import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";
import { Card } from "../ui/Card";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  to: string;
  accent?: "brand" | "emerald" | "amber" | "slate";
}

const accentClasses = {
  brand: "bg-brand-50 text-brand-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  slate: "bg-slate-100 text-slate-600",
};

export function StatCard({ label, value, icon: Icon, to, accent = "brand" }: StatCardProps) {
  return (
    <Link to={to} className="block rounded-xl focus-visible:outline-none">
      <Card className="flex items-center gap-4 p-5 transition-colors hover:border-brand-500/40">
        <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-lg", accentClasses[accent])}>
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-3xl font-bold tracking-tight text-ink">{value.toLocaleString()}</p>
          <p className="text-sm text-muted">{label}</p>
        </div>
      </Card>
    </Link>
  );
}
