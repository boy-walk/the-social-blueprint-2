import React from 'react';

export default function PillTag({ label, backgroundColor = '#007ea8' }) {
  return (
    <span
      className={`text-center relative inline-block p-2 md:px-2.5 py-1 md:py-2 lg:px-3 lg:py-1 rounded-xl text-white italic Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-headline-large-emphasized bg-${backgroundColor}`}
    >
      <span className="relative z-10">{label}</span>
      <span className="absolute inset-0 rounded-xl shadow-[7px_6px_1px_var(--schemesOutlineVariant,#C9C7BD)] mix-blend-multiply z-0 content-['']"></span>
    </span>
  );
}
