import React, { useId } from 'react';
import clsx from 'clsx';

/**
 * Blueprint TextField
 * --------------------------------------------------------------
 * -   Styles:  'outlined' | 'filled'
 * -   States:  enabled · hover · focus · error · disabled
 * -   Features: floating label, leading / trailing icon,
 *               supporting text, required flag
 * -------------------------------------------------------------- */

export function TextField({
  label = 'Label',
  value = '',
  onChange,
  placeholder = '',
  supportingText = '',
  leadingIcon = null,
  trailingIcon = null,
  error = false,
  disabled = false,
  required = false,
  style = 'outlined', // 'outlined' | 'filled'
  type = 'text',
  name,
  id,
}) {
  const inputId = id || useId();
  const hasText = Boolean(value);

  /* ──────────────────────────
     Variant / state class maps
  ────────────────────────── */
  const containerBase =
    'relative w-full text-schemesOnSurface Blueprint-body-medium';

  const variantMap = {
    outlined:
      'border border-schemesOutline rounded-lg bg-transparent hover:border-schemesOnSurfaceVariant ' +
      'focus-within:border-schemesPrimary',
    filled:
      'bg-schemesSurfaceVariant rounded-lg hover:bg-schemesSurface focus-within:bg-schemesSurface',
  };

  const errorClasses = error
    ? 'border-schemesError focus-within:border-schemesError'
    : '';

  const disabledClasses = disabled
    ? 'opacity-50 pointer-events-none cursor-not-allowed'
    : '';

  /* ──────────────────────────
     Floating-label positioning
  ────────────────────────── */
  const labelBase =
    'absolute left-4 -translate-y-1/2 px-1 transition-all duration-150 ' +
    'Blueprint-body-large text-schemesOnPrimary pointer-events-none bg-black peer-focus:bg-[#0799D0]';

  const labelError = error
    ? 'text-schemesError peer-focus:text-schemesError'
    : '';

  /* ──────────────────────────
     Input element classes
  ────────────────────────── */
  const inputBase =
    'peer w-full py-3 pr-4 pl-3 bg-transparent outline-none ' +
    'text-schemesOnSurface placeholder:opacity-0 ' +
    'focus:placeholder:opacity-100 disabled:bg-transparent';

  return (
    <div className={clsx(containerBase, variantMap[style], errorClasses, disabledClasses)}>
      {/* Leading icon */}
      {leadingIcon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant pointer-events-none">
          {leadingIcon}
        </span>
      )}

      {/* Input */}
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        required={required}
        disabled={disabled}
        className={inputBase}
      />

      {/* Floating label */}
      <label htmlFor={inputId} className={clsx(labelBase, labelError)}>
        {label}
      </label>

      {/* Trailing icon */}
      {trailingIcon && (
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant hover:text-schemesOnSurface"
          tabIndex={-1}
        >
          {trailingIcon}
        </button>
      )}

      {/* Supporting text */}
      {supportingText && (
        <p
          className={clsx(
            'mt-1 ml-4 Blueprint-body-small',
            error ? 'text-schemesError' : 'text-schemesOnSurfaceVariant'
          )}
        >
          {supportingText}
        </p>
      )}
    </div>
  );
}
