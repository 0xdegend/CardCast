import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] font-display">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-white/[0.04] border border-[var(--border)] rounded-[var(--radius-md)]",
            "px-3.5 py-2.5 text-sm font-display text-[var(--text)]",
            "placeholder:text-[var(--text-dim)]",
            "outline-none focus:border-[var(--teal)] focus:bg-white/[0.06]",
            "transition-all duration-200",
            error && "border-[var(--red)]",
            leftIcon && "pl-9",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[var(--red)]">{error}</p>}
      {hint && !error && <p className="text-xs text-[var(--text-dim)]">{hint}</p>}
    </div>
  )
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] font-display">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          "w-full bg-white/[0.04] border border-[var(--border)] rounded-[var(--radius-md)]",
          "px-3.5 py-2.5 text-sm font-display text-[var(--text)]",
          "placeholder:text-[var(--text-dim)]",
          "outline-none focus:border-[var(--teal)] focus:bg-white/[0.06]",
          "transition-all duration-200 resize-none",
          error && "border-[var(--red)]",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[var(--red)]">{error}</p>}
    </div>
  )
);
Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] font-display">
          {label}
        </label>
      )}
      <select
        className={cn(
          "w-full bg-white/[0.04] border border-[var(--border)] rounded-[var(--radius-md)]",
          "px-3.5 py-2.5 text-sm font-display text-[var(--text)]",
          "outline-none focus:border-[var(--teal)]",
          "transition-all duration-200 cursor-pointer",
          "[&>option]:bg-[var(--bg-elevated)]",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
