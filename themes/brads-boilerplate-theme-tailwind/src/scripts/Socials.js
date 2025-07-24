import { FacebookLogoIcon, InstagramLogoIcon, LinkedinLogoIcon, SpotifyLogoIcon, YoutubeLogoIcon } from "@phosphor-icons/react"
import { IconButton } from "./Icon"
import { useTranslation } from "react-i18next";

export const Socials = () => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-4">
      <IconButton
        icon={<FacebookLogoIcon size={22} weight="bold" />}
        style="tonal"
        size="sm"
        onClick={() => window.open('https://www.facebook.com/TheSocialBlueprintInc/', '_blank')}
        aria-label={t('follow_us_on_facebook')}
      />
      <IconButton
        icon={<YoutubeLogoIcon size={22} weight="bold" />}
        style="tonal"
        size="sm"
        onClick={() => window.open('https://www.youtube.com/@thesocialblueprint', '_blank')}
        aria-label={t('follow_us_on_youtube')}
      />
      <IconButton
        icon={<InstagramLogoIcon size={22} weight="bold" />}
        style="tonal"
        size="sm"
        onClick={() => window.open('https://www.instagram.com/thesocialblueprintinc', '_blank')}
        aria-label={t('follow_us_on_instagram')}
      />
      <IconButton
        icon={<LinkedinLogoIcon size={22} weight="bold" />}
        style="tonal"
        size="sm"
        onClick={() => window.open('https://www.linkedin.com/company/the-social-blueprint-inc', '_blank')}
        aria-label={t('follow_us_on_linkedin')}
      />
      <IconButton
        icon={<SpotifyLogoIcon size={22} weight="bold" />}
        style="tonal"
        size="sm"
        onClick={() => window.open('https://open.spotify.com/show/5RwgbA2ILk2LGD3io8LWFj', '_blank')}
        aria-label={t('follow_us_on_spotify')}
      />
    </div>
  )
}