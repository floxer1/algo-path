import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Trophy, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import LeagueBadge from '@/components/LeagueBadge';
import { getLeague, LEAGUES } from '@/lib/leagues';

const tabs = ['global', 'country', 'league'] as const;
const medalColors = ['text-league-gold', 'text-league-silver', 'text-league-bronze'];

interface LeaderboardUser {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  xp: number;
  weekly_xp: number;
  country: string | null;
  level: number;
  problems_solved: number;
  league: string;
}

const Leaderboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('global');
  const [players, setPlayers] = useState<LeaderboardUser[]>([]);
  const [myProfile, setMyProfile] = useState<LeaderboardUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url, xp, weekly_xp, country, level, problems_solved, league')
        .order('xp', { ascending: false })
        .limit(50);

      if (!error && data) {
        setPlayers(data as LeaderboardUser[]);
        if (user) {
          const me = (data as LeaderboardUser[]).find(p => p.user_id === user.id);
          if (me) setMyProfile(me);
          else {
            const { data: own } = await supabase
              .from('profiles')
              .select('user_id, display_name, avatar_url, xp, weekly_xp, country, level, problems_solved, league')
              .eq('user_id', user.id)
              .single();
            if (own) setMyProfile(own as LeaderboardUser);
          }
        }
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, [user]);

  const myLeague = myProfile ? getLeague(myProfile.weekly_xp ?? 0) : null;

  const filteredPlayers = activeTab === 'country' && myProfile?.country
    ? players.filter(p => p.country === myProfile.country)
    : activeTab === 'league' && myLeague
    ? players.filter(p => getLeague(p.weekly_xp ?? 0).tier === myLeague.tier)
    : players;

  const myRank = myProfile
    ? players.findIndex(p => p.user_id === myProfile.user_id) + 1 || '—'
    : '—';

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen pb-24 safe-top">
      <header className="px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold">{t('leaderboard.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('leaderboard.weekly')}</p>
      </header>

      {/* League card */}
      {myProfile && (
        <div className="px-4 mb-4">
          <LeagueBadge weeklyXp={myProfile.weekly_xp ?? 0} />
        </div>
      )}

      {/* Tabs */}
      <div className="px-4 flex gap-2 mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex-1 ${
              activeTab === tab
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {tab === 'league' ? (myLeague ? `${myLeague.emoji} ${myLeague.label}` : 'Ligue') : t(`leaderboard.${tab}`)}
          </button>
        ))}
      </div>

      {/* Your rank */}
      {myProfile && (
        <div className="px-4 mb-4">
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-3">
            <span className="text-lg font-bold text-primary">#{myRank}</span>
            {myProfile.avatar_url ? (
              <img src={myProfile.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {getInitials(myProfile.display_name)}
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-sm">{myProfile.display_name || 'You'} (You)</p>
            </div>
            <span className="font-mono text-sm font-bold text-xp">{myProfile.xp.toLocaleString()} XP</span>
          </div>
        </div>
      )}

      {/* Rankings */}
      <div className="px-4 space-y-2">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" size={24} />
          </div>
        ) : filteredPlayers.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">Aucun joueur trouvé</p>
        ) : (
          filteredPlayers.map((player, i) => {
            const playerLeague = getLeague(player.weekly_xp ?? 0);
            return (
              <motion.div
                key={player.user_id}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-3 p-3 rounded-xl bg-card border border-border ${
                  player.user_id === user?.id ? 'ring-1 ring-primary/30' : ''
                }`}
              >
                <div className="w-8 text-center">
                  {i < 3 ? (
                    <Trophy size={18} className={medalColors[i]} />
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">#{i + 1}</span>
                  )}
                </div>
                {player.avatar_url ? (
                  <img src={player.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {getInitials(player.display_name)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{player.display_name || 'Anonyme'}</p>
                  <p className="text-xs text-muted-foreground">
                    {playerLeague.emoji} {playerLeague.label} • Lvl {player.level}
                  </p>
                </div>
                <span className="font-mono text-sm font-bold text-xp">{player.xp.toLocaleString()}</span>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
