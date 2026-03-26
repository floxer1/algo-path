import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Home, Code2, Trophy, Swords, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', icon: Home, labelKey: 'nav.home' },
  { path: '/practice', icon: Code2, labelKey: 'nav.practice' },
  { path: '/duels', icon: Swords, labelKey: 'nav.duels' },
  { path: '/leaderboard', icon: Trophy, labelKey: 'nav.leaderboard' },
  { path: '/profile', icon: User, labelKey: 'nav.profile' },
];

const BottomNav = () => {
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass safe-bottom border-t border-border">
      <div className="flex items-center justify-around px-2 pt-2 pb-1 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, labelKey }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className="flex flex-col items-center gap-0.5 min-w-0 flex-1"
          >
            {({ isActive }) => (
              <motion.div
                className="flex flex-col items-center gap-0.5"
                whileTap={{ scale: 0.9 }}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {t(labelKey)}
                </span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
