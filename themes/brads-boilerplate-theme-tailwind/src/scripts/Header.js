import React from 'react';
import Logo from '../../assets/logo.svg';
import { Button } from './Button';
import { IconButton } from './Icon';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { ListIcon, SmileyIcon } from '@phosphor-icons/react';
import { Socials } from './Socials';

export default function Header({ isUserLoggedIn = false }) {
  const { t } = useTranslation();

  return (
    <header className="
        relative
        bg-[var(--schemesPrimaryContainer)]
        text-[var(--schemesOnPrimaryContainer)]
        w-full px-8 lg:px-16 py-6
        flex items-center justify-between z-50
        shadow-[7px_6px_1px_var(--schemesOutlineVariant,#C9C7BD)]
        mix-blend-multiply
      "
    >
      <a href="/" className="flex items-center">
        <img src={Logo} alt="The Social Blueprint" className="h-20" />
      </a>

      {/*<LanguageSwitcher />*/}
      <div className="hidden lg:flex flex-col items-end gap-6">
        <Socials />
        <div className="hidden lg:flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-3 Blueprint-body-medium">
            <Button label={t('whats_on')} className="text-white" size="lg" variant="text" onClick={() => window.location.href = '/events'} />
            <Button label={t('directory')} className="text-white" size="lg" variant="text" onClick={() => window.location.href = '/directory'} />
            <Button label={t('blueprint_stories')} className="text-white" size="lg" variant="text" onClick={() => window.location.href = '/stories'} />
            <Button label={t('about_us')} className="text-white" size="lg" variant="text" onClick={() => window.location.href = '/about-us'} />
            <Button label={t('message_board')} className="text-white" size="lg" variant="text" onClick={() => window.location.href = '/message-boards'} />
          </nav>
          <div className="flex gap-4">
            <Button
              label={t('Subscribe')}
              variant="filled"
              shape="square"
              size="lg"
              onClick={() => console.log('Subscribe')}
            />
            <Button
              label={isUserLoggedIn ? t("account_dasboard") : t('log_in')}
              variant="tonal"
              shape="square"
              size="lg"
              icon={(
                <SmileyIcon size={22} weight="bold" />
              )}
              onClick={() => isUserLoggedIn ? window.location.href = '/account-dashboard' : window.location.href = '/login'}
            />
          </div>
        </div>
      </div>
      <div className="lg:hidden items-center">
        <IconButton
          icon={<ListIcon size={22} weight="bold" />}
          style="tonal"
          size="sm"
          onClick={() => console.log('Menu clicked')}
          aria-label={t('menu')}
        />
      </div>
    </header>
  );
}
