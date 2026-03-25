"use client";

import { useState } from "react";
import { LEADERBOARD, QUESTS } from "@/lib/data/mock";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/Charts";
import { formatXP } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Trophy, Zap, Gift, Users } from "lucide-react";

type Period = "This Week" | "This Month" | "All Time";

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("All Time");
  const top3 = [LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--gold)] mb-2 font-display">Rankings</p>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight mb-3">Leaderboard</h1>
        <p className="text-[var(--text-muted)] text-base max-w-md">
          Top predictors earn the biggest share of the $CAST airdrop. Every correct call counts.
        </p>
      </div>

      {/* ── Podium ── */}
      <div className="flex justify-center items-end gap-4 mb-12">
        {top3.map((user, i) => {
          const isWinner = i === 1;
          const podiumHeight = [100, 128, 84][i];
          return (
            <div key={user.rank} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{user.badge}</span>
              <p className="font-display font-bold text-sm">{user.handle}</p>
              <p className="font-mono text-xs text-[var(--teal)]">{formatXP(user.xp)} XP</p>
              <div
                className={cn(
                  "rounded-t-[var(--radius-md)] flex items-center justify-center border transition-all",
                  isWinner
                    ? "bg-[rgba(240,180,41,0.12)] border-[rgba(240,180,41,0.35)] shadow-[0_-8px_32px_rgba(240,180,41,0.15)]"
                    : "bg-white/[0.04] border-[var(--border)]"
                )}
                style={{ width: isWinner ? 96 : 76, height: podiumHeight }}
              >
                <span className={`font-mono font-bold text-lg ${isWinner ? "text-[var(--gold)]" : "text-[var(--text-dim)]"}`}>
                  #{user.rank}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Period selector */}
      <div className="flex gap-2 mb-5">
        {(["This Week", "This Month", "All Time"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              "px-4 py-1.5 rounded-[var(--radius-sm)] text-xs font-bold uppercase tracking-wider transition-all font-display",
              period === p
                ? "bg-[rgba(0,229,204,0.1)] text-[var(--teal)] border border-[rgba(0,229,204,0.2)]"
                : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 border border-transparent"
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-xl)] overflow-hidden mb-10">
        {/* Header row */}
        <div className="grid grid-cols-[40px_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-[var(--border)]">
          {["#", "Predictor", "Points", "Win Rate", "Streak", "PnL"].map((h) => (
            <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-dim)] font-display">{h}</span>
          ))}
        </div>

        {LEADERBOARD.map((user, idx) => (
          <div
            key={user.rank}
            className={cn(
              "grid grid-cols-[40px_1fr_auto_auto_auto_auto] gap-4 px-5 py-3.5 items-center transition-colors hover:bg-white/[0.025]",
              user.isCurrentUser && "bg-[rgba(0,229,204,0.04)] border-l-2 border-[var(--teal)]",
              !user.isCurrentUser && "border-l-2 border-transparent",
              idx < LEADERBOARD.length - 1 && "border-b border-[var(--border)]"
            )}
          >
            {/* Rank */}
            <span className="text-base">{user.badge}</span>

            {/* User */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--teal)] to-[var(--purple)] flex items-center justify-center text-[11px] font-bold text-black shrink-0">
                {user.handle.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-sm truncate">{user.handle}</span>
                  {user.isCurrentUser && <Badge variant="teal">YOU</Badge>}
                </div>
                <span className="text-[10px] text-[var(--text-dim)] font-mono">{user.accuracy}% accuracy</span>
              </div>
            </div>

            {/* Points */}
            <span className="font-mono text-sm font-medium text-[var(--gold)]">{formatXP(user.xp)}</span>

            {/* Win Rate */}
            <span className="font-mono text-sm text-[var(--green)]">{user.winRate}</span>

            {/* Streak */}
            <div className="flex items-center gap-1">
              {user.streak > 0
                ? <><span className="text-sm">🔥</span><span className="font-mono text-xs text-[var(--gold)]">{user.streak}</span></>
                : <span className="text-[var(--text-dim)] text-xs">—</span>}
            </div>

            {/* PnL */}
            <span className="font-mono text-sm text-[var(--green)]">{user.pnl}</span>
          </div>
        ))}
      </div>

      {/* ── Daily Quests ── */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-5">
          <Zap size={18} className="text-[var(--gold)]" />
          <h2 className="font-display font-bold text-xl">Daily Quests</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUESTS.map((q: import("@/lib/types").Quest) => (
            <div
              key={q.id}
              className={cn(
                "bg-[var(--bg-card)] border rounded-[var(--radius-lg)] p-4 transition-all",
                q.completed ? "border-[rgba(0,208,132,0.25)]" : "border-[var(--border)]"
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{q.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-display font-bold text-sm">{q.title}</p>
                      <Badge variant={q.type === "daily" ? "muted" : q.type === "weekly" ? "gold" : "purple"}>
                        {q.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{q.description}</p>
                  </div>
                </div>
                <Badge variant={q.completed ? "green" : "gold"}>+{q.xpReward} XP</Badge>
              </div>
              <ProgressBar value={q.progress} color={q.completed ? "green" : "teal"} />
              <p className="font-mono text-[10px] text-[var(--text-dim)] mt-1.5">
                {q.current}/{q.total} · {q.progress}% complete
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Referral / Airdrop info ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <Gift size={20} />, title: "Seasonal Airdrop", desc: "Leaderboard resets seasonally. Top 100 predictors share the $CAST airdrop pool.", color: "gold" },
          { icon: <Users size={20} />, title: "Referral Bonus", desc: "Earn 200 XP per verified referral. Your referrals' activity earns you 5% XP bonus.", color: "purple" },
          { icon: <Trophy size={20} />, title: "Hall of Fame", desc: "All-time top predictors are permanently enshrined in the CardCast Hall of Fame.", color: "teal" },
        ].map(({ icon, title, desc, color }) => (
          <div key={title} className={cn(
            "border rounded-[var(--radius-lg)] p-5",
            color === "gold" ? "bg-[rgba(240,180,41,0.05)] border-[rgba(240,180,41,0.15)]"
            : color === "purple" ? "bg-[rgba(155,109,255,0.05)] border-[rgba(155,109,255,0.15)]"
            : "bg-[rgba(0,229,204,0.05)] border-[rgba(0,229,204,0.15)]"
          )}>
            <div className={cn("w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center mb-3",
              color === "gold" ? "bg-[rgba(240,180,41,0.12)] text-[var(--gold)]"
              : color === "purple" ? "bg-[rgba(155,109,255,0.12)] text-[var(--purple)]"
              : "bg-[rgba(0,229,204,0.12)] text-[var(--teal)]"
            )}>
              {icon}
            </div>
            <h3 className="font-display font-bold text-sm mb-1.5">{title}</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
