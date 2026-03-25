"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { TxStatusDisplay } from "@/components/ui/TxStatus";
import { OddsBar } from "@/components/ui/Charts";
import { createMarket } from "@/lib/adapters/web3";
import type { CreateMarketForm, MarketCategory, TxStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, Info } from "lucide-react";

const STEPS = ["Category", "Market Setup", "Resolution", "Deploy"] as const;
type Step = (typeof STEPS)[number];

const CATEGORIES: { id: MarketCategory; icon: string; desc: string }[] = [
  { id: "Price", icon: "💰", desc: "Card hits a price target" },
  { id: "Grading", icon: "🏅", desc: "PSA / BGS grading outcome" },
  { id: "Event", icon: "🎮", desc: "Tournament or game event" },
  { id: "Pull Odds", icon: "🎰", desc: "Card rarity / pull rate" },
  { id: "Demand", icon: "📊", desc: "Community demand trend" },
  { id: "Custom", icon: "✦", desc: "Custom prediction" },
];

const DATA_SOURCES = [
  { value: "tcgplayer", label: "TCGPlayer Market Price" },
  { value: "cardmarket", label: "Cardmarket (EU)" },
  { value: "ebay", label: "eBay Sales History" },
  { value: "psa", label: "PSA / BGS Grading Result" },
  { value: "official", label: "Official Event Results" },
  { value: "oracle", label: "Community Oracle" },
];

const EXPIRY_OPTIONS = [
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "30", label: "30 days" },
  { value: "60", label: "60 days" },
  { value: "90", label: "90 days" },
];

const defaultForm: CreateMarketForm = {
  category: "",
  title: "",
  description: "",
  cardName: "",
  setName: "",
  resolutionCriteria: "",
  dataSource: "tcgplayer",
  expiryDays: 30,
  initialLiquidity: 100,
};

