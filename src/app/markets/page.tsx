"use client";

import { useState, useMemo } from "react";
import { MARKETS } from "@/lib/data/mock";
import { MarketCard } from "@/components/markets/MarketCard";
import { Ticker } from "@/components/layout/Ticker";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/Charts";
import { cn, formatCompact } from "@/lib/utils";
import type { MarketCategory } from "@/lib/types";
import { Search } from "lucide-react";

const CATEGORIES: (MarketCategory | "All")[] = ["All", "Price", "Grading", "Event", "Pull Odds", "Demand"];
const SORTS = ["Hot", "Volume", "New", "Ending Soon"] as const;

export default function MarketsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<MarketCategory | "All">("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Hot");

  const filtered = useMemo(() => {
    let m = [...MARKETS];
    if (search) m = m.filter((x) => x.title.toLowerCase().includes(search.toLowerCase()) || x.cardName.toLowerCase().includes(search.toLowerCase()));
    if (category !== "All") m = m.filter((x) => x.category === category);
    if (sort === "Hot") m.sort((a, b) => (b.hot ? 1 : 0) - (a.hot ? 1 : 0) || b.participants - a.participants);
    if (sort === "Volume") m.sort((a, b) => b.volume - a.volume);
    if (sort === "New") m.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    if (sort === "Ending Soon") m.sort((a, b) => a.endsAt.getTime() - b.endsAt.getTime());
    return m;
  }, [search, category, sort]);

  const totalVolume = MARKETS.reduce((s, m) => s + m.volume, 0);
  const totalParticipants = MARKETS.reduce((s, m) => s + m.participants, 0);

  return (
    <>
      <Ticker />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--teal)] mb-2 font-display">Explore</p>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight mb-3">Prediction Markets</h1>
          <p className="text-[var(--text-muted)] text-base">Find your edge in the TCG market.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total Volume" value={formatCompact(totalVolume)} color="var(--teal)" />
          <StatCard label="Live Markets" value={String(MARKETS.filter(m => m.status === "live").length)} color="var(--text)" />
          <StatCard label="Participants" value={`${(totalParticipants / 1000).toFixed(1)}K`} color="var(--purple)" />
          <StatCard label="Resolved YES" value="68%" color="var(--green)" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center justify-between">
          {/* Category tabs */}
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "px-3.5 py-1.5 rounded-[var(--radius-sm)] text-xs font-bold uppercase tracking-wider transition-all font-display",
                  category === c
                    ? "bg-[rgba(0,229,204,0.12)] text-[var(--teal)] border border-[rgba(0,229,204,0.2)]"
                    : "bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 border border-transparent"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Search + sort */}
          <div className="flex gap-2 items-center w-full sm:w-auto">
            <div className="relative flex-1 sm:w-[220px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search markets..."
                className="w-full bg-white/[0.04] border border-[var(--border)] rounded-[var(--radius-md)] pl-8 pr-3.5 py-2 text-xs font-display text-[var(--text)] placeholder:text-[var(--text-dim)] outline-none focus:border-[var(--teal)] transition-colors"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="bg-white/[0.04] border border-[var(--border)] rounded-[var(--radius-md)] px-3 py-2 text-xs font-display text-[var(--text)] outline-none focus:border-[var(--teal)] transition-colors cursor-pointer [&>option]:bg-[var(--bg-elevated)]"
            >
              {SORTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-display font-bold text-lg mb-2">No markets found</p>
            <p className="text-sm text-[var(--text-muted)]">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m) => (
              <MarketCard key={m.id} market={m} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
