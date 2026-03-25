import { cn } from "@/lib/utils";

export type BadgeVariant = "teal" | "gold" | "purple" | "red" | "green" | "blue" | "muted";

const variantStyles: Record<BadgeVariant, string> = {
  teal:   "bg-[rgba(0,229,204,0.1)]   text-[var(--teal)]   border-[rgba(0,229,204,0.2)]",
  gold:   "bg-[rgba(240,180,41,0.1)]  text-[var(--gold)]   border-[rgba(240,180,41,0.2)]",
  purple: "bg-[rgba(155,109,255,0.1)] text-[var(--purple)] border-[rgba(155,109,255,0.2)]",
  red:    "bg-[rgba(255,77,106,0.1)]  text-[var(--red)]    border-[rgba(255,77,106,0.2)]",
  green:  "bg-[rgba(0,208,132,0.1)]   text-[var(--green)]  border-[rgba(0,208,132,0.2)]",
  blue:   "bg-[rgba(59,158,255,0.1)]  text-[var(--blue)]   border-[rgba(59,158,255,0.2)]",
  muted:  "bg-white/5 text-[var(--text-muted)] border-[var(--border)]",
};

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = "muted", className, children }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
      "text-[10px] font-semibold tracking-widest uppercase border font-display",
      variantStyles[variant],
      className
    )}>
      {children}
    </span>
  );
}

export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[rgba(255,77,106,0.1)] text-[var(--red)] border border-[rgba(255,77,106,0.25)] font-display">
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)] animate-blink" />
      LIVE
    </span>
  );
}
