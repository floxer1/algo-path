import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Settings, Download, Globe, Moon, Bell, LogOut, ChevronRight, Flame, Trophy, CheckCircle2, Wifi } from 'lucide-react';
import { mockUser, badges, languages } from '@/lib/mock-data';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import i18n from '@/lib/i18n';

const Profile = () => {
  const { t } = useTranslation();
  const [showLanguages, setShowLanguages] = useState(false);
  const [lowData, setLowData] = useState(false);

  const stats = [
    { label: t('profile.solved'), value: mockUser.solved, icon: CheckCircle2, color: 'text-primary' },
    { label: t('profile.rank'), value: `#${mockUser.rank}`, icon: Trophy, color: 'text-accent' },
    { label: t('profile.streak'), value: `${mockUser.streak}d`, icon: Flame, color: 'text-streak' },
  ];

  return (
    <div className="min-h-screen pb-24 safe-top">
      <header className="px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold">{t('profile.title')}</h1>
      </header>

      {/* Avatar & Info */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
            {mockUser.avatar}
          </div>
          <div>
            <h2 className="text-lg font-bold">{mockUser.name}</h2>
            <p className="text-sm text-muted-foreground">{t('home.level', { level: mockUser.level })} • {mockUser.xp} XP</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-3 text-center">
              <Icon size={18} className={`mx-auto mb-1 ${color}`} />
              <p className="text-lg font-bold">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="px-4 mb-6">
        <h3 className="font-bold text-sm mb-3">{t('profile.achievements')}</h3>
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {badges.map(badge => (
            <motion.div
              key={badge.id}
              className={`flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center gap-1 border ${
                badge.unlocked ? 'bg-card border-primary/20' : 'bg-muted border-border opacity-40'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">{badge.icon}</span>
              <span className="text-[8px] text-muted-foreground font-medium">{t(`badges.${badge.id}`)}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="px-4 space-y-1">
        <h3 className="font-bold text-sm mb-3">{t('profile.settings')}</h3>

        {/* Language Selector */}
        <button
          onClick={() => setShowLanguages(!showLanguages)}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
        >
          <Globe size={18} className="text-muted-foreground" />
          <span className="flex-1 text-left text-sm">{t('profile.language')}</span>
          <ChevronRight size={16} className={`text-muted-foreground transition-transform ${showLanguages ? 'rotate-90' : ''}`} />
        </button>
        {showLanguages && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-1 p-2 bg-card border border-border rounded-xl">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { i18n.changeLanguage(lang.code); setShowLanguages(false); }}
                  className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                    i18n.language === lang.code ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="truncate">{lang.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Low Data Mode */}
        <button
          onClick={() => setLowData(!lowData)}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
        >
          <Wifi size={18} className="text-muted-foreground" />
          <span className="flex-1 text-left text-sm">{t('profile.lowDataMode')}</span>
          <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${lowData ? 'bg-primary' : 'bg-muted'}`}>
            <div className={`w-5 h-5 rounded-full bg-card shadow transition-transform ${lowData ? 'translate-x-4' : ''}`} />
          </div>
        </button>

        {/* Download Packs */}
        <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
          <Download size={18} className="text-muted-foreground" />
          <span className="flex-1 text-left text-sm">{t('profile.downloadPacks')}</span>
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>

        {/* Notifications */}
        <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
          <Bell size={18} className="text-muted-foreground" />
          <span className="flex-1 text-left text-sm">{t('profile.notifications')}</span>
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>

        {/* Logout */}
        <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border text-destructive">
          <LogOut size={18} />
          <span className="flex-1 text-left text-sm">{t('profile.logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
