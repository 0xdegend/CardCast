"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck } from "lucide-react";
import type { Market } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { formatCompact, formatTimeLeft } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { OddsBar, Sparkline } from "@/components/ui/Charts";

// Generate stable sparkline data from market id
function seedSparkline(id: string, base: number): number[] {
  let seed = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  return Array.from({ length: 14 }, (_, i) => {
    if (i === 0) return base - 15;
    return Math.min(95, Math.max(5, base + (rng() - 0.47) * 18));
  });
}

interface MarketCardProps {
  market: Market;
  compact?: boolean;
}

export function MarketCard({ market, compact = false }: MarketCardProps) {
  const { watchlist, toggleWatchlist } = useAppStore();
  const isWatched = watchlist.includes(market.id);
  const isUp = market.change24h > 0;
  const sparkData = seedSparkline(market.id, market.yesOdds);

  return (
    <Link href={`/market/${market.id}`} className="block group">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 card-hover card-hover-teal h-full flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-white/5 flex items-center justify-center text-xl shrink-0">
              {market.emoji}
            </div>
            <div>
              <p className="text-[11px] text-[var(--text-dim)] mb-1">{market.setName}</p>
              <div className="flex items-center gap-1.5">
                <Badge variant={
                  market.category === "Price" ? "teal"
                  : market.category === "Grading" ? "gold"
                  : market.category === "Event" ? "purple"
                  : "muted"
                }>
                  {market.category}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {market.hot && <Badge variant="red">🔥 Hot</Badge>}
            {!market.hot && market.trending && <Badge variant="gold">📈 Trending</Badge>}
            {market.status === "ending" && <Badge variant="red">⏰ Ending</Badge>}
            {!market.hot && !market.trending && market.status === "live" && market.change24h > 5 && (
              <Badge variant="purple">✦ New</Badge>
            )}

            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWatchlist(market.id); }}
              className="p-1 text-[var(--text-dim)] hover:text-[var(--gold)] transition-colors"
            >
              {isWatched
                ? <BookmarkCheck size={15} className="text-[var(--gold)]" />
                : <Bookmark size={15} />
              }
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-sm leading-snug text-[var(--text)] line-clamp-2 flex-1">
          {market.title}
        </h3>

        {/* Odds */}
        <div>
          <OddsBar yes={market.yesOdds} animated showLabels />
        </div>

        {/* Stats */}
        {!compact && (
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
            <div className="text-center">
              <p className="font-mono text-xs font-medium text-[var(--text)]">
                {formatCompact(market.volume)}
              </p>
              <p className="text-[10px] text-[var(--text-dim)] mt-0.5">Volume</p>
            </div>
            <div className="text-center">
              <p className={`font-mono text-xs font-medium ${isUp ? "text-[var(--green)]" : "text-[var(--red)]"}`}>
                {isUp ? "+" : ""}{market.change24h}%
              </p>
              <p className="text-[10px] text-[var(--text-dim)] mt-0.5">24h</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-xs font-medium text-[var(--text)]">
                {market.participants.toLocaleString()}
              </p>
              <p className="text-[10px] text-[var(--text-dim)] mt-0.5">Traders</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-xs font-medium text-[var(--gold)]">
                {formatTimeLeft(market.endsAt)}
              </p>
              <p className="text-[10px] text-[var(--text-dim)] mt-0.5">Ends</p>
            </div>
            <Sparkline data={sparkData} width={64} height={28} />
          </div>
        )}
      </div>
    </Link>
  );
}
