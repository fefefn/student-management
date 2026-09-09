import type { InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import { errorTextClasses, fieldClasses, hintTextClasses, labelClasses } from "./fieldStyles";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export function Input({ label, name, error, hint, containerClassName, className, ...props }: InputProps) {
  const id = props.id ?? name;
  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={fieldClasses(Boolean(error), cn("h-10", className))}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className={errorTextClasses}>
          {error}
        </p>
      ) : hint ? (
        <p className={hintTextClasses}>{hint}</p>
      ) : null}
    </div>
  );
}
