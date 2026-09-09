import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import { errorTextClasses, fieldClasses, labelClasses } from "./fieldStyles";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  error?: string;
  containerClassName?: string;
}

export function Textarea({ label, name, error, containerClassName, className, ...props }: TextareaProps) {
  const id = props.id ?? name;
  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        aria-invalid={Boolean(error)}
        className={fieldClasses(Boolean(error), cn("min-h-24 py-2", className))}
        {...props}
      />
      {error && <p className={errorTextClasses}>{error}</p>}
    </div>
  );
}
