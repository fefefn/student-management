import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "../../utils/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" };

export function Modal({ isOpen, onClose, title, description, children, footer, size = "md" }: ModalProps) {
  // Close on Escape and prevent the page behind from scrolling
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden="true" />
      <div className={cn("relative w-full rounded-2xl bg-white shadow-xl", sizeClasses[size])}>
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-ink">
              {title}
            </h2>
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 rounded-lg p-2 text-muted transition-colors hover:bg-slate-100 hover:text-ink"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-3 border-t border-line px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
