import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md";

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "border border-line bg-white text-ink hover:bg-slate-50",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
  ghost: "text-muted hover:bg-slate-100 hover:text-ink",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
};

/** Reusable so <Link> elements can look exactly like buttons. */
export const buttonClasses = (
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
): string => cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner className="size-4" /> : leftIcon}
      {children}
    </button>
  );
}
