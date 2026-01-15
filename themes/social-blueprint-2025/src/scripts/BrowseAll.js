// components/BrowseAll.jsx
import React, { useEffect, useMemo, useState } from "react";
import { ContentCard } from "./ContentCard";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { getBadge } from "./getBadge";
import { Button } from "./Button";
import { IconButton } from "./Icon";

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
  filters = EMPTY,
  initialFilter = "All",
  gridHeights = DEFAULT_GRID_HEIGHTS,
  className = "",
}) {
  const [active, setActive] = useState(initialFilter);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total_pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const perPage = baseQuery.per_page ?? 10;

  const filtersKey = useMemo(
    () => (filters && filters.length ? JSON.stringify(filters) : "[]"),
    [filters]
  );

  // payload: baseQuery is the default; chip values (if present) OVERRIDE specific fields
  const payload = useMemo(() => {
    const p = { ...baseQuery, page, per_page: perPage };

    // helper normalizers
    const normalizePT = (v) => {
      if (!v) return [];
      if (Array.isArray(v)) return v.slice();
      if (typeof v === "string") return [v];
      return [];
    };
    const normalizeTax = (t) => {
      if (!t) return [];
      return Array.isArray(t) ? t.slice() : [t];
    };

    // find active chip (if not "All")
    const chip = active && active !== "All" ? (filters || EMPTY).find((x) => x.label === active) : null;

    // POST_TYPE override logic: chip replaces baseQuery.post_type if present
    const basePT = normalizePT(baseQuery.post_type);
    const chipPT = chip ? normalizePT(chip.post_type) : [];
    if (chipPT.length) {
      p.post_type = chipPT;
    } else if (basePT.length) {
      p.post_type = basePT;
    } else {
      delete p.post_type;
    }

    // TAX override logic: chip replaces baseQuery.tax if present
    const baseTax = normalizeTax(baseQuery.tax);
    const chipTax = chip ? normalizeTax(chip.tax) : [];
    if (chipTax.length) {
      p.tax = chipTax;
    } else if (baseTax.length) {
      p.tax = baseTax;
    } else {
      delete p.tax;
    }

    // tax_relation: chip can override, else baseQuery
    if (chip && chip.tax_relation) {
      p.tax_relation = chip.tax_relation;
    } else if (baseQuery.tax_relation) {
      p.tax_relation = baseQuery.tax_relation;
    } else {
      delete p.tax_relation;
    }

    // preserve other baseQuery keys that may be useful for the endpoint
    if (baseQuery.meta_key) p.meta_key = baseQuery.meta_key;
    if (baseQuery.tribeHideRecurrence) p.tribeHideRecurrence = baseQuery.tribeHideRecurrence;
    if (baseQuery.s) p.s = baseQuery.s;

    return p;
  }, [baseQuery, active, page, perPage, filtersKey]);

  const payloadKey = useMemo(() => JSON.stringify(payload), [payload]);

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
  }, [payloadKey, endpoint]);

  useEffect(() => {
    setPage(1);
  }, [active]);

  const totalPages = Math.max(1, data.total_pages);

  const skeletons = Array.from({ length: perPage }).map((_, i) => (
    <div
      key={`sk-${i}`}
      className={`rounded-xl border border-[var(--schemesOutlineVariant)] ${gridHeights.base} ${gridHeights.md} ${gridHeights.lg}`}
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
    <section className={className}>
      <h2 className="Blueprint-headline-medium mb-6">{title}</h2>

      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {[{ label: "All" }, ...filters.filter((f) => f.label !== "All")].map(({ label }) => (
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
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 justify-items-stretch">
        {loading
          ? skeletons
          : data.items.map((post) => (
            <div
              key={post.id}
              className={`${gridHeights.base} ${gridHeights.md} ${gridHeights.lg} overflow-hidden rounded-xl`}
            >
              <ContentCard
                image={post.thumbnail}
                title={post.title}
                badge={getBadge(post.post_type)}
                type={post.post_type}
                date={post.date}
                subtitle={post.meta?.location || post.excerpt || post.content || ""}
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

      <div className="flex justify-center items-center gap-3 mt-2">
        <div className="flex justify-center items-center flex-wrap gap-2 mt-2">
          {(() => {
            const buttons = [];
            const range = 2; // how many pages before and after current page

            let start = Math.max(1, page - range);
            let end = Math.min(totalPages, page + range);

            // Adjust range at edges (so we still show up to 5)
            if (page <= range) end = Math.min(totalPages, 1 + range * 2);
            if (page > totalPages - range) start = Math.max(1, totalPages - range * 2);

            // Always include first page
            if (start > 1) {
              buttons.push(
                <Button
                  key={1}
                  size="sm"
                  variant={page === 1 ? "filled" : "tonal"}
                  label="1"
                  onClick={() => setPage(1)}
                  className={`min-w-[36px] px-3 ${page === 1 ? "bg-schemesPrimary text-white" : "text-schemesOnSurfaceVariant"}`}
                />
              );
              if (start > 2) {
                buttons.push(
                  <span key="start-ellipsis" className="px-1 text-schemesOnSurfaceVariant">
                    …
                  </span>
                );
              }
            }

            // Pages around current
            for (let i = start; i <= end; i++) {
              buttons.push(
                <Button
                  key={i}
                  size="sm"
                  variant={i === page ? "filled" : "tonal"}
                  label={i.toString()}
                  onClick={() => setPage(i)}
                  className={`min-w-[36px] px-3 ${i === page ? "bg-schemesPrimary text-white" : "text-schemesOnSurfaceVariant"}`}
                />
              );
            }

            // Always include last page
            if (end < totalPages) {
              if (end < totalPages - 1) {
                buttons.push(
                  <span key="end-ellipsis" className="px-1 text-schemesOnSurfaceVariant">
                    …
                  </span>
                );
              }
              buttons.push(
                <Button
                  key={totalPages}
                  size="sm"
                  variant={page === totalPages ? "filled" : "tonal"}
                  label={totalPages.toString()}
                  onClick={() => setPage(totalPages)}
                  className={`min-w-[36px] px-3 ${page === totalPages ? "bg-schemesPrimary text-white" : "text-schemesOnSurfaceVariant"}`}
                />
              );
            }
            return buttons;
          })()}
        </div>
      </div>
    </section>
  );
}