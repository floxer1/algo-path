import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en';
import fr from './locales/fr';
import es from './locales/es';
import pt from './locales/pt';
import ar from './locales/ar';
import sw from './locales/sw';
import yo from './locales/yo';
import ha from './locales/ha';
import ln from './locales/ln';

const resources = { en: { translation: en }, fr: { translation: fr }, es: { translation: es }, pt: { translation: pt }, ar: { translation: ar }, sw: { translation: sw }, yo: { translation: yo }, ha: { translation: ha }, ln: { translation: ln } };

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
