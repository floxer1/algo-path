import { motion } from 'framer-motion';
import { SortStep } from '@/lib/sorting-algorithms';

interface SortVisualizerProps {
  step: SortStep;
  maxValue: number;
}

const SortVisualizer = ({ step, maxValue }: SortVisualizerProps) => {
  return (
    <div className="w-full">
      {/* Step label */}
      <div className="text-center mb-3">
        <span className="text-xs font-mono text-muted-foreground bg-secondary px-3 py-1 rounded-full">
          {step.label}
        </span>
      </div>

      {/* Bars */}
      <div className="flex items-end justify-center gap-[2px] h-48 px-2">
        {step.array.map((value, index) => {
          const isSorted = step.sorted.includes(index);
          const isComparing = step.comparing && (step.comparing[0] === index || step.comparing[1] === index);
          const isSwapping = step.swapping && (step.swapping[0] === index || step.swapping[1] === index);
          const isPivot = step.pivot === index;

          let barColor = 'bg-primary/40';
          if (isSorted) barColor = 'bg-primary';
          if (isComparing) barColor = 'bg-info';
          if (isSwapping) barColor = 'bg-accent';
          if (isPivot) barColor = 'bg-duel';

          const heightPercent = (value / maxValue) * 100;

          return (
            <motion.div
              key={index}
              className={`rounded-t-sm flex-1 max-w-8 relative ${barColor}`}
              style={{ height: `${heightPercent}%` }}
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-muted-foreground">
                {value}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-info" />
          <span className="text-[10px] text-muted-foreground">Comparing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-accent" />
          <span className="text-[10px] text-muted-foreground">Swapping</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary" />
          <span className="text-[10px] text-muted-foreground">Sorted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-duel" />
          <span className="text-[10px] text-muted-foreground">Pivot</span>
        </div>
      </div>
    </div>
  );
};

export default SortVisualizer;
