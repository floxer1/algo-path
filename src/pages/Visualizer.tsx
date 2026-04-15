import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, RotateCcw, Gauge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SortVisualizer from '@/components/SortVisualizer';
import {
  SortStep,
  bubbleSort,
  mergeSort,
  quickSort,
  generateRandomArray,
} from '@/lib/sorting-algorithms';

const algorithms = [
  { id: 'bubble', name: 'Bubble Sort', fn: bubbleSort, complexity: 'O(n²)', desc: 'Repeatedly swaps adjacent elements if they are in the wrong order.' },
  { id: 'merge', name: 'Merge Sort', fn: mergeSort, complexity: 'O(n log n)', desc: 'Divides array in half, sorts each half, then merges them.' },
  { id: 'quick', name: 'Quick Sort', fn: quickSort, complexity: 'O(n log n)', desc: 'Picks a pivot, partitions around it, then recurses.' },
] as const;

const speeds = [
  { label: '0.5×', ms: 600 },
  { label: '1×', ms: 300 },
  { label: '2×', ms: 150 },
  { label: '4×', ms: 75 },
];

const ARRAY_SIZE = 15;

const Visualizer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedAlgo, setSelectedAlgo] = useState(0);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [maxValue, setMaxValue] = useState(55);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const algo = algorithms[selectedAlgo];

  const generateNew = useCallback(() => {
    const arr = generateRandomArray(ARRAY_SIZE);
    setMaxValue(Math.max(...arr) + 5);
    const newSteps = algo.fn(arr);
    setSteps(newSteps);
    setCurrentStep(0);
    setPlaying(false);
  }, [algo]);

  useEffect(() => {
    generateNew();
  }, [generateNew]);

  useEffect(() => {
    if (playing && currentStep < steps.length - 1) {
      timerRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speeds[speedIdx].ms);
    } else if (currentStep >= steps.length - 1) {
      setPlaying(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, currentStep, steps.length, speedIdx]);

  const togglePlay = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
      setPlaying(true);
    } else {
      setPlaying(!playing);
    }
  };

  const stepForward = () => {
    setPlaying(false);
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const stepBack = () => {
    setPlaying(false);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen pb-24 safe-top">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-bold">{t('visualizer.title')}</h1>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Algorithm selector */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {algorithms.map((a, i) => (
            <button
              key={a.id}
              onClick={() => { setSelectedAlgo(i); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                selectedAlgo === i
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>

        {/* Info card */}
        <div className="bg-card border border-border rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-sm">{algo.name}</h2>
            <span className="text-xs font-mono bg-xp/10 text-xp px-2 py-0.5 rounded-full">{algo.complexity}</span>
          </div>
          <p className="text-xs text-muted-foreground">{algo.desc}</p>
        </div>

        {/* Visualization */}
        {currentStepData && (
          <motion.div
            key={selectedAlgo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <SortVisualizer step={currentStepData} maxValue={maxValue} />
          </motion.div>
        )}

        {/* Progress bar */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={steps.length - 1}
            value={currentStep}
            onChange={e => { setPlaying(false); setCurrentStep(Number(e.target.value)); }}
            className="w-full h-1.5 bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
          />
          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
            <span>Step {currentStep + 1}</span>
            <span>{steps.length} total</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <motion.button
            onClick={stepBack}
            className="p-2.5 bg-secondary rounded-xl"
            whileTap={{ scale: 0.9 }}
          >
            <SkipBack size={18} />
          </motion.button>

          <motion.button
            onClick={togglePlay}
            className="p-3.5 bg-primary text-primary-foreground rounded-2xl"
            whileTap={{ scale: 0.9 }}
          >
            {playing ? <Pause size={22} /> : <Play size={22} />}
          </motion.button>

          <motion.button
            onClick={stepForward}
            className="p-2.5 bg-secondary rounded-xl"
            whileTap={{ scale: 0.9 }}
          >
            <SkipForward size={18} />
          </motion.button>
        </div>

        {/* Speed + Reset */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge size={14} className="text-muted-foreground" />
            <div className="flex gap-1">
              {speeds.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => setSpeedIdx(i)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    speedIdx === i ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            onClick={generateNew}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-lg text-xs font-medium text-muted-foreground"
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={12} />
            {t('visualizer.newArray')}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
