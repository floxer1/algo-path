import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code2, Zap, Trophy, BarChart3, Brain, Swords, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const AnimatedCounter = ({ target, suffix, isInfinite }: { target: number; suffix: string; isInfinite: boolean }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          if (isInfinite) return;
          const duration = 1200;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, hasAnimated, isInfinite]);

  return (
    <div ref={ref} className="text-2xl font-bold text-primary">
      {isInfinite ? '∞' : `${count}${suffix}`}
    </div>
  );
};

const Landing = () => {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const features = [
    { icon: Brain, title: t('landing.feature1Title'), desc: t('landing.feature1Desc'), color: 'text-primary' },
    { icon: Code2, title: t('landing.feature2Title'), desc: t('landing.feature2Desc'), color: 'text-[hsl(var(--xp))]' },
    { icon: Trophy, title: t('landing.feature3Title'), desc: t('landing.feature3Desc'), color: 'text-[hsl(var(--accent))]' },
    { icon: Swords, title: t('landing.feature4Title'), desc: t('landing.feature4Desc'), color: 'text-[hsl(var(--duel))]' },
    { icon: BarChart3, title: t('landing.feature5Title'), desc: t('landing.feature5Desc'), color: 'text-[hsl(var(--streak))]' },
    { icon: Zap, title: t('landing.feature6Title'), desc: t('landing.feature6Desc'), color: 'text-primary' },
  ];

  const stats = [
    { value: 50, label: t('landing.statsExercises'), suffix: '+' },
    { value: 5, label: t('landing.statsPaths'), suffix: '' },
    { value: 6, label: t('landing.statsLeagues'), suffix: '' },
    { value: 0, label: t('landing.statsMotivation'), suffix: '∞' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <section ref={heroRef} className="relative overflow-hidden px-4 pt-16 pb-20">
        <motion.div style={{ y: bgY }} className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-[hsl(var(--xp))]/10 pointer-events-none" />
        <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, -60]) }} className="absolute top-10 left-[10%] w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
        <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }} className="absolute top-20 right-[10%] w-48 h-48 bg-[hsl(var(--xp))]/5 rounded-full blur-3xl pointer-events-none" />
        <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, -30]) }} className="absolute bottom-10 left-[30%] w-24 h-24 bg-[hsl(var(--accent))]/5 rounded-full blur-2xl pointer-events-none" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-lg mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, type: 'spring', stiffness: 200 }} className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Zap size={14} />
              {t('landing.badge')}
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl font-bold tracking-tight mb-4">
              {t('landing.heroTitle1')}{' '}
              <span className="text-primary">{t('landing.heroTitle2')}</span>
              {t('landing.heroTitle3')}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              {t('landing.heroDesc')}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="text-base gap-2">
                <Link to="/auth">
                  {t('landing.cta')}
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section className="px-4 py-10">
        <div className="max-w-lg mx-auto grid grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.1 }} className="text-center">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} isInfinite={stat.label === t('landing.statsMotivation')} />
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="max-w-lg mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} className="text-2xl font-bold text-center mb-8">
            {t('landing.featuresTitle')}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-20px' }} transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="bg-card border border-border rounded-xl p-4 cursor-default">
                <motion.div whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}>
                  <f.icon size={24} className={`${f.color} mb-2`} />
                </motion.div>
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="max-w-lg mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl font-bold text-center mb-8">
            {t('landing.howTitle')}
          </motion.h2>
          <div className="space-y-4">
            {[t('landing.step1'), t('landing.step2'), t('landing.step3')].map((text, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-20px' }} transition={{ delay: i * 0.15, type: 'spring', stiffness: 150 }} className="flex items-center gap-4">
                <motion.div whileInView={{ scale: [0, 1.2, 1] }} viewport={{ once: true }} transition={{ delay: i * 0.15 + 0.2, duration: 0.4 }} className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold">{i + 1}</span>
                </motion.div>
                <div className="flex-1 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[hsl(var(--success))] shrink-0" />
                  <p className="text-sm">{text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-40px' }} transition={{ type: 'spring', stiffness: 150 }} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }} className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground relative overflow-hidden">
            <motion.div animate={{ x: [0, 20, 0], y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-4 right-4 w-24 h-24 bg-primary-foreground/5 rounded-full blur-xl pointer-events-none" />
            <h2 className="text-2xl font-bold mb-3 relative">{t('landing.ctaTitle')}</h2>
            <p className="text-sm opacity-90 mb-6 relative">{t('landing.ctaDesc')}</p>
            <Button asChild variant="secondary" size="lg" className="text-base gap-2 relative">
              <Link to="/auth">
                {t('landing.ctaButton')}
                <ArrowRight size={18} />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <footer className="px-4 py-6 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} AlgoTrainer · Conçu par{' '}
          <a href="https://www.smartsolution-it.com/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline underline-offset-2">
            Smart Solution IT
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Landing;
