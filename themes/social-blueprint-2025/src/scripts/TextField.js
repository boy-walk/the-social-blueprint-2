import React, { useId } from 'react';
import clsx from 'clsx';

export function TextField({
  label = 'Label',
  value = '',
  onChange,
  placeholder = '',
  supportingText = '',
  leadingIcon = null,
  trailingIcon = null,
  error = '',
  disabled = false,
  required = false,
  style = 'outlined',
  type = 'text',
  multiline = false,
  name,
  id,
}) {
  const inputId = id || useId();
  const msgId = `${inputId}-msg`;
  const hasError = typeof error === 'string' && error.length > 0;
  const helperText = hasError ? error : supportingText;

  const containerBase =
    'relative w-full rounded-xl text-schemesOnSurface Blueprint-body-medium';

  const variantMap = {
    outlined:
      'border border-schemesOutline bg-schemesSurfaceContainerLow hover:border-schemesOnSurfaceVariant ' +
      'focus-within:border-schemesPrimaryContainer',
    filled:
      'bg-schemesSurfaceVariant hover:bg-schemesSurface focus-within:bg-schemesSurface',
  };

  const errorClasses = hasError
    ? 'border-schemesError focus-within:border-schemesError'
    : '';

  const disabledClasses = disabled
    ? 'opacity-50 pointer-events-none cursor-not-allowed'
    : '';

  const labelBase =
    'absolute left-4 -translate-y-1/2 px-1 transition-all duration-150 leading-tight ' +
    'Blueprint-label-medium pointer-events-none bg-schemesPrimaryFixed peer-focus:bg-schemesSurfaceContainerLow rounded-sm';

  const inputBase =
    'peer w-full py-3 pr-4 pl-3 bg-transparent outline-none ' +
    'text-schemesOnSurface placeholder:opacity-0 disabled:bg-transparent';

  const commonProps = {
    id: inputId,
    name,
    value,
    onChange,
    placeholder: placeholder || label,
    required,
    disabled,
    'aria-invalid': hasError ? 'true' : undefined,
    'aria-describedby': helperText ? msgId : undefined,
    className: multiline
      ? clsx(inputBase, 'resize-none')
      : inputBase,
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className={clsx(
          containerBase,
          variantMap[style],
          errorClasses,
          disabledClasses
        )}
      >
        {leadingIcon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant pointer-events-none">
            {leadingIcon}
          </span>
        )}

        {multiline ? (
          <textarea {...commonProps} />
        ) : (
          <input type={type} {...commonProps} />
        )}

        <label htmlFor={inputId} className={labelBase}>
          {label}
        </label>

        {trailingIcon && (
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant hover:text-schemesOnSurface"
            tabIndex={-1}
          >
            {trailingIcon}
          </button>
        )}
      </div>

      {helperText ? (
        <p
          id={msgId}
          className={clsx(
            'ml-4 Blueprint-body-small',
            hasError ? 'text-schemesError' : 'text-schemesOnSurfaceVariant'
          )}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
