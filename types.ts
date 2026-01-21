
export interface User {
  uid: string;
  email: string;
  password?: string;
  wallet: number;
  fullName?: string;
  freeFireId?: string;
  profilePhoto?: string;
  createdAt?: string;
  isBanned?: boolean;
  isAdmin?: boolean;
}

export enum MatchStatus {
  UPCOMING = 'upcoming',
  LIVE = 'live',
  FINISHED = 'finished'
}

export interface Category {
  id: string;
  label: string;
  bannerUrl: string;
  link?: string; // Added redirect link for category banners
}

export interface PrizeBreakdown {
  rank: string;
  amount: number;
}

export interface Registration {
  uid: string;
  gameName: string;
  slotNumber: number;
}

export interface LeaderboardEntry {
  rank: number;
  player: string;
  earnings: number;
  matches: number;
  avatar?: string;
}

export interface Match {
  id: string;
  title: string;
  entryFee: number;
  prize: number;
  perKill?: number;
  status: MatchStatus;
  joinedPlayers: string[];
  registrations: Registration[];
  maxPlayers: number;
  startTime: string;
  map: string;
  mode: string;
  imageUrl?: string;
  liveLink?: string; 
  winnerId?: string;
  isCancelled?: boolean;
  prizeBreakdown?: PrizeBreakdown[];
  detailedRules?: string;
  roomId?: string;
  password?: string;
}

export interface Poster {
  id: string;
  imageUrl: string;
  link: string;
  ytLink?: string; // Added specific YouTube link for posters
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  ENTRY_FEE = 'entry_fee',
  WINNING = 'winning',
  REFUND = 'refund',
  MANUAL_ADJUST = 'manual_adjust'
}

export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  FAILED = 'failed'
}

export interface Transaction {
  id: string;
  userId: string;
  userEmail?: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  timestamp: string;
  matchTitle?: string;
  balanceBefore?: number;
  balanceAfter?: number;
  metadata?: {
    trxId?: string;
    method?: string;
    phoneNumber?: string;
    ip?: string;
  };
}

export interface AppConfig {
  appName: string;
  appLogoUrl: string;
  primaryColor: string;
  homeBannerUrl: string;
  liveBannerUrl?: string;
  liveBannerLink?: string;
  notice: string;
  liveAnnouncement: string;
  howToPlayUrl: string;
  bkashTutorialUrl?: string;
  nagadTutorialUrl?: string;
  rules: string;
  telegramSupportUrl: string;
  telegramCommunityUrl: string;
  supportPhone: string;
  bkashNumber: string;
  nagadNumber: string;
  isLeaderboardEnabled: boolean;
  isWalletEnabled: boolean;
  isNotificationsEnabled: boolean;
  isHistoryEnabled: boolean;
  isSliderEnabled: boolean;
  posters: Poster[];
  isSliderLogoEnabled: boolean;
  isSliderAppNameEnabled: boolean;
  sliderLogoSize: number;
  loadingText: string;
  showHomeBalanceCard: boolean;
  showHomeCategories: boolean;
  categories: Category[];
}

export type AdminView = 'dashboard' | 'matches' | 'transactions' | 'winners' | 'users' | 'settings' | 'auth';

export type View = 'home' | 'tournaments' | 'leaderboard' | 'profile' | 'notifications' | 'wallet' | 'history' | 'auth' | 'settings' | 'match_details';

export type MatchCategory = 'all' | 'SOLO' | 'DUO' | 'SQUAD';
