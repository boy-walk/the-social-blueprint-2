import React, { useState } from "react";
import { ContentCard } from "./ContentCard";
import { SearchBar } from "./SearchBar";

const FILTERS = ["All", "Article", "Podcast", "Recipe", "Toolkit", "Event"];
const RESULTS_PER_PAGE = 10;

export function SearchPage({ query, results }) {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = selectedFilter === "All"
    ? results
    : results.filter((r) => r.type.toLowerCase() === selectedFilter.toLowerCase());

  const totalPages = Math.ceil(filtered.length / RESULTS_PER_PAGE);
  const paginatedResults = filtered.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  return (
    <>
      {/* Header */}
      <div className="bg-schemesPrimaryFixed py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="Blueprint-display-small-emphasized mb-3 text-schemesOnSurface">Search Results</h1>
          <SearchBar />
        </div>
      </div>

      {/* Body */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-8 mt-4">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setSelectedFilter(filter);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-full border Blueprint-label-large ${
                  selectedFilter === filter
                    ? "bg-black text-white"
                    : "bg-white text-schemesOnSurface border-gray-300"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {paginatedResults.length === 0 && <p>No results found.</p>}

          {/* Content Cards */}
          <div className="flex flex-wrap gap-[24px] justify-start items-start">
            {paginatedResults.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] max-w-[280px]"
              >
                <ContentCard
                  image={item.thumbnail}
                  title={item.title}
                  type={item.type}
                  subtitle={item.meta?.author || item.meta?.location || ""}
                  badge={
                    item.type.toLowerCase() === "podcast"
                      ? "New Interview"
                      : item.type.toLowerCase() === "blog"
                      ? "Blog"
                      : item.type.toLowerCase() === "event"
                      ? "Event"
                      : null
                  }
                  href={item.link}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-10 h-10 rounded-full text-sm font-medium ${
                    num === currentPage
                      ? "bg-black text-white"
                      : "bg-white border border-gray-300 text-gray-700"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          )}

          {/* Count */}
          <p className="text-sm text-schemesOnSurfaceVariant mt-6">
            Showing {(currentPage - 1) * RESULTS_PER_PAGE + 1}–
            {Math.min(currentPage * RESULTS_PER_PAGE, filtered.length)} of {filtered.length} result
            {filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </>
  );
}
