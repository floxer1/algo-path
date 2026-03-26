import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flame, Zap, ChevronRight, Clock, BarChart3 } from 'lucide-react';
import { mockUser, learningPaths, dailyChallenge } from '@/lib/mock-data';
import XPBar from '@/components/XPBar';
import DifficultyBadge from '@/components/DifficultyBadge';

const pathColors: Record<string, string> = {
  primary: 'from-primary/20 to-primary/5 border-primary/30',
  info: 'from-info/20 to-info/5 border-info/30',
  xp: 'from-xp/20 to-xp/5 border-xp/30',
  accent: 'from-accent/20 to-accent/5 border-accent/30',
};

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pb-24 safe-top">
      {/* Header */}
      <header className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold">{t('home.greeting', { name: mockUser.name })}</h1>
            <p className="text-sm text-muted-foreground">{t('home.level', { level: mockUser.level })}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-streak">
              <Flame size={18} />
              <span className="text-sm font-bold">{mockUser.streak}</span>
            </div>
            <div className="flex items-center gap-1 text-xp">
              <Zap size={18} />
              <span className="text-sm font-bold">{mockUser.xp}</span>
            </div>
          </div>
        </div>
        <XPBar current={mockUser.xp} max={mockUser.xpToNext} level={mockUser.level} />
      </header>

      <div className="px-4 space-y-5 mt-3">
        {/* Daily Challenge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link to="/exercise/daily" className="block">
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-4 text-primary-foreground">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{t('home.dailyChallenge')}</span>
                <div className="flex items-center gap-1 text-xs opacity-80">
                  <Clock size={12} />
                  {dailyChallenge.timeLeft}
                </div>
              </div>
              <h3 className="text-lg font-bold mb-1">{dailyChallenge.title}</h3>
              <div className="flex items-center justify-between">
                <DifficultyBadge difficulty={dailyChallenge.difficulty} />
                <span className="text-sm font-bold">+{dailyChallenge.xp} XP</span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Visualizer CTA */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Link to="/visualizer" className="block">
            <div className="bg-gradient-to-r from-xp/20 to-info/20 border border-xp/30 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-xp/20 flex items-center justify-center">
                <BarChart3 size={20} className="text-xp" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">Algorithm Visualizer</h3>
                <p className="text-xs text-muted-foreground">Watch sorting algorithms in action</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
          </Link>
        </motion.div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">{t('home.learningPaths')}</h2>
            <Link to="/practice" className="text-sm text-primary font-medium">{t('home.viewAll')}</Link>
          </div>
          <div className="space-y-3">
            {learningPaths.map((path, i) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
              >
                <Link to={`/path/${path.id}`} className="block">
                  <div className={`bg-gradient-to-r ${pathColors[path.color]} border rounded-xl p-4 flex items-center gap-3`}>
                    <span className="text-2xl">{path.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{t(`paths.${path.id}`)}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{t('paths.lessons', { count: path.lessons })}</p>
                      <div className="mt-2 h-1.5 bg-background/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">{t('paths.progress', { percent: path.progress })}</p>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
