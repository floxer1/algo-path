import { useTranslation } from 'react-i18next';

interface DifficultyBadgeProps {
  difficulty: 'easy' | 'medium' | 'hard';
}

const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
  const { t } = useTranslation();
  const styles = {
    easy: 'bg-primary/15 text-primary',
    medium: 'bg-accent/15 text-accent-foreground',
    hard: 'bg-destructive/15 text-destructive',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${styles[difficulty]}`}>
      {t(`practice.${difficulty}`)}
    </span>
  );
};

export default DifficultyBadge;
