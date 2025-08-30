import React, { useEffect, useMemo, useState, useCallback } from "react";
import { ContentCard } from "./ContentCard";
import { FilterGroup } from "./FilterGroup";
import { Button } from "./Button";

/**
 * GenericArchivePage
 *
 * Props:
 * - postType: string (e.g. 'article' or 'tribe_events' or 'gd_aid_listing')
 * - taxonomy: string (if this is a taxonomy archive)
 * - filters: array of { taxonomy: 'topic_tag', label: 'Topic' } // optional; used for non-GD
 * - endpoint: string (e.g. '/wp-json/tsb/v1/browse')
 * - baseQuery: object (initial POST payload to API)
 * - title: string
 * - subtitle: string
 */
export function GenericArchivePage(props) {
  const {
    postType,
    taxonomy, // not used directly here
    filters = [],
    endpoint,
    baseQuery = {},
    title,
    subtitle,
  } = props;

  // UI state
  const [page, setPage] = useState(1);
  const [selectedTerms, setSelectedTerms] = useState({}); // { taxonomy_key: [term_id,...] }
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetched options for each filter group (what we render)
  // For hierarchical groups we store a TREE (roots with children[]).
  // For flat groups we store a flat array (no children).
  const [termsOptions, setTermsOptions] = useState({}); // { taxonomy_key: TreeNode[] | Flat[] }

  // For hierarchical taxonomies: descendants lookup so we can expand parents in queries
  // { taxonomy_key: { termId: [descendantIds...] } }
  const [descendantsMap, setDescendantsMap] = useState({});

  // Map of rest_base (or taxonomy name) -> taxonomy name used by WP_Query
  const [taxNameMap, setTaxNameMap] = useState({});

  // retry tick to force refetch on demand
  const [retryTick, setRetryTick] = useState(0);

  const isGD = useMemo(
    () => typeof postType === "string" && postType.startsWith("gd_"),
    [postType]
  );

  // e.g. gd_aid_listing -> aid_listing
  const gdBase = useMemo(
    () => (isGD ? postType.replace(/^gd_/, "") : ""),
    [isGD, postType]
  );

  // Which filters to render: for GD we auto-provide Categories/Tags via GeoDirectory
  const effectiveFilters = useMemo(() => {
    if (isGD) {
      return [
        { taxonomy: `${gdBase}/categories`, label: "Categories", _source: "geodir", _segment: "categories", _hierarchical: true },
        { taxonomy: `${gdBase}/tags`, label: "Tags", _source: "geodir", _segment: "tags", _hierarchical: false },
      ];
    }
    return filters || [];
  }, [isGD, gdBase, filters]);

  // Load WP taxonomies once to translate rest_base -> real taxonomy name for WP_Query
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/wp-json/wp/v2/taxonomies", { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`taxonomies HTTP ${res.status}`);
        const json = await res.json(); // object keyed by taxonomy name
        if (cancelled) return;

        const map = {};
        Object.entries(json || {}).forEach(([taxonomyName, obj]) => {
          map[taxonomyName] = taxonomyName; // direct name lookup
          if (obj?.rest_base) map[obj.rest_base] = taxonomyName; // rest_base lookup
        });

        setTaxNameMap(map);
      } catch {
        setTaxNameMap({}); // fall back to sending keys as-is
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const resolveTaxonomyName = useCallback(
    (key) => taxNameMap[key] || key,
    [taxNameMap]
  );

  // --------- helpers to build TREE + descendants ----------
  // rows: [{id, name, slug, parent}]
  const buildTreeAndDescendants = (rows) => {
    const byId = {};
    rows.forEach((r) => {
      const id = String(r.id);
      byId[id] = { id, name: r.name, slug: r.slug, children: [] };
    });

    const roots = [];
    rows.forEach((r) => {
      const id = String(r.id);
      const parent = String(r.parent || "0");
      if (parent !== "0" && byId[parent]) {
        byId[parent].children.push(byId[id]);
      } else {
        roots.push(byId[id]);
      }
    });

    const descendants = {}; // id -> [descendantIds]
    const collect = (node) => {
      let acc = [];
      node.children.forEach((c) => {
        acc.push(String(c.id), ...collect(c));
      });
      descendants[String(node.id)] = acc;
      return acc;
    };
    roots.forEach((n) => collect(n));

    // sort alphabetically at each level for stable UI
    const sortTree = (nodes) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name));
      nodes.forEach((n) => sortTree(n.children));
    };
    sortTree(roots);

    return { tree: roots, descendants };
  };

  // --------- Fetch term options for each filter group ----------
  useEffect(() => {
    let cancelled = false;

    // Try kebab first, then underscore fallback
    const fetchGDTerms = async (segment) => {
      const baseUnderscore = gdBase;                // e.g. "aid_listing"
      const baseKebab = gdBase.replace(/_/g, "-");  // e.g. "aid-listing"
      const candidates = [
        `/wp-json/geodir/v2/${baseKebab}/${segment}?per_page=100`,
        `/wp-json/geodir/v2/${baseUnderscore}/${segment}?per_page=100`,
      ];
      for (const url of candidates) {
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        if (res.ok) return res.json();
      }
      throw new Error(`No GD endpoint found for ${segment}`);
    };

    (async () => {
      const nextOptions = {};
      const nextDesc = {};

      for (const f of effectiveFilters) {
        try {
          if (isGD && f._source === "geodir") {
            const segment = f._segment === "tags" ? "tags" : "categories";
            const json = await fetchGDTerms(segment);

            // expect objects with id, name, slug, parent
            const rows = (Array.isArray(json) ? json : []).map((t) => ({
              id: String(t.id),
              name: t.name,
              slug: t.slug,
              parent: String(t.parent || "0"),
            }));

            if (f._hierarchical) {
              const { tree, descendants } = buildTreeAndDescendants(rows);
              nextOptions[f.taxonomy] = tree;          // TREE for FilterGroup
              nextDesc[f.taxonomy] = descendants;      // expansion for querying
            } else {
              nextOptions[f.taxonomy] = rows.map(({ id, name, slug }) => ({ id, name, slug }));
            }
          } else {
            const res = await fetch(`/wp-json/wp/v2/${f.taxonomy}?per_page=100`, {
              headers: { Accept: "application/json" },
            });
            if (!res.ok) throw new Error(`WP tax ${f.taxonomy} HTTP ${res.status}`);
            const json = await res.json();
            const rows = (Array.isArray(json) ? json : []).map((t) => ({
              id: String(t.id),
              name: t.name,
              slug: t.slug,
              parent: String(t.parent || "0"),
            }));

            // If WP taxonomy is hierarchical, build a TREE; else flat.
            const isHier = rows.some((r) => r.parent !== "0");
            if (isHier) {
              const { tree, descendants } = buildTreeAndDescendants(rows);
              nextOptions[f.taxonomy] = tree;         // TREE
              nextDesc[f.taxonomy] = descendants;     // for expansion
            } else {
              nextOptions[f.taxonomy] = rows.map(({ id, name, slug }) => ({ id, name, slug }));
            }
          }
        } catch {
          nextOptions[f.taxonomy] = [];
        }
      }

      if (!cancelled) {
        setTermsOptions(nextOptions);
        setDescendantsMap(nextDesc);
      }
    })();

    return () => { cancelled = true; };
  }, [effectiveFilters, isGD, gdBase]);

  // Expand selected IDs with descendants if taxonomy is hierarchical (for queries)
  const expandWithDescendants = useCallback((taxKey, ids) => {
    const desc = descendantsMap[taxKey];
    if (!desc) return ids; // not hierarchical or no data
    const out = new Set();
    ids.forEach((id) => {
      const s = String(id);
      out.add(s);
      const kids = desc[s] || [];
      kids.forEach((kid) => out.add(String(kid)));
    });
    return Array.from(out);
  }, [descendantsMap]);

  // --------- Fetch items whenever page or selected terms change ----------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const payload = { ...baseQuery, page };

        // Start with any tax filters already provided in baseQuery
        const baseTax = Array.isArray(baseQuery.tax)
          ? baseQuery.tax.slice()
          : baseQuery.tax
            ? [baseQuery.tax]
            : [];

        // Add UI-selected filters (translate to real taxonomy names; expand parents)
        const uiTax = [];
        for (const [taxKey, termIds] of Object.entries(selectedTerms)) {
          if (termIds && termIds.length) {
            const expanded = expandWithDescendants(taxKey, termIds);
            uiTax.push({
              taxonomy: resolveTaxonomyName(taxKey), // e.g. "gd_aid_listing_category" or pass-through key your API maps
              field: "term_id",
              terms: expanded
                .map((id) => parseInt(id, 10))
                .filter((n) => Number.isFinite(n)),
              operator: "IN",
              include_children: true, // hint; safe to include
            });
          }
        }

        const finalTax = [...baseTax, ...uiTax];
        if (finalTax.length) payload.tax = finalTax;
        if (baseQuery.tax_relation) payload.tax_relation = baseQuery.tax_relation;

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (!cancelled) {
          setItems(json.items || []);
          setTotalPages(json.total_pages || 1);
          setTotal(typeof json.total === "number" ? json.total : undefined);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [baseQuery, endpoint, page, selectedTerms, resolveTaxonomyName, expandWithDescendants, retryTick]);

  // ---- Derived UI helpers ----
  const hasActiveFilters = useMemo(
    () => Object.values(selectedTerms).some((arr) => (arr || []).length > 0),
    [selectedTerms]
  );

  const clearAllFilters = () => {
    setSelectedTerms({});
    setPage(1);
  };

  // ---- Skeletons ----
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
          <h1 className="Blueprint-headline-large text-schemesOnSurface mb-1">{title}</h1>
          {subtitle && (
            <p className="Blueprint-body-medium text-schemesOnPrimaryFixedVariant">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="tsb-container flex flex-col lg:flex-row py-8 gap-8">
        {/* Filters */}
        {effectiveFilters.length > 0 && (
          <aside className="hidden lg:block lg:w-64 xl:w-72">
            <h2 className="Blueprint-headline-small-emphasized mb-4 text-schemesOnSurfaceVariant">Filters</h2>

            {hasActiveFilters && (
              <div className="mb-4">
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="tonal"
                    onClick={clearAllFilters}
                    label="Clear filters"
                  />
                </div>
              </div>
            )}

            {/* Filter groups */}
            {effectiveFilters.map((f) => (
              <div key={f.taxonomy} className="mb-4">
                <FilterGroup
                  title={f.label || f.taxonomy}
                  options={termsOptions[f.taxonomy] || []} // TREE for hierarchical; flat for non-hier
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
          {/* Error state */}
          {error && !loading && (
            <div className="mb-8 rounded-xl border border-[var(--schemesOutlineVariant)] bg-[var(--schemesSurface)] p-6">
              <div className="Blueprint-title-small-emphasized mb-2 text-[var(--schemesError)]">
                Something went wrong
              </div>
              <p className="Blueprint-body-medium text-[var(--schemesOnSurfaceVariant)] mb-4">
                {error}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="filled"
                  label="Try again"
                  onClick={() => setRetryTick((n) => n + 1)}
                />
                {hasActiveFilters && (
                  <Button
                    variant="tonal"
                    label="Clear filters"
                    onClick={clearAllFilters}
                  />
                )}
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8" aria-hidden="true">
              {skeletonCards}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && items.length === 0 && (
            <div className="rounded-2xl border border-[var(--schemesOutlineVariant)] bg-[var(--schemesSurface)] p-10 text-center mb-8">
              <div className="Blueprint-headline-small mb-2">No results found</div>
              <p className="Blueprint-body-medium text-[var(--schemesOnSurfaceVariant)] mb-6">
                Try adjusting or clearing your filters to see more results.
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  variant="filled"
                  label="Clear all filters"
                  onClick={clearAllFilters}
                />
                <Button
                  variant="tonal"
                  label="Reload"
                  onClick={() => setRetryTick((n) => n + 1)}
                />
              </div>
            </div>
          )}

          {/* Results grid */}
          {!loading && !error && items.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large text-[var(--schemesOnSurfaceVariant)]" aria-live="polite">
                  {typeof total === "number" ? `${total.toLocaleString()} result${total === 1 ? "" : "s"}` : null}
                </div>
                {hasActiveFilters && (
                  <Button size="sm" variant="tonal" label="Clear filters" onClick={clearAllFilters} />
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                {items.map((item) => (
                  <ContentCard
                    key={item.id}
                    image={item.thumbnail}
                    title={item.title}
                    subtitle={item.date}
                    badge={item.post_type === "tribe_events" ? "Event" : null}
                    href={item.permalink}
                  />
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
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
    </div>
  );
}
