"use client";

import { useState, useEffect, useCallback } from "react";
import { createPublicClient, http, erc20Abi, formatUnits } from "viem";
import { base } from "viem/chains";

// Official USDC on Base (native Circle deployment)
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;
const USDC_DECIMALS = 6;
const POLL_INTERVAL_MS = 15_000; // re-fetch every 15s

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

interface UseUSDCBalanceResult {
  balance: string | null; // formatted, e.g. "12.50"
  rawBalance: bigint | null;
  isLoading: boolean;
  isError: boolean;
  refresh: () => void;
}

export function useUSDCBalance(
  address: string | null | undefined,
): UseUSDCBalanceResult {
  const [balance, setBalance] = useState<string | null>(null);
  const [rawBalance, setRawBalance] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
      setBalance(null);
      setRawBalance(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    try {
      const raw = await publicClient.readContract({
        address: USDC_BASE,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      });
      setRawBalance(raw);
      // Format to 2 decimal places max
      const formatted = parseFloat(formatUnits(raw, USDC_DECIMALS)).toFixed(2);
      setBalance(formatted);
    } catch (err) {
      console.error("[useUSDCBalance] fetch failed:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Initial fetch + poll
  useEffect(() => {
    fetchBalance();
    if (!address) return;
    const id = setInterval(fetchBalance, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchBalance, address]);

  return { balance, rawBalance, isLoading, isError, refresh: fetchBalance };
}
