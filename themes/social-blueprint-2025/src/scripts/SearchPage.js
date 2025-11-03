import React, { useMemo, useState } from "react";
import BrowseAll from "./BrowseAll";
import { SearchBar } from "./SearchBar";

// Post-type chips. "All" aggregates everything you want searchable.
const CHIP_OPTIONS = [
  { label: "All", types: ['tribe_events', 'article', 'podcast', 'directory', 'gd_discount', 'gd_aid_listing', 'gd_health_listing', 'gd_business', 'gd_photo_gallery', 'gd_cost_of_living'] },
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
      <div className="bg-schemesPrimaryFixed">
        <div className="max-w-[1600px] py-16 px-4 sm:px-8 lg:px-16 mx-auto">
          <h1 className="Blueprint-display-small-emphasized mb-4 text-schemesOnSurface">{`Search results '${query}'`}</h1>
          <SearchBar defaultValue={query} />
        </div>
      </div>
      <BrowseAll
        title="Results"
        endpoint="/wp-json/tsb/v1/browse"
        baseQuery={baseQuery}
        filters={[
          { label: "Article", post_type: "article" },
          { label: "Interview", post_type: "podcast" },
          { label: "Aid Listing", post_type: "gd_aid_listing" },
          { label: "Health Listing", post_type: "gd_health_listing" },
          { label: "Message Board", post_type: "gd_discount" },
          { label: "Event", post_type: "tribe_events" },
        ]}
        className="py-16 px-4 sm:px-8 lg:px-16 mx-auto max-w-[1600px]"
      />
    </>
  );
}
