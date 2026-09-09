import { cn } from "../../utils/cn";
import { Spinner } from "./Spinner";

interface LoadingStateProps {
  label?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingState({ label = "Loading…", fullScreen = false, className }: LoadingStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-muted",
        fullScreen ? "min-h-screen" : "py-16",
        className
      )}
    >
      <Spinner className="size-7 text-brand-600" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
