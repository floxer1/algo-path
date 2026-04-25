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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [problems, setProblems] = useState<ProblemRow[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('user_progress').select('status, attempts, time_spent_seconds, xp_earned, problem_id, language, created_at, solved_at').eq('user_id', user.id),
      (supabase as any).from('problems_public').select('id, category, difficulty, title'),
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

    const categoryMap = new Map<string, { total: number; solved: number; time: number }>();
    for (const prob of problems) {
      if (!categoryMap.has(prob.category)) categoryMap.set(prob.category, { total: 0, solved: 0, time: 0 });
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

    const langMap = new Map<string, number>();
    for (const p of progress) langMap.set(p.language, (langMap.get(p.language) || 0) + 1);

    const locale = i18n.language === 'fr' ? 'fr-FR' : i18n.language === 'es' ? 'es-ES' : i18n.language === 'pt' ? 'pt-BR' : 'en-US';
    const now = new Date();
    const xpByDay: { date: string; xp: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayXp = progress.filter(p => p.created_at?.slice(0, 10) === key).reduce((s, p) => s + p.xp_earned, 0);
      xpByDay.push({ date: d.toLocaleDateString(locale, { day: '2-digit', month: 'short' }), xp: dayXp });
    }

    const solvedByWeek: { week: string; count: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - i * 7);
      const startStr = weekStart.toISOString().slice(0, 10);
      const endStr = weekEnd.toISOString().slice(0, 10);
      const count = solved.filter(p => {
        const d = (p.solved_at || p.created_at)?.slice(0, 10);
        return d && d >= startStr && d < endStr;
      }).length;
      solvedByWeek.push({ week: `S${weekStart.toLocaleDateString(locale, { day: '2-digit', month: 'short' }).replace(' ', '/')}`, count });
    }

    return { solved: solved.length, attempted: attempted.length, totalTime, successRate, totalAttempts, avgAttempts, totalXp, categories: Array.from(categoryMap.entries()).map(([name, data]) => ({ name, ...data })), difficulties: diffMap, languages: Array.from(langMap.entries()).map(([lang, count]) => ({ lang, count })).sort((a, b) => b.count - a.count), xpByDay, solvedByWeek };
  }, [progress, problems, i18n.language]);

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
    easy: { bar: 'bg-green-500', text: 'text-green-500', label: t('dashboard.easy') },
    medium: { bar: 'bg-yellow-500', text: 'text-yellow-500', label: t('dashboard.medium') },
    hard: { bar: 'bg-red-500', text: 'text-red-500', label: t('dashboard.hard') },
  };

  return (
    <div className="min-h-screen pb-24 safe-top">
      <header className="px-4 pt-4 pb-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">{t('dashboard.title')}</h1>
      </header>

      <div className="px-4 space-y-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
          {[
            { label: t('dashboard.totalTime'), value: formatTime(stats.totalTime), icon: Clock, color: 'text-info' },
            { label: t('dashboard.successRate'), value: `${stats.successRate}%`, icon: Target, color: 'text-primary' },
            { label: t('dashboard.exercisesSolved'), value: `${stats.solved}`, icon: CheckCircle2, color: 'text-green-500' },
            { label: t('dashboard.totalXp'), value: `${stats.totalXp}`, icon: Zap, color: 'text-xp' },
          ].map(({ label, value, icon: Icon, color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * i }} className="bg-card border border-border rounded-xl p-4">
              <Icon size={18} className={`${color} mb-2`} />
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-[11px] text-muted-foreground">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-3">
          {[
            { label: t('dashboard.inProgress'), value: stats.attempted, icon: Code2 },
            { label: t('dashboard.avgAttempts'), value: stats.avgAttempts, icon: TrendingUp },
            { label: t('dashboard.streak'), value: `${profile?.streak ?? 0}j`, icon: Flame },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-3 text-center">
              <Icon size={16} className="mx-auto mb-1 text-muted-foreground" />
              <p className="text-lg font-bold">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </motion.div>

        {profile && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <LeagueBadge weeklyXp={profile.weekly_xp ?? 0} />
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <LineChartIcon size={16} className="text-primary" />
            <h3 className="font-bold text-sm">{t('dashboard.xpPerDay')}</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.xpByDay} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: 'hsl(var(--foreground))' }} itemStyle={{ color: 'hsl(var(--primary))' }} />
                <Area type="monotone" dataKey="xp" stroke="hsl(var(--primary))" fill="url(#xpGradient)" strokeWidth={2} name="XP" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-green-500" />
            <h3 className="font-bold text-sm">{t('dashboard.solvedPerWeek')}</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.solvedByWeek} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: 'hsl(var(--foreground))' }} itemStyle={{ color: 'hsl(142, 71%, 45%)' }} />
                <Bar dataKey="count" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} name={t('dashboard.solved')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-bold text-sm mb-3">{t('dashboard.byDifficulty')}</h3>
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
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className={`h-full rounded-full ${c.bar}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-bold text-sm mb-3">{t('dashboard.categoryProgress')}</h3>
          {stats.categories.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">{t('dashboard.noCategory')}</p>
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
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className="h-full rounded-full bg-primary" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {stats.languages.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-sm mb-3">{t('dashboard.languagesUsed')}</h3>
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
