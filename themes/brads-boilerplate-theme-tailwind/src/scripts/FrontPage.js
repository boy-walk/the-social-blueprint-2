import React from 'react';
import { Card } from './Card';
import { SearchBar } from './SearchBar';

export default function FrontPage() {
  return (
    <div className="bg-schemesPrimaryFixed">
      <FrontPageGrid />
      <div className="flex justify-center flex-col items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-4">
        <h2 className="Blueprint-display-small-emphasized text-schemesLightOnSurface text-center">
          Search The Social Blueprint
        </h2>
        <SearchBar />
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
    </div>
  );
}

export const FrontPageGrid = () => {
  return (
    <div className="px-4 grid grid-cols-5 grid-rows-4 py-8 lg:px-16 gap-4 h-150">
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
