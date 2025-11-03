import React, { useEffect, useMemo, useState, useRef } from "react";
import { FilterGroup } from "./FilterGroup";
import { Button } from "./Button";
import { MagnifyingGlassIcon, FunnelSimpleIcon, XIcon } from "@phosphor-icons/react";
import { Breadcrumbs } from "./Breadcrumbs";

export default function MessageBoardArchivePage(props) {
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

  const CPT = useMemo(() => (Array.isArray(postType) ? postType[0] : postType) || "gd_discount", [postType]);

  // ---------------- State ----------------
  const [page, setPage] = useState(1);

  // Seed once for taxonomy archives
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

  // Filters / terms
  const [termsOptions, setTermsOptions] = useState({});
  const [descendantsMap, setDescendantsMap] = useState({});
  const [retryTick, setRetryTick] = useState(0);

  // ---- identify the "Category" taxonomy to promote to chips ----
  const categoryFilter = useMemo(() => {
    const re = /(_category|_categories|category|categories|cat)$/i;
    return (filters || []).find((f) => f.isCategory || re.test(f.taxonomy));
  }, [filters]);
  const categoryTax = categoryFilter?.taxonomy || null;

  // Sidebar filters (exclude the scoped taxonomy and the category)
  const displayedFilters = useMemo(() => {
    return (filters || []).filter(
      (f) => f.taxonomy !== taxonomy && f.taxonomy !== categoryTax
    );
  }, [filters, taxonomy, categoryTax]);

  // ---------------- Helpers ----------------
  const buildTreeAndDescendants = (rows) => {
    const byId = {};
    rows.forEach((r) => {
      const id = String(r.id);
      byId[id] = { id, name: r.name, slug: r.slug, parent: String((r.parent ?? 0) || "0"), children: [] };
    });
    const roots = [];
    rows.forEach((r) => {
      const id = String(r.id);
      const p = String(r.parent || "0");
      if (p !== "0" && byId[p]) byId[p].children.push(byId[id]);
      else roots.push(byId[id]);
    });
    const descendants = {};
    const collect = (n) => {
      let acc = [];
      n.children.forEach((c) => { acc.push(String(c.id), ...collect(c)); });
      descendants[String(n.id)] = acc;
      return acc;
    };
    roots.forEach(collect);
    const sortTree = (nodes) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name));
      nodes.forEach((n) => sortTree(n.children));
    };
    sortTree(roots);
    return { tree: roots, descendants };
  };

  // ---------------- Load term options ----------------
  const fetchedOnceRef = useRef(new Set());

  useEffect(() => {
    const toFetch = [...displayedFilters];
    if (categoryTax) toFetch.unshift({ taxonomy: categoryTax });

    if (!toFetch.length) {
      setTermsOptions({});
      setDescendantsMap({});
      return;
    }
    let cancelled = false;

    (async () => {
      const nextOptions = {};
      const nextDesc = {};

      for (const f of toFetch) {
        const tax = f.taxonomy;
        if (fetchedOnceRef.current.has(tax)) continue;
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

          const isHier = rows.some((r) => r.parent !== "0");
          if (isHier) {
            const { tree, descendants } = buildTreeAndDescendants(rows);
            nextOptions[tax] = tree;
            nextDesc[tax] = descendants;
          } else {
            nextOptions[tax] = rows.map(({ id, name, slug }) => ({ id, name, slug }));
          }

          fetchedOnceRef.current.add(tax);
        } catch {
          nextOptions[f.taxonomy] = [];
        }
      }

      if (!cancelled && (Object.keys(nextOptions).length || Object.keys(nextDesc).length)) {
        setTermsOptions((prev) => ({ ...prev, ...nextOptions }));
        setDescendantsMap((prev) => ({ ...prev, ...nextDesc }));
      }
    })();

    return () => { cancelled = true; };
  }, [displayedFilters, categoryTax]);

  // ---------------- Scope filter UI for taxonomy archives (UI-only) ----------------
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

  // ---------------- Fetch posts ----------------
  const fetchSeq = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const seq = ++fetchSeq.current;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const payload = { ...baseQuery, page };

        // base tax
        const baseTax = Array.isArray(baseQuery.tax)
          ? baseQuery.tax.slice()
          : baseQuery.tax ? [baseQuery.tax] : [];

        // UI selections
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
          // Sort items: featured posts first, then others
          const sortedItems = (json.items || []).sort((a, b) => {
            const aFeat = a.featured ? 1 : 0;
            const bFeat = b.featured ? 1 : 0;
            return bFeat - aFeat;
          });

          setItems(sortedItems);
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
    () => Object.entries(selectedTerms).some(([k, arr]) => (k !== categoryTax) && (arr || []).length > 0),
    [selectedTerms, categoryTax]
  );

  // ---------------- Category chips ----------------
  const categoryOptionsRaw = termsOptions[categoryTax] || [];
  const isCatTree = Array.isArray(categoryOptionsRaw[0]?.children);
  const categoryRoots = isCatTree ? categoryOptionsRaw : categoryOptionsRaw; // we only show roots/flat
  const currentCategorySel = (selectedTerms[categoryTax] || [])[0] || "";

  const setCategory = (id) => {
    setSelectedTerms((prev) => ({ ...prev, [categoryTax]: id ? [String(id)] : [] }));
    setPage(1);
  };

  // ---------------- Mobile filters drawer ----------------
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

  const clearAllFilters = () => {
    setSelectedTerms((prev) => ({ [categoryTax]: prev[categoryTax] || [] })); // keep category; clear others
    setPage(1);
  };

  const filterCount =
    (hasActiveFilters ? Object.values(selectedTerms).reduce((n, arr, k) => n + ((Object.keys(selectedTerms)[k] === categoryTax) ? 0 : (arr || []).length), 0) : 0) +
    (searching ? 1 : 0);

  // ---------------- Row rendering helpers ----------------
  const stripTags = (html) => {
    if (typeof html !== "string") return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return (tmp.textContent || tmp.innerText || "").trim();
  };

  const extractCategoryLabels = (item) => {
    const labels = [];
    const seen = new Set();
    const push = (val) => {
      const name = typeof val === "string" ? val : (val?.name || val?.title || "");
      const text = (name || "").toString().trim();
      if (!text) return;
      const key = text.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      labels.push(text);
    };
    if (Array.isArray(item?.categories)) item.categories.forEach(push);
    if (item?.taxonomies && typeof item.taxonomies === "object") {
      Object.entries(item.taxonomies).forEach(([tx, arr]) => {
        if (!Array.isArray(arr)) return;
        if (/_category$/.test(tx) || /categories?$/.test(tx) || /cat$/.test(tx)) {
          arr.forEach(push);
        }
      });
    }
    Object.keys(item || {}).forEach((k) => {
      if (!/_category$/.test(k) && !/categories?$/.test(k) && !/cat$/.test(k)) return;
      const v = item[k];
      if (Array.isArray(v)) v.forEach(push);
    });
    return labels;
  };

  const LeadingIcon = ({ item }) => {
    const letter = (String(item?.title || "").trim()[0] || "â€¢").toUpperCase();
    return (
      <div className="w-16 h-16 rounded-xl bg-[var(--schemesSecondaryContainer)] flex items-center justify-center shrink-0">
        <span className="Blueprint-headline-medium text-[var(--schemesOnSecondaryContainer)]">
          {letter}
        </span>
      </div>
    );
  };

  const MessageRow = ({ item }) => {
    const href = item?.permalink || "#";
    const categories = extractCategoryLabels(item);

    return (
      <a
        href={href}
        className="block rounded-xl border border-[var(--schemesOutlineVariant)] bg-[var(--schemesSurfaceContainerLowest)] hover:bg-[var(--schemesSurfaceContainer)] focus:outline-none focus:ring-2 focus:ring-[var(--schemesPrimary)] transition"
      >
        <div className="flex gap-4 p-4">
          <LeadingIcon item={item} />
          <div className="flex-1">
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {categories.map((label, idx) => (
                  <span
                    key={`${item.id}-cat-${idx}`}
                    className="px-3 py-2 rounded-lg bg-[var(--schemesSurfaceContainerHigh)] text-[var(--schemesOnSurface)] Blueprint-label-small"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}

            <div className="Blueprint-title-small-emphasized text-[var(--schemesOnSurface)] mb-1">
              {item?.title}
            </div>

            {item?.excerpt && (
              <p
                className="Blueprint-body-small text-[var(--schemesOnSurfaceVariant)]"
                style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
              >
                {stripTags(item.excerpt)}
              </p>
            )}
          </div>
        </div>
      </a>
    );
  };

  // ---------------- Skeletons ----------------
  const skeletonRows = Array.from({ length: 8 }).map((_, i) => (
    <div key={`sk-${i}`} className="rounded-xl border border-[var(--schemesOutlineVariant)] overflow-hidden bg-[var(--schemesSurface)]">
      <div className="flex gap-4 p-4">
        <div className="w-16 h-16 rounded-xl bg-[var(--schemesSurfaceContainerHighest)] animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/5 bg-[var(--schemesSurfaceContainerHigh)] animate-pulse rounded" />
          <div className="h-4 w-4/5 bg-[var(--schemesSurfaceContainerHigh)] animate-pulse rounded" />
          <div className="h-4 w-2/3 bg-[var(--schemesSurfaceContainerHigh)] animate-pulse rounded" />
        </div>
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
          {subtitle && (
            <p className="Blueprint-body-medium text-schemesOnPrimaryFixedVariant">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Top controls: category chips + mobile search & filters */}
      <div className="tsb-container pt-6">
        {/* Mobile search + Filters button */}
        <div className="lg:hidden flex items-center gap-2 mb-4">
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
            onClick={() => setIsFiltersOpen(true)}
            icon={<FunnelSimpleIcon />}
            label={filterCount ? `Filters (${filterCount})` : "Filters"}
            variant="outlined"
            size="base"
            aria-expanded={isFiltersOpen ? "true" : "false"}
            aria-controls="mobile-filters"
          />
        </div>
      </div>

      <div className="tsb-container flex flex-col lg:flex-row py-4 lg:py-8 gap-8">
        {/* Filters (desktop) */}
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
                  {!searchQuery && (
                    <MagnifyingGlassIcon size={20} className="text-schemesOnSurfaceVariant" weight="bold" />
                  )}
                </div>
              </div>
            </div>

            <h2 className="Blueprint-headline-small-emphasized mb-4 text-schemesOnSurfaceVariant">Filters</h2>

            {(hasActiveFilters || searchQuery) && (
              <div className="mb-4 flex gap-2">
                {hasActiveFilters && (
                  <Button size="sm" variant="tonal" onClick={clearAllFilters} label="Clear filters" />
                )}
                {searchQuery && (
                  <Button size="sm" variant="tonal" onClick={() => setSearchQuery("")} label="Clear search" />
                )}
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
                    const checked = !!(e.target.checked);
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
          {categoryTax && (categoryRoots?.length > 0) && (
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-3">
              <button
                type="button"
                onClick={() => setCategory("")}
                className={`px-3 py-2 rounded-sm whitespace-nowrap ${currentCategorySel ? "bg-[var(--schemesSurfaceContainerHigh)]" : "bg-gray-500 text-[var(--schemesOnPrimary)]"
                  } Blueprint-label-small`}
              >
                All
              </button>
              {categoryRoots.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCategory(opt.id)}
                  className={`px-3 py-2 rounded-sm whitespace-nowrap ${String(currentCategorySel) === String(opt.id)
                    ? "bg-gray-500 text-[var(--schemesOnPrimary)]"
                    : "bg-[var(--schemesSurfaceContainerHigh)]"
                    } Blueprint-label-small`}
                  title={opt.name}
                >
                  {opt.name}
                </button>
              ))}
            </div>
          )}
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

          {/* Loading */}
          {loading && (
            <div className="space-y-4 mb-8" aria-hidden="true">
              {skeletonRows}
            </div>
          )}
          {console.log(filteredItems)}
          {/* Empty */}
          {!loading && !error && filteredItems.length === 0 && (
            <div className="rounded-2xl border border-[var(--schemesOutlineVariant)] bg-[var(--schemesSurface)] p-10 text-center mb-8">
              <div className="Blueprint-headline-small mb-2">No results found</div>
              <p className="Blueprint-body-medium text-[var(--schemesOnSurfaceVariant)] mb-6">
                {searchQuery ? "Try a different keyword or clear search." : "Try adjusting or clearing your filters to see more results."}
              </p>
              <div className="flex justify-center gap-3">
                {searchQuery
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
              <div className="flex items-center justify-between mb-3">
                <div className="Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large text-[var(--schemesOnSurfaceVariant)]" aria-live="polite">
                  {searchQuery
                    ? `${filteredItems.length} match${filteredItems.length === 1 ? "" : "s"} on this page`
                    : (typeof total === "number" ? `${total.toLocaleString()} result${total === 1 ? "" : "s"}` : null)}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {filteredItems.map((item) => (
                  <MessageRow key={item.id} item={item} />
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && !searching && (
            <div className="flex justify-center items-center gap-3 mt-2">
              <Button
                size="base"
                variant="tonal"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                label="Prev"
              />
              <span className="Blueprint-body-medium text-schemesOnSurfaceVariant">
                {page} / {totalPages}
              </span>
              <Button
                size="base"
                variant="tonal"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                label="Next"
              />
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
        {/* Overlay */}
        <div
          onClick={closeFilters}
          className={`absolute inset-0 transition-opacity ${isFiltersOpen ? "opacity-100" : "opacity-0"} bg-[color:rgb(0_0_0_/_0.44)]`}
        />
        {/* Sheet */}
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
              <FilterGroup
                key={`m-${f.taxonomy}`}
                title={f.label || f.taxonomy}
                options={termsOptions[f.taxonomy] || []}
                selected={selectedTerms[f.taxonomy] || []}
                onChangeHandler={(e) => {
                  const id = String(e.target.value);
                  const checked = !!(e.target.checked);
                  setSelectedTerms((prev) => {
                    const current = prev[f.taxonomy] || [];
                    const next = checked ? [...current, id] : current.filter((x) => x !== id);
                    return { ...prev, [f.taxonomy]: next };
                  });
                  setPage(1);
                }}
              />
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