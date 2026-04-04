import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code2, Zap, Trophy, BarChart3, Brain, Swords, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useEffect, useState } from 'react';

const features = [
  { icon: Brain, title: 'Apprentissage progressif', desc: 'Des parcours structurés du débutant à l\'expert', color: 'text-primary' },
  { icon: Code2, title: 'Exercices interactifs', desc: 'Code directement dans le navigateur avec feedback instantané', color: 'text-[hsl(var(--xp))]' },
  { icon: Trophy, title: 'Système de ligues', desc: 'Progresse dans les ligues et affronte d\'autres apprenants', color: 'text-[hsl(var(--accent))]' },
  { icon: Swords, title: 'Duels en temps réel', desc: 'Défie tes amis et monte dans le classement', color: 'text-[hsl(var(--duel))]' },
  { icon: BarChart3, title: 'Visualisation d\'algorithmes', desc: 'Comprends visuellement le fonctionnement des algorithmes', color: 'text-[hsl(var(--streak))]' },
  { icon: Zap, title: 'XP & Streaks', desc: 'Gagne de l\'XP, maintiens ta série et monte de niveau', color: 'text-primary' },
];

const stats = [
  { value: 50, label: 'Exercices', suffix: '+' },
  { value: 5, label: 'Parcours', suffix: '' },
  { value: 6, label: 'Ligues', suffix: '' },
  { value: 0, label: 'Motivation', suffix: '∞' },
];

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
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero with parallax */}
      <section ref={heroRef} className="relative overflow-hidden px-4 pt-16 pb-20">
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-[hsl(var(--xp))]/10 pointer-events-none"
        />
        {/* Floating orbs parallax */}
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -60]) }}
          className="absolute top-10 left-[10%] w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
          className="absolute top-20 right-[10%] w-48 h-48 bg-[hsl(var(--xp))]/5 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -30]) }}
          className="absolute bottom-10 left-[30%] w-24 h-24 bg-[hsl(var(--accent))]/5 rounded-full blur-2xl pointer-events-none"
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-lg mx-auto relative"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6"
            >
              <Zap size={14} />
              Apprends en t'amusant
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight mb-4"
            >
              Maîtrise les{' '}
              <span className="text-primary">algorithmes</span>,{' '}
              un défi à la fois
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-lg mb-8 max-w-md mx-auto"
            >
              La plateforme gamifiée pour apprendre les structures de données et algorithmes, avec des exercices interactifs et un système de progression motivant.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button asChild size="lg" className="text-base gap-2">
                <Link to="/auth">
                  Commencer gratuitement
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats with animated counters */}
      <section className="px-4 py-10">
        <div className="max-w-lg mx-auto grid grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <AnimatedCounter target={stat.value} suffix={stat.suffix} isInfinite={stat.label === 'Motivation'} />
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features with staggered scroll animations */}
      <section className="px-4 py-10">
        <div className="max-w-lg mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            className="text-2xl font-bold text-center mb-8"
          >
            Tout ce qu'il faut pour progresser
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-card border border-border rounded-xl p-4 cursor-default"
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
                >
                  <f.icon size={24} className={`${f.color} mb-2`} />
                </motion.div>
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works with scroll-triggered animations */}
      <section className="px-4 py-10">
        <div className="max-w-lg mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-center mb-8"
          >
            Comment ça marche ?
          </motion.h2>
          <div className="space-y-4">
            {[
              { step: '1', text: 'Inscris-toi gratuitement et choisis ton parcours' },
              { step: '2', text: 'Résous des exercices interactifs et gagne de l\'XP' },
              { step: '3', text: 'Monte dans les ligues et défie d\'autres apprenants' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: i * 0.15, type: 'spring', stiffness: 150 }}
                className="flex items-center gap-4"
              >
                <motion.div
                  whileInView={{ scale: [0, 1.2, 1] }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.2, duration: 0.4 }}
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
                >
                  <span className="text-primary font-bold">{item.step}</span>
                </motion.div>
                <div className="flex-1 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[hsl(var(--success))] shrink-0" />
                  <p className="text-sm">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA with parallax */}
      <section className="px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ type: 'spring', stiffness: 150 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground relative overflow-hidden"
          >
            <motion.div
              animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-4 right-4 w-24 h-24 bg-primary-foreground/5 rounded-full blur-xl pointer-events-none"
            />
            <h2 className="text-2xl font-bold mb-3 relative">Prêt à coder ?</h2>
            <p className="text-sm opacity-90 mb-6 relative">Rejoins des milliers d'apprenants et commence ton parcours algorithmique.</p>
            <Button asChild variant="secondary" size="lg" className="text-base gap-2 relative">
              <Link to="/auth">
                C'est parti !
                <ArrowRight size={18} />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
