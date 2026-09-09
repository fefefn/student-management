import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <AlertTriangle className="size-5" />
        </div>
        <p className="text-sm leading-6 text-muted">{message}</p>
      </div>
    </Modal>
  );
}
