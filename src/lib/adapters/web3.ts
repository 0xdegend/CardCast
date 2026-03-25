/**
 * Web3 Adapter — Chain-Agnostic Abstraction Layer
 *
 * All onchain interactions go through this module.
 * To switch chains: update SUPPORTED_CHAINS and swap the stub implementations
 * with real wagmi writeContract / readContract calls.
 * The UI layer never imports chain-specific code directly.
 */

import type { TxStatus } from "@/lib/types";

// ── Chain Configuration ────────────────────────────────────────

export interface ChainConfig {
  id: number;
  name: string;
  rpcUrl: string;
  explorer: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
}

export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  base: {
    id: 8453,
    name: "Base",
    rpcUrl: "https://mainnet.base.org",
    explorer: "https://basescan.org",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  },
  // Add more chains here — Sui, Solana adapters can be wired in without touching UI
};

export const DEFAULT_CHAIN = SUPPORTED_CHAINS.base;

// ── Contract Addresses ─────────────────────────────────────────

export const CONTRACTS = {
  PredictionMarket: "" as `0x${string}`, // TODO: deploy and populate
  RewardToken: "" as `0x${string}`,      // $CAST ERC-20
  LeaderboardOracle: "" as `0x${string}`,
};

// ── Action Param Types ─────────────────────────────────────────

export interface BuySharesParams {
  marketId: string;
  outcome: "yes" | "no";
  amount: number;        // USDC amount
  slippage?: number;     // 0–1, default 0.01
}

export interface CreateMarketParams {
  title: string;
  description: string;
  resolutionCriteria: string;
  expiryTimestamp: number;
  initialLiquidity: number;
}

export interface ClaimRewardsParams {
  address: string;
  amount: number;
}

// ── Market Actions ─────────────────────────────────────────────

/**
 * Buy YES or NO shares in a prediction market.
 * TODO: replace stub with wagmi writeContract to PredictionMarket
 */
export async function buyShares(
  params: BuySharesParams,
  onStatus: (status: TxStatus) => void
): Promise<void> {
  onStatus({ state: "signing" });
  await _delay(1500);
  onStatus({ state: "pending" });
  await _delay(3000);

  if (Math.random() > 0.08) {
    onStatus({
      state: "confirmed",
      hash: `0x${_randomHex(64)}`,
    });
  } else {
    onStatus({ state: "failed", error: "Transaction reverted. Insufficient balance or slippage exceeded." });
  }
}

/**
 * Deploy a new prediction market onchain.
 * TODO: replace stub with wagmi writeContract to MarketFactory
 */
export async function createMarket(
  params: CreateMarketParams,
  onStatus: (status: TxStatus) => void
): Promise<void> {
  onStatus({ state: "signing" });
  await _delay(1800);
  onStatus({ state: "pending" });
  await _delay(3500);
  onStatus({ state: "confirmed", hash: `0x${_randomHex(64)}` });
}

/**
 * Claim earned XP / $CAST rewards onchain.
 */
export async function claimRewards(
  params: ClaimRewardsParams,
  onStatus: (status: TxStatus) => void
): Promise<void> {
  onStatus({ state: "signing" });
  await _delay(1200);
  onStatus({ state: "pending" });
  await _delay(2500);
  onStatus({ state: "confirmed", hash: `0x${_randomHex(64)}` });
}

// ── Read Helpers ───────────────────────────────────────────────

/**
 * Read current odds for a market from the contract.
 * TODO: replace with wagmi readContract
 */
export async function getMarketOdds(_marketId: string): Promise<number> {
  return 0.68;
}

/**
 * Read user's USDC balance.
 * TODO: replace with wagmi readContract / balanceOf
 */
export async function getUserBalance(_address: string): Promise<number> {
  return 1240.5;
}

// ── Internal Helpers ───────────────────────────────────────────

function _delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function _randomHex(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}
