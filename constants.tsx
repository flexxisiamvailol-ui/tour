
import { Match, MatchStatus, LeaderboardEntry } from './types';

export const COLORS = {
  primary: '#6366F1', // Indigo Blue
  secondary: '#8B5CF6', // Purple
  accent: '#10B981', // Emerald Green
  bg: '#F8FAFC', // Slate 50
  card: '#FFFFFF',
  text: '#1E293B',
  textMuted: '#64748B',
};

export const INITIAL_CATEGORIES = [
  'BR RANKED', 'CLASH SQUAD', 'BERMUDA', 'SOLO KING', 'DUO WAR', 'SQUAD'
];

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'm1',
    title: 'Elite Duo Warmup',
    entryFee: 10,
    prize: 450,
    perKill: 5,
    status: MatchStatus.UPCOMING,
    joinedPlayers: [],
    // Added missing required registrations property
    registrations: [],
    maxPlayers: 48,
    startTime: new Date(Date.now() + 1800000).toISOString(),
    map: 'Bermuda',
    mode: 'DUO',
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'm2',
    title: 'Solo King Scrims',
    entryFee: 50,
    prize: 2500,
    perKill: 10,
    status: MatchStatus.UPCOMING,
    joinedPlayers: [],
    // Added missing required registrations property
    registrations: [],
    maxPlayers: 48,
    startTime: new Date(Date.now() + 7200000).toISOString(),
    map: 'Purgatory',
    mode: 'SOLO',
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800"
  }
];

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { rank: 1, player: 'ELITE_PLAYER', earnings: 12500, matches: 145, avatar: '👤' },
  { rank: 2, player: 'NIGHT_HAWK', earnings: 9200, matches: 88, avatar: '🦅' },
  { rank: 3, player: 'PRO_GAMER_7', earnings: 8800, matches: 76, avatar: '🎮' },
];
