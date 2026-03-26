import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Send, Bot, ChevronDown, CheckCircle2, XCircle, Loader2, Clock, AlertTriangle } from 'lucide-react';
import { useProblem, useProgressForProblem, useSaveProgress } from '@/hooks/use-problems';
import { supabase } from '@/integrations/supabase/client';
import DifficultyBadge from '@/components/DifficultyBadge';

const langOptions = ['javascript', 'python', 'java', 'cpp'] as const;

interface TestResult {
  input: string;
  expected: string;
  actual: string | null;
  passed: boolean | null;
  time_ms?: number;
  error?: string | null;
}

const Exercise = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: problem, isLoading } = useProblem(id || '');
  const { data: existingProgress } = useProgressForProblem(id || '');
  const saveProgress = useSaveProgress();

  const [selectedLang, setSelectedLang] = useState<string>('javascript');
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showAI, setShowAI] = useState(false);
  const [tab, setTab] = useState<'problem' | 'code'>('problem');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [execError, setExecError] = useState<string | null>(null);

  useEffect(() => {
    if (problem) {
      const starterCode = problem.starter_code as Record<string, string>;
      setCode(existingProgress?.code || starterCode[selectedLang] || '');
      const cases = problem.test_cases as Array<{ input: unknown; expected: unknown }>;
      setTestResults(cases.map(tc => ({
        input: JSON.stringify(tc.input),
        expected: JSON.stringify(tc.expected),
        actual: null,
        passed: null,
      })));
    }
  }, [problem, existingProgress]);

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    if (problem) {
      const starterCode = problem.starter_code as Record<string, string>;
      setCode(starterCode[lang] || '');
      // Reset test results
      const cases = problem.test_cases as Array<{ input: unknown; expected: unknown }>;
      setTestResults(cases.map(tc => ({
        input: JSON.stringify(tc.input),
        expected: JSON.stringify(tc.expected),
        actual: null,
        passed: null,
      })));
      setExecError(null);
    }
  };

  const executeCode = async () => {
    if (!problem) return null;

    const testCases = problem.test_cases as Array<{ input: unknown; expected: unknown }>;

    const { data, error } = await supabase.functions.invoke('execute-code', {
      body: {
        code,
        language: selectedLang,
        testCases,
        functionName: '', // auto-detect
      },
    });

    if (error) throw error;
    return data;
  };

  const handleRun = async () => {
    setIsRunning(true);
    setExecError(null);
    try {
      const data = await executeCode();
      if (data?.error && !data?.results) {
        setExecError(data.error);
        return;
      }
      if (data?.results) {
        setTestResults(data.results);
      }
      if (data?.error) {
        setExecError(data.error);
      }
    } catch (err) {
      setExecError(err instanceof Error ? err.message : 'Execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem) return;
    setIsSubmitting(true);
    setExecError(null);
    try {
      const data = await executeCode();
      if (data?.error && !data?.results) {
        setExecError(data.error);
        return;
      }
      if (data?.results) {
        setTestResults(data.results);
      }

      const allPassed = data?.allPassed ?? false;

      saveProgress.mutate({
        problem_id: problem.id,
        code,
        language: selectedLang,
        status: allPassed ? 'solved' : 'attempted',
        xp_earned: allPassed ? problem.xp : 0,
      });

      if (data?.error) {
        setExecError(data.error);
      }
    } catch (err) {
      setExecError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const passedCount = testResults.filter(r => r.passed === true).length;
  const totalCount = testResults.length;
  const allPassed = passedCount === totalCount && testResults.some(r => r.passed !== null);

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

            {/* Execution error */}
            <AnimatePresence>
              {execError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mx-4 mb-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-2"
                >
                  <AlertTriangle size={14} className="text-destructive mt-0.5 shrink-0" />
                  <p className="text-xs text-destructive">{execError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Test results */}
            <div className="px-4 pb-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground">{t('practice.testCases')}</p>
                {testResults.some(r => r.passed !== null) && (
                  <span className={`text-xs font-bold ${allPassed ? 'text-primary' : 'text-destructive'}`}>
                    {passedCount}/{totalCount} passed
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {testResults.map((tc, i) => (
                  <div key={i} className="p-2 bg-secondary rounded-lg text-xs font-mono space-y-1">
                    <div className="flex items-center gap-2">
                      {tc.passed === null ? (
                        <div className="w-4 h-4 rounded-full border border-muted-foreground shrink-0" />
                      ) : tc.passed ? (
                        <CheckCircle2 size={14} className="text-primary shrink-0" />
                      ) : (
                        <XCircle size={14} className="text-destructive shrink-0" />
                      )}
                      <span className="flex-1 truncate">Test {i + 1}: {tc.input}</span>
                      {tc.time_ms !== undefined && tc.passed !== null && (
                        <span className="text-muted-foreground flex items-center gap-0.5">
                          <Clock size={10} />
                          {tc.time_ms}ms
                        </span>
                      )}
                    </div>
                    {tc.passed === false && tc.actual !== null && (
                      <div className="pl-6 space-y-0.5">
                        <p className="text-muted-foreground">Expected: <span className="text-primary">{tc.expected}</span></p>
                        <p className="text-muted-foreground">Got: <span className="text-destructive">{tc.actual}</span></p>
                      </div>
                    )}
                    {tc.passed === false && tc.error && (
                      <p className="pl-6 text-destructive">{tc.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Success banner */}
            <AnimatePresence>
              {allPassed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mx-4 mb-2 p-3 bg-primary/10 border border-primary/20 rounded-xl text-center"
                >
                  <p className="text-sm font-bold text-primary">🎉 All tests passed! +{problem.xp} XP</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-2 p-4 border-t border-border">
              <motion.button
                onClick={handleRun}
                disabled={isRunning || isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium disabled:opacity-50"
                whileTap={{ scale: 0.97 }}
              >
                {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                {isRunning ? 'Running…' : t('practice.runCode')}
              </motion.button>
              <motion.button
                onClick={handleSubmit}
                disabled={isRunning || isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold disabled:opacity-50"
                whileTap={{ scale: 0.97 }}
              >
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                {isSubmitting ? 'Submitting…' : t('practice.submit')}
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
