import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Loader2, Zap } from 'lucide-react';
import { mockUser } from '@/lib/mock-data';

const Duels = () => {
  const { t } = useTranslation();
  const [state, setState] = useState<'idle' | 'searching' | 'found'>('idle');

  const startSearch = () => {
    setState('searching');
    setTimeout(() => setState('found'), 3000);
  };

  return (
    <div className="min-h-screen pb-24 safe-top flex flex-col">
      <header className="px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold">{t('duels.title')}</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                className="w-24 h-24 rounded-full bg-duel/10 flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Swords size={40} className="text-duel" />
              </motion.div>
              <h2 className="text-lg font-bold mb-2">{t('duels.title')}</h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                {t('duels.desc')}
              </p>
              <motion.button
                onClick={startSearch}
                className="px-8 py-3 bg-duel text-duel-foreground rounded-xl font-bold text-sm"
                whileTap={{ scale: 0.95 }}
              >
                {t('duels.findOpponent')}
              </motion.button>
            </motion.div>
          )}

          {state === 'searching' && (
            <motion.div
              key="searching"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 rounded-full border-4 border-duel/20 border-t-duel mx-auto mb-6"
              />
              <p className="text-sm text-muted-foreground">{t('duels.waiting')}</p>
            </motion.div>
          )}

          {state === 'found' && (
            <motion.div
              key="found"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center w-full max-w-sm"
            >
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl mb-2">
                    {mockUser.avatar}
                  </div>
                  <p className="text-sm font-bold">{mockUser.name}</p>
                  <p className="text-xs text-muted-foreground">Lvl {mockUser.level}</p>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <span className="text-2xl font-black text-duel">{t('duels.vs')}</span>
                </motion.div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-duel/10 flex items-center justify-center text-2xl mb-2">
                    🧑‍💻
                  </div>
                  <p className="text-sm font-bold">CodeNinja</p>
                  <p className="text-xs text-muted-foreground">Lvl 15</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 mb-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t('duels.problem')}</p>
                <h3 className="font-bold">Two Sum</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/15 text-primary">Easy</span>
                  <div className="flex items-center gap-1 text-accent">
                    <Zap size={14} />
                    <span className="text-xs font-bold">+50 XP</span>
                  </div>
                </div>
              </div>

              <motion.button
                className="w-full py-3 bg-duel text-duel-foreground rounded-xl font-bold text-sm"
                whileTap={{ scale: 0.95 }}
                onClick={() => setState('idle')}
              >
                {t('duels.startDuel')}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Duels;
