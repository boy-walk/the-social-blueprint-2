import React from 'react';
import Logo from '../../assets/logo.svg';
import { Button } from './Button';          // ← our new token-driven button
import { IconButton } from './Icon';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { FacebookLogoIcon, InstagramLogoIcon, LinkedinLogoIcon, SpotifyLogoIcon, YoutubeLogoIcon, ListIcon } from '@phosphor-icons/react';

/**
 * Blueprint Header
 * — colours straight from design-token custom-props
 * — uses new <Button> with proper variants & hover states
 */
export default function Header() {
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
      {/* logo -------------------------------------------------- */}
      <a href="/" className="flex items-center">
        <img src={Logo} alt="The Social Blueprint" className="h-20" />
      </a>

      {/* right-hand block ------------------------------------- */}
      <div className="hidden lg:flex flex-col items-end gap-6">
        {/* social icons */}
        <div className="flex gap-4">
          <IconButton
            icon={<FacebookLogoIcon size={22} weight="bold" />}
            style="tonal"
            size="sm"
            onClick={() => window.open('https://www.facebook.com', '_blank')}
            aria-label={t('follow_us_on_facebook')}
          />
          <IconButton
            icon={<YoutubeLogoIcon size={22} weight="bold" />}
            style="tonal"
            size="sm"
            onClick={() => window.open('https://www.youtube.com', '_blank')}
            aria-label={t('follow_us_on_youtube')}
          />
          <IconButton
            icon={<InstagramLogoIcon size={22} weight="bold" />}
            style="tonal"
            size="sm"
            onClick={() => window.open('https://www.instagram.com', '_blank')}
            aria-label={t('follow_us_on_instagram')}
          />
          <IconButton
            icon={<LinkedinLogoIcon size={22} weight="bold" />}
            style="tonal"
            size="sm"
            onClick={() => window.open('https://www.linkedin.com', '_blank')}
            aria-label={t('follow_us_on_linkedin')}
          />
          <IconButton
            icon={<SpotifyLogoIcon size={22} weight="bold" />}
            style="tonal"
            size="sm"
            onClick={() => window.open('https://www.spotify.com', '_blank')}
            aria-label={t('follow_us_on_spotify')}
          />
        </div>

        {/* nav + CTAs */}
        <div className="hidden lg:flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-6 Blueprint-body-medium">
            <Button label={t('whats_on')} className="text-white" size="sm" variant="text" onClick={() => window.location.href = '/events'} />
            <Button label={t('directory')} className="text-white" size="sm" variant="text" onClick={() => window.location.href = '/directory'} />
            <Button label={t('blueprint_stories')} className="text-white" size="sm" variant="text" onClick={() => window.location.href = '/stories'} />
            <Button label={t('about_us')} className="text-white" size="sm" variant="text" onClick={() => window.location.href = '/about'} />
            <Button label={t('message_board')} className="text-white" size="sm" variant="text" onClick={() => window.location.href = '/message-board'} />
          </nav>
          {/* ----- action buttons ----- */}
          <div className="flex gap-4">
            {/* outline / pill */}
            <Button
              label={t('Subscribe')}
              variant="filled"
              shape="square"
              size="sm"
              onClick={() => console.log('Subscribe')}
            />
            <Button
              label={t('log_in')}
              variant="tonal"
              shape="pill"
              size="sm"
              icon={(
                <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
                </svg>
              )}
              onClick={() => window.location.href = '/login'}
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
