import React from 'react';
import clsx from 'clsx';

export function Button({
  className = '',
  label = 'Label',
  size = 'base',
  variant = 'filled',
  shape = 'square',
  icon,
  disabled = false,
  onClick = () => { },
  type = 'button',
}) {
  const sizeStyles = {
    xs: 'px-3 py-1.5 Blueprint-label-large',
    sm: 'px-4 py-2 Blueprint-label-large',
    base: 'px-4 py-2.5 Blueprint-title-medium',
    lg: 'px-6 py-4 Blueprint-headline-small',
    xl: 'px-8 py-6 Blueprint-headline-large',
  }[size];

  const rounded = {
    square: { xs: 'rounded-xl', sm: 'rounded-xl', base: 'rounded-[16px]', lg: 'rounded-[16px]', xl: 'rounded-[28px]' },
    pill: { xs: 'rounded-[100px]', sm: 'rounded-[100px]', base: 'rounded-[100px]', lg: 'rounded-[100px]', xl: 'rounded-[100px]' },
  };

  const variantStyles = {
    filled: 'bg-[var(--schemesPrimary)] text-[var(--schemesOnPrimary)] hover:bg-[var(--palettesPrimary40)]',
    tonal: 'bg-[var(--schemesPrimaryFixed)] text-[var(--schemesOnPrimaryFixedVariant)] hover:bg-[var(--schemesPrimaryFixedDim)]',
    outline: 'border border-[var(--schemesOnPrimary)] text-[var(--schemesOnPrimary)] hover:bg-[var(--palettesOnPrimary40)]',
    elevated: 'bg-[var(--schemesSurfaceContainerHigh)] text-[var(--schemesPrimary)] shadow-3x3 hover:bg-[var(--stateLayersSurfaceContainerHighOpacity08)]',
    text: 'bg-transparent text-[var(--schemesPrimary)] hover:bg-[var(--palettesPrimary60)]',
  }[variant];

  // cursor + disabled handling
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';
  const baseCursor = disabled ? '' : 'cursor-pointer';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center gap-2 transition-colors duration-150',
        baseCursor,            // pointer on hover for enabled buttons
        sizeStyles,
        rounded[shape][size],
        variantStyles,
        disabledStyles,        // overrides cursor when disabled
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="Blueprint-label-large">{label}</span>
    </button>
  );
}
