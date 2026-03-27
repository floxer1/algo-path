import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Loader2, Search, X, SlidersHorizontal } from 'lucide-react';
import { useProblems, useUserProgress } from '@/hooks/use-problems';
import DifficultyBadge from '@/components/DifficultyBadge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const difficulties = ['allProblems', 'easy', 'medium', 'hard'] as const;

const Practice = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<string>('allProblems');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [learningPath, setLearningPath] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const { data: problems = [], isLoading } = useProblems();
  const { data: progress = [] } = useUserProgress();

  const solvedIds = new Set(progress.filter(p => p.status === 'solved').map(p => p.problem_id));

  const categories = useMemo(
    () => [...new Set(problems.map(p => p.category))].sort(),
    [problems]
  );
  const learningPaths = useMemo(
    () => [...new Set(problems.map(p => p.learning_path).filter(Boolean))].sort(),
    [problems]
  );

  const filtered = useMemo(() => {
    let result = problems;
    if (activeFilter !== 'allProblems') {
      result = result.filter(p => p.difficulty === activeFilter);
    }
    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }
    if (learningPath !== 'all') {
      result = result.filter(p => p.learning_path === learningPath);
    }
    if (status === 'solved') {
      result = result.filter(p => solvedIds.has(p.id));
    } else if (status === 'unsolved') {
      result = result.filter(p => !solvedIds.has(p.id));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tags && p.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }
    return result;
  }, [problems, activeFilter, category, learningPath, status, search, solvedIds]);

  const activeFilterCount =
    (category !== 'all' ? 1 : 0) + (learningPath !== 'all' ? 1 : 0) + (status !== 'all' ? 1 : 0);

  const clearAll = () => {
    setActiveFilter('allProblems');
    setSearch('');
    setCategory('all');
    setLearningPath('all');
    setStatus('all');
  };

  return (
    <div className="min-h-screen pb-24 safe-top">
      <header className="px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold">{t('practice.title')}</h1>
      </header>

      {/* Search bar */}
      <div className="px-4 mb-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('practice.searchPlaceholder', 'Search problems...')}
            className="pl-9 h-9 text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(f => !f)}
          className={`flex items-center gap-1 px-3 rounded-lg border text-sm font-medium transition-colors ${
            showFilters || activeFilterCount > 0
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-secondary text-secondary-foreground border-border'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {activeFilterCount > 0 && (
            <span className="text-xs">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Difficulty pills */}
      <div className="px-4 flex gap-2 mb-3 overflow-x-auto no-scrollbar">
        {difficulties.map(f => (
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

      {/* Expanded filters */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 mb-3 flex gap-2 flex-wrap"
        >
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px] h-9 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="solved">Solved</SelectItem>
              <SelectItem value="unsolved">Unsolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={learningPath} onValueChange={setLearningPath}>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="Learning Path" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Paths</SelectItem>
              {learningPaths.map(lp => (
                <SelectItem key={lp!} value={lp!}>
                  {lp!.charAt(0).toUpperCase() + lp!.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-muted-foreground hover:text-foreground underline self-center"
            >
              Clear all
            </button>
          )}
        </motion.div>
      )}

      {/* Results count */}
      <div className="px-4 mb-2">
        <p className="text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? 'problem' : 'problems'}
        </p>
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
