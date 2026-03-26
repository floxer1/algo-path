import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { leaderboardData, mockUser } from '@/lib/mock-data';
import { Trophy } from 'lucide-react';

const tabs = ['global', 'country', 'friends'] as const;

const medalColors = ['text-league-gold', 'text-league-silver', 'text-league-bronze'];

const Leaderboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('global');

  return (
    <div className="min-h-screen pb-24 safe-top">
      <header className="px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold">{t('leaderboard.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('leaderboard.weekly')}</p>
      </header>

      {/* Tabs */}
      <div className="px-4 flex gap-2 mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex-1 ${
              activeTab === tab
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {t(`leaderboard.${tab}`)}
          </button>
        ))}
      </div>

      {/* Your rank */}
      <div className="px-4 mb-4">
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-3">
          <span className="text-lg font-bold text-primary">#{mockUser.rank}</span>
          <span className="text-xl">{mockUser.avatar}</span>
          <div className="flex-1">
            <p className="font-semibold text-sm">{mockUser.name} (You)</p>
          </div>
          <span className="font-mono text-sm font-bold text-xp">{mockUser.xp} XP</span>
        </div>
      </div>

      {/* Rankings */}
      <div className="px-4 space-y-2">
        {leaderboardData.map((user, i) => (
          <motion.div
            key={user.rank}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
          >
            <div className="w-8 text-center">
              {i < 3 ? (
                <Trophy size={18} className={medalColors[i]} />
              ) : (
                <span className="text-sm font-bold text-muted-foreground">#{user.rank}</span>
              )}
            </div>
            <span className="text-xl">{user.avatar}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.country}</p>
            </div>
            <span className="font-mono text-sm font-bold text-xp">{user.xp.toLocaleString()}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
