import React from 'react';

export const Card = ({ children, styles }) => {
  return (
    <div className={`border border-[color:var(--schemesOutlineVariant,#C9C7BD)] border-solid flex justify-center bg-white rounded-lg shadow-[7px_6px_1px_var(--schemesOutlineVariant,#C9C7BD)] ${styles}`}>{children}</div>
  );
};
