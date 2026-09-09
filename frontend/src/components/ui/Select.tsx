import type { SelectHTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import { errorTextClasses, fieldClasses, labelClasses } from "./fieldStyles";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  containerClassName?: string;
}

export function Select({
  label,
  name,
  options,
  placeholder,
  error,
  containerClassName,
  className,
  ...props
}: SelectProps) {
  const id = props.id ?? name;
  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      <select
        id={id}
        name={name}
        aria-invalid={Boolean(error)}
        className={fieldClasses(Boolean(error), cn("h-10", className))}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className={errorTextClasses}>{error}</p>}
    </div>
  );
}
