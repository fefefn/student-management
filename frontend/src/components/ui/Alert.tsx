import { AlertTriangle } from "lucide-react";

/** Inline error banner used inside forms for server-side errors. */
export function Alert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
