import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination as PaginationInfo } from "../../types";
import { cn } from "../../utils/cn";

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

/** Builds a compact page list like: 1 … 4 5 6 … 12 */
const getPageNumbers = (current: number, total: number): (number | "…")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push("…");
    result.push(page);
  });
  return result;
};

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, limit, total, totalPages } = pagination;
  if (total === 0) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <nav
      className="flex flex-col items-center justify-between gap-3 border-t border-line px-4 py-3 sm:flex-row"
      aria-label="Pagination"
    >
      <p className="text-sm text-muted">
        Showing <span className="font-semibold text-ink">{from}–{to}</span> of{" "}
        <span className="font-semibold text-ink">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="rounded-lg p-2 text-muted transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="size-4" />
        </button>
        {getPageNumbers(page, totalPages).map((item, index) =>
          item === "…" ? (
            <span key={`gap-${index}`} className="px-2 text-sm text-muted">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={cn(
                "min-w-9 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors",
                item === page ? "bg-brand-600 text-white" : "text-muted hover:bg-slate-100 hover:text-ink"
              )}
            >
              {item}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="rounded-lg p-2 text-muted transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </nav>
  );
}
