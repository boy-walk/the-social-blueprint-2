import React from 'react';
import clsx from 'clsx';

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
  const sizeMap = {
    sm: 'w-8  h-8  text-base', // 32 px
    md: 'w-10 h-10 text-lg',   // 40 px
    lg: 'w-12 h-12 text-xl',   // 48 px
  };
  const variantMap = {
    filled: clsx(
      'bg-[var(--schemesPrimary)] text-[var(--schemesOnPrimary)]',
      'hover:bg-[var(--schemesPrimaryContainer)]',
      'active:bg-[var(--schemesPrimary)]',
      'focus-visible:ring-2 focus-visible:ring-[var(--schemesPrimaryContainer)]'
    ),
    tonal: clsx(
      'bg-schemesPrimaryFixed text-[var(--schemesOnSecondaryContainer)]',
      'hover:bg-[var(--palettesOnPrimary60)]',
      'active:bg-[var(--schemesSecondary)]',
      'focus-visible:ring-2 focus-visible:ring-[var(--schemesSecondaryContainer)]'
    ),
    outlined: clsx(
      'border border-[var(--schemesOutline)]  text-[var(--schemesOnSurface)]  bg-transparent',
      'hover:bg-[var(--schemesSurfaceVariant)]',
      'active:bg-[var(--schemesSurfaceVariant)]',
      'focus-visible:ring-2 focus-visible:ring-[var(--schemesOutline)]'
    ),
    standard: clsx(
      'text-[var(--schemesOnSurface)]  bg-schemesSurfaceContainer',
      'hover:bg-[var(--schemesSurfaceVariant)]',
      'active:bg-[var(--schemesSurfaceVariant)]',
      'focus-visible:ring-2 focus-visible:ring-[var(--schemesSurfaceVariant)]'
    ),
  };

  const disabledClasses =
    'opacity-40 pointer-events-none select-none';

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center',
        'rounded-[12px] transition-colors duration-200 text-black cursor-pointer',
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
