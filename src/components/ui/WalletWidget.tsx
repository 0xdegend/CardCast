"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useFundWallet } from "@privy-io/react-auth";
import { base } from "viem/chains";
import { cn } from "@/lib/utils";
//@ts-expect-error Typescript
import { useUSDCBalance } from "@/hooks/useUSDCBalance";

interface WalletWidgetProps {
  walletAddress: string;
  handle?: string; // e.g. "0xde" initials for avatar
  xp?: number;
  onDisconnect: () => void;
}

// Tiny shimmer for loading state
function Shimmer({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded animate-pulse bg-white/10",
        className,
      )}
    />
  );
}

// Truncate wallet address for display
function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function WalletWidget({
  walletAddress,
  handle,
  xp = 120,
  onDisconnect,
}: WalletWidgetProps) {
  const { balance, isLoading, isError, refresh } =
    useUSDCBalance(walletAddress);
  const { fundWallet } = useFundWallet({
    onUserExited: () => {
      // Refresh balance after user exits the fund flow (may have deposited)
      setTimeout(refresh, 2000);
    },
  });

  const [fundLoading, setFundLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleFund = async () => {
    setFundLoading(true);
    try {
      await fundWallet({
        address: walletAddress,
        options: {
          chain: base,
          amount: "50",
          asset: "USDC",
        },
      });
    } catch (err) {
      console.error("[WalletWidget] fundWallet error:", err);
    } finally {
      setFundLoading(false);
    }
  };

  const initials = handle
    ? handle.replace("0x", "").slice(0, 2).toUpperCase()
    : walletAddress.slice(2, 4).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      {/* ── USDC Balance Pill ─────────────────────────────────────── */}
      <button
        onClick={handleFund}
        disabled={fundLoading}
        title="Fund wallet with USDC on Base"
        className={cn(
          "group relative hidden sm:flex items-center gap-2 h-8 px-3 rounded-sm transition-all duration-200",
          "border border-[rgba(0,229,204,0.18)] bg-[rgba(0,229,204,0.06)]",
          "hover:border-[rgba(0,229,204,0.35)] hover:bg-[rgba(0,229,204,0.1)]",
          "active:scale-[0.98]",
          fundLoading && "opacity-60 cursor-wait",
          isError && "border-[rgba(255,80,80,0.25)] bg-[rgba(255,80,80,0.05)]",
        )}
      >
        {/* USDC logo circle */}
        <span className="text-[10px] font-bold text-(--teal) leading-none select-none">
          $
        </span>

        {/* Balance value */}
        {isLoading && !balance ? (
          <Shimmer className="w-10 h-3" />
        ) : isError ? (
          <span className="font-mono text-[12px] text-red-400/70">—</span>
        ) : (
          <span className="font-mono text-[13px] text-(--teal) font-semibold leading-none tabular-nums">
            {balance ?? "0.00"}
          </span>
        )}

        <span className="font-display text-[10px] text-(--teal)/60 font-bold tracking-wider leading-none">
          USDC
        </span>
        {/* Spinner when funding flow is launching */}
        {fundLoading && (
          <span
            className="w-3 h-3 rounded-full border border-[var(--teal)] border-t-transparent animate-spin shrink-0"
            aria-label="Loading"
          />
        )}
      </button>

      {/* ── XP Pill (unchanged from original) ─────────────────────── */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(240,180,41,0.08)] border border-[rgba(240,180,41,0.2)] rounded-sm h-8">
        <span className="text-xs leading-none">⚡</span>
        <span className="font-mono text-[13px] text-(--gold) font-medium leading-none">
          {xp} XP
        </span>
      </div>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="w-8 h-8 rounded-full bg-linear-to-br from-(--teal) to-(--purple) flex items-center justify-center text-xs font-extrabold text-black cursor-pointer hover:opacity-90 transition-opacity"
          aria-label="Wallet menu"
        >
          {initials}
        </button>
        {menuOpen && (
          <div
            className={cn(
              "absolute right-0 top-10 z-50 w-56",
              "rounded-md border border-white/10 shadow-xl",
              "bg-[rgba(10,12,20,0.97)] backdrop-blur-xl",
              "py-1 animate-in fade-in slide-in-from-top-2 duration-150",
            )}
          >
            <div className="px-3 py-2.5 border-b border-white/8">
              <p className="font-display text-[10px] text-(--text-dim) tracking-widest uppercase mb-0.5">
                Connected wallet
              </p>
              <p className="font-mono text-[12px] text-(--text-muted) truncate">
                {shortAddress(walletAddress)}
              </p>
            </div>
            <div className="px-3 py-2 border-b border-white/8 sm:hidden">
              <p className="font-display text-[10px] text-(--text-dim) tracking-widest uppercase mb-0.5">
                USDC Balance · Base
              </p>
              <div className="flex items-center justify-between">
                {isLoading && !balance ? (
                  <Shimmer className="w-14 h-4" />
                ) : (
                  <span className="font-mono text-[15px] text-(--teal) font-semibold">
                    ${balance ?? "0.00"}
                  </span>
                )}
                <span className="font-display text-[10px] text-(--teal)/50 font-bold">
                  USDC
                </span>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <Link
                href="/profile"
                className="flex items-center gap-2.5 px-3 py-2 text-sm font-display text-(--text-muted) hover:text-(--text) hover:bg-white/5 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-xs opacity-60">◈</span>
                View Profile
              </Link>

              <button
                onClick={() => {
                  handleFund();
                  setMenuOpen(false);
                }}
                disabled={fundLoading}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-display text-(--teal) hover:bg-[rgba(0,229,204,0.06)] transition-colors disabled:opacity-50"
              >
                <span className="text-xs">+</span>
                Fund Wallet (USDC)
              </button>

              <button
                onClick={() => {
                  refresh();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-display text-(--text-muted) hover:text-(--text) hover:bg-white/5 transition-colors"
              >
                <span className="text-xs opacity-60">↻</span>
                Refresh Balance
              </button>
            </div>

            <div className="border-t border-white/8 py-1">
              <button
                onClick={() => {
                  onDisconnect();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-display text-(--text-dim) hover:text-red-400 hover:bg-white/5 transition-colors"
              >
                <span className="text-xs opacity-60">⌀</span>
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
