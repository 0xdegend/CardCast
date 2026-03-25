"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MARKETS, generateOddsHistory } from "@/lib/data/mock";
import { TradePanel } from "@/components/markets/TradePanel";
import { ActivityFeed } from "@/components/markets/ActivityFeed";
import { MarketCard } from "@/components/markets/MarketCard";
import { OddsChart, OddsBar, StatCard } from "@/components/ui/Charts";
import { Badge, LiveBadge } from "@/components/ui/Badge";
import { formatCompact, formatDate, formatTimeLeft } from "@/lib/utils";
import { ArrowLeft, Info, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const INFO_TABS = ["Chart", "Details", "Activity", "Comments"] as const;

export default function MarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const market = MARKETS.find((m) => m.id === id);
  if (!market) notFound();

  const [infoTab, setInfoTab] = useState<(typeof INFO_TABS)[number]>("Chart");
  const [comment, setComment] = useState("");
  const oddsHistory = generateOddsHistory(market.yesOdds, 30);
  const related = MARKETS.filter((m) => m.id !== market.id && m.category === market.category).slice(0, 3);

  // Mock comments
  const comments = [
    { user: "0xSatoshi", text: "Charizard has been on a consistent uptrend since Q3. YES is the move.", time: "2h ago" },
    { user: "CardShark99", text: "I'm not so sure. Supply is increasing with reprints.", time: "5h ago" },
    { user: "PokeDegen", text: "HODL. The graded market alone justifies this.", time: "1d ago" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Back nav */}
      <Link href="/markets" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-6 transition-colors font-display font-medium group">
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Markets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* ── Left column ── */}
        <div className="flex flex-col gap-5">
          {/* Market header card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-[var(--radius-md)] bg-white/5 flex items-center justify-center text-3xl shrink-0">
                {market.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Badge variant={market.category === "Price" ? "teal" : market.category === "Grading" ? "gold" : "purple"}>
                    {market.category}
                  </Badge>
                  <LiveBadge />
                  {market.hot && <Badge variant="red">🔥 Hot</Badge>}
                </div>
                <h1 className="font-display font-extrabold text-xl sm:text-2xl leading-tight">{market.title}</h1>
                <p className="text-sm text-[var(--text-muted)] mt-1.5">{market.setName} · {market.cardName}</p>
              </div>
            </div>

            {/* Big odds display */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-[rgba(0,229,204,0.06)] border border-[rgba(0,229,204,0.15)] rounded-[var(--radius-md)] p-4 text-center">
                <p className="font-mono text-3xl font-medium text-[var(--teal)] mb-1">{market.yesOdds}%</p>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-display font-semibold">YES Probability</p>
              </div>
              <div className="bg-[rgba(255,77,106,0.06)] border border-[rgba(255,77,106,0.15)] rounded-[var(--radius-md)] p-4 text-center">
                <p className="font-mono text-3xl font-medium text-[var(--red)] mb-1">{100 - market.yesOdds}%</p>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-display font-semibold">NO Probability</p>
              </div>
            </div>

            <OddsBar yes={market.yesOdds} animated showLabels height={8} />

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-2 mt-5">
              {[
                { label: "Volume", value: formatCompact(market.volume) },
                { label: "Liquidity", value: formatCompact(market.liquidity) },
                { label: "Traders", value: market.participants.toLocaleString() },
                { label: "Ends", value: formatTimeLeft(market.endsAt) },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="font-mono text-sm font-medium">{value}</p>
                  <p className="text-[10px] text-[var(--text-dim)] mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Info tabs */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-xl)] p-5">
            <div className="flex gap-1 mb-5 overflow-x-auto">
              {INFO_TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setInfoTab(t)}
                  className={cn(
                    "px-4 py-1.5 rounded-[var(--radius-sm)] text-xs font-bold uppercase tracking-wider transition-all font-display whitespace-nowrap",
                    infoTab === t
                      ? "bg-[rgba(0,229,204,0.1)] text-[var(--teal)] border border-[rgba(0,229,204,0.2)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 border border-transparent"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            {infoTab === "Chart" && (
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-3 font-display">YES Odds — Last 30 days</p>
                <OddsChart data={oddsHistory} />
              </div>
            )}

            {infoTab === "Details" && (
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-dim)] mb-2 font-display">Description</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{market.description}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-dim)] mb-2 font-display">Resolution Criteria</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{market.resolutionCriteria}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.03] rounded-[var(--radius-sm)] p-3">
                    <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest mb-1 font-display">Data Source</p>
                    <p className="text-xs text-[var(--text)] flex items-center gap-1.5">
                      {market.dataSource} <ExternalLink size={10} className="text-[var(--text-dim)]" />
                    </p>
                  </div>
                  <div className="bg-white/[0.03] rounded-[var(--radius-sm)] p-3">
                    <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest mb-1 font-display">Expiry Date</p>
                    <p className="text-xs text-[var(--text)]">{formatDate(market.endsAt)}</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-[var(--radius-sm)] p-3">
                    <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest mb-1 font-display">Created</p>
                    <p className="text-xs text-[var(--text)]">{formatDate(market.createdAt)}</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-[var(--radius-sm)] p-3">
                    <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest mb-1 font-display">Tags</p>
                    <div className="flex gap-1 flex-wrap">
                      {market.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[10px] text-[var(--teal)] bg-[rgba(0,229,204,0.08)] px-1.5 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-[rgba(240,180,41,0.06)] border border-[rgba(240,180,41,0.15)] rounded-[var(--radius-md)] p-3">
                  <Info size={14} className="text-[var(--gold)] shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    This market resolves based on publicly verifiable data from the stated source. All positions are settled onchain with no counterparty risk.
                  </p>
                </div>
              </div>
            )}

            {infoTab === "Activity" && <ActivityFeed marketId={market.id} />}

            {infoTab === "Comments" && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  {comments.map((c, i) => (
                    <div key={i} className="flex gap-3 py-3 border-b border-[var(--border)] last:border-0">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--teal)] to-[var(--purple)] flex items-center justify-center text-[10px] font-bold text-black shrink-0">
                        {c.user.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-display font-bold">{c.user}</span>
                          <span className="text-[10px] text-[var(--text-dim)] font-mono">{c.time}</span>
                        </div>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-white/[0.04] border border-[var(--border)] rounded-[var(--radius-md)] px-3.5 py-2 text-xs font-display text-[var(--text)] placeholder:text-[var(--text-dim)] outline-none focus:border-[var(--teal)] transition-colors"
                  />
                  <button
                    onClick={() => setComment("")}
                    className="px-4 py-2 bg-[rgba(0,229,204,0.1)] border border-[rgba(0,229,204,0.2)] rounded-[var(--radius-md)] text-xs font-bold text-[var(--teal)] hover:bg-[rgba(0,229,204,0.15)] transition-colors font-display"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Related markets */}
          {related.length > 0 && (
            <div>
              <h2 className="font-display font-bold text-base mb-3">Related Markets</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {related.map((m) => <MarketCard key={m.id} market={m} compact />)}
              </div>
            </div>
          )}
        </div>

        {/* ── Right column — Trade + Activity ── */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-[72px] lg:self-start">
          <TradePanel market={market} />
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-xl)] p-5">
            <ActivityFeed marketId={market.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
