import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Settings, Download, Globe, Moon, Sun, Monitor, Bell, LogOut, ChevronRight, Flame, Trophy, CheckCircle2, Wifi, Pencil, X, Check, Loader2, Palette } from 'lucide-react';
import { mockUser, badges, languages } from '@/lib/mock-data';
import { useState, useEffect } from 'react';
import AvatarUpload from '@/components/AvatarUpload';
import LeagueBadge from '@/components/LeagueBadge';
import LeagueChangeOverlay from '@/components/LeagueChangeOverlay';
import PasswordProtectionStatus from '@/components/PasswordProtectionStatus';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import i18n from '@/lib/i18n';
import { useTheme, type ColorTheme } from '@/hooks/use-theme';
import { toast } from 'sonner';

const colorThemes: { value: ColorTheme; label: string; colors: string[] }[] = [
  { value: 'default', label: 'Default', colors: ['hsl(152,69%,45%)', 'hsl(38,92%,60%)'] },
  { value: 'ocean', label: 'Ocean', colors: ['hsl(200,80%,50%)', 'hsl(180,60%,45%)'] },
  { value: 'sunset', label: 'Sunset', colors: ['hsl(20,90%,55%)', 'hsl(340,80%,55%)'] },
  { value: 'forest', label: 'Forest', colors: ['hsl(140,50%,40%)', 'hsl(80,50%,45%)'] },
];

const Profile = () => {
  const { t } = useTranslation();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [showLanguages, setShowLanguages] = useState(false);
  const [lowData, setLowData] = useState(false);
  const { theme, setTheme, colorTheme, setColorTheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setProfile(data);
          setEditName(data.display_name || '');
          setEditBio(data.bio || '');
        }
      });
  }, [user]);

  const displayName = profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || mockUser.name;
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const xp = profile?.xp ?? mockUser.xp;
  const level = profile?.level ?? mockUser.level;
  const solved = profile?.problems_solved ?? mockUser.solved;
  const streak = profile?.streak ?? mockUser.streak;
  const rank = profile?.rank ?? mockUser.rank;

  const handleStartEdit = () => {
    setEditName(profile?.display_name || displayName);
    setEditBio(profile?.bio || '');
    setEditing(true);
  };

  const handleSave = async () => {
    if (!user || !profile) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: editName.trim(), bio: editBio.trim() })
      .eq('user_id', user.id);
    setSaving(false);
    if (error) {
      toast.error(t('profile.saveError'));
      return;
    }
    setProfile({ ...profile, display_name: editName.trim(), bio: editBio.trim() });
    setEditing(false);
    toast.success(t('profile.saveSuccess'));
  };

  const stats = [
    { label: t('profile.solved'), value: solved, icon: CheckCircle2, color: 'text-primary' },
    { label: t('profile.rank'), value: `#${rank}`, icon: Trophy, color: 'text-accent' },
    { label: t('profile.streak'), value: `${streak}d`, icon: Flame, color: 'text-streak' },
  ];

  return (
    <div className="min-h-screen pb-24 safe-top">
      <header className="px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold">{t('profile.title')}</h1>
      </header>

      {/* Avatar & Info */}
      <div className="px-4 mb-6">
        {editing ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold">{t('profile.editProfile')}</span>
              <button onClick={() => setEditing(false)} className="text-muted-foreground">
                <X size={18} />
              </button>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t('profile.displayName')}</label>
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                maxLength={50}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t('profile.bio')}</label>
              <textarea
                value={editBio}
                onChange={e => setEditBio(e.target.value)}
                maxLength={160}
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder={t('profile.bioPlaceholder')}
              />
              <p className="text-[10px] text-muted-foreground text-right mt-0.5">{editBio.length}/160</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || !editName.trim()}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {t('profile.save')}
            </button>
          </motion.div>
        ) : (
          <div className="flex items-center gap-4">
            {user ? (
              <AvatarUpload
                userId={user.id}
                currentAvatarUrl={avatarUrl}
                fallbackEmoji={mockUser.avatar}
                displayName={displayName}
                onAvatarUpdated={(url) => setProfile((p: any) => ({ ...p, avatar_url: url }))}
              />
            ) : avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-16 h-16 rounded-2xl object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
                {mockUser.avatar}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold truncate">{displayName}</h2>
                <button onClick={handleStartEdit} className="text-muted-foreground hover:text-primary transition-colors">
                  <Pencil size={14} />
                </button>
              </div>
              {profile?.bio && <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{profile.bio}</p>}
              <p className="text-sm text-muted-foreground">{t('home.level', { level })} • {xp} XP</p>
            </div>
          </div>
        )}
      </div>

      {/* League */}
      {profile && user && (
        <div className="px-4 mb-6">
          <LeagueBadge weeklyXp={profile.weekly_xp ?? 0} />
          <LeagueChangeOverlay weeklyXp={profile.weekly_xp ?? 0} userId={user.id} />
        </div>
      )}

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

        {/* Color Theme Selector */}
        <div className="w-full p-3 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Palette size={18} className="text-muted-foreground" />
            <span className="text-sm">{t('profile.colorTheme')}</span>
          </div>
          <div className="flex gap-2 ml-8">
            {colorThemes.map(ct => (
              <button
                key={ct.value}
                onClick={() => setColorTheme(ct.value)}
                className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all ${
                  colorTheme === ct.value ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-secondary'
                }`}
              >
                <div className="flex gap-0.5">
                  {ct.colors.map((c, i) => (
                    <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className="text-[9px] text-muted-foreground font-medium">{ct.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Theme Selector */}
        <div className="w-full p-3 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Moon size={18} className="text-muted-foreground" />
            <span className="text-sm">{t('profile.theme')}</span>
          </div>
          <div className="flex gap-1 ml-8">
            {([
              { value: 'light' as const, icon: Sun, label: 'Light' },
              { value: 'dark' as const, icon: Moon, label: 'Dark' },
              { value: 'system' as const, icon: Monitor, label: 'Auto' },
            ]).map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium flex-1 justify-center transition-colors ${
                  theme === value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>

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

        {/* Security status */}
        <div className="pt-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
            {t('security.sectionTitle')}
          </h2>
          <PasswordProtectionStatus />
        </div>

        {/* Logout */}
        <button onClick={async () => { await signOut(); navigate('/auth'); }} className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border text-destructive">
          <LogOut size={18} />
          <span className="flex-1 text-left text-sm">{t('profile.logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
