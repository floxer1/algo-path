import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';
import { problems } from '@/lib/mock-data';
import DifficultyBadge from '@/components/DifficultyBadge';

const filters = ['allProblems', 'easy', 'medium', 'hard'] as const;

const Practice = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<string>('allProblems');

  const filtered = activeFilter === 'allProblems'
    ? problems
    : problems.filter(p => p.difficulty === activeFilter);

  return (
    <div className="min-h-screen pb-24 safe-top">
      <header className="px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold">{t('practice.title')}</h1>
      </header>

      {/* Filters */}
      <div className="px-4 flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {t(`practice.${f}`)}
          </button>
        ))}
      </div>

      {/* Problem List */}
      <div className="px-4 space-y-2">
        {filtered.map((problem, i) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Link to={`/exercise/${problem.id}`} className="block">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
                {problem.solved ? (
                  <CheckCircle2 size={20} className="text-primary flex-shrink-0" />
                ) : (
                  <Circle size={20} className="text-muted-foreground flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{problem.title}</h3>
                  <p className="text-xs text-muted-foreground">{problem.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <DifficultyBadge difficulty={problem.difficulty} />
                  <span className="text-xs text-xp font-mono">+{problem.xp}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Practice;
