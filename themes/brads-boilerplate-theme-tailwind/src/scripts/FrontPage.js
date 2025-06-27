import React, { useState } from 'react';
import { FrontPageGrid } from './FrontPageGrid';
import { useTranslation } from 'react-i18next';

function FrontPage() {
  return (
    <div className="bg-background-dark">
      <FrontPageGrid />
      <SearchBar />
    </div>
  );
}

export default FrontPage;

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `/search?s=${encodeURIComponent(query)}`;
  };

  return (
    <div className="bg-container-dark flex flex-col items-center justify-center gap-4 py-16 px-8">
      <div className="ibm-plex-sans-condensed-bold text-center text-[#474740]">
        Search The Social Blueprint
      </div>
      <form class="w-auto mx-auto" onSubmit={handleSubmit}>
        <label
          for="default-search"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 start-1 flex items-center ps-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            class="block w-110 p-4 ps-10 text-sm text-gray-900 border border-border-light rounded-lg bg-container-lighter focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search Mockups, Logos..."
            onChange={(e) => setQuery(e.target.value)}
            required
          />
        </div>
      </form>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="text-sm text-gray-600">Trending Searches:</div>
        {['Jewish Podcasts', 'mental health help', 'family-friendly events', 'kosher recipes'].map(
          (tag) => (
            <button
              key={tag}
              className="bg-white border border-gray-300 px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100 shadow-3x3"
            >
              {tag}
            </button>
          )
        )}
      </div>
    </div>
  );
};
