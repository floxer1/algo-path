import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, ShieldAlert, ShieldQuestion, ExternalLink, Check } from 'lucide-react';
import { motion } from 'framer-motion';

type Status = 'unknown' | 'enabled' | 'disabled';

const STORAGE_KEY = 'algotrainer-hibp-status';

/**
 * Read-only status card for the "Leaked Password Protection" (HIBP) feature.
 * The flag itself lives in the Lovable Cloud auth settings and cannot be
 * inspected from a client SDK, so we let an admin user record their own
 * verification locally. The card always shows the activation guide.
 */
const PasswordProtectionStatus = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status>('unknown');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'enabled' || stored === 'disabled') setStatus(stored);
  }, []);

  const setAndPersist = (next: Status) => {
    setStatus(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const cfg = {
    enabled: {
      Icon: ShieldCheck,
      tone: 'bg-success/10 border-success/30 text-success',
      title: t('security.hibp.enabledTitle'),
      desc: t('security.hibp.enabledDesc'),
    },
    disabled: {
      Icon: ShieldAlert,
      tone: 'bg-destructive/10 border-destructive/30 text-destructive',
      title: t('security.hibp.disabledTitle'),
      desc: t('security.hibp.disabledDesc'),
    },
    unknown: {
      Icon: ShieldQuestion,
      tone: 'bg-muted/40 border-border text-muted-foreground',
      title: t('security.hibp.unknownTitle'),
      desc: t('security.hibp.unknownDesc'),
    },
  }[status];

  const { Icon } = cfg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-4 ${cfg.tone}`}
    >
      <div className="flex items-start gap-3">
        <Icon size={22} className="shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground">{cfg.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{cfg.desc}</p>

          {status !== 'enabled' && (
            <div className="mt-3 space-y-2 text-xs text-foreground/80">
              <p className="font-medium">{t('security.hibp.howTitle')}</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>{t('security.hibp.step1')}</li>
                <li>{t('security.hibp.step2')}</li>
                <li>{t('security.hibp.step3')}</li>
              </ol>
              <a
                href="https://docs.lovable.dev/features/security"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-primary hover:underline"
              >
                {t('security.hibp.docs')}
                <ExternalLink size={12} />
              </a>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            {status !== 'enabled' && (
              <button
                onClick={() => setAndPersist('enabled')}
                className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-success/15 text-success hover:bg-success/25 transition-colors"
              >
                <Check size={12} />
                {t('security.hibp.markEnabled')}
              </button>
            )}
            {status === 'enabled' && (
              <button
                onClick={() => setAndPersist('disabled')}
                className="text-xs px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-foreground"
              >
                {t('security.hibp.markDisabled')}
              </button>
            )}
            {status === 'unknown' && (
              <button
                onClick={() => setAndPersist('disabled')}
                className="text-xs px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-foreground"
              >
                {t('security.hibp.notYet')}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PasswordProtectionStatus;
