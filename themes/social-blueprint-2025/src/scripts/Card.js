import React from 'react';

export const Card = ({ children, styles, href }) => {
  const baseClass = `relative rounded-xl bg-white border border-[color:var(--schemesOutlineVariant,#C9C7BD)] shadow-none ${styles} before:absolute before:inset-0 before:rounded-lg before:mix-blend-multiply before:z-0 before:content-['']`;

  const innerClass = "relative z-10 w-full h-full";

  const content = (
    <div className={baseClass}>
      <div className={innerClass}>
        {children}
      </div>
    </div>
  );

  return href ? <a href={href} className="h-full block">{content}</a> : content;
};
