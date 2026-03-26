import { motion } from 'framer-motion';

interface XPBarProps {
  current: number;
  max: number;
  level: number;
}

const XPBar = ({ current, max, level }: XPBarProps) => {
  const percent = (current / max) * 100;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-xp text-xp-foreground text-xs font-bold">
        {level}
      </div>
      <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-xp rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs text-muted-foreground font-mono">{current}/{max}</span>
    </div>
  );
};

export default XPBar;
