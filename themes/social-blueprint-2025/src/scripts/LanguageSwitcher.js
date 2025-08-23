import i18n from 'i18next';
import { useTranslation } from '../../node_modules/react-i18next';

export const LanguageSwitcher = () => {
  const { t } = useTranslation();

  const switchLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => switchLanguage('en')}>🇬🇧 {t('language.english')}</button>
      <button onClick={() => switchLanguage('he')}>🇮🇱 {t('language.hebrew')}</button>
    </div>
  );
};
