"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";
import { MARKETS, LEADERBOARD } from "@/lib/data/mock";
import { MarketCard } from "@/components/markets/MarketCard";
import { Ticker } from "@/components/layout/Ticker";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatXP } from "@/lib/utils";
import { ArrowRight, Zap, Shield, TrendingUp, Trophy } from "lucide-react";
import HeroSection from "@/components/layout/HeroSection";

// ── Floating Card Visual ──────────────────────────────────────

export default function HomePage() {
  const { login, isAuthenticated } = useAppStore();
  const featuredMarkets = MARKETS.filter((m) => m.featured).slice(0, 3);

  return (
    <>
      <HeroSection />
      <Ticker />

      {/* ── Featured Markets ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--teal)] mb-2 font-display">
              Featured
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight">
              Hot Markets 🔥
            </h2>
          </div>
          <Link
            href="/markets"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[var(--teal)] hover:opacity-80 transition-opacity font-display"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredMarkets.map((m) => (
            <MarketCard key={m.id} market={m} />
          ))}
        </div>
        <div className="mt-4 sm:hidden">
          <Link href="/markets">
            <Button variant="secondary" fullWidth>
              View All Markets
            </Button>
          </Link>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--gold)] mb-3 font-display">
            How It Works
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight">
            Simple as predicting a pull
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: <Zap size={22} />,
              step: "01",
              title: "Connect Wallet",
              desc: "Sign in with Privy using email, Google, or any EVM wallet. Embedded wallet included — no extension needed.",
              color: "teal",
            },
            {
              icon: <TrendingUp size={22} />,
              step: "02",
              title: "Browse Markets",
              desc: "Discover prediction markets for card prices, PSA grading outcomes, pull odds, and competitive events.",
              color: "purple",
            },
            {
              icon: <Shield size={22} />,
              step: "03",
              title: "Take a Position",
              desc: "Buy YES or NO shares onchain. Odds update in real-time based on collective market activity.",
              color: "gold",
            },
            {
              icon: <Trophy size={22} />,
              step: "04",
              title: "Earn & Win",
              desc: "Correct predictions pay out. Earn XP for every action — predictions, quests, referrals — toward the $CAST airdrop.",
              color: "green",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6"
            >
              <div
                className={`w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center mb-4 
                ${
                  item.color === "teal"
                    ? "bg-[rgba(0,229,204,0.1)] text-[var(--teal)]"
                    : item.color === "purple"
                      ? "bg-[rgba(155,109,255,0.1)] text-[var(--purple)]"
                      : item.color === "gold"
                        ? "bg-[rgba(240,180,41,0.1)] text-[var(--gold)]"
                        : "bg-[rgba(0,208,132,0.1)] text-[var(--green)]"
                }`}
              >
                {item.icon}
              </div>
              <p className="font-mono text-[11px] text-[var(--text-dim)] mb-2 tracking-wider">
                STEP {item.step}
              </p>
              <h3 className="font-display font-bold text-base mb-2">
                {item.title}
              </h3>
              <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Leaderboard Teaser + XP Farming ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leaderboard teaser */}
          <div className="bg-gradient-to-br from-[rgba(155,109,255,0.08)] to-[rgba(0,229,204,0.04)] border border-[rgba(155,109,255,0.2)] rounded-[var(--radius-2xl)] p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--purple)] mb-3 font-display">
              Leaderboard
            </p>
            <h2 className="font-display font-extrabold text-2xl tracking-tight mb-2">
              Top Predictors
            </h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Compete for the top spot and maximize your $CAST airdrop
              allocation.
            </p>
            <div className="flex flex-col gap-2 mb-6">
              {LEADERBOARD.slice(0, 5).map((u) => (
                <div
                  key={u.rank}
                  className={`flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] ${u.isCurrentUser ? "bg-[rgba(0,229,204,0.06)] border border-[rgba(0,229,204,0.15)]" : "hover:bg-white/[0.03]"} transition-colors`}
                >
                  <span className="text-base w-5 shrink-0">{u.badge}</span>
                  <span className="flex-1 text-sm font-display font-semibold">
                    {u.handle}
                  </span>
                  {u.isCurrentUser && <Badge variant="teal">YOU</Badge>}
                  <span className="font-mono text-xs text-[var(--teal)]">
                    {formatXP(u.xp)} XP
                  </span>
                </div>
              ))}
            </div>
            <Link href="/leaderboard">
              <Button variant="secondary" fullWidth>
                See Full Rankings
              </Button>
            </Link>
          </div>

          {/* XP / Airdrop farming */}
          <div className="bg-gradient-to-br from-[rgba(240,180,41,0.08)] to-[rgba(255,157,0,0.04)] border border-[rgba(240,180,41,0.2)] rounded-[var(--radius-2xl)] p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--gold)] mb-3 font-display">
              Points Farming
            </p>
            <h2 className="font-display font-extrabold text-2xl tracking-tight mb-2">
              Earn XP. Farm the Airdrop.
            </h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Every prediction, correct call, daily quest, and referral earns
              you XP. Top predictors share in the $CAST airdrop.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { action: "Correct Prediction", xp: "+150 XP" },
                { action: "Daily Quest", xp: "+50–500 XP" },
                { action: "Market Creation", xp: "+500 XP" },
                { action: "Referral", xp: "+200 XP" },
              ].map(({ action, xp }) => (
                <div
                  key={action}
                  className="bg-[rgba(240,180,41,0.06)] rounded-[var(--radius-sm)] px-3 py-2.5"
                >
                  <p className="text-xs text-[var(--text-muted)] mb-0.5">
                    {action}
                  </p>
                  <p className="font-mono text-sm font-medium text-[var(--gold)]">
                    {xp}
                  </p>
                </div>
              ))}
            </div>
            <Button variant="gold" fullWidth onClick={login}>
              {isAuthenticated ? "View My XP →" : "Connect & Start Farming →"}
            </Button>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--teal)] mb-3 font-display">
            Why CardCast
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight">
            Built different
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              icon: "🃏",
              title: "TCG Native",
              desc: "Markets designed around card mechanics, grading, and collecting culture — not generic prediction interfaces.",
            },
            {
              icon: "⚡",
              title: "Real-time Odds",
              desc: "Odds update live with every trade. See the market shift as whale activity and breaking news hit.",
            },
            {
              icon: "🔮",
              title: "Smart Picks",
              desc: "Personalized market recommendations based on your collection interests and trading history.",
            },
            {
              icon: "🐋",
              title: "Whale Alerts",
              desc: "Get notified when large positions move the odds in markets you're watching.",
            },
            {
              icon: "🎴",
              title: "Shareable Cards",
              desc: "Generate beautiful OG prediction cards to share your calls on X and flex your accuracy score.",
            },
            {
              icon: "🔐",
              title: "Chain Agnostic",
              desc: "Powered by EVM today. Built to move to any chain. Your positions are always yours.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 hover:border-[var(--border-md)] transition-colors"
            >
              <span className="text-2xl block mb-3">{icon}</span>
              <h3 className="font-display font-bold text-sm mb-1.5">{title}</h3>
              <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 mb-8">
        <div
          className="relative overflow-hidden rounded-[var(--radius-2xl)] border border-[rgba(0,229,204,0.2)] p-10 sm:p-16 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,229,204,0.07) 0%, rgba(155,109,255,0.07) 100%)",
          }}
        >
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="relative z-10">
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight mb-4">
              Ready to predict?
            </h2>
            <p className="text-[var(--text-muted)] text-lg mb-8 max-w-md mx-auto">
              Join 89,000+ collectors already trading on CardCast.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/markets">
                <Button size="lg" className="min-w-[200px]">
                  Browse Markets
                </Button>
              </Link>
              <Link href="/create">
                <Button size="lg" variant="secondary" className="min-w-[200px]">
                  Create a Market
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
