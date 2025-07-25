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
  error = false,
  disabled = false,
  required = false,
  style = 'outlined',
  type = 'text',
  multiline = false,
  name,
  id,
}) {
  const inputId = id || useId();
  const containerBase =
    'relative w-full text-schemesOnSurface Blueprint-body-medium';

  const variantMap = {
    outlined:
      'border border-schemesOutline bg-transparent hover:border-schemesOnSurfaceVariant ' +
      'focus-within:border-schemesPrimaryContainer',
    filled:
      'bg-schemesSurfaceVariant hover:bg-schemesSurface focus-within:bg-schemesSurface',
  };

  const errorClasses = error
    ? 'border-schemesError focus-within:border-schemesError'
    : '';

  const disabledClasses = disabled
    ? 'opacity-50 pointer-events-none cursor-not-allowed'
    : '';

  const labelBase =
    'absolute left-4 -translate-y-1/2 px-1 transition-all duration-150 leading-tight' +
    'Blueprint-label-medium pointer-events-none bg-schemesPrimaryFixedDim peer-focus:bg-[#0799D0]';

  const labelError = error
    ? 'text-schemesError peer-focus:text-schemesError'
    : '';

  const inputBase =
    'peer w-full py-3 pr-4 pl-3 bg-transparent outline-none ' +
    'text-schemesOnSurface placeholder:opacity-0 ' +
    'disabled:bg-transparent';

  return (
    <div className={clsx(containerBase, variantMap[style], errorClasses, disabledClasses)}>
      {leadingIcon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant pointer-events-none">
          {leadingIcon}
        </span>
      )}
      {multiline ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder || label}
          required={required}
          disabled={disabled}
          className={clsx(inputBase, 'resize-none h-32')}
        />
      ) : (
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
        />)}
      <label htmlFor={inputId} className={clsx(labelBase, labelError)}>
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
