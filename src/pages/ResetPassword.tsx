import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) setIsRecovery(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setIsRecovery(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error(t('resetPassword.mismatch')); return; }
    if (password.length < 6) { toast.error(t('resetPassword.tooShort')); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success(t('resetPassword.success'));
      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      toast.error(err.message || t('resetPassword.error'));
    } finally {
      setLoading(false);
    }
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <p className="text-muted-foreground text-sm text-center">
          {t('resetPassword.invalidLink')}<br />
          <button onClick={() => navigate('/auth')} className="text-primary font-medium mt-2 inline-block">
            {t('resetPassword.backToLogin')}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 max-w-sm mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl mx-auto mb-3">🔑</div>
          <h1 className="text-2xl font-bold">{t('resetPassword.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('resetPassword.desc')}</p>
        </div>
        <form onSubmit={handleReset} className="space-y-3">
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t('resetPassword.newPassword')} required minLength={6} className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder={t('resetPassword.confirmPassword')} required minLength={6} className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <motion.button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2" whileTap={{ scale: 0.98 }}>
            {loading && <Loader2 size={16} className="animate-spin" />}
            {t('resetPassword.reset')}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
