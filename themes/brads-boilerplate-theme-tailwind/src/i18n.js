import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const en = require('./locales/en/translations.json');
const he = require('./locales/he/translations.json');
const defaultLang = localStorage.getItem('lang') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    he: { translation: he },
  },
  lng: defaultLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
