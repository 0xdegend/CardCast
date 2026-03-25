import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  glow?: "teal" | "gold" | "purple" | "none";
  padding?: "none" | "sm" | "md" | "lg";
}

const glowStyles = {
  teal: "hover:border-[rgba(0,229,204,0.25)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_30px_rgba(0,229,204,0.06)]",
  gold: "hover:border-[rgba(240,180,41,0.25)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_30px_rgba(240,180,41,0.06)]",
  purple: "hover:border-[rgba(155,109,255,0.25)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_30px_rgba(155,109,255,0.06)]",
  none: "",
};

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-7",
};

export function Card({ className, children, hover = false, glow = "none", padding = "md" }: CardProps) {
  return (
    <div className={cn(
      "bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)]",
      hover && "card-hover cursor-pointer",
      glow !== "none" && glowStyles[glow],
      paddingStyles[padding],
      className
    )}>
      {children}
    </div>
  );
}

export function GlassCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn(
      "glass rounded-[var(--radius-lg)] p-5",
      className
    )}>
      {children}
    </div>
  );
}
