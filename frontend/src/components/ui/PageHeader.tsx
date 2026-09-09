import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  backTo?: { to: string; label: string };
}

export function PageHeader({ title, description, actions, backTo }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {backTo && (
          <Link
            to={backTo.to}
            className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-brand-600"
          >
            <ArrowLeft className="size-4" />
            {backTo.label}
          </Link>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}
