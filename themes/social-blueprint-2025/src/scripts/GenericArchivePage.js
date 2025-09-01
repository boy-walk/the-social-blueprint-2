import React, { useEffect, useMemo, useState, useRef } from "react";
import { ContentCard } from "./ContentCard";
import { FilterGroup } from "./FilterGroup";
import { Button } from "./Button";
import { getBadge } from "./getBadge";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Breadcrumbs } from "./Breadcrumbs";

/**
 * GenericArchivePage (lean)
 * - single fetch per taxonomy for term options (TSB endpoint)
 * - items fetch does NOT depend on term metadata => no flicker when filters load
 */
export function GenericArchivePage(props) {
  const {
    postType,
    taxonomy,
    currentTerm,
    filters = [],
    endpoint,
    baseQuery = {},
    title,
    subtitle,
    breadcrumbs = [],
  } = props;

  // Just normalize for display context (no GD branching)
  const postTypes = useMemo(() => (Array.isArray(postType) ? postType : [postType]), [postType]);

  // ---------------- UI state ----------------
  const [page, setPage] = useState(1);

  // Seed once from archive context to avoid an extra fetch later
  const [selectedTerms, setSelectedTerms] = useState(() => {
    if (taxonomy && currentTerm?.id) return { [taxonomy]: [String(currentTerm.id)] };
    return {};
  });

  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [retryTick, setRetryTick] = useState(0);

  // Term options (per taxonomy)
  const [termsOptions, setTermsOptions] = useState({}); // taxonomy -> Tree[] | Flat[]
  const fetchedOnceRef = useRef(new Set());             // avoid duplicate term fetches this mount

  // Hide the group we’re already scoped to
  const displayedFilters = useMemo(() => {
    if (!taxonomy) return filters;
    return (filters || []).filter((f) => f.taxonomy !== taxonomy);
  }, [filters, taxonomy]);

  // ---------------- Fetch terms (1 call per taxonomy via TSB endpoint) ----------------
  useEffect(() => {
    if (!displayedFilters.length) {
      setTermsOptions({});
      return;
    }

    let cancelled = false;

    (async () => {
      const next = {};
      for (const f of displayedFilters) {
        const tax = f.taxonomy;
        if (fetchedOnceRef.current.has(tax)) continue; // already fetched during this mount

        try {
          const res = await fetch(
            `/wp-json/tsb/v1/terms?taxonomy=${encodeURIComponent(tax)}&per_page=100`,
            { headers: { Accept: "application/json" } }
          );
          if (!res.ok) throw new Error(`Terms fetch failed for ${tax} (HTTP ${res.status})`);
          const json = await res.json();

          const rows = (Array.isArray(json) ? json : []).map((t) => ({
            id: String(t.id),
            name: t.name,
            slug: t.slug,
            parent: String((t.parent ?? 0) || "0"),
          }));

          // Build tree only if hierarchical
          const isHier = rows.some((r) => r.parent !== "0");
          if (isHier) {
            const byId = {};
            rows.forEach((r) => (byId[r.id] = { ...r, children: [] }));
            const roots = [];
            rows.forEach((r) => (r.parent !== "0" && byId[r.parent]) ? byId[r.parent].children.push(byId[r.id]) : roots.push(byId[r.id]));
            const sortTree = (nodes) => { nodes.sort((a, b) => a.name.localeCompare(b.name)); nodes.forEach(n => sortTree(n.children)); };
            sortTree(roots);
            next[tax] = roots;
          } else {
            next[tax] = rows.map(({ id, name, slug }) => ({ id, name, slug }));
          }

          fetchedOnceRef.current.add(tax);
        } catch {
          next[f.taxonomy] = [];
        }
      }

      if (!cancelled && Object.keys(next).length) {
        setTermsOptions((prev) => ({ ...prev, ...next }));
      }
    })();

    return () => { cancelled = true; };
  }, [displayedFilters]);

  // ---------------- Scope the visible branch on taxonomy archives (UI-only) ----------------
  const didScopeRef = useRef(false);
  useEffect(() => {
    if (didScopeRef.current) return;
    if (!taxonomy || !currentTerm?.id) return;
    const opts = termsOptions[taxonomy];
    if (!opts || !opts.length) return;

    const isTree = Array.isArray(opts) && Array.isArray(opts[0]?.children);
    if (isTree) {
      // find node by id and show only that branch
      const stack = [...opts];
      let node = null;
      while (stack.length) {
        const n = stack.pop();
        if (String(n.id) === String(currentTerm.id)) { node = n; break; }
        (n.children || []).forEach(c => stack.push(c));
      }
      if (node) {
        setTermsOptions((prev) => ({ ...prev, [taxonomy]: [node] }));
        didScopeRef.current = true;
      }
    } else {
      setTermsOptions((prev) => ({
        ...prev,
        [taxonomy]: (prev[taxonomy] || []).filter((o) => String(o.id) === String(currentTerm.id)),
      }));
      didScopeRef.current = true;
    }
  }, [termsOptions, taxonomy, currentTerm]);

  // ---------------- Fetch items (decoupled from term metadata => no flicker) ----------------
  const fetchSeq = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const seq = ++fetchSeq.current;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const payload = { ...baseQuery, page };

        // Base tax from server
        const baseTax = Array.isArray(baseQuery.tax)
          ? baseQuery.tax.slice()
          : baseQuery.tax ? [baseQuery.tax] : [];

        // UI selections (no client-side descendant expansion; server will include children)
        const uiTax = [];
        for (const [taxKey, termIds] of Object.entries(selectedTerms)) {
          if (termIds && termIds.length) {
            uiTax.push({
              taxonomy: taxKey,
              field: "term_id",
              terms: termIds.map((id) => parseInt(id, 10)).filter(Number.isFinite),
              operator: "IN",
              include_children: true,
            });
          }
        }

        const finalTax = [...baseTax, ...uiTax];
        if (finalTax.length) {
          payload.tax = finalTax;
          if (baseQuery.tax_relation) payload.tax_relation = baseQuery.tax_relation;
        }

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (!cancelled && seq === fetchSeq.current) {
          setItems(json.items || []);
          setTotalPages(json.total_pages || 1);
          setTotal(typeof json.total === "number" ? json.total : undefined);
        }
      } catch (err) {
        if (!cancelled && seq === fetchSeq.current) setError(err.message || "Failed to load data");
      } finally {
        if (!cancelled && seq === fetchSeq.current) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [baseQuery, endpoint, page, selectedTerms, retryTick]);

  // ---------------- Client-side search ----------------
  const searchIndex = useMemo(() => {
    const idx = new Map();
    const collect = (val, bag) => {
      if (!val) return;
      if (Array.isArray(val)) val.forEach(v => collect(v, bag));
      else if (typeof val === "object") {
        if (typeof val.name === "string") bag.push(val.name);
        if (typeof val.slug === "string") bag.push(val.slug.replace(/-/g, " "));
        Object.values(val).forEach(v => collect(v, bag));
      } else if (typeof val === "string") bag.push(val);
    };
    (items || []).forEach((item) => {
      const bag = [];
      collect(item.title, bag);
      collect(item.subtitle, bag);
      collect(item.excerpt, bag);
      collect(item.categories, bag);
      collect(item.tags, bag);
      collect(item.terms, bag);
      collect(item.taxonomies, bag);
      idx.set(item.id, bag.join(" ").toLowerCase());
    });
    return idx;
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    const words = q.split(/\s+/).filter(Boolean);
    return items.filter((it) => {
      const hay = searchIndex.get(it.id) || "";
      return words.every((w) => hay.includes(w));
    });
  }, [items, searchQuery, searchIndex]);

  const searching = searchQuery.trim().length > 0;
  const hasActiveFilters = useMemo(
    () => Object.values(selectedTerms).some((arr) => (arr || []).length > 0),
    [selectedTerms]
  );

  const clearAllFilters = () => {
    setSelectedTerms({});
    setPage(1);
  };

  // ---------------- Skeletons ----------------
  const skeletonCards = Array.from({ length: 8 }).map((_, i) => (
    <div key={`sk-${i}`} className="rounded-xl border border-[var(--schemesOutlineVariant)] overflow-hidden">
      <div className="w-full aspect-[1.6] bg-[var(--schemesSurfaceContainerHighest)] animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 bg-[var(--schemesSurfaceContainerHigh)] animate-pulse rounded" />
        <div className="h-3 w-1/2 bg-[var(--schemesSurfaceContainerHigh)] animate-pulse rounded" />
        <div className="h-3 w-2/3 bg-[var(--schemesSurfaceContainerHigh)] animate-pulse rounded" />
      </div>
    </div>
  ));

  return (
    <div className="archive-container bg-schemesSurface">
      {/* Header band */}
      <div className="bg-schemesPrimaryFixed py-8">
        <div className="tsb-container">
          <Breadcrumbs items={breadcrumbs} textColour="text-schemesPrimary" />
          <h1 className="Blueprint-headline-large text-schemesOnSurface mb-1">{title}</h1>
          {subtitle && <p className="Blueprint-body-medium text-schemesOnPrimaryFixedVariant">{subtitle}</p>}
        </div>
      </div>

      <div className="tsb-container flex flex-col lg:flex-row py-8 gap-8">
        {/* Filters */}
        {displayedFilters.length > 0 && (
          <aside className="hidden lg:block lg:w-64 xl:w-72">
            {/* Search bar */}
            <div className="mb-6">
              <label htmlFor="archive-search" className="sr-only">Search by keyword</label>
              <div className="flex items-center gap-2">
                <div className="bg-schemesSurfaceContainer flex-1 flex items-center gap-2 rounded-full px-4 py-3">
                  <input
                    id="archive-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by keyword"
                    className="w-full outline-none Blueprint-body-medium text-schemesOnSurface placeholder:text-schemesOnSurfaceVariant"
                  />
                  {!searchQuery && <MagnifyingGlassIcon size={20} className="text-schemesOnSurfaceVariant" weight="bold" />}
                </div>
              </div>
            </div>

            <h2 className="Blueprint-headline-small-emphasized mb-4 text-schemesOnSurfaceVariant">Filters</h2>

            {(hasActiveFilters || searching) && (
              <div className="mb-4 flex gap-2">
                {hasActiveFilters && <Button size="sm" variant="tonal" onClick={clearAllFilters} label="Clear filters" />}
                {searching && <Button size="sm" variant="tonal" onClick={() => setSearchQuery("")} label="Clear search" />}
              </div>
            )}

            {displayedFilters.map((f) => (
              <div key={f.taxonomy} className="mb-4">
                <FilterGroup
                  title={f.label || f.taxonomy}
                  options={termsOptions[f.taxonomy] || []}
                  selected={selectedTerms[f.taxonomy] || []}
                  onChangeHandler={(e) => {
                    const id = String(e.target.value);
                    const checked = !!e.target.checked;
                    setSelectedTerms((prev) => {
                      const current = prev[f.taxonomy] || [];
                      const next = checked ? [...current, id] : current.filter((x) => x !== id);
                      return { ...prev, [f.taxonomy]: next };
                    });
                    setPage(1);
                  }}
                />
              </div>
            ))}
          </aside>
        )}

        {/* Main content */}
        <section className="flex-1">
          {/* Error */}
          {error && !loading && (
            <div className="mb-8 rounded-xl border border-[var(--schemesOutlineVariant)] bg-[var(--schemesSurface)] p-6">
              <div className="Blueprint-title-small-emphasized mb-2 text-[var(--schemesError)]">Something went wrong</div>
              <p className="Blueprint-body-medium text-[var(--schemesOnSurfaceVariant)] mb-4">{error}</p>
              <div className="flex gap-2">
                <Button variant="filled" label="Try again" onClick={() => setRetryTick((n) => n + 1)} />
                {hasActiveFilters && <Button variant="tonal" label="Clear filters" onClick={clearAllFilters} />}
              </div>
            </div>
          )}

          {/* Loading skeleton (items only) */}
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8" aria-hidden="true">
              {skeletonCards}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredItems.length === 0 && (
            <div className="rounded-2xl border border-[var(--schemesOutlineVariant)] bg-[var(--schemesSurface)] p-10 text-center mb-8">
              <div className="Blueprint-headline-small mb-2">No results found</div>
              <p className="Blueprint-body-medium text-[var(--schemesOnSurfaceVariant)] mb-6">
                {searching ? "Try a different keyword or clear search." : "Try adjusting or clearing your filters to see more results."}
              </p>
              <div className="flex justify-center gap-3">
                {searching
                  ? <Button variant="filled" label="Clear search" onClick={() => setSearchQuery("")} />
                  : <Button variant="filled" label="Clear all filters" onClick={clearAllFilters} />
                }
                <Button variant="tonal" label="Reload" onClick={() => setRetryTick((n) => n + 1)} />
              </div>
            </div>
          )}

          {/* Results */}
          {!loading && !error && filteredItems.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large text-[var(--schemesOnSurfaceVariant)]" aria-live="polite">
                  {searching
                    ? `${filteredItems.length} match${filteredItems.length === 1 ? "" : "es"} on this page`
                    : (typeof total === "number" ? `${total.toLocaleString()} result${total === 1 ? "" : "s"}` : null)}
                </div>
                {(hasActiveFilters || searching) && (
                  <div className="flex gap-2">
                    {hasActiveFilters && <Button size="sm" variant="tonal" label="Clear filters" onClick={clearAllFilters} />}
                    {searching && <Button size="sm" variant="tonal" label="Clear search" onClick={() => setSearchQuery("")} />}
                  </div>
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                {filteredItems.map((item) => (
                  <ContentCard
                    key={item.id}
                    image={item.thumbnail}
                    title={item.title}
                    subtitle={item.date}
                    badge={getBadge(item.post_type)}
                    href={item.permalink}
                  />
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && !searching && (
            <div className="flex justify-center items-center gap-3 mt-2">
              <Button size="base" variant="tonal" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} label="Prev" />
              <span className="Blueprint-body-medium text-schemesOnSurfaceVariant">{page} / {totalPages}</span>
              <Button size="base" variant="tonal" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} label="Next" />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
