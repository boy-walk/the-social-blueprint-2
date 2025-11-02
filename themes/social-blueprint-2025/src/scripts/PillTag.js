import React from 'react';

export default function PillTag({ label, backgroundColor = '#007ea8' }) {
  return (
    <span
      className={`text-center relative inline-block px-3 sm:py-2 md:py-3 rounded-xl text-white italic Blueprint-title-large-emphasized bg-${backgroundColor}`}
    >
      <span className="relative z-10">{label}</span>
      <span className="absolute inset-0 rounded-xl shadow-[7px_6px_1px_var(--schemesOutlineVariant,#C9C7BD)] mix-blend-multiply z-0 content-['']"></span>
    </span>
  );
}
