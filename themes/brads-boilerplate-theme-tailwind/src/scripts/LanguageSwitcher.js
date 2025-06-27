import i18n from 'i18next';

export const LanguageSwitcher = () => {
  const switchLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => switchLanguage('en')}>🇬🇧 English</button>
      <button onClick={() => switchLanguage('he')}>🇮🇱 עברית</button>
    </div>
  );
};
