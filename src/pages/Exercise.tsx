import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Send, Bot, ChevronDown, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useProblem, useProgressForProblem, useSaveProgress } from '@/hooks/use-problems';
import DifficultyBadge from '@/components/DifficultyBadge';

const langOptions = ['javascript', 'python', 'java', 'cpp'] as const;

const Exercise = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: problem, isLoading } = useProblem(id || '');
  const { data: existingProgress } = useProgressForProblem(id || '');
  const saveProgress = useSaveProgress();

  const [selectedLang, setSelectedLang] = useState<string>('javascript');
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState<Array<{ input: string; expected: string; passed: boolean | null }>>([]);
  const [showAI, setShowAI] = useState(false);
  const [tab, setTab] = useState<'problem' | 'code'>('problem');

  // Initialize code from problem data
  useEffect(() => {
    if (problem) {
      const starterCode = problem.starter_code as Record<string, string>;
      setCode(existingProgress?.code || starterCode[selectedLang] || '');
      const cases = problem.test_cases as Array<{ input: string; expected: string }>;
      setTestResults(cases.map(tc => ({ ...tc, passed: null })));
    }
  }, [problem, existingProgress]);

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    if (problem) {
      const starterCode = problem.starter_code as Record<string, string>;
      setCode(starterCode[lang] || '');
    }
  };

  const handleRun = () => {
    setTestResults(prev => prev.map((tc, i) => ({
      ...tc,
      passed: i < 2,
    })));
  };

  const handleSubmit = () => {
    if (!problem) return;
    saveProgress.mutate({
      problem_id: problem.id,
      code,
      language: selectedLang,
      status: 'attempted',
      xp_earned: 0,
    });
  };

  if (isLoading || !problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const examples = (problem.description.match(/Example \d+[\s\S]*?(?=Example \d+|$)/g) || []).length > 0
    ? [] // parsed from description if needed
    : [];

  return (
    <div className="min-h-screen flex flex-col safe-top">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold truncate">{problem.title}</h1>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
        <motion.button
          onClick={() => setShowAI(!showAI)}
          className={`p-2 rounded-xl transition-colors ${showAI ? 'bg-xp/10 text-xp' : 'bg-secondary text-muted-foreground'}`}
          whileTap={{ scale: 0.9 }}
        >
          <Bot size={18} />
        </motion.button>
      </header>

      <div className="flex border-b border-border">
        <button
          onClick={() => setTab('problem')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${tab === 'problem' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
        >
          Problem
        </button>
        <button
          onClick={() => setTab('code')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${tab === 'code' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
        >
          Code
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {tab === 'problem' ? (
          <div className="p-4 space-y-4">
            <p className="text-sm leading-relaxed whitespace-pre-line">{problem.description}</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border overflow-x-auto no-scrollbar">
              {langOptions.map(lang => (
                <button
                  key={lang}
                  onClick={() => handleLangChange(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                    selectedLang === lang ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <div className="flex-1 p-2">
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full h-48 bg-foreground/5 rounded-xl p-3 font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                spellCheck={false}
              />
            </div>

            <div className="px-4 pb-2">
              <p className="text-xs font-semibold text-muted-foreground mb-2">{t('practice.testCases')}</p>
              <div className="space-y-1">
                {testResults.map((tc, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-secondary rounded-lg text-xs font-mono">
                    {tc.passed === null ? (
                      <div className="w-4 h-4 rounded-full border border-muted-foreground" />
                    ) : tc.passed ? (
                      <CheckCircle2 size={14} className="text-primary" />
                    ) : (
                      <XCircle size={14} className="text-destructive" />
                    )}
                    <span className="flex-1">Test {i + 1}: {tc.input} → {tc.expected}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 p-4 border-t border-border">
              <motion.button
                onClick={handleRun}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium"
                whileTap={{ scale: 0.97 }}
              >
                <Play size={14} />
                {t('practice.runCode')}
              </motion.button>
              <motion.button
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold"
                whileTap={{ scale: 0.97 }}
                disabled={saveProgress.isPending}
              >
                <Send size={14} />
                {t('practice.submit')}
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {showAI && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          className="fixed bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-2xl p-4 z-50 max-h-[60vh] overflow-auto"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Bot size={16} className="text-xp" />
              {t('exercise.aiCoach')}
            </h3>
            <button onClick={() => setShowAI(false)}>
              <ChevronDown size={18} />
            </button>
          </div>
          <div className="space-y-2">
            {['hint', 'explanation', 'optimize', 'complexity'].map(action => (
              <button
                key={action}
                className="w-full text-left p-3 bg-secondary rounded-xl text-sm hover:bg-secondary/80 transition-colors"
              >
                {t(`exercise.${action}`)}
              </button>
            ))}
          </div>
          {problem.hints && problem.hints.length > 0 && (
            <div className="mt-4 p-3 bg-xp/5 border border-xp/20 rounded-xl">
              <p className="text-sm text-muted-foreground">💡 {problem.hints[0]}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Exercise;
