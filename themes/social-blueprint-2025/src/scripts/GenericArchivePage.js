import React, { useEffect, useMemo, useState, useRef } from "react";
import { ContentCard } from "./ContentCard";
import { FilterGroup } from "./FilterGroup";
import { Button } from "./Button";
import { getBadge } from "./getBadge";
import { MagnifyingGlassIcon, FunnelSimpleIcon, XIcon } from "@phosphor-icons/react";
import { Breadcrumbs } from "./Breadcrumbs";

/**
 * GenericArchivePage (lean) + mobile filters drawer
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

  const postTypes = useMemo(() => (Array.isArray(postType) ? postType : [postType]), [postType]);

  const [page, setPage] = useState(1);
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

  const [termsOptions, setTermsOptions] = useState({});
  const fetchedOnceRef = useRef(new Set());

  const displayedFilters = useMemo(() => {
    if (!taxonomy) return filters;
    return (filters || []).filter((f) => f.taxonomy !== taxonomy);
  }, [filters, taxonomy]);

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
        if (fetchedOnceRef.current.has(tax)) continue;
        try {
          const res = await fetch(
            `/wp-json/tsb/v1/terms?taxonomy=${encodeURIComponent(tax)}&per_page=100&post_type=${postType}}`,
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
          const isHier = rows.some((r) => r.parent !== "0");
          if (isHier) {
            const byId = {};
            rows.forEach((r) => (byId[r.id] = { ...r, children: [] }));
            const roots = [];
            rows.forEach((r) =>
              (r.parent !== "0" && byId[r.parent]) ? byId[r.parent].children.push(byId[r.id]) : roots.push(byId[r.id])
            );
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
      if (!cancelled && Object.keys(next).length) setTermsOptions((prev) => ({ ...prev, ...next }));
    })();
    return () => { cancelled = true; };
  }, [displayedFilters]);

  const didScopeRef = useRef(false);
  useEffect(() => {
    if (didScopeRef.current) return;
    if (!taxonomy || !currentTerm?.id) return;
    const opts = termsOptions[taxonomy];
    if (!opts || !opts.length) return;

    const isTree = Array.isArray(opts) && Array.isArray(opts[0]?.children);
    if (isTree) {
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

  const fetchSeq = useRef(0);
  useEffect(() => {
    let cancelled = false;
    const seq = ++fetchSeq.current;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const payload = { ...baseQuery, page };
        const baseTax = Array.isArray(baseQuery.tax) ? baseQuery.tax.slice() : baseQuery.tax ? [baseQuery.tax] : [];
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

  const clearAllFilters = () => { setSelectedTerms({}); setPage(1); };

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const firstCloseBtnRef = useRef(null);
  const openFilters = () => setIsFiltersOpen(true);
  const closeFilters = () => setIsFiltersOpen(false);

  useEffect(() => {
    if (!isFiltersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") closeFilters(); };
    window.addEventListener("keydown", onKey);
    setTimeout(() => firstCloseBtnRef.current?.focus(), 0);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [isFiltersOpen]);

  const filterCount =
    Object.values(selectedTerms).reduce((n, arr) => n + (arr?.length || 0), 0) +
    (searching ? 1 : 0);

  const skeletonCards = Array.from({ length: 8 }).map((_, i) => (
    <div key={`sk-${i}`} className="rounded-xl border border-[var(--schemesOutlineVariant)] overflow-hidden">
      <div className="w-full aspect-[1] bg-[var(--schemesSurfaceContainerHighest)] animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 bg-[var(--schemesSurfaceContainerHigh)] animate-pulse rounded" />
        <div className="h-3 w-1/2 bg-[var(--schemesSurfaceContainerHigh)] animate-pulse rounded" />
        <div className="h-3 w-2/3 bg-[var(--schemesSurfaceContainerHigh)] animate-pulse rounded" />
      </div>
    </div>
  ));

  return (
    <div className="archive-container bg-schemesSurface">
      <div className="bg-schemesPrimaryFixed py-8">
        <div className="tsb-container">
          <Breadcrumbs items={breadcrumbs} textColour="text-schemesPrimary" />
          <h1 className="Blueprint-headline-large text-schemesOnSurface mb-1">{title}</h1>
          {subtitle && <p className="Blueprint-body-medium text-schemesOnPrimaryFixedVariant">{subtitle}</p>}
        </div>
      </div>

      <div className="tsb-container lg:hidden pt-6">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              id="archive-search-mobile"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword"
              className="Blueprint-body-medium w-full pl-4 pr-10 py-3 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-[var(--schemesPrimary)]"
            />
            <MagnifyingGlassIcon size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant" weight="bold" aria-hidden />
          </div>

          <Button
            onClick={openFilters}
            icon={<FunnelSimpleIcon />}
            label={filterCount ? `Filters (${filterCount})` : "Filters"}
            variant="outlined"
            size="base"
            aria-expanded={isFiltersOpen ? "true" : "false"}
            aria-controls="mobile-filters"
          />
        </div>
      </div>

      <div className="tsb-container flex flex-col lg:flex-row py-8 gap-8">
        {displayedFilters.length > 0 && (
          <aside className="hidden lg:block lg:w-64 xl:w-72">
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

            {displayedFilters
              .filter((f) => (termsOptions[f.taxonomy] || []).length > 0)
              .map((f) => (
                <div key={f.taxonomy} className="mb-4">
                  {f.taxonomy === "people_tag" ? (
                    <div>
                      <label
                        htmlFor={`filter-${f.taxonomy}`}
                        className="Blueprint-title-small-emphasized block mb-2 text-schemesOnSurfaceVariant"
                      >
                        {f.label || "People"}
                      </label>
                      <select
                        id={`filter-${f.taxonomy}`}
                        value={selectedTerms[f.taxonomy]?.[0] || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedTerms((prev) => ({
                            ...prev,
                            [f.taxonomy]: value ? [value] : [],
                          }));
                          setPage(1);
                        }}
                        className="w-full rounded-lg border border-[var(--schemesOutlineVariant)] bg-schemesSurfaceContainerHigh Blueprint-body-medium text-schemesOnSurface py-2 px-3 focus:ring-2 focus:ring-[var(--schemesPrimary)] focus:outline-none"
                      >
                        <option value="">All</option>
                        {(termsOptions[f.taxonomy] || []).map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
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
                  )}
                </div>
              ))}
          </aside>
        )}

        <section className="flex-1">
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

          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8" aria-hidden="true">
              {skeletonCards}
            </div>
          )}

          {!loading && !error && filteredItems.length === 0 && (
            <div className="rounded-2xl border border-[var(--schemesOutlineVariant)] bg-[var(--schemesSurfaceContainerLowest)] p-10 text-center mb-8">
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

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                {filteredItems.map((item) => (
                  <ContentCard
                    key={item.id}
                    image={item.thumbnail}
                    title={item.title}
                    date={item.date}
                    badge={getBadge(item.post_type)}
                    href={item.permalink}
                    fullHeight
                    shadow
                  />
                ))}
              </div>
            </>
          )}

          {!loading && !error && totalPages > 1 && !searching && (
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
          )}
        </section>
      </div>

      {/* MOBILE FILTERS DRAWER */}
      <div
        id="mobile-filters"
        className={`lg:hidden fixed inset-0 z-[70] ${isFiltersOpen ? "" : "pointer-events-none"}`}
        aria-hidden={isFiltersOpen ? "false" : "true"}
      >
        <div
          onClick={closeFilters}
          className={`absolute inset-0 transition-opacity ${isFiltersOpen ? "opacity-100" : "opacity-0"} bg-[color:rgb(0_0_0_/_0.44)]`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className={`absolute left-0 right-0 bottom-0 max-h-[85vh] rounded-t-2xl bg-schemesSurface shadow-[0_-16px_48px_rgba(0,0,0,0.25)] transition-transform duration-300 ${isFiltersOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="relative px-4 py-3 border-b border-[var(--schemesOutlineVariant)]">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-[var(--schemesOutlineVariant)]" />
            <div className="mt-3 flex items-center justify-between">
              <div className="Blueprint-title-small-emphasized">Filters</div>
              <button
                ref={firstCloseBtnRef}
                type="button"
                onClick={closeFilters}
                className="rounded-full p-2 hover:bg-surfaceContainerHigh text-schemesOnSurfaceVariant"
                aria-label="Close filters"
              >
                <XIcon />
              </button>
            </div>
          </div>

          <div className="px-4 py-4 overflow-y-auto space-y-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Search by keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="Blueprint-body-medium w-full pl-4 pr-10 py-3 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-[var(--schemesPrimary)]"
              />
              <MagnifyingGlassIcon size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant" weight="bold" aria-hidden />
            </div>

            {displayedFilters.map((f) => (
              <div key={`m-${f.taxonomy}`}>
                {f.taxonomy === "people" ? (
                  <div>
                    <label
                      htmlFor={`mobile-filter-${f.taxonomy}`}
                      className="Blueprint-title-small-emphasized block mb-2 text-schemesOnSurfaceVariant"
                    >
                      {f.label || "People"}
                    </label>
                    <select
                      id={`mobile-filter-${f.taxonomy}`}
                      value={selectedTerms[f.taxonomy]?.[0] || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedTerms((prev) => ({
                          ...prev,
                          [f.taxonomy]: value ? [value] : [],
                        }));
                        setPage(1);
                      }}
                      className="w-full rounded-lg border border-[var(--schemesOutlineVariant)] bg-schemesSurfaceContainerHigh Blueprint-body-medium text-schemesOnSurface py-2 px-3 focus:ring-2 focus:ring-[var(--schemesPrimary)] focus:outline-none"
                    >
                      <option value="">All</option>
                      {(termsOptions[f.taxonomy] || []).map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
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
                )}
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 px-4 py-3 bg-schemesSurface border-t border-[var(--schemesOutlineVariant)] flex gap-2">
            <Button onClick={clearAllFilters} variant="outlined" label="Clear all" className="flex-1" />
            <Button onClick={closeFilters} variant="filled" label="Apply" className="flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
