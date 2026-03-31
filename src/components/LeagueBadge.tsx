import { motion } from 'framer-motion';
import { getLeague, getNextLeague, getLeagueProgress, type LeagueInfo } from '@/lib/leagues';

interface LeagueBadgeProps {
  weeklyXp: number;
  compact?: boolean;
}

const LeagueBadge = ({ weeklyXp, compact = false }: LeagueBadgeProps) => {
  const league = getLeague(weeklyXp);
  const next = getNextLeague(weeklyXp);
  const progress = getLeagueProgress(weeklyXp);

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${league.color}`}>
        {league.emoji} {league.label}
      </span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl border p-4 ${league.bgColor} ${league.borderColor}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{league.emoji}</span>
        <div>
          <p className={`font-bold text-sm ${league.color}`}>Ligue {league.label}</p>
          <p className="text-xs text-muted-foreground">{weeklyXp} XP cette semaine</p>
        </div>
      </div>

      {next && (
        <div>
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>{league.label}</span>
            <span>{next.label} — {next.minXp} XP</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full`}
              style={{ backgroundColor: `hsl(var(--league-${league.tier}))` }}
            />
          </div>
        </div>
      )}

      {!next && (
        <p className="text-xs text-muted-foreground text-center">🎉 Ligue maximale atteinte !</p>
      )}
    </motion.div>
  );
};

export default LeagueBadge;
