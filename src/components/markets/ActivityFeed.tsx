"use client";

import { ACTIVITY } from "@/lib/data/mock";
import { formatTimeAgo, formatCompact } from "@/lib/utils";
import { LiveBadge } from "@/components/ui/Badge";

export function ActivityFeed({ marketId }: { marketId?: string }) {
  const feed = marketId
    ? ACTIVITY.filter((a) => a.marketId === marketId)
    : ACTIVITY;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-display font-bold text-sm">Live Activity</h3>
        <LiveBadge />
      </div>
      {feed.length === 0 ? (
        <p className="text-sm text-[var(--text-dim)] py-4 text-center">No activity yet. Be the first!</p>
      ) : (
        feed.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 py-2.5 px-3 rounded-[var(--radius-sm)] hover:bg-white/[0.03] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--teal)] to-[var(--purple)] flex items-center justify-center text-[10px] font-bold text-black shrink-0">
              {item.userHandle.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--text)]">
                <span className="font-semibold font-display">{item.userHandle}</span>
                {" "}
                <span className="text-[var(--text-muted)]">{item.action}</span>
                {item.outcome && (
                  <span className={`ml-1 font-bold ${item.outcome === "yes" ? "text-[var(--teal)]" : "text-[var(--red)]"}`}>
                    {item.outcome.toUpperCase()}
                  </span>
                )}
                {item.amount && (
                  <span className="text-[var(--text-muted)]"> · {formatCompact(item.amount)}</span>
                )}
              </p>
              {item.marketTitle && (
                <p className="text-[10px] text-[var(--text-dim)] truncate mt-0.5">{item.marketTitle}</p>
              )}
            </div>
            <span className="text-[10px] text-[var(--text-dim)] shrink-0 font-mono">
              {formatTimeAgo(item.timestamp)}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
