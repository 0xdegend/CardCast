"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_USER, POSITIONS, ACHIEVEMENTS, MARKETS, ACTIVITY } from "@/lib/data/mock";
import { MarketCard } from "@/components/markets/MarketCard";
import { ActivityFeed } from "@/components/markets/ActivityFeed";
import { Badge, LiveBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/Charts";
import { formatUSD, formatXP, formatAddress, formatTimeAgo, pnlColor } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { Share2, Copy, ExternalLink } from "lucide-react";

type Tab = "Positions" | "History" | "Achievements" | "Watchlist";

export default function ProfilePage() {
  const { isAuthenticated, login } = useAppStore();
  const [tab, setTab] = useState<Tab>("Positions");
  const user = MOCK_USER;

  const watchlistMarkets = MARKETS.filter((m) => user.watchlist.includes(m.id));
  const totalInvested = POSITIONS.reduce((s, p) => s + p.invested, 0);
  const totalCurrentValue = POSITIONS.reduce((s, p) => s + p.currentValue, 0);
  const unrealizedPnl = totalCurrentValue - totalInvested;

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="text-6xl mb-2">🔐</div>
        <h1 className="font-display font-extrabold text-3xl tracking-tight">Connect to view profile</h1>
        <p className="text-[var(--text-muted)] max-w-sm">Your positions, XP, and achievements are stored onchain. Connect your wallet to access your dashboard.</p>
        <Button size="lg" onClick={login}>Connect Wallet</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* ── Profile Header ── */}
      <div className="relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-2xl)] p-6 sm:p-8 mb-6">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,229,204,0.05) 0%, transparent 70%)" }} />

        <div className="relative flex items-start gap-5 flex-wrap">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--teal)] to-[var(--purple)] flex items-center justify-center text-xl font-extrabold text-black border-2 border-[rgba(0,229,204,0.3)] shrink-0">
            {user.handle.slice(0, 2).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="font-display font-extrabold text-2xl">{user.handle}</h1>
              <LiveBadge />
              <Badge variant="teal">Rank #{user.rank}</Badge>
              {user.streak > 0 && <Badge variant="gold">🔥 {user.streak} Streak</Badge>}
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-xs text-[var(--text-dim)]">{formatAddress(user.address)}</span>
              <button className="text-[var(--text-dim)] hover:text-[var(--text-muted)] transition-colors">
                <Copy size={11} />
              </button>
              <span className="text-[var(--text-dim)] text-xs">· Connected via Privy</span>
            </div>

            {/* Stats */}
            <div className="flex gap-6 flex-wrap">
              {[
                { label: "XP Earned", value: formatXP(user.xp), color: "var(--gold)" },
                { label: "Win Rate", value: `${user.winRate}%`, color: "var(--green)" },
                { label: "Total PnL", value: formatUSD(user.totalPnl), color: "var(--teal)" },
                { label: "Markets", value: String(user.marketsTraded), color: "var(--purple)" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <p className="font-mono text-xl font-medium" style={{ color }}>{value}</p>
                  <p className="text-xs text-[var(--text-dim)] mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: XP progress + actions */}
          <div className="flex flex-col gap-3 min-w-[180px]">
            <div className="bg-white/[0.03] border border-[var(--border)] rounded-[var(--radius-md)] p-3.5">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-dim)] mb-2 font-display">XP to Next Rank</p>
              <ProgressBar value={Math.round((user.xp / 33000) * 100)} color="gold" />
              <p className="font-mono text-[11px] text-[var(--text-dim)] mt-1.5">{formatXP(user.xp)} / 33,000</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1 gap-1.5 !text-xs">
                <Share2 size={12} /> Share
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 !text-xs">
                <ExternalLink size={12} />
              </Button>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="relative flex items-center gap-2 mt-5 pt-5 border-t border-[var(--border)] flex-wrap">
          {user.badges.map((b) => (
            <div key={b.id} className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-display font-semibold",
              b.rarity === "legendary" ? "bg-[rgba(240,180,41,0.1)] border-[rgba(240,180,41,0.3)] text-[var(--gold)]"
              : b.rarity === "epic" ? "bg-[rgba(155,109,255,0.1)] border-[rgba(155,109,255,0.3)] text-[var(--purple)]"
              : b.rarity === "rare" ? "bg-[rgba(0,229,204,0.1)] border-[rgba(0,229,204,0.3)] text-[var(--teal)]"
              : "bg-white/5 border-[var(--border)] text-[var(--text-muted)]"
            )}>
              {b.icon} {b.name}
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1.5 mb-5">
        {(["Positions", "History", "Achievements", "Watchlist"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 rounded-[var(--radius-sm)] text-xs font-bold uppercase tracking-wider transition-all font-display",
              tab === t
                ? "bg-[rgba(0,229,204,0.1)] text-[var(--teal)] border border-[rgba(0,229,204,0.2)]"
                : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 border border-transparent"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      {tab === "Positions" && (
        <div className="flex flex-col gap-4">
          {/* PnL summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Invested", value: formatUSD(totalInvested), color: "var(--text)" },
              { label: "Current Value", value: formatUSD(totalCurrentValue), color: "var(--teal)" },
              { label: "Unrealized PnL", value: `${unrealizedPnl >= 0 ? "+" : ""}${formatUSD(unrealizedPnl)}`, color: pnlColor(unrealizedPnl) },
              { label: "Open Positions", value: String(POSITIONS.length), color: "var(--purple)" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-md)] p-4">
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-dim)] mb-1.5 font-display">{label}</p>
                <p className="font-mono text-lg font-medium" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>

          {POSITIONS.map((p) => (
            <Link key={p.id} href={`/market/${p.marketId}`}>
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 card-hover flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant={p.outcome === "yes" ? "teal" : "red"}>{p.outcome.toUpperCase()}</Badge>
                    <span className="font-display font-bold text-sm truncate">{p.marketTitle}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[var(--text-dim)] font-mono">
                    <span>${p.invested} invested</span>
                    <span>Entry {Math.round(p.entryPrice * 100)}% → Now {Math.round(p.currentPrice * 100)}%</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-lg font-medium" style={{ color: pnlColor(p.pnl) }}>
                    {p.pnl >= 0 ? "+" : ""}${p.pnl}
                  </p>
                  <p className="text-xs font-mono" style={{ color: pnlColor(p.pnl) }}>
                    {p.pnl >= 0 ? "+" : ""}{p.pnlPercent.toFixed(1)}%
                  </p>
                  <p className="text-[10px] text-[var(--text-dim)] mt-0.5 uppercase tracking-wider font-display">
                    {p.status}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {tab === "History" && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-xl)] overflow-hidden">
          {ACTIVITY.map((item, idx) => (
            <div key={item.id} className={cn(
              "flex items-center gap-3 px-5 py-3.5",
              idx < ACTIVITY.length - 1 && "border-b border-[var(--border)]"
            )}>
              <span className="text-base">
                {item.type === "trade" ? (item.outcome === "yes" ? "📈" : "📉") : item.type === "create" ? "✦" : "✅"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-sm">{item.action}</p>
                {item.marketTitle && (
                  <p className="text-xs text-[var(--text-dim)] truncate mt-0.5">{item.marketTitle}</p>
                )}
              </div>
              {item.amount && (
                <span className="font-mono text-xs text-[var(--text)]">${item.amount.toLocaleString()}</span>
              )}
              <span className="font-mono text-[10px] text-[var(--text-dim)] shrink-0">{formatTimeAgo(item.timestamp)}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "Achievements" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ACHIEVEMENTS.map((a) => (
            <div
              key={a.id}
              className={cn(
                "bg-[var(--bg-card)] border rounded-[var(--radius-lg)] p-4 text-center transition-all",
                a.unlocked
                  ? "border-[rgba(240,180,41,0.25)] hover:border-[rgba(240,180,41,0.5)] hover:shadow-[0_0_20px_rgba(240,180,41,0.08)] cursor-pointer"
                  : "border-[var(--border)] opacity-45 grayscale"
              )}
            >
              <div className="text-3xl mb-2">{a.icon}</div>
              <p className="font-display font-bold text-xs mb-1">{a.name}</p>
              <p className="text-[10px] text-[var(--text-muted)] leading-relaxed mb-2">{a.description}</p>
              {a.unlocked ? (
                <Badge variant="gold">+{a.xpReward} XP</Badge>
              ) : (
                <div>
                  <ProgressBar value={a.progress} color="purple" height={3} />
                  <p className="font-mono text-[10px] text-[var(--text-dim)] mt-1">{a.current}/{a.total}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "Watchlist" && (
        <div>
          {watchlistMarkets.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-3xl mb-3">🔖</p>
              <p className="font-display font-bold text-lg mb-2">No markets bookmarked</p>
              <p className="text-sm text-[var(--text-muted)] mb-4">Save markets to track them here.</p>
              <Link href="/markets"><Button variant="secondary">Browse Markets</Button></Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchlistMarkets.map((m) => <MarketCard key={m.id} market={m} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
