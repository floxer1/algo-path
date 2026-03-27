import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface CategoryProgressProps {
  categories: string[];
  problems: { id: string; category: string }[];
  solvedIds: Set<string>;
  onCategoryClick?: (category: string) => void;
  activeCategory?: string;
}

const CategoryProgress = ({ categories, problems, solvedIds, onCategoryClick, activeCategory }: CategoryProgressProps) => {
  const stats = useMemo(() => {
    return categories.map(cat => {
      const total = problems.filter(p => p.category === cat).length;
      const solved = problems.filter(p => p.category === cat && solvedIds.has(p.id)).length;
      const percent = total > 0 ? Math.round((solved / total) * 100) : 0;
      return { category: cat, total, solved, percent };
    });
  }, [categories, problems, solvedIds]);

  if (stats.length === 0) return null;

  return (
    <div className="px-4 mb-3">
      <div className="grid grid-cols-2 gap-2">
        {stats.map((s, i) => (
          <motion.button
            key={s.category}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onCategoryClick?.(activeCategory === s.category ? 'all' : s.category)}
            className={`text-left p-2.5 rounded-lg border transition-colors ${
              activeCategory === s.category
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium truncate mr-2">{s.category}</span>
              <span className="text-[10px] font-mono text-muted-foreground flex-shrink-0">
                {s.solved}/{s.total}
              </span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  s.percent === 100 ? 'bg-primary' : 'bg-primary/60'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${s.percent}%` }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
              />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryProgress;
