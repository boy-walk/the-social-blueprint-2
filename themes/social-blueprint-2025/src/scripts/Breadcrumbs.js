// components/Breadcrumbs.jsx
import React from "react";

export function Breadcrumbs({ items = [], textColour = 'text-schemesOnSurfaceVariant' }) {
  if (!items || !items.length) return null;

  const filteredItems = items.map((it) => {
    if (it.url.includes('events-calendar')) {
      return { ...it, url: it.url.replace('events-calendar', 'events') };
    }
    return it;
  })

  return (
    <nav aria-label="Breadcrumb" className="mb-3 lg:mb-6">
      <ol className={`flex flex-wrap items-center gap-1 Blueprint-label-small lg:Blueprint-label-large ${textColour}`}>
        {filteredItems.map((it, i) => (
          <React.Fragment key={i}>
            {i > 0 && <li className="px-1">
              {'>'}
            </li>}
            <li>
              {it.url ? (
                <a href={it.url} className="no-underline hover:underline ">{it.label}</a>
              ) : (
                <span>{it.label}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
