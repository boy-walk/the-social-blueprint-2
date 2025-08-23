import React from 'react';
import { Card } from './Card';
import { SearchBar } from './SearchBar';
import CardText from "../../assets/card-text.svg";

export default function FrontPage() {
  return (
    <div className="bg-schemesPrimaryFixed">
      <div className="max-w-[1600px] mx-auto">
        <FrontPageGrid />
        <div className="flex justify-center flex-col items-center mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-4">
          <h2 className="Blueprint-display-small-emphasized text-schemesOnSurface text-center">
            Search The Social Blueprint
          </h2>
          <SearchBar />
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="lg:Blueprint-label-large md:Blueprint-label-medium Blueprint-label-small text-schemesOnSurfaceVariant">Trending Searches:</span>
            {['Jewish Podcasts', 'mental health help', 'family-friendly events', 'kosher recipes'].map(
              (tag) => (
                <a href={`/search/${tag}`} key={tag}>
                  <button
                    key={tag}
                    className="bg-schemesPrimaryFixedDim px-3 py-1 rounded-md Blueprint-label-large text-schemesOnPrimaryFixed hover:bg-white shadow-sm hover:cursor-pointer"
                  >
                    {tag}
                  </button>
                </a>
              )
            )}
          </div>
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
        <div className="bg-blue-100 rounded-md w-full h-full ">
          <img src={CardText} alt="Card Text" className="w-full h-full object-cover rounded-lg" />
        </div>
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
