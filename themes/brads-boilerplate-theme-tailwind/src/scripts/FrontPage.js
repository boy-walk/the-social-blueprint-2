import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from './Card';

export default function FrontPage() {
  return (
    <div className="bg-schemesInversePrimary">
      <FrontPageGrid />
      <SearchBar />
    </div>
  );
}


const SearchBar = () => {
  const [query, setQuery] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `/?s=${encodeURIComponent(query)}`;
  };

  return (
    <div className="bg-container-dark flex flex-col items-center justify-center gap-8 py-16 px-4 sm:px-6">
      <h2 className="Blueprint-display-small-emphasized font-bold text-xl text-[#474740]">
        Search The Social Blueprint
      </h2>

      <form className="w-full max-w-xl" onSubmit={handleSubmit}>
        <label htmlFor="default-search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full py-3 pl-10 pr-4 text-sm text-gray-900 border border-border-light rounded-lg bg-schemesSurfaceContainerLowest focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search podcasts, events, resources..."
            onChange={(e) => setQuery(e.target.value)}
            required
          />
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="text-sm text-gray-600">Trending Searches:</span>
        {['Jewish Podcasts', 'mental health help', 'family-friendly events', 'kosher recipes'].map(
          (tag) => (
            <button
              key={tag}
              className="bg-white border border-gray-300 px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100 shadow-sm"
              onClick={() => {
                setQuery(tag);
                window.location.href = `/?s=${encodeURIComponent(tag)}`;
              }}
            >
              {tag}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export const FrontPageGrid = () => {
  return (
    <div className="grid grid-cols-5 grid-rows-4 py-8 px-16 gap-4 h-150">
      <Card styles="col-span-1 row-span-2 p-2">
        <div className="bg-green-100 rounded-md w-full h-full"></div>
      </Card>
      <Card styles="col-span-2 row-span-2 p-2">
        <div className="bg-blue-100 rounded-md w-full h-full "></div>
      </Card>
      <Card styles="col-span-1 row-span-3 p-2">
        <div className="bg-indigo-200 rounded-md w-full h-full"></div>
      </Card>
      <Card styles="col-span-1 row-span-2 p-2">
        <div className="bg-pink-200 rounded-md w-full h-full"></div>
      </Card>
      <Card styles="col-span-2 row-span-2 p-2">
        <div className="bg-blue-800 rounded-md w-full h-full"></div>
      </Card>
      <Card styles="col-span-1 row-span-2 p-2">
        <div className="bg-pink-200 rounded-md w-full h-full"></div>
      </Card>
      <Card styles="col-span-1 row-span-2 p-2">
        <div className="bg-green-200 rounded-md w-full h-full"></div>
      </Card>
      <Card styles="col-span-1 row-span-1 p-2">
        <div className="bg-cyan-800 rounded-md w-full h-full"></div>
      </Card>
    </div>
  );
};
