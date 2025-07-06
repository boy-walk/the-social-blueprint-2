import React from 'react';

export const MoreInterviews = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <section className="py-12">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold">More Interviews</h2>
        <img src="/assets/icons/arrow-icon.svg" alt="" className="w-6 h-6" />
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:gap-4">
        {items.map(({ id, title, link, thumbnail }) => (
          <a
            key={id}
            href={link}
            className="flex flex-col w-full md:w-1/3 rounded-2xl overflow-hidden shadow-[7px_6px_1px_var(--schemesOutlineVariant,#C9C7BD)] border border-[color:var(--schemesOutlineVariant,#C9C7BD)] bg-white transition hover:shadow-lg"
          >
            <div className="relative w-full h-64">
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-white text-xs font-semibold text-gray-700 px-3 py-1 rounded-full shadow">
                Event
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm font-medium text-[#555] mt-1">
                New podcast
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}