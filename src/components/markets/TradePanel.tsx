"use client";

import { useState } from "react";
import type { Market, MarketOutcome, TxStatus } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { buyShares } from "@/lib/adapters/web3";
import { Button } from "@/components/ui/Button";
import { TxStatusDisplay } from "@/components/ui/TxStatus";
import { cn } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";

interface TradePanelProps {
  market: Market;
}

export function TradePanel({ market }: TradePanelProps) {
  const { authenticated, login } = usePrivy();
  const [outcome, setOutcome] = useState<MarketOutcome>("yes");
  const [amount, setAmount] = useState("100");
  const [txStatus, setTxStatus] = useState<TxStatus>({ state: "idle" });

  const amountNum = parseFloat(amount) || 0;
  const price =
    outcome === "yes" ? market.yesOdds / 100 : (100 - market.yesOdds) / 100;
  const shares = price > 0 ? amountNum / price : 0;
  const potentialPayout = shares * 1; // $1 per share if resolved YES
  const profit = potentialPayout - amountNum;

  const PRESETS = [50, 100, 250, 500];

  async function handleTrade() {
    if (!authenticated) {
      login();
      return;
    }
    await buyShares(
      { marketId: market.id, outcome, amount: amountNum },
      setTxStatus,
    );
  }

  if (txStatus.state !== "idle") {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6">
        <TxStatusDisplay
          status={txStatus}
          onReset={() => setTxStatus({ state: "idle" })}
        />
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-xl)] p-5 flex flex-col gap-5">
      <h3 className="font-display font-bold text-base">Take a Position</h3>

      {/* Outcome selector */}
      <div className="grid grid-cols-2 gap-2">
        {(["yes", "no"] as MarketOutcome[]).map((o) => (
          <button
            key={o}
            onClick={() => setOutcome(o)}
            className={cn(
              "py-3 rounded-[var(--radius-md)] font-display font-bold text-sm uppercase tracking-wider transition-all duration-200",
              outcome === o
                ? o === "yes"
                  ? "bg-[rgba(0,229,204,0.15)] border border-[rgba(0,229,204,0.4)] text-[var(--teal)]"
                  : "bg-[rgba(255,77,106,0.15)] border border-[rgba(255,77,106,0.4)] text-[var(--red)]"
                : "bg-white/5 border border-[var(--border)] text-[var(--text-muted)] hover:bg-white/8",
            )}
          >
            {o === "yes"
              ? `YES · ${market.yesOdds}%`
              : `NO · ${100 - market.yesOdds}%`}
          </button>
        ))}
      </div>

      {/* Amount input */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2 block font-display">
          Amount (USDC)
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-dim)] text-sm">
            $
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            className="w-full bg-white/[0.04] border border-[var(--border)] rounded-[var(--radius-md)] pl-7 pr-4 py-2.5 font-mono text-sm text-[var(--text)] outline-none focus:border-[var(--teal)] transition-colors"
          />
        </div>
        <div className="flex gap-2 mt-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(String(p))}
              className="flex-1 py-1 text-xs font-mono text-[var(--text-dim)] bg-white/5 border border-[var(--border)] rounded-[var(--radius-sm)] hover:text-[var(--text)] hover:bg-white/8 transition-colors"
            >
              ${p}
            </button>
          ))}
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-white/[0.03] rounded-[var(--radius-md)] p-3.5 flex flex-col gap-2.5">
        {[
          ["Avg Price", `${(price * 100).toFixed(1)}¢`],
          ["Shares", shares.toFixed(2)],
          ["Max Payout", `$${potentialPayout.toFixed(2)}`],
          [
            "Potential Profit",
            `${profit >= 0 ? "+" : ""}$${profit.toFixed(2)}`,
          ],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-xs text-[var(--text-muted)]">{label}</span>
            <span
              className={`font-mono text-xs font-medium ${label === "Potential Profit" ? (profit >= 0 ? "text-[var(--green)]" : "text-[var(--red)]") : "text-[var(--text)]"}`}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      <Button
        variant={outcome === "yes" ? "primary" : "danger"}
        fullWidth
        size="lg"
        onClick={handleTrade}
        disabled={amountNum <= 0}
      >
        {authenticated
          ? `Buy ${outcome.toUpperCase()} · $${amountNum}`
          : "Connect Wallet to Trade"}
      </Button>

      <p className="text-center text-[10px] text-[var(--text-dim)] leading-relaxed">
        Positions are settled onchain. Past performance does not guarantee
        future results.
      </p>
    </div>
  );
}
