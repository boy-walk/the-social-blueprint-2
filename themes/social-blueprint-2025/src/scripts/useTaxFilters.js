import { useEffect, useMemo, useState } from "react";

/** Fetch helpers */
async function fetchJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} @ ${url}`);
  return { json: await r.json(), headers: r.headers };
}

async function fetchAllTerms(itemsHref) {
  // itemsHref is like /wp-json/wp/v2/aid_listing/tags
  const out = [];
  let page = 1;
  let totalPages = 1;

  do {
    const url =
      `${itemsHref}${itemsHref.includes("?") ? "&" : "?"}` +
      `_fields=id,name,slug&per_page=100&hide_empty=false&page=${page}`;
    const { json, headers } = await fetchJSON(url);
    out.push(...json);
    totalPages = parseInt(headers.get("X-WP-TotalPages") || "1", 10);
    page += 1;
  } while (page <= totalPages);

  return out.map((t) => ({ id: t.id, name: t.name, slug: t.slug }));
}

/**
 * Load taxonomies and terms for a post type.
 * Returns:
 *  - taxes: [{ slug, label, itemsHref }]
 *  - terms: { [taxSlug]: [{id,name,slug}, ...] }
 */
export function useTaxFilters(postType) {
  const [loading, setLoading] = useState(true);
  const [taxes, setTaxes] = useState([]);
  const [terms, setTerms] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!postType) return;
      setLoading(true);
      setError("");

      try {
        // 1) Get only taxonomies attached to this postType
        const { json: taxObj } = await fetchJSON(
          `/wp-json/wp/v2/taxonomies?type=${encodeURIComponent(postType)}`
        );
        // taxObj is an object keyed by taxonomy slug
        const list = Object.entries(taxObj).map(([slug, t]) => ({
          slug,
          label: t.name,
          // prefer canonical items href; fall back to rest_base
          itemsHref:
            t?._links?.["wp:items"]?.[0]?.href ||
            `/wp-json/wp/v2/${t.rest_base || slug}`,
        }));

        // 2) Fetch terms for each taxonomy
        const pairs = await Promise.all(
          list.map(async (t) => {
            try {
              const termList = await fetchAllTerms(t.itemsHref);
              return [t.slug, termList];
            } catch (e) {
              console.warn("Failed to fetch terms for", t.slug, e);
              return [t.slug, []];
            }
          })
        );

        if (cancelled) return;
        setTaxes(list);
        setTerms(Object.fromEntries(pairs));
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load filters");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [postType]);

  return { loading, taxes, terms, error };
}
