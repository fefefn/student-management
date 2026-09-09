import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center" role="alert">
      <div className="flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
        <AlertTriangle className="size-6" />
      </div>
      <h3 className="mt-4 text-base font-bold text-ink">Could not load data</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-6" onClick={onRetry} leftIcon={<RefreshCw className="size-4" />}>
          Try again
        </Button>
      )}
    </div>
  );
}
