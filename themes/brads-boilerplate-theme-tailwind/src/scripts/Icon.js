import React from 'react';
import clsx from 'clsx';

/**
 * ──────────────────────────────────────────────
 * Blueprint - IconButton   (arbitrary-value colours)
 * ──────────────────────────────────────────────
 * • style : 'filled' | 'tonal' | 'outlined' | 'standard'
 * • size  : 'sm' | 'md' | 'lg'     (default → md)
 * • icon  : React node (e.g. <svg />)
 * • disabled : boolean
 *
 * State colours (hover / focus-visible / active / disabled)
 * are driven purely by CSS pseudo-classes.
 * ──────────────────────────────────────────────
 */

export function IconButton({
  style = 'filled',
  size = 'md',
  icon,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  onClick,
  ...rest
}) {
  /* ——— geometry ————————————————————— */
  const sizeMap = {
    sm: 'w-8  h-8  text-base', // 32 px
    md: 'w-10 h-10 text-lg',   // 40 px
    lg: 'w-12 h-12 text-xl',   // 48 px
  };

  /* ——— colour / state variants ————————— */
  const variantMap = {
    /* Filled ──────────────────────────── */
    filled: clsx(
      'bg-[var(--schemesPrimary)] text-[var(--schemesOnPrimary)]',
      'hover:bg-[var(--schemesPrimaryContainer)]',
      'active:bg-[var(--schemesPrimary)]',
      'focus-visible:ring-2 focus-visible:ring-[var(--schemesPrimaryContainer)]'
    ),

    /* Tonal ───────────────────────────── */
    tonal: clsx(
      'bg-[var(--schemesPrimary)] text-[var(--schemesOnSecondaryContainer)]',
      'hover:bg-[var(--schemesPrimaryFixedDim)] hover:text-[var(--schemesOnSecondary)]',
      'active:bg-[var(--schemesSecondary)]',
      'focus-visible:ring-2 focus-visible:ring-[var(--schemesSecondaryContainer)]'
    ),

    /* Outlined ────────────────────────── */
    outlined: clsx(
      'border border-[var(--schemesOutline)]  text-[var(--schemesOnSurface)]  bg-transparent',
      'hover:bg-[var(--schemesSurfaceVariant)]',
      'active:bg-[var(--schemesSurfaceVariant)]',
      'focus-visible:ring-2 focus-visible:ring-[var(--schemesOutline)]'
    ),

    /* Standard (text-only) ────────────── */
    standard: clsx(
      'text-[var(--schemesOnSurface)]  bg-transparent',
      'hover:bg-[var(--schemesSurfaceVariant)]',
      'active:bg-[var(--schemesSurfaceVariant)]',
      'focus-visible:ring-2 focus-visible:ring-[var(--schemesSurfaceVariant)]'
    ),
  };

  /* ——— disabled treatment ——————————— */
  const disabledClasses =
    'opacity-40 pointer-events-none select-none';

  /* ——— final button ———————————————— */
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center',
        'rounded-[12px] transition-colors duration-200 text-black',
        sizeMap[size],
        variantMap[style],
        disabled && disabledClasses,
        className
      )}
      onClick={onClick}
      {...rest}
    >
      {icon}
    </button>
  );
}
