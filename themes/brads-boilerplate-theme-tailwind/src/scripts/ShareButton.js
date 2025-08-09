// ShareButton.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import {
  ShareFat, FacebookLogo, LinkedinLogo, InstagramLogo, YoutubeLogo, LinkSimple, X as CloseIcon,
  CheckCircle as CheckIcon,
} from '@phosphor-icons/react';
import clsx from 'clsx';

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
      <div className={clsx(
        'pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-[16px]',
        'bg-[var(--schemesSurfaceContainerHigh)] text-[var(--schemesOnSurface)]',
        'border border-[var(--schemesOutlineVariant)] shadow-lg'
      )}>
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
  url,
  title = '',
  summary = '',
  className = '',
  size = 'base',
  variant = 'filled',
  shape = 'square',
}) {
  const [open, setOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '' });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const shareUrl = typeof window !== 'undefined' ? (url || window.location.href) : (url || '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title || (typeof document !== 'undefined' ? document.title : '') || '');

  const links = [
    {
      id: 'facebook', label: 'Facebook', icon: <FacebookLogo size={20} weight="fill" />, type: 'link',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`
    },
    {
      id: 'linkedin', label: 'LinkedIn', icon: <LinkedinLogo size={20} weight="fill" />, type: 'link',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    },
    { id: 'instagram', label: 'Instagram (copy link)', icon: <InstagramLogo size={20} weight="fill" />, type: 'ig' },
    { id: 'youtube', label: 'YouTube (copy link)', icon: <YoutubeLogo size={20} weight="fill" />, type: 'yt' },
    { id: 'copy', label: 'Copy link', icon: <LinkSimple size={20} weight="bold" />, type: 'copy' },
  ];

  useEffect(() => {
    function onDown(e) {
      if (!open) return;
      if (menuRef.current && !menuRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)) setOpen(false);
    }
    function onEsc(e) { if (e.key === 'Escape') setOpen(false); }
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onEsc);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  async function nativeShare() {
    try {
      await navigator.share({ title: title || document?.title || '', text: summary || '', url: shareUrl });
    } catch {
      setOpen(v => !v);
    }
  }

  async function copyLink(extraText = '') {
    const payload = extraText ? `${extraText}\n${shareUrl}` : shareUrl;
    const ok = await safeCopyToClipboard(payload);
    setSnack({ open: true, message: ok ? 'Link copied' : 'Copy failed — press ⌘/Ctrl+C' });

    if (!ok) {
      // Last‑resort prompt so users can manually copy
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
      await copyLink(title);
      // try app, then web (no official web intent)
      window.location.href = 'instagram://app';
      setTimeout(() => window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer'), 300);
      setOpen(false);
      return;
    }
    if (item.type === 'yt') {
      await copyLink(title);
      window.open('https://www.youtube.com/', '_blank', 'noopener,noreferrer');
      setOpen(false);
      return;
    }
    if (item.type === 'copy') {
      await copyLink(title);
      setOpen(false);
      return;
    }
  }

  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

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
            onClick={() => (canNativeShare ? nativeShare() : setOpen(v => !v))}
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
        onClose={() => setSnack(s => ({ ...s, open: false }))}
      />
    </>
  );
}
