import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Github, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { toast } from 'sonner';

const Auth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success('Check your email to verify your account!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const isLovableDomain = window.location.hostname.endsWith('.lovable.app');

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      if (isLovableDomain) {
        const result = await lovable.auth.signInWithOAuth('google', {
          redirect_uri: window.location.origin,
        });
        if (result.error) {
          toast.error(result.error.message || 'Google login failed');
        }
      } else {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin },
        });
        if (error) throw error;
      }
    } catch (err: any) {
      toast.error(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubAuth = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || 'GitHub login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col safe-top">
      <header className="px-4 py-3">
        <button onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </button>
      </header>

      <div className="flex-1 flex flex-col justify-center px-6 max-w-sm mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl mx-auto mb-3">
              🧠
            </div>
            <h1 className="text-2xl font-bold">AlgoTrainer</h1>
            <p className="text-sm text-muted-foreground mt-1">{t('app.tagline')}</p>
          </div>

          {/* Social buttons */}
          <div className="space-y-3 mb-6">
            <motion.button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 bg-card border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
              whileTap={{ scale: 0.98 }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
              {t('auth.google')}
            </motion.button>

            <motion.button
              onClick={handleGithubAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 bg-card border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
              whileTap={{ scale: 0.98 }}
            >
              <Github size={18} />
              {t('auth.github')}
            </motion.button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">{t('auth.or')}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('auth.email')}
                required
                className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t('auth.password')}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              whileTap={{ scale: 0.98 }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === 'login' ? t('auth.login') : t('auth.signup')}
            </motion.button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-primary font-medium"
            >
              {mode === 'login' ? t('auth.signup') : t('auth.login')}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
