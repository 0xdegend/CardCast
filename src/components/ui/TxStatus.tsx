"use client";

import type { TxStatus } from "@/lib/types";
import { Button } from "./Button";

interface TxStatusDisplayProps {
  status: TxStatus;
  onReset: () => void;
  chainExplorer?: string;
}

export function TxStatusDisplay({ status, onReset, chainExplorer = "https://basescan.org" }: TxStatusDisplayProps) {
  if (status.state === "idle") return null;

  const states = {
    signing: {
      icon: "✍️",
      title: "Waiting for Signature",
      desc: "Confirm the transaction in your wallet",
      color: "var(--gold)",
    },
    pending: {
      icon: null,
      title: "Transaction Pending",
      desc: "Broadcasting to the network...",
      color: "var(--teal)",
    },
    confirmed: {
      icon: "🎉",
      title: "Transaction Confirmed",
      desc: "Your position is now live onchain",
      color: "var(--green)",
    },
    failed: {
      icon: "⚠️",
      title: "Transaction Failed",
      desc: status.error ?? "Something went wrong. Please try again.",
      color: "var(--red)",
    },
  };

  const s = states[status.state];

  return (
    <div className="flex flex-col items-center text-center py-6 gap-4">
      {status.state === "pending" ? (
        <div
          className="w-12 h-12 rounded-full border-2 border-[var(--teal)] border-t-transparent animate-spin"
        />
      ) : (
        <div className="text-5xl">{s.icon}</div>
      )}
      <div>
        <h3 className="font-display font-bold text-lg mb-1" style={{ color: s.color }}>
          {s.title}
        </h3>
        <p className="text-sm text-[var(--text-muted)]">{s.desc}</p>
        {status.hash && (
          <a
            href={`${chainExplorer}/tx/${status.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--teal)] mt-2 block hover:underline font-mono"
          >
            {status.hash.slice(0, 18)}...{status.hash.slice(-6)} ↗
          </a>
        )}
      </div>
      {(status.state === "confirmed" || status.state === "failed") && (
        <Button variant="secondary" size="sm" onClick={onReset}>
          {status.state === "confirmed" ? "Done" : "Try Again"}
        </Button>
      )}
    </div>
  );
}
