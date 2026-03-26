import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { useProblems, useUserProgress } from '@/hooks/use-problems';
import DifficultyBadge from '@/components/DifficultyBadge';

const filters = ['allProblems', 'easy', 'medium', 'hard'] as const;

const Practice = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<string>('allProblems');
  const { data: problems = [], isLoading } = useProblems();
  const { data: progress = [] } = useUserProgress();

  const solvedIds = new Set(progress.filter(p => p.status === 'solved').map(p => p.problem_id));

  const filtered = activeFilter === 'allProblems'
    ? problems
    : problems.filter(p => p.difficulty === activeFilter);

  return (
    <div className="min-h-screen pb-24 safe-top">
      <header className="px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold">{t('practice.title')}</h1>
      </header>

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

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
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
                  {solvedIds.has(problem.id) ? (
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
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">No problems found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Practice;
