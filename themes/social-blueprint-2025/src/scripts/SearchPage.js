import React, { useMemo, useState } from "react";
import BrowseAll from "./BrowseAll";
import { SearchBar } from "./SearchBar";

// Post-type chips. "All" aggregates everything you want searchable.
const CHIP_OPTIONS = [
  { label: "All", types: ['tribe_events', 'article', 'podcast', 'directory', 'gd_discount', 'gd_aid_listing', 'gd_health_listing', 'gd_business', 'gd_photo_gallery', 'gd_cost_of_living'] },
  { label: "Articles", types: ['article'] },
  { label: "Podcasts", types: ['podcast'] },
  { label: "Events", types: ['tribe_events'] },
  { label: "Directory", types: ['directory'] },
  { label: "Message board", types: ['gd_discount'] }, // optional, keep/remove as needed
];

export function SearchPage({ query = "" }) {
  const [chip, setChip] = useState(CHIP_OPTIONS[0]); // default "All"

  // Base query for BrowseAll. We memoize so it doesn't refetch in a loop.
  const baseQuery = useMemo(() => ({
    post_type: chip.types,
    per_page: 10,
    orderby: 'date',
    order: 'DESC',
    s: query,                 // the actual search term
    // no taxonomy filters here
  }), [chip, query]);

  return (
    <>
      {/* Header + search input */}
      <div className="bg-schemesPrimaryFixed py-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-16">
          <h1 className="Blueprint-display-small-emphasized mb-4 text-schemesOnSurface">{`Search results '${query}'`}</h1>
          <SearchBar defaultValue={query} />
        </div>
      </div>
      <BrowseAll
        title="Results"
        endpoint="/wp-json/tsb/v1/browse"
        baseQuery={baseQuery}
        filters={[]}
        className="py-16 px-4 sm:px-8 lg:px-16 mx-auto"
      />
    </>
  );
}
