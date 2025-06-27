import React from 'react';

export default function PillTag({ label, backgroundColor = '#007ea8' }) {
  return (
    <span
      className="inline-block px-3 py-1 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,0.2)] text-white italic font-semibold text-xl"
      style={{ backgroundColor }}
    >
      {label}
    </span>
  );
}
