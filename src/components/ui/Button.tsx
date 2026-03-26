"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "gold";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-gradient-to-r from-[var(--teal)] to-[var(--teal-dim)]",
    "text-black font-bold tracking-wide uppercase text-xs",
    "hover:shadow-[0_8px_24px_rgba(0,229,204,0.35)] hover:-translate-y-0.5",
    "active:translate-y-0 active:scale-[0.98]",
  ].join(" "),
  secondary: [
    "bg-white/5 text-[var(--text)] border border-[var(--border)]",
    "hover:bg-white/10 hover:border-[var(--border-md)] hover:-translate-y-0.5",
    "active:translate-y-0 active:scale-[0.98]",
  ].join(" "),
  ghost: [
    "bg-transparent text-[var(--text-muted)]",
    "hover:text-[var(--text)] hover:bg-white/5",
    "active:scale-[0.98]",
  ].join(" "),
  danger: [
    "bg-[rgba(255,77,106,0.12)] text-[var(--red)] border border-[rgba(255,77,106,0.25)]",
    "hover:bg-[rgba(255,77,106,0.2)] hover:-translate-y-0.5",
    "active:scale-[0.98]",
  ].join(" "),
  gold: [
    "bg-gradient-to-r from-[var(--gold)] to-[#ff9d00]",
    "text-black font-bold tracking-wide uppercase text-xs",
    "hover:shadow-[0_8px_24px_rgba(240,180,41,0.35)] hover:-translate-y-0.5",
    "active:translate-y-0 active:scale-[0.98]",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-[var(--radius-sm)]",
  md: "px-5 py-2.5 text-sm rounded-[var(--radius-md)]",
  lg: "px-7 py-3.5 text-sm rounded-[var(--radius-md)]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "font-display font-semibold transition-all duration-200 cursor-pointer select-none",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none!",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-sm animate-spin" />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  ),
);
Button.displayName = "Button";
