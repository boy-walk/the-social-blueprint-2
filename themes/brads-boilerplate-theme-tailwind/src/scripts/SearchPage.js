import React, { useState } from "react";
import { ArrowIcon } from "../../assets/icons/arrow";
import { SearchBar } from "./SearchBar";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Articles", value: "post" },
  { label: "Podcasts", value: "podcast" },
  { label: "Recipes", value: "recipe" },
  { label: "Toolkit", value: "toolkit" },
  { label: "Events", value: "event" },
];

export function SearchPage({ query, results }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredResults =
    activeFilter === "all"
      ? results
      : results.filter((item) => item.type === activeFilter);

  return (
    <main className="bg-schemesSurface text-schemesOnSurface min-h-screen">
      <section className="bg-schemesPrimaryFixed text-onPrimaryContainer py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-2">
          <h1 className="Blueprint-headline-medium">Search Results</h1>
         <SearchBar />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              className={`px-4 py-2 rounded-full text-sm border ${
                activeFilter === filter.value
                  ? "bg-primary text-white border-primary"
                  : "bg-schemesSurfaceVariant text-schemesOnSurface border-schemesOutline"
              }`}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {filteredResults.length === 0 ? (
          <p className="text-schemesOnSurfaceVariant">No results found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((item) => (
              <a
                href={item.link}
                key={item.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden"
              >
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 space-y-1">
                  <span className="text-sm text-primary font-medium capitalize">
                    {item.type}
                  </span>
                  <h2 className="text-lg Blueprint-title-small line-clamp-2">
                    {item.title}
                  </h2>
                  {item.meta?.event_date && (
                    <p className="text-sm text-schemesOnSurfaceVariant">
                      {item.meta.event_date}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}

        <p className="text-schemesOnSurfaceVariant text-sm mt-6">
          Displaying {filteredResults.length} of {results.length} results
        </p>
      </section>
    </main>
  );
}
