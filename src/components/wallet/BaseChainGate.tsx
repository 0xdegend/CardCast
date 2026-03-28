"use client";

import { cn } from "@/lib/utils";
import { useRequireBaseChain } from "@/hooks/useRequireBaseChain";
import { BASE_CHAIN_ID } from "@/lib/web3/chainUtils";

export function BaseChainGate({ children }: { children: React.ReactNode }) {
  const { ready, needsBase, status, lastError, switchToBase } =
    useRequireBaseChain();

  const busy = status === "switching";

  return (
    <>
      {ready && needsBase ? (
        <div
          className="fixed top-15 left-0 right-0 z-[60] border-b border-[rgba(37,99,235,0.25)] bg-[rgba(241,245,255,0.95)] px-4 py-3 text-center text-sm text-[var(--text)] shadow-sm backdrop-blur-md"
          role="alert"
        >
          <p className="text-[15px] font-medium text-[#0f172a]">
            CardCast runs on{" "}
            <span className="font-semibold text-[#1d4ed8]">Base</span>. Switch
            your wallet to Base (chain ID {BASE_CHAIN_ID}) to continue.
          </p>
          {lastError ? (
            <p className="mt-1 text-xs text-[#b91c1c]">{lastError}</p>
          ) : null}
          <button
            type="button"
            disabled={busy}
            onClick={() => void switchToBase()}
            className="mt-2 inline-flex items-center justify-center rounded-sm bg-linear-to-r from-[#1d4ed8] to-[#2563eb] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-md transition-opacity disabled:opacity-60"
          >
            {busy ? "Opening wallet…" : "Switch to Base"}
          </button>
        </div>
      ) : null}

      <main
        className={cn(
          "min-h-screen",
          needsBase && ready ? "pt-[8.5rem] sm:pt-36" : "pt-15",
        )}
      >
        {children}
      </main>
    </>
  );
}