export default function CreateMarketPage() {
  const [step, setStep] = useState<Step>("Category");
  const [form, setForm] = useState<CreateMarketForm>(defaultForm);
  const [txStatus, setTxStatus] = useState<TxStatus>({ state: "idle" });

  const stepIndex = STEPS.indexOf(step);
  const update = (field: keyof CreateMarketForm, value: string | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  const canAdvance = {
    Category: !!form.category,
    "Market Setup": !!form.title && !!form.cardName,
    Resolution: !!form.resolutionCriteria && !!form.dataSource,
    Deploy: true,
  };

  async function handleDeploy() {
    await createMarket({
      title: form.title,
      description: form.description,
      resolutionCriteria: form.resolutionCriteria,
      expiryTimestamp: Date.now() + form.expiryDays * 86400000,
      initialLiquidity: form.initialLiquidity,
    }, setTxStatus);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--purple)] mb-2 font-display">Market Creation</p>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight mb-3">Create a Market</h1>
        <p className="text-[var(--text-muted)]">Launch your prediction market. Earn 500 XP when the first trade is placed.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        {/* ── Sidebar steps ── */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
          {STEPS.map((s, i) => {
            const done = stepIndex > i;
            const active = step === s;
            const upcoming = stepIndex < i;
            return (
              <button
                key={s}
                onClick={() => done && setStep(s)}
                disabled={upcoming}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-display font-semibold transition-all whitespace-nowrap lg:whitespace-normal",
                  active && "bg-[rgba(0,229,204,0.08)] border border-[rgba(0,229,204,0.2)] text-[var(--teal)]",
                  done && "cursor-pointer opacity-70 hover:opacity-100",
                  upcoming && "opacity-30 cursor-not-allowed",
                  !active && !upcoming && !done && "border border-transparent"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full border flex items-center justify-center text-[11px] font-bold shrink-0",
                  done ? "bg-[rgba(0,208,132,0.15)] border-[rgba(0,208,132,0.4)] text-[var(--green)]"
                  : active ? "bg-[rgba(0,229,204,0.15)] border-[rgba(0,229,204,0.4)] text-[var(--teal)]"
                  : "bg-white/5 border-[var(--border)] text-[var(--text-dim)]"
                )}>
                  {done ? <Check size={11} /> : i + 1}
                </div>
                {s}
              </button>
            );
          })}

          {/* XP reward */}
          <div className="hidden lg:block mt-4 bg-[rgba(155,109,255,0.06)] border border-[rgba(155,109,255,0.15)] rounded-[var(--radius-md)] p-3.5">
            <p className="text-[10px] uppercase tracking-widest text-[var(--purple)] mb-1.5 font-display">Creation Reward</p>
            <p className="font-mono text-lg text-[var(--gold)] font-medium">+500 XP</p>
            <p className="text-[10px] text-[var(--text-dim)] mt-0.5">On first trade placed</p>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-2xl)] p-6 sm:p-8">

          {/* ── STEP 1: Category ── */}
          {step === "Category" && (
            <div>
              <h2 className="font-display font-extrabold text-xl mb-1.5">Choose Category</h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">What type of prediction is this market about?</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => update("category", c.id)}
                    className={cn(
                      "flex items-center gap-3 p-3.5 rounded-[var(--radius-md)] border text-left transition-all",
                      form.category === c.id
                        ? "bg-[rgba(0,229,204,0.07)] border-[rgba(0,229,204,0.35)] shadow-[0_0_20px_rgba(0,229,204,0.06)]"
                        : "bg-white/[0.02] border-[var(--border)] hover:bg-white/[0.04] hover:border-[var(--border-md)]"
                    )}
                  >
                    <span className="text-2xl shrink-0">{c.icon}</span>
                    <div>
                      <p className={cn("font-display font-bold text-sm", form.category === c.id ? "text-[var(--teal)]" : "text-[var(--text)]")}>{c.id}</p>
                      <p className="text-[10px] text-[var(--text-dim)] mt-0.5">{c.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <Button fullWidth disabled={!canAdvance.Category} onClick={() => setStep("Market Setup")}>
                Continue →
              </Button>
            </div>
          )}

          {/* ── STEP 2: Market Setup ── */}
          {step === "Market Setup" && (
            <div>
              <h2 className="font-display font-extrabold text-xl mb-1.5">Market Setup</h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">Define what your market is predicting.</p>
              <div className="flex flex-col gap-4">
                <Input
                  label="Market Question"
                  placeholder="e.g. Will Charizard ex hit $500 by June 2025?"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                />
                <Textarea
                  label="Description (optional)"
                  placeholder="Add more context for traders..."
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Card Name"
                    placeholder="e.g. Charizard ex"
                    value={form.cardName}
                    onChange={(e) => update("cardName", e.target.value)}
                  />
                  <Input
                    label="Set / Series"
                    placeholder="e.g. Obsidian Flames"
                    value={form.setName}
                    onChange={(e) => update("setName", e.target.value)}
                  />
                </div>

                {/* Expiry */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 block font-display">Expiry</label>
                  <div className="flex gap-2">
                    {EXPIRY_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => update("expiryDays", parseInt(o.value))}
                        className={cn(
                          "flex-1 py-2 rounded-[var(--radius-sm)] border text-xs font-mono font-bold transition-all",
                          form.expiryDays === parseInt(o.value)
                            ? "bg-[rgba(0,229,204,0.08)] border-[rgba(0,229,204,0.35)] text-[var(--teal)]"
                            : "bg-white/[0.03] border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-white/[0.05]"
                        )}
                      >
                        {o.label.replace(" days", "d")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button variant="secondary" onClick={() => setStep("Category")}>← Back</Button>
                <Button fullWidth disabled={!canAdvance["Market Setup"]} onClick={() => setStep("Resolution")}>
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Resolution ── */}
          {step === "Resolution" && (
            <div>
              <h2 className="font-display font-extrabold text-xl mb-1.5">Resolution Rules</h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">Define exactly how and when this market resolves.</p>
              <div className="flex flex-col gap-4">
                <Textarea
                  label="Resolution Criteria"
                  placeholder="e.g. Resolves YES if TCGPlayer market price of Charizard ex 199/165 is ≥ $500 on June 1, 2025 at 00:00 UTC."
                  value={form.resolutionCriteria}
                  onChange={(e) => update("resolutionCriteria", e.target.value)}
                  rows={4}
                />
                <Select
                  label="Primary Data Source"
                  options={DATA_SOURCES}
                  value={form.dataSource}
                  onChange={(e) => update("dataSource", e.target.value)}
                />

                <div className="flex items-start gap-2.5 bg-[rgba(240,180,41,0.06)] border border-[rgba(240,180,41,0.15)] rounded-[var(--radius-md)] p-3.5">
                  <Info size={14} className="text-[var(--gold)] shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Ambiguous resolution criteria may result in your market being flagged for community review. Be specific about the data source, threshold, and exact resolution date/time.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button variant="secondary" onClick={() => setStep("Market Setup")}>← Back</Button>
                <Button fullWidth disabled={!canAdvance.Resolution} onClick={() => setStep("Deploy")}>
                  Preview & Deploy →
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Deploy ── */}
          {step === "Deploy" && (
            <div>
              {txStatus.state !== "idle" ? (
                <TxStatusDisplay
                  status={txStatus}
                  onReset={() => { setTxStatus({ state: "idle" }); setStep("Category"); setForm(defaultForm); }}
                />
              ) : (
                <>
                  <h2 className="font-display font-extrabold text-xl mb-1.5">Deploy Market</h2>
                  <p className="text-sm text-[var(--text-muted)] mb-6">Review your market before deploying onchain.</p>

                  {/* Preview card */}
                  <div className="bg-white/[0.03] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={form.category === "Price" ? "teal" : form.category === "Grading" ? "gold" : "purple"}>
                        {form.category}
                      </Badge>
                      <span className="font-mono text-xs text-[var(--text-dim)]">Expires in {form.expiryDays} days</span>
                    </div>
                    <p className="font-display font-bold text-base mb-3">
                      {form.title || "Your market question will appear here"}
                    </p>
                    <OddsBar yes={50} showLabels height={6} />
                    <p className="font-mono text-xs text-[var(--text-dim)] mt-2">Starting odds: 50/50</p>
                  </div>

                  {/* Fee breakdown */}
                  <div className="bg-white/[0.03] rounded-[var(--radius-md)] p-4 mb-5">
                    {[
                      ["Creation Fee", "0.001 ETH"],
                      ["Initial Liquidity", `$${form.initialLiquidity} USDC`],
                      ["XP Reward", "+500 XP (on first trade)"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between py-2 border-b border-[var(--border)] last:border-0 last:pb-0">
                        <span className="text-sm text-[var(--text-muted)]">{label}</span>
                        <span className={cn("font-mono text-sm", label === "XP Reward" ? "text-[var(--gold)]" : "text-[var(--text)]")}>{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setStep("Resolution")}>← Back</Button>
                    <Button fullWidth variant="gold" onClick={handleDeploy}>
                      Deploy Onchain ↗
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
