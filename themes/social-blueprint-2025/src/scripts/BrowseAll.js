// components/BrowseAll.jsx
import React, { useEffect, useMemo, useState } from "react";
import { ContentCard } from "./ContentCard";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { getBadge } from "./getBadge";

// ---- stable module-level defaults ----
const EMPTY = Object.freeze([]);
const DEFAULT_BASE_QUERY = Object.freeze({
  per_page: 10,
  orderby: "date",
  order: "DESC",
});
const DEFAULT_GRID_HEIGHTS = Object.freeze({
  base: "h-[18rem]",
  md: "md:h-[20rem]",
  lg: "lg:h-[22rem]",
});

export default function BrowseAll({
  title = "Browse all",
  endpoint = "/wp-json/tsb/v1/browse",
  baseQuery = DEFAULT_BASE_QUERY,
  filters = EMPTY,                 // <-- stable, not recreated each render
  initialFilter = "All",
  gridHeights = DEFAULT_GRID_HEIGHTS,
}) {
  const [active, setActive] = useState(initialFilter);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total_pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const perPage = baseQuery.per_page ?? 10;

  // stable key for filters so a new [] reference doesn't retrigger everything
  const filtersKey = useMemo(
    () => (filters && filters.length ? JSON.stringify(filters) : "[]"),
    [filters]
  );

  // Build payload from baseQuery + active filter
  const payload = useMemo(() => {
    const p = { ...baseQuery, page, per_page: perPage };

    // merge base tax + chip tax
    const baseTax = Array.isArray(baseQuery.tax)
      ? baseQuery.tax
      : baseQuery.tax
        ? [baseQuery.tax]
        : EMPTY;

    let chipTax = EMPTY;
    if (active && active !== "All") {
      const f = (filters || EMPTY).find((x) => x.label === active);
      if (f?.tax) chipTax = Array.isArray(f.tax) ? f.tax : [f.tax];
    }

    p.tax = [...baseTax, ...chipTax];
    if (baseQuery.tax_relation) p.tax_relation = baseQuery.tax_relation;

    return p;
    // depend on filtersKey (structural) rather than filters reference
  }, [baseQuery, active, page, perPage, filtersKey]);

  // stable key for effect dependency
  const payloadKey = useMemo(() => JSON.stringify(payload), [payload]);

  // Fetch helper with abort
  useEffect(() => {
    let isMounted = true;
    const ac = new AbortController();
    setLoading(true);
    setErr("");

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ac.signal,
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = await r.json();
        if (isMounted)
          setData({
            items: json.items || [],
            total_pages: json.total_pages || 1,
            total: json.total || 0,
          });
      })
      .catch((e) => isMounted && setErr(e.message || "Failed to load"))
      .finally(() => isMounted && setLoading(false));

    return () => {
      isMounted = false;
      ac.abort();
    };
    // depend on endpoint + *key*, not the object itself
  }, [payloadKey]);

  // Reset page to 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [active]);

  const totalPages = Math.max(1, data.total_pages);

  const skeletons = Array.from({ length: perPage }).map((_, i) => (
    <div
      key={`sk-${i}`}
      className={`rounded-xl border border-[var(--schemesOutlineVariant)] overflow-hidden ${gridHeights.base} ${gridHeights.md} ${gridHeights.lg}`}
    >
      <div className="w-full h-1/2 bg-[var(--schemesSurfaceContainerHighest)] animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 bg-[var(--schemesSurfaceContainerHigh)] animate-pulse rounded" />
        <div className="h-3 w-1/2 bg-[var(--schemesSurfaceContainerHigh)] animate-pulse rounded" />
        <div className="h-3 w-2/3 bg-[var(--schemesSurfaceContainerHigh)] animate-pulse rounded" />
      </div>
    </div>
  ));

  return (
    <section className="py-16 px-4 sm:px-8 lg:px-16 mx-auto">
      <h2 className="Blueprint-headline-medium mb-6">{title}</h2>

      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {[{ label: "All" }, ...filters.filter((f) => f.label !== "All")].map(
            ({ label }) => (
              <button
                key={label}
                onClick={() => setActive(label)}
                className={`px-4 py-1.5 text-sm rounded-full border transition ${active === label
                  ? "bg-[var(--schemesPrimary)] text-white"
                  : "bg-[var(--schemesSurface)] text-[var(--schemesOnSurface)] border-[var(--schemesOutlineVariant)]"
                  }`}
              >
                {label}
              </button>
            )
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-stretch">
        {loading
          ? skeletons
          : data.items.map((post) => (
            <div
              key={post.id}
              className={`overflow-hidden ${gridHeights.base} ${gridHeights.md} ${gridHeights.lg}`}
            >
              <ContentCard
                image={post.thumbnail}
                title={post.title}
                badge={getBadge(post.post_type)}
                type={post.post_type}
                subtitle={post.date}
                href={post.permalink}
                fullHeight
              />
            </div>
          ))}
      </div>

      {!loading && !err && data.items.length === 0 && (
        <p className="Blueprint-body-large text-[var(--schemesOnSurfaceVariant)] mt-6">
          No results found.
        </p>
      )}
      {err && (
        <p className="Blueprint-body-large text-[var(--schemesError)] mt-6">
          Error: {err}
        </p>
      )}

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="p-2 rounded-full bg-[var(--schemesSurface)] border border-[var(--schemesOutlineVariant)] disabled:opacity-30"
        >
          <CaretLeftIcon size={24} weight="bold" />
        </button>
        <span className="text-sm font-medium">
          {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="p-2 rounded-full bg-[var(--schemesSurface)] border border-[var(--schemesOutlineVariant)] disabled:opacity-30"
        >
          <CaretRightIcon size={24} weight="bold" />
        </button>
      </div>
    </section>
  );
}
