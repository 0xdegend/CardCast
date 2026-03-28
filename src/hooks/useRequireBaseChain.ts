"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePrivy, useActiveWallet } from "@privy-io/react-auth";
import type { ConnectedWallet } from "@privy-io/react-auth";
import { BASE_CHAIN_ID, parseWalletChainId } from "@/lib/web3/chainUtils";

type Status = "idle" | "switching" | "error";

export function useRequireBaseChain() {
  const { ready, authenticated } = usePrivy();
  const { wallet } = useActiveWallet();
  const [status, setStatus] = useState<Status>("idle");
  const [lastError, setLastError] = useState<string | null>(null);

  const ethWallet =
    wallet && wallet.type === "ethereum" ? (wallet as ConnectedWallet) : null;

  const chainIdStr = ethWallet?.chainId ?? "";
  const numericChain = chainIdStr ? parseWalletChainId(chainIdStr) : null;
  const needsBase =
    Boolean(ready && authenticated && ethWallet && numericChain !== null) &&
    numericChain !== BASE_CHAIN_ID;

  const autoAttemptedForChain = useRef<string | null>(null);

  const switchToBase = useCallback(async () => {
    if (!ethWallet) return;
    setStatus("switching");
    setLastError(null);
    try {
      await ethWallet.switchChain(BASE_CHAIN_ID);
      setStatus("idle");
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Could not switch network.";
      setLastError(message);
      setStatus("error");
    }
  }, [ethWallet]);

  useEffect(() => {
    if (!needsBase || !ethWallet || numericChain === null) {
      return;
    }

    const key = `${ethWallet.address}:${numericChain}`;
    if (autoAttemptedForChain.current === key) {
      return;
    }
    autoAttemptedForChain.current = key;

    void (async () => {
      setStatus("switching");
      setLastError(null);
      try {
        await ethWallet.switchChain(BASE_CHAIN_ID);
        setStatus("idle");
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Could not switch network.";
        setLastError(message);
        setStatus("error");
      }
    })();
  }, [needsBase, ethWallet, numericChain]);

  useEffect(() => {
    if (!needsBase) {
      autoAttemptedForChain.current = null;
    }
  }, [needsBase]);

  return {
    ready,
    authenticated,
    needsBase,
    ethWallet,
    status,
    lastError,
    switchToBase,
  };
}
