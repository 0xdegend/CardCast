import { create } from "zustand";
import type { UserProfile, Market, TxStatus } from "@/lib/types";
import { MOCK_USER, MARKETS } from "@/lib/data/mock";

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: () => void;
  logout: () => void;
  setUser: (user: UserProfile | null) => void;

  // Markets
  markets: Market[];
  watchlist: string[];
  toggleWatchlist: (marketId: string) => void;

  // Active market
  activeMarket: Market | null;
  setActiveMarket: (market: Market | null) => void;

  // Tx state
  txStatus: TxStatus;
  setTxStatus: (status: TxStatus) => void;

  // Notifications
  notifCount: number;
  clearNotifs: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: () => set({ user: MOCK_USER, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  markets: MARKETS,
  watchlist: MOCK_USER.watchlist,
  toggleWatchlist: (marketId) =>
    set((state) => ({
      watchlist: state.watchlist.includes(marketId)
        ? state.watchlist.filter((id) => id !== marketId)
        : [...state.watchlist, marketId],
    })),

  activeMarket: null,
  setActiveMarket: (market) => set({ activeMarket: market }),

  txStatus: { state: "idle" },
  setTxStatus: (status) => set({ txStatus: status }),

  notifCount: 3,
  clearNotifs: () => set({ notifCount: 0 }),
}));
