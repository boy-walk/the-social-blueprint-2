import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const SearchBar = () => {
    const [query, setQuery] = useState('');
    const { t } = useTranslation();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!query.trim()) return;
      window.location.href = `/?s=${encodeURIComponent(query)}`;
    };
  
    return (
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
    );
  };