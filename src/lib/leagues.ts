import { Shield } from 'lucide-react';

export type LeagueTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface LeagueInfo {
  tier: LeagueTier;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  minXp: number;
}

export const LEAGUES: LeagueInfo[] = [
  { tier: 'bronze', label: 'Bronze', emoji: '🥉', color: 'text-league-bronze', bgColor: 'bg-league-bronze/10', borderColor: 'border-league-bronze/30', minXp: 0 },
  { tier: 'silver', label: 'Argent', emoji: '🥈', color: 'text-league-silver', bgColor: 'bg-league-silver/10', borderColor: 'border-league-silver/30', minXp: 100 },
  { tier: 'gold', label: 'Or', emoji: '🏆', color: 'text-league-gold', bgColor: 'bg-league-gold/10', borderColor: 'border-league-gold/30', minXp: 300 },
  { tier: 'diamond', label: 'Diamant', emoji: '💎', color: 'text-league-diamond', bgColor: 'bg-league-diamond/10', borderColor: 'border-league-diamond/30', minXp: 600 },
];

export function getLeague(weeklyXp: number): LeagueInfo {
  for (let i = LEAGUES.length - 1; i >= 0; i--) {
    if (weeklyXp >= LEAGUES[i].minXp) return LEAGUES[i];
  }
  return LEAGUES[0];
}

export function getNextLeague(weeklyXp: number): LeagueInfo | null {
  const current = getLeague(weeklyXp);
  const idx = LEAGUES.findIndex(l => l.tier === current.tier);
  return idx < LEAGUES.length - 1 ? LEAGUES[idx + 1] : null;
}

export function getLeagueProgress(weeklyXp: number): number {
  const current = getLeague(weeklyXp);
  const next = getNextLeague(weeklyXp);
  if (!next) return 100;
  const range = next.minXp - current.minXp;
  return Math.min(100, Math.round(((weeklyXp - current.minXp) / range) * 100));
}
