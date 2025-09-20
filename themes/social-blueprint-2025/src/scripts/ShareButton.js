// WordPress-optimized ShareButton component
import React, { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import {
  ShareFat, FacebookLogo, LinkedinLogo, InstagramLogo, YoutubeLogo, LinkSimple, X as CloseIcon,
  CheckCircle as CheckIcon,
} from '@phosphor-icons/react';
import clsx from 'clsx';

// Helper to get meta tag content
function getMetaContent(property) {
  if (typeof document === 'undefined') return '';
  const meta = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
  return meta ? meta.getAttribute('content') || '' : '';
}

// Helper to get page data from WordPress/meta tags
function getPageData() {
  return {
    title: getMetaContent('og:title') || document.title || '',
    description: getMetaContent('og:description') || '',
    image: getMetaContent('og:image') || '',
    url: getMetaContent('og:url') || window.location.href,
  };
}

// Robust copier: uses Clipboard API when available, falls back to execCommand
async function safeCopyToClipboard(text) {
  try {
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function' &&
      (window.isSecureContext || location.hostname === 'localhost')
    ) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback: hidden textarea + execCommand
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    ta.style.pointerEvents = 'none';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

function Snackbar({ open, message = 'Link copied', onClose }) {
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(onClose, 2500);
    return () => clearTimeout(id);
  }, [open, onClose]);

  return (
    <div
      className={clsx(
        'pointer-events-none fixed inset-x-0 bottom-4 z-[9999] flex justify-center transition-all',
        open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      )}
      aria-live="polite" aria-atomic="true"
    >
      <div
        className={clsx(
          'pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-[16px]',
          'bg-[var(--schemesSurfaceContainerHigh)] text-[var(--schemesOnSurface)]',
          'border border-[var(--schemesOutlineVariant)] shadow-lg'
        )}
      >
        <CheckIcon size={18} weight="bold" />
        <span className="Blueprint-label-large">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 p-1 rounded-md hover:bg-[var(--stateLayersSurfaceOpacity10)]"
          aria-label="Dismiss"
        >
          <CloseIcon size={16} />
        </button>
      </div>
    </div>
  );
}

export function ShareButton({
  // Allow manual overrides, but default to page data
  url = '',
  title = '',
  description = '',
  hashtags = '',
  className = '',
  size = 'base',
  variant = 'filled',
  shape = 'square',
}) {
  const [open, setOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '' });
  const [pageData, setPageData] = useState({ title: '', description: '', url: '', image: '' });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  // Get page data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPageData(getPageData());
    }
  }, []);

  // Use provided props or fall back to page data
  const shareUrl = url || pageData.url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || pageData.title || (typeof document !== 'undefined' ? document.title : '');
  const shareDescription = description || pageData.description || '';

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);
  const encodedDescription = encodeURIComponent(shareDescription);
  const encodedHashtags = encodeURIComponent(hashtags);

  const links = [
    {
      id: 'facebook',
      label: 'Facebook',
      icon: <FacebookLogo size={20} weight="fill" />,
      type: 'link',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}${encodedTitle ? `&quote=${encodedTitle}` : ''}`,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: <LinkedinLogo size={20} weight="fill" />,
      type: 'link',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      id: 'twitter',
      label: 'Twitter/X',
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      type: 'link',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}${encodedTitle ? `&text=${encodedTitle}` : ''}${encodedHashtags ? `&hashtags=${encodedHashtags}` : ''}`,
    },
    {
      id: 'instagram',
      label: 'Instagram (copy link)',
      icon: <InstagramLogo size={20} weight="fill" />,
      type: 'ig'
    },
    {
      id: 'youtube',
      label: 'YouTube (copy link)',
      icon: <YoutubeLogo size={20} weight="fill" />,
      type: 'yt'
    },
    {
      id: 'copy',
      label: 'Copy link',
      icon: <LinkSimple size={20} weight="bold" />,
      type: 'copy'
    },
  ];

  useEffect(() => {
    function onDown(e) {
      if (!open) return;
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    function onEsc(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onEsc);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  async function copyLink(extraText = '') {
    const payload = extraText ? `${extraText}\n${shareUrl}` : shareUrl;
    const ok = await safeCopyToClipboard(payload);
    setSnack({ open: true, message: ok ? 'Link copied' : 'Copy failed — press ⌘/Ctrl+C' });

    if (!ok) {
      const res = window.prompt('Copy this link:', payload);
      if (res !== null) setSnack({ open: true, message: 'Link ready to paste' });
    }
  }

  async function handleAction(item) {
    if (item.type === 'link') {
      window.open(item.href, '_blank', 'noopener,noreferrer');
      setOpen(false);
      return;
    }
    if (item.type === 'ig') {
      await copyLink(shareTitle);
      window.location.href = 'instagram://app';
      setTimeout(() => window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer'), 300);
      setOpen(false);
      return;
    }
    if (item.type === 'yt') {
      await copyLink(shareTitle);
      window.open('https://www.youtube.com/', '_blank', 'noopener,noreferrer');
      setOpen(false);
      return;
    }
    if (item.type === 'copy') {
      await copyLink(shareTitle);
      setOpen(false);
      return;
    }
  }

  return (
    <>
      <div className={clsx('relative inline-block', className)}>
        <span ref={btnRef}>
          <Button
            label="Share"
            size={size}
            variant={variant}
            shape={shape}
            icon={<ShareFat size={20} weight="bold" />}
            onClick={() => setOpen(true)}
            className="!bg-[var(--schemesPrimary)] !text-[var(--schemesOnPrimary)]"
          />
        </span>

        {open && (
          <div
            ref={menuRef}
            className={clsx(
              'absolute right-0 mt-2 min-w-[14rem] z-50',
              'rounded-2xl border border-[var(--schemesOutlineVariant)]',
              'bg-[var(--schemesSurfaceContainerHigh)] shadow-lg p-3 flex flex-col gap-2'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="Blueprint-title-small text-[var(--schemesOnSurface)]">Share this page</span>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-md hover:bg-[var(--stateLayersSurfaceOpacity10)]"
                aria-label="Close"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            {/* Optional: Show what's being shared */}
            {shareTitle && (
              <div className="text-xs text-[var(--schemesOnSurfaceVariant)] mb-2 p-2 bg-[var(--schemesSurfaceContainer)] rounded-lg">
                <div className="font-medium truncate">{shareTitle}</div>
                {shareDescription && (
                  <div className="truncate mt-1">{shareDescription}</div>
                )}
              </div>
            )}

            {links.map((item) => (
              <Button
                key={item.id}
                label={item.label}
                size="sm"
                variant="text"
                shape="square"
                icon={item.icon}
                onClick={() => handleAction(item)}
                className="w-full justify-start !px-2"
              />
            ))}
          </div>
        )}
      </div>

      <Snackbar
        open={snack.open}
        message={snack.message}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      />
    </>
  );
}