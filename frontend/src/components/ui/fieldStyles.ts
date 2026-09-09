import { cn } from "../../utils/cn";

/** Shared input/select/textarea styles so every field looks identical. */
export const fieldClasses = (hasError: boolean, extra?: string): string =>
  cn(
    "w-full rounded-lg border bg-white px-3 text-sm text-ink placeholder:text-slate-400 transition-colors",
    "focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50",
    hasError
      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
      : "border-line focus:border-brand-500 focus:ring-brand-500/20",
    extra
  );

export const labelClasses = "text-sm font-medium text-ink";
export const errorTextClasses = "text-sm text-rose-600";
export const hintTextClasses = "text-sm text-muted";
