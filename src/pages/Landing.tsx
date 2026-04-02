import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code2, Zap, Trophy, BarChart3, Brain, Swords, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Brain, title: 'Apprentissage progressif', desc: 'Des parcours structurés du débutant à l\'expert', color: 'text-primary' },
  { icon: Code2, title: 'Exercices interactifs', desc: 'Code directement dans le navigateur avec feedback instantané', color: 'text-[hsl(var(--xp))]' },
  { icon: Trophy, title: 'Système de ligues', desc: 'Progresse dans les ligues et affronte d\'autres apprenants', color: 'text-[hsl(var(--accent))]' },
  { icon: Swords, title: 'Duels en temps réel', desc: 'Défie tes amis et monte dans le classement', color: 'text-[hsl(var(--duel))]' },
  { icon: BarChart3, title: 'Visualisation d\'algorithmes', desc: 'Comprends visuellement le fonctionnement des algorithmes', color: 'text-[hsl(var(--streak))]' },
  { icon: Zap, title: 'XP & Streaks', desc: 'Gagne de l\'XP, maintiens ta série et monte de niveau', color: 'text-primary' },
];

const stats = [
  { value: '50+', label: 'Exercices' },
  { value: '5', label: 'Parcours' },
  { value: '6', label: 'Ligues' },
  { value: '∞', label: 'Motivation' },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-[hsl(var(--xp))]/10 pointer-events-none" />
        <div className="max-w-lg mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Zap size={14} />
              Apprends en t'amusant
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Maîtrise les{' '}
              <span className="text-primary">algorithmes</span>,{' '}
              un défi à la fois
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              La plateforme gamifiée pour apprendre les structures de données et algorithmes, avec des exercices interactifs et un système de progression motivant.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="text-base gap-2">
                <Link to="/auth">
                  Commencer gratuitement
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 py-10">
        <div className="max-w-lg mx-auto grid grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-10">
        <div className="max-w-lg mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-center mb-8"
          >
            Tout ce qu'il faut pour progresser
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="bg-card border border-border rounded-xl p-4"
              >
                <f.icon size={24} className={`${f.color} mb-2`} />
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-10">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Comment ça marche ?</h2>
          <div className="space-y-4">
            {[
              { step: '1', text: 'Inscris-toi gratuitement et choisis ton parcours' },
              { step: '2', text: 'Résous des exercices interactifs et gagne de l\'XP' },
              { step: '3', text: 'Monte dans les ligues et défie d\'autres apprenants' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold">{item.step}</span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[hsl(var(--success))] shrink-0" />
                  <p className="text-sm">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground"
          >
            <h2 className="text-2xl font-bold mb-3">Prêt à coder ?</h2>
            <p className="text-sm opacity-90 mb-6">Rejoins des milliers d'apprenants et commence ton parcours algorithmique.</p>
            <Button asChild variant="secondary" size="lg" className="text-base gap-2">
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
