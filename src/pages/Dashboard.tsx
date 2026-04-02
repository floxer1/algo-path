import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Target, TrendingUp, CheckCircle2, XCircle, Code2, Flame, Zap, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import LeagueBadge from '@/components/LeagueBadge';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressRow {
  status: string;
  attempts: number;
  time_spent_seconds: number | null;
  xp_earned: number;
  problem_id: string;
  language: string;
  created_at: string;
  solved_at: string | null;
}

interface ProblemRow {
  id: string;
  category: string;
  difficulty: string;
  title: string;
}

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [problems, setProblems] = useState<ProblemRow[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('user_progress').select('status, attempts, time_spent_seconds, xp_earned, problem_id, language').eq('user_id', user.id),
      supabase.from('problems').select('id, category, difficulty, title'),
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
    ]).then(([progRes, probRes, profRes]) => {
      setProgress(progRes.data || []);
      setProblems(probRes.data || []);
      setProfile(profRes.data);
      setLoading(false);
    });
  }, [user]);

  const stats = useMemo(() => {
    const solved = progress.filter(p => p.status === 'solved');
    const attempted = progress.filter(p => p.status === 'attempted');
    const totalTime = progress.reduce((sum, p) => sum + (p.time_spent_seconds || 0), 0);
    const successRate = progress.length > 0 ? Math.round((solved.length / progress.length) * 100) : 0;
    const totalAttempts = progress.reduce((sum, p) => sum + p.attempts, 0);
    const avgAttempts = solved.length > 0 ? (solved.reduce((s, p) => s + p.attempts, 0) / solved.length).toFixed(1) : '0';
    const totalXp = progress.reduce((sum, p) => sum + p.xp_earned, 0);

    // Category breakdown
    const categoryMap = new Map<string, { total: number; solved: number; time: number }>();
    for (const prob of problems) {
      if (!categoryMap.has(prob.category)) {
        categoryMap.set(prob.category, { total: 0, solved: 0, time: 0 });
      }
      categoryMap.get(prob.category)!.total++;
    }
    for (const p of progress) {
      const prob = problems.find(pr => pr.id === p.problem_id);
      if (prob && categoryMap.has(prob.category)) {
        const cat = categoryMap.get(prob.category)!;
        if (p.status === 'solved') cat.solved++;
        cat.time += p.time_spent_seconds || 0;
      }
    }

    // Difficulty breakdown
    const diffMap = { easy: { total: 0, solved: 0 }, medium: { total: 0, solved: 0 }, hard: { total: 0, solved: 0 } };
    for (const prob of problems) {
      const d = prob.difficulty as keyof typeof diffMap;
      if (diffMap[d]) diffMap[d].total++;
    }
    for (const p of solved) {
      const prob = problems.find(pr => pr.id === p.problem_id);
      if (prob) {
        const d = prob.difficulty as keyof typeof diffMap;
        if (diffMap[d]) diffMap[d].solved++;
      }
    }

    // Language breakdown
    const langMap = new Map<string, number>();
    for (const p of progress) {
      langMap.set(p.language, (langMap.get(p.language) || 0) + 1);
    }

    return {
      solved: solved.length,
      attempted: attempted.length,
      totalTime,
      successRate,
      totalAttempts,
      avgAttempts,
      totalXp,
      categories: Array.from(categoryMap.entries()).map(([name, data]) => ({ name, ...data })),
      difficulties: diffMap,
      languages: Array.from(langMap.entries()).map(([lang, count]) => ({ lang, count })).sort((a, b) => b.count - a.count),
    };
  }, [progress, problems]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const diffColors = {
    easy: { bar: 'bg-green-500', text: 'text-green-500', label: 'Facile' },
    medium: { bar: 'bg-yellow-500', text: 'text-yellow-500', label: 'Moyen' },
    hard: { bar: 'bg-red-500', text: 'text-red-500', label: 'Difficile' },
  };

  return (
    <div className="min-h-screen pb-24 safe-top">
      <header className="px-4 pt-4 pb-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Tableau de bord</h1>
      </header>

      <div className="px-4 space-y-5">
        {/* Key metrics */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3"
        >
          {[
            { label: 'Temps total', value: formatTime(stats.totalTime), icon: Clock, color: 'text-info' },
            { label: 'Taux de réussite', value: `${stats.successRate}%`, icon: Target, color: 'text-primary' },
            { label: 'Exercices résolus', value: `${stats.solved}`, icon: CheckCircle2, color: 'text-green-500' },
            { label: 'XP total', value: `${stats.totalXp}`, icon: Zap, color: 'text-xp' },
          ].map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
              className="bg-card border border-border rounded-xl p-4"
            >
              <Icon size={18} className={`${color} mb-2`} />
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-[11px] text-muted-foreground">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Secondary stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: 'En cours', value: stats.attempted, icon: Code2 },
            { label: 'Tentatives moy.', value: stats.avgAttempts, icon: TrendingUp },
            { label: 'Streak', value: `${profile?.streak ?? 0}j`, icon: Flame },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-3 text-center">
              <Icon size={16} className="mx-auto mb-1 text-muted-foreground" />
              <p className="text-lg font-bold">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* League */}
        {profile && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <LeagueBadge weeklyXp={profile.weekly_xp ?? 0} />
          </motion.div>
        )}

        {/* Difficulty breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <h3 className="font-bold text-sm mb-3">Par difficulté</h3>
          <div className="space-y-3">
            {(Object.entries(stats.difficulties) as [keyof typeof diffColors, { total: number; solved: number }][]).map(([diff, data]) => {
              const pct = data.total > 0 ? Math.round((data.solved / data.total) * 100) : 0;
              const c = diffColors[diff];
              return (
                <div key={diff}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`font-medium ${c.text}`}>{c.label}</span>
                    <span className="text-muted-foreground">{data.solved}/{data.total}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${c.bar}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Category breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <h3 className="font-bold text-sm mb-3">Progression par catégorie</h3>
          {stats.categories.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Aucune catégorie disponible</p>
          ) : (
            <div className="space-y-3">
              {stats.categories.map((cat) => {
                const pct = cat.total > 0 ? Math.round((cat.solved / cat.total) * 100) : 0;
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium capitalize">{cat.name}</span>
                      <span className="text-muted-foreground">{cat.solved}/{cat.total} • {formatTime(cat.time)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Language usage */}
        {stats.languages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <h3 className="font-bold text-sm mb-3">Langages utilisés</h3>
            <div className="flex flex-wrap gap-2">
              {stats.languages.map(({ lang, count }) => (
                <span key={lang} className="px-3 py-1.5 rounded-lg bg-secondary text-xs font-medium">
                  {lang} <span className="text-muted-foreground">({count})</span>
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
