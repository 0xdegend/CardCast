// ── Market Types ──────────────────────────────────────────────

export type MarketCategory =
  | "Price"
  | "Grading"
  | "Event"
  | "Pull Odds"
  | "Demand"
  | "Custom";
export type MarketStatus = "live" | "ending" | "resolved" | "pending";
export type MarketOutcome = "yes" | "no";

export interface Market {
  id: string;
  title: string;
  description: string;
  category: MarketCategory;
  cardName: string;
  setName: string;
  image: string;
  emoji: string;
  yesOdds: number; // 0-100
  volume: number;
  liquidity: number;
  change24h: number;
  status: MarketStatus;
  endsAt: Date;
  createdAt: Date;
  participants: number;
  tags: string[];
  resolutionCriteria: string;
  dataSource: string;
  hot: boolean;
  trending: boolean;
  featured: boolean;
}

export interface Position {
  id: string;
  marketId: string;
  marketTitle: string;
  outcome: MarketOutcome;
  shares: number;
  entryPrice: number; // 0-1
  currentPrice: number; // 0-1
  invested: number; // USD
  currentValue: number; // USD
  pnl: number;
  pnlPercent: number;
  status: "open" | "won" | "lost" | "resolved";
  createdAt: Date;
}

export interface Activity {
  id: string;
  type: "trade" | "create" | "resolve" | "quest" | "achievement";
  user: string;
  userHandle: string;
  action: string;
  marketId?: string;
  marketTitle?: string;
  amount?: number;
  outcome?: MarketOutcome;
  timestamp: Date;
}

// ── User / Profile ─────────────────────────────────────────────

export interface UserProfile {
  address: string;
  handle: string;
  avatar?: string;
  xp: number;
  rank: number;
  accuracy: number;
  winRate: number;
  streak: number;
  totalPnl: number;
  totalVolume: number;
  marketsTraded: number;
  marketsCreated: number;
  badges: Badge[];
  achievements: Achievement[];
  positions: Position[];
  watchlist: string[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: Date;
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  xpReward: number;
  unlocked: boolean;
  progress: number; // 0-100
  current: number;
  total: number;
}

// ── Leaderboard ────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  address: string;
  handle: string;
  xp: number;
  accuracy: number;
  winRate: string;
  streak: number;
  pnl: string;
  badge: string;
  isCurrentUser?: boolean;
}

// ── Quest ──────────────────────────────────────────────────────

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  total: number;
  current: number;
  icon: string;
  completed: boolean;
  type: "daily" | "weekly" | "seasonal";
}

// ── Web3 ───────────────────────────────────────────────────────

export type TxState = "idle" | "signing" | "pending" | "confirmed" | "failed";

export interface TxStatus {
  state: TxState;
  hash?: string;
  error?: string;
}

// ── Create Market ──────────────────────────────────────────────

export interface CreateMarketForm {
  category: MarketCategory | "";
  title: string;
  description: string;
  cardName: string;
  setName: string;
  resolutionCriteria: string;
  dataSource: string;
  expiryDays: number;
  initialLiquidity: number;
}

export interface FloatingCardProps {
  image: string;
  label: string;
  sublabel: string;
  grade?: string;
  color: string;
  glowColor: string;
  style?: React.CSSProperties;
  cardIndex: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  angle: number;
  delay: number;
}

export interface CounterProps {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}
