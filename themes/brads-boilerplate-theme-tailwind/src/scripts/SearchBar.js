import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon } from "@phosphor-icons/react"

export const SearchBar = () => {
  const [query, setQuery] = useState();
  const { t } = useTranslation();

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('s');
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, []);

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
          <div className="bg-schemesPrimaryFixed rounded-lg p-1.5">
            <MagnifyingGlassIcon size={22} className="rounded-sm text-schemesOnPrimaryFixedVariant" />
          </div>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full py-3 pl-13 pr-4 Blueprint-body-large text-schemesOnSurfaceVariant border border-border-light rounded-xl bg-schemesSurfaceContainerLowest focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search podcasts, events, resources..."
          onChange={(e) => setQuery(e.target.value)}
          required
          value={query || ''}
        />
      </div>
    </form>
  );
};