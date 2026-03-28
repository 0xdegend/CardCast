"use client";

import Link from "next/link";
import Image from "next/image";
import { Bookmark, BookmarkCheck } from "lucide-react";
import type { Market } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { formatCompact, formatTimeLeft } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { PredictionOddsRange, Sparkline } from "@/components/ui/Charts";

function seedSparkline(id: string, base: number): number[] {
  let seed = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
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
      <article className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 card-hover card-hover-teal h-full flex flex-col gap-4 transition-shadow duration-300 hover:shadow-[0_20px_48px_rgba(0,0,0,0.12)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="relative w-12 h-12 shrink-0 rounded-[var(--radius-sm)] overflow-hidden ring-1 ring-[var(--border)] bg-[var(--bg-elevated)] flex items-center justify-center text-xl">
              {market.image ? (
                <>
                  <Image
                    src={market.image}
                    alt=""
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                    sizes="48px"
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-lg bg-[var(--bg-card)]/80 backdrop-blur-[2px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {market.emoji}
                  </span>
                </>
              ) : (
                <span aria-hidden>{market.emoji}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-[var(--text-dim)] mb-1 truncate">
                {market.setName}
              </p>
              <Badge
                variant={
                  market.category === "Price"
                    ? "teal"
                    : market.category === "Grading"
                      ? "gold"
                      : market.category === "Event"
                        ? "purple"
                        : "muted"
                }
              >
                {market.category}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {market.hot && <Badge variant="red">🔥 Hot</Badge>}
            {!market.hot && market.trending && (
              <Badge variant="gold">📈 Trending</Badge>
            )}
            {market.status === "ending" && <Badge variant="red">⏰ Ending</Badge>}
            {!market.hot &&
              !market.trending &&
              market.status === "live" &&
              market.change24h > 5 && <Badge variant="purple">✦ New</Badge>}

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWatchlist(market.id);
              }}
              className="p-1 text-[var(--text-dim)] hover:text-[var(--gold)] transition-colors rounded-sm hover:bg-white/5"
              aria-label={isWatched ? "Remove from watchlist" : "Add to watchlist"}
            >
              {isWatched ? (
                <BookmarkCheck size={15} className="text-[var(--gold)]" />
              ) : (
                <Bookmark size={15} />
              )}
            </button>
          </div>
        </div>

        <h3 className="font-display font-bold text-[15px] leading-snug text-[var(--text)] line-clamp-2">
          {market.title}
        </h3>

        <PredictionOddsRange yes={market.yesOdds} animated />

        {!compact && (
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--border)]">
            <div className="text-center min-w-0 flex-1">
              <p className="font-mono text-xs font-medium text-[var(--text)] truncate">
                {formatCompact(market.volume)}
              </p>
              <p className="text-[10px] text-[var(--text-dim)] mt-0.5">Volume</p>
            </div>
            <div className="text-center min-w-0 flex-1">
              <p
                className={`font-mono text-xs font-medium truncate ${isUp ? "text-[var(--green)]" : "text-[var(--red)]"}`}
              >
                {isUp ? "+" : ""}
                {market.change24h}%
              </p>
              <p className="text-[10px] text-[var(--text-dim)] mt-0.5">24h</p>
            </div>
            <div className="text-center min-w-0 flex-1">
              <p className="font-mono text-xs font-medium text-[var(--text)]">
                {market.participants.toLocaleString()}
              </p>
              <p className="text-[10px] text-[var(--text-dim)] mt-0.5">Traders</p>
            </div>
            <div className="text-center min-w-0 flex-1 hidden sm:block">
              <p className="font-mono text-xs font-medium text-[var(--gold)]">
                {formatTimeLeft(market.endsAt)}
              </p>
              <p className="text-[10px] text-[var(--text-dim)] mt-0.5">Ends</p>
            </div>
            <div className="shrink-0 hidden md:block">
              <Sparkline data={sparkData} width={64} height={28} />
            </div>
          </div>
        )}
      </article>
    </Link>
  );
}
