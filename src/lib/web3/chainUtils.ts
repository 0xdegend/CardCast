import { base } from "viem/chains";

export const BASE_CHAIN_ID = base.id;

/** Parse CAIP-2 `eip155:n`, hex `0x…`, or decimal chain id strings. */
export function parseWalletChainId(chainId: string): number | null {
  const trimmed = chainId.trim();
  if (trimmed.startsWith("eip155:")) {
    const n = Number(trimmed.split(":")[1]);
    return Number.isFinite(n) ? n : null;
  }
  if (trimmed.startsWith("0x")) {
    const n = parseInt(trimmed, 16);
    return Number.isFinite(n) ? n : null;
  }
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

export function isBaseChainId(chainId: string): boolean {
  const id = parseWalletChainId(chainId);
  return id === BASE_CHAIN_ID;
}
