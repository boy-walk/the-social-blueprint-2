import React from "react";

export function SearchPage({ query, results }) {
  return (
    <div className="px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>
      {results.length === 0 && <p>No results found.</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.map((item) => (
          <a href={item.link} key={item.id} className="bg-white rounded-xl shadow p-4">
            {item.thumbnail && (
              <img src={item.thumbnail} alt={item.title} className="rounded mb-4" />
            )}
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-sm text-gray-500 capitalize">{item.type}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
