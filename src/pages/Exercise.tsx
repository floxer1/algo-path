import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Send, Bot, ChevronDown, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { exerciseDetail } from '@/lib/mock-data';
import DifficultyBadge from '@/components/DifficultyBadge';

const langOptions = ['javascript', 'python', 'java', 'cpp'] as const;

const Exercise = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState<string>('javascript');
  const [code, setCode] = useState(exerciseDetail.starterCode.javascript);
  const [testResults, setTestResults] = useState(exerciseDetail.testCases);
  const [showAI, setShowAI] = useState(false);
  const [tab, setTab] = useState<'problem' | 'code'>('problem');

  const handleRun = () => {
    setTestResults(prev => prev.map((tc, i) => ({
      ...tc,
      passed: i < 2 ? true : false,
    })));
  };

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    setCode(exerciseDetail.starterCode[lang as keyof typeof exerciseDetail.starterCode] || '');
  };

  return (
    <div className="min-h-screen flex flex-col safe-top">
      {/* Top bar */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold truncate">{exerciseDetail.title}</h1>
          <DifficultyBadge difficulty={exerciseDetail.difficulty} />
        </div>
        <motion.button
          onClick={() => setShowAI(!showAI)}
          className={`p-2 rounded-xl transition-colors ${showAI ? 'bg-xp/10 text-xp' : 'bg-secondary text-muted-foreground'}`}
          whileTap={{ scale: 0.9 }}
        >
          <Bot size={18} />
        </motion.button>
      </header>

      {/* Mobile tab switcher */}
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
            <p className="text-sm leading-relaxed whitespace-pre-line">{exerciseDetail.description}</p>
            <div className="space-y-3">
              {exerciseDetail.examples.map((ex, i) => (
                <div key={i} className="bg-secondary rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Example {i + 1}</p>
                  <p className="text-sm font-mono"><span className="text-muted-foreground">Input: </span>{ex.input}</p>
                  <p className="text-sm font-mono"><span className="text-muted-foreground">Output: </span>{ex.output}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Language selector */}
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

            {/* Code editor */}
            <div className="flex-1 p-2">
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full h-48 bg-foreground/5 rounded-xl p-3 font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                spellCheck={false}
              />
            </div>

            {/* Test Results */}
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

            {/* Action buttons */}
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
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold"
                whileTap={{ scale: 0.97 }}
              >
                <Send size={14} />
                {t('practice.submit')}
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* AI Coach Panel */}
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
          <div className="mt-4 p-3 bg-xp/5 border border-xp/20 rounded-xl">
            <p className="text-sm text-muted-foreground">
              💡 Try using a <strong>stack</strong> data structure. Push opening brackets and pop when you find a matching closing bracket.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Exercise;
