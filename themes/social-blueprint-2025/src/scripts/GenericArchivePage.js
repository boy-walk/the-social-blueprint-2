import React, { useEffect, useMemo, useState, useCallback } from "react";
import { ContentCard } from "./ContentCard";
import { EventsCalendarFilterGroup } from "./EventsCalendarFilterGroup";
import { Button } from "./Button";

/**
 * GenericArchivePage
 *
 * Props:
 * - postType: string (e.g. 'article' or 'tribe_events' or 'gd_aid_listing')
 * - taxonomy: string (if this is a taxonomy archive)   // not used for fetching filters here
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetched options for each filter group
  const [termsOptions, setTermsOptions] = useState({}); // { taxonomy_key: [ {id,name,slug}, ... ] }

  // Map of rest_base (or taxonomy name) -> taxonomy name used by WP_Query
  const [taxNameMap, setTaxNameMap] = useState({});

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
        { taxonomy: `${gdBase}/categories`, label: "Categories", _source: "geodir", _segment: "categories" },
        { taxonomy: `${gdBase}/tags`, label: "Tags", _source: "geodir", _segment: "tags" },
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

  // Fetch term options for each filter group
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
      const next = {};
      for (const f of effectiveFilters) {
        try {
          if (isGD && f._source === "geodir") {
            const segment = f._segment === "tags" ? "tags" : "categories";
            const json = await fetchGDTerms(segment);
            next[f.taxonomy] = (Array.isArray(json) ? json : []).map((t) => ({
              id: String(t.id),
              name: t.name,
              slug: t.slug,
            }));
          } else {
            const res = await fetch(`/wp-json/wp/v2/${f.taxonomy}?per_page=100`, {
              headers: { Accept: "application/json" },
            });
            if (!res.ok) throw new Error(`WP tax ${f.taxonomy} HTTP ${res.status}`);
            const json = await res.json();
            next[f.taxonomy] = (Array.isArray(json) ? json : []).map((t) => ({
              id: String(t.id),
              name: t.name,
              slug: t.slug,
            }));
          }
        } catch {
          next[f.taxonomy] = [];
        }
      }
      if (!cancelled) setTermsOptions(next);
    })();

    return () => { cancelled = true; };
  }, [effectiveFilters, isGD, gdBase]);

  // Fetch items whenever page or selected terms change
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

        // Add UI-selected filters (translate to real taxonomy names)
        const uiTax = [];
        for (const [taxKey, termIds] of Object.entries(selectedTerms)) {
          if (termIds && termIds.length) {
            uiTax.push({
              taxonomy: resolveTaxonomyName(taxKey), // e.g. "gd_aid_listing_category"
              field: "term_id",
              terms: termIds
                .map((id) => parseInt(id, 10))
                .filter((n) => Number.isFinite(n)),
              operator: "IN",
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
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [baseQuery, endpoint, page, selectedTerms, resolveTaxonomyName]);

  return (
    <div className="archive-container bg-schemesSurface">
      <div className="bg-schemesPrimaryFixed py-8">
        <div className="tsb-container">
          <h1 className="Blueprint-headline-large text-schemesOnSurface mb-1">{title}</h1>
          {subtitle && <p className="Blueprint-body-medium text-schemesOnPrimaryFixedVariant">{subtitle}</p>}
        </div>
      </div>

      <div className="tsb-container flex flex-col lg:flex-row py-8 gap-8">
        {effectiveFilters.length > 0 && (
          <aside className="hidden lg:block lg:w-64 xl:w-72">
            <h2 className="Blueprint-headline-small-emphasized mb-4 text-schemesOnSurfaceVariant">Filters</h2>

            {effectiveFilters.map((f) => (
              <div key={f.taxonomy} className="mb-4">
                <EventsCalendarFilterGroup
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
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !items.length && <p>No results found.</p>}

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

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2">
            <Button
              size="base"
              variant="tonal"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              label="Prev"
            />
            <span className="text-schemesOnSurfaceVariant">{page} / {totalPages}</span>
            <Button
              size="base"
              variant="tonal"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              label="Next"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
