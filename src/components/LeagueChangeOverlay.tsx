import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLeague, LEAGUES, type LeagueInfo, type LeagueTier } from '@/lib/leagues';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface LeagueChangeOverlayProps {
  weeklyXp: number;
  userId: string;
}

const STORAGE_KEY = 'algotrainer_last_league';

const LeagueChangeOverlay = ({ weeklyXp, userId }: LeagueChangeOverlayProps) => {
  const [changeInfo, setChangeInfo] = useState<{
    from: LeagueInfo;
    to: LeagueInfo;
    promoted: boolean;
  } | null>(null);

  useEffect(() => {
    const currentLeague = getLeague(weeklyXp);
    const key = `${STORAGE_KEY}_${userId}`;
    const stored = localStorage.getItem(key);

    if (stored && stored !== currentLeague.tier) {
      const prevLeague = LEAGUES.find(l => l.tier === stored);
      if (prevLeague) {
        const prevIdx = LEAGUES.findIndex(l => l.tier === stored);
        const currIdx = LEAGUES.findIndex(l => l.tier === currentLeague.tier);
        setChangeInfo({
          from: prevLeague,
          to: currentLeague,
          promoted: currIdx > prevIdx,
        });
      }
    }

    localStorage.setItem(key, currentLeague.tier);
  }, [weeklyXp, userId]);

  const dismiss = () => setChangeInfo(null);

  return (
    <AnimatePresence>
      {changeInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={dismiss}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="bg-card border border-border rounded-2xl p-6 mx-6 max-w-sm w-full text-center shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Icon */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', damping: 10, delay: 0.2 }}
              className="mb-4"
            >
              {changeInfo.promoted ? (
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-2">
                  <ArrowUp size={32} className="text-green-500" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-2">
                  <ArrowDown size={32} className="text-destructive" />
                </div>
              )}
            </motion.div>

            {/* Title */}
            <h2 className="text-lg font-bold mb-1">
              {changeInfo.promoted ? '🎉 Promotion !' : 'Rétrogradation'}
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              {changeInfo.promoted
                ? 'Félicitations, tu montes de ligue !'
                : 'Tu as été rétrogradé de ligue.'}
            </p>

            {/* League transition */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl ${changeInfo.from.bgColor} ${changeInfo.from.borderColor} border`}
              >
                <span className="text-2xl">{changeInfo.from.emoji}</span>
                <span className={`text-xs font-semibold ${changeInfo.from.color}`}>{changeInfo.from.label}</span>
              </motion.div>

              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="text-muted-foreground text-lg"
              >
                →
              </motion.span>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl ${changeInfo.to.bgColor} ${changeInfo.to.borderColor} border ring-2 ring-offset-2 ring-offset-background`}
                style={{ ['--tw-ring-color' as string]: `hsl(var(--league-${changeInfo.to.tier}))` }}
              >
                <motion.span
                  className="text-2xl"
                  animate={changeInfo.promoted ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ delay: 0.7, duration: 0.4 }}
                >
                  {changeInfo.to.emoji}
                </motion.span>
                <span className={`text-xs font-semibold ${changeInfo.to.color}`}>{changeInfo.to.label}</span>
              </motion.div>
            </div>

            {/* Particles for promotion */}
            {changeInfo.promoted && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: `hsl(var(--league-${changeInfo.to.tier}))`,
                      left: `${20 + Math.random() * 60}%`,
                      top: '50%',
                    }}
                    initial={{ opacity: 1, scale: 0 }}
                    animate={{
                      opacity: [1, 1, 0],
                      scale: [0, 1, 0.5],
                      y: [0, -80 - Math.random() * 60],
                      x: [(Math.random() - 0.5) * 100],
                    }}
                    transition={{ delay: 0.6 + i * 0.05, duration: 0.8, ease: 'easeOut' }}
                  />
                ))}
              </div>
            )}

            {/* Dismiss */}
            <motion.button
              onClick={dismiss}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
            >
              {changeInfo.promoted ? 'Continuer 🚀' : 'Compris'}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeagueChangeOverlay;
