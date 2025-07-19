import React from 'react';

export const Card = ({ children, styles, href }) => {
  return (
    href ? (
    <a
      href={href}
    >
      <div
        className={`relative rounded-lg bg-white border border-[color:var(--schemesOutlineVariant,#C9C7BD)] shadow-none ${styles} before:absolute before:inset-0 before:rounded-lg before:shadow-[7px_6px_1px_var(--schemesOutlineVariant,#C9C7BD)] before:mix-blend-multiply before:z-0 before:content-['']`}
      >
        <div className="relative z-10 w-full h-full flex justify-center items-center">
          {children}
        </div>
      </div>
    </a>
    ) : (
      <div
      className={`relative rounded-lg bg-white border border-[color:var(--schemesOutlineVariant,#C9C7BD)] shadow-none ${styles} before:absolute before:inset-0 before:rounded-lg before:shadow-[7px_6px_1px_var(--schemesOutlineVariant,#C9C7BD)] before:mix-blend-multiply before:z-0 before:content-['']`}
    >
      <div className="relative z-10 w-full h-full flex justify-center items-center">
        {children}
      </div>
    </div>
    )
  );
};
