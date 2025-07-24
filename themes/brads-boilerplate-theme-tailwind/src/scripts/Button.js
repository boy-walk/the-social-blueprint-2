import React from 'react';
import clsx from 'clsx';

/**
 * Blueprint Button
 * --------------------------------------------------
 * ‣ size:     xs | sm | base | lg | xl
 * ‣ variant:  filled | tonal | outline | elevated | text
 * ‣ shape:    square | pill
 */
export function Button({
  className = '',
  label = 'Label',
  size = 'base',
  variant = 'filled',
  shape = 'square',
  icon,
  disabled = false,
  onClick = () => { },
}) {
  /* ---------- size → padding / radius / typography ---------- */
  const sizeStyles = {
    xs: 'px-3  py-1.5 Blueprint-label-large',
    sm: 'px-4  py-2 Blueprint-label-large',
    base: 'px-4  py-2.5 Blueprint-title-medium',
    lg: 'px-6  py-3 Blueprint-headline-small',
    xl: 'px-8  py-6 Blueprint-headline-large',
  }[size];

  /* ---------- square vs pill ---------- */
  const rounded = {
    square: {
      xs: 'rounded-xl',
      sm: 'rounded-xl',
      base: 'rounded-[16px]',
      lg: 'rounded-[28px]',
      xl: 'rounded-[28px]',
    },
    pill: {
      xs: 'rounded-[100px]',
      sm: 'rounded-[100px]',
      base: 'rounded-[100px]',
      lg: 'rounded-[100px]',
      xl: 'rounded-[100px]',
    },
  };

  /* ---------- colour / elevation ----------
     (uses CSS custom props already in :root)   */
  const variantStyles = {
    /* solid brand */
    filled: clsx(
      'bg-[var(--schemesPrimary)]',               // normal
      'text-[var(--schemesOnPrimary)]',         // text
      'hover:bg-[var(--schemesPrimaryContainer)]'
    ),

    /* light-tint “tonal” button */
    tonal: clsx(
      'bg-[var(--schemesPrimaryFixed)]',
      'text-[var(--schemesOnPrimaryFixedVariant)]',
      'hover:bg-[var(--schemesPrimaryFixedDim)]'
    ),

    /* outline – transparent, takes on-surface text */
    outline: clsx(
      'border',
      'border-[var(--schemesOnPrimary]',
      'text-[var(--schemesOnPrimary)]',
      'hover:bg-[var(--stateLayersOnSurfaceOpacity08)]'
    ),

    /* elevated – subtle card-like surface with shadow */
    elevated: clsx(
      'bg-[var(--schemesSurfaceContainerHigh)]',
      'text-[var(--schemesPrimary)]',
      'shadow-3x3',
      'hover:bg-[var(--stateLayersSurfaceContainerHighOpacity08)]'
    ),

    /* text-only button */
    text: clsx(
      'bg-transparent',
      'text-[var(--schemesPrimary)]',
      'hover:bg-[var(--stateLayersPrimaryOpacity08)]'
    ),
  }[variant];

  /* ---------- disabled overlay ---------- */
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center gap-2 transition-colors duration-150',
        sizeStyles,
        rounded[shape][size],
        variantStyles,
        disabledStyles,
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="Blueprint-label-large">{label}</span>
    </button>
  );
}
