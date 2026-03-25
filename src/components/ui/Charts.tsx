"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";

// ── Odds Bar ──────────────────────────────────────────────────

interface OddsBarProps {
  yes: number;
  animated?: boolean;
  height?: number;
  showLabels?: boolean;
}

export function OddsBar({ yes, animated = false, height = 6, showLabels = false }: OddsBarProps) {
  const [width, setWidth] = useState(animated ? 0 : yes);

  useEffect(() => {
    if (animated) {
      const t = setTimeout(() => setWidth(yes), 150);
      return () => clearTimeout(t);
    }
  }, [yes, animated]);

  return (
    <div>
      <div
        className="rounded-full overflow-hidden bg-white/5 flex gap-0.5"
        style={{ height }}
      >
        <div
          className="odds-yes rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, height: "100%" }}
        />
        <div
          className="odds-no flex-1 rounded-full"
          style={{ height: "100%" }}
        />
      </div>
      {showLabels && (
        <div className="flex justify-between mt-2">
          <span className="font-mono text-xs text-[var(--teal)] font-medium">YES {yes}%</span>
          <span className="font-mono text-xs text-[var(--red)] font-medium">NO {100 - yes}%</span>
        </div>
      )}
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────────

interface ProgressBarProps {
  value: number; // 0-100
  color?: "teal" | "gold" | "purple" | "green";
  height?: number;
  animated?: boolean;
}

const progressColors = {
  teal: "linear-gradient(90deg, var(--teal), var(--teal-dim))",
  gold: "linear-gradient(90deg, var(--gold), #ff9d00)",
  purple: "linear-gradient(90deg, var(--purple), var(--purple-dim))",
  green: "linear-gradient(90deg, var(--green), var(--teal))",
};

export function ProgressBar({ value, color = "teal", height = 4, animated = true }: ProgressBarProps) {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (animated) {
      const t = setTimeout(() => setW(value), 100);
      return () => clearTimeout(t);
    } else {
      setW(value);
    }
  }, [value, animated]);

  return (
    <div
      className="rounded-full overflow-hidden bg-white/6"
      style={{ height }}
    >
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${w}%`, background: progressColors[color] }}
      />
    </div>
  );
}

// ── Mini Sparkline Chart ──────────────────────────────────────

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function Sparkline({ data, color = "var(--teal)", width = 80, height = 32 }: SparklineProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((v, i) =>
    `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 2) - 1}`
  ).join(" ");

  const areaPoints = `0,${height} ${points} ${width},${height}`;
  const isUp = data[data.length - 1] >= data[0];
  const c = isUp ? color : "var(--red)";

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg-${color.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity="0.3" />
          <stop offset="100%" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={areaPoints} fill={`url(#sg-${color.replace(/[^a-z0-9]/gi, "")})`} />
      <polyline points={points} fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Full Odds History Chart ────────────────────────────────────

interface OddsChartProps {
  data: { time: string; odds: number; volume: number }[];
}

export function OddsChart({ data }: OddsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="oddsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <XAxis dataKey="time" tick={{ fontSize: 10, fill: "var(--text-dim)", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} interval={6} />
        <Tooltip
          contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, fontFamily: "DM Mono", color: "var(--text)" }}
          formatter={(value: number) => [`${value}%`, "YES Odds"]}
        />
        <Area type="monotone" dataKey="odds" stroke="var(--teal)" strokeWidth={2} fill="url(#oddsGrad)" dot={false} activeDot={{ r: 4, fill: "var(--teal)" }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Skeleton Loader ───────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-shimmer rounded-[var(--radius-sm)] bg-white/5 ${className ?? ""}`} />
  );
}

// ── Stat Card ─────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  icon?: string;
}

export function StatCard({ label, value, sub, color, icon }: StatCardProps) {
  return (
    <div className="bg-white/[0.03] border border-[var(--border)] rounded-[var(--radius-md)] p-4">
      {icon && <span className="text-lg mb-2 block">{icon}</span>}
      <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1 font-display">{label}</div>
      <div className="font-mono text-xl font-medium" style={color ? { color } : {}}>{value}</div>
      {sub && <div className="text-xs text-[var(--text-dim)] mt-1">{sub}</div>}
    </div>
  );
}
