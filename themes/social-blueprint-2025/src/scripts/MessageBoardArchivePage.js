import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { FilterGroup } from "./FilterGroup";
import { Button } from "./Button";
import { MagnifyingGlass, FunnelSimple, X } from "@phosphor-icons/react";
import { Breadcrumbs } from "./Breadcrumbs";

// ─────────────────────────────────────────────────────────────────────────────
// Constants & Helpers (outside component to avoid recreation)
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-800", selectedBg: "bg-blue-600" },
  { bg: "bg-emerald-100", text: "text-emerald-800", selectedBg: "bg-emerald-600" },
  { bg: "bg-amber-100", text: "text-amber-800", selectedBg: "bg-amber-600" },
  { bg: "bg-rose-100", text: "text-rose-800", selectedBg: "bg-rose-600" },
  { bg: "bg-violet-100", text: "text-violet-800", selectedBg: "bg-violet-600" },
  { bg: "bg-cyan-100", text: "text-cyan-800", selectedBg: "bg-cyan-600" },
  { bg: "bg-orange-100", text: "text-orange-800", selectedBg: "bg-orange-600" },
  { bg: "bg-pink-100", text: "text-pink-800", selectedBg: "bg-pink-600" },
  { bg: "bg-teal-100", text: "text-teal-800", selectedBg: "bg-teal-600" },
  { bg: "bg-indigo-100", text: "text-indigo-800", selectedBg: "bg-indigo-600" },
  { bg: "bg-lime-100", text: "text-lime-800", selectedBg: "bg-lime-600" },
  { bg: "bg-fuchsia-100", text: "text-fuchsia-800", selectedBg: "bg-fuchsia-600" },
];

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const getCategoryColor = (label, isSelected = false) => {
  const color = CATEGORY_COLORS[hashString(label) % CATEGORY_COLORS.length];
  return isSelected
    ? { bg: color.selectedBg, text: "text-white" }
    : { bg: color.bg, text: color.text };
};

const stripTags = (html) => {
  if (typeof html !== "string") return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || "").trim();
};

const CATEGORY_PATTERN = /(_category|_categories|category|categories|cat)$/i;

const extractCategoryLabels = (item) => {
  const seen = new Set();
  const labels = [];

  const push = (val) => {
    const name = typeof val === "string" ? val : val?.name || val?.title || "";
    const text = name.toString().trim();
    if (!text) return;
    const key = text.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    labels.push(text);
  };

  // Check categories array
  item?.categories?.forEach(push);

  // Check taxonomies object
  if (item?.taxonomies) {
    for (const [tx, arr] of Object.entries(item.taxonomies)) {
      if (Array.isArray(arr) && CATEGORY_PATTERN.test(tx)) {
        arr.forEach(push);
      }
    }
  }

  // Check direct category properties
  for (const k of Object.keys(item || {})) {
    if (CATEGORY_PATTERN.test(k)) {
      const v = item[k];
      if (Array.isArray(v)) v.forEach(push);
    }
  }

  return labels;
};

const buildTreeAndDescendants = (rows) => {
  const byId = {};
  rows.forEach((r) => {
    const id = String(r.id);
    byId[id] = {
      id,
      name: r.name,
      slug: r.slug,
      parent: String(r.parent ?? 0),
      children: []
    };
  });

  const roots = [];
  rows.forEach((r) => {
    const id = String(r.id);
    const p = byId[id].parent;
    if (p !== "0" && byId[p]) {
      byId[p].children.push(byId[id]);
    } else {
      roots.push(byId[id]);
    }
  });

  const descendants = {};
  const collect = (n) => {
    const acc = [];
    n.children.forEach((c) => {
      acc.push(String(c.id), ...collect(c));
    });
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

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components (memoized)
// ─────────────────────────────────────────────────────────────────────────────

const LeadingIcon = React.memo(({ categoryLabels, categoriesMap }) => {
  let imageUrl = null;
  let faIcon = null;
  let color = null;

  // Find matching category
  for (const label of categoryLabels) {
    const match = categoriesMap.get(label.toLowerCase());
    if (match) {
      imageUrl = match.image_url;
      faIcon = match.fa_icon;
      color = match.color;
      break;
    }
  }

  if (imageUrl) {
    return (
      <div className="w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden shrink-0">
        <img
          src={imageUrl.startsWith('http') ? imageUrl : `/wp-content/uploads/${imageUrl}`}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  if (faIcon) {
    return (
      <div
        className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: color || 'var(--schemesSecondaryContainer)' }}
      >
        <i
          className={`${faIcon} text-xl md:text-2xl`}
          style={{ color: color ? '#fff' : 'var(--schemesOnSecondaryContainer)' }}
        />
      </div>
    );
  }

  // Fallback to first letter
  const letter = (categoryLabels[0]?.[0] || "•").toUpperCase();
  return (
    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-schemesSecondaryContainer flex items-center justify-center shrink-0">
      <span className="Blueprint-title-large md:Blueprint-headline-medium text-schemesOnSecondaryContainer">
        {letter}
      </span>
    </div>
  );
});

const CategoryBadges = React.memo(({ labels }) => {
  if (!labels.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5 md:gap-2 mb-1.5 md:mb-2">
      {labels.map((label, idx) => {
        const color = getCategoryColor(label);
        return (
          <span
            key={idx}
            className={`px-2 py-1 md:px-3 md:py-1.5 rounded-lg ${color.bg} ${color.text} Blueprint-label-small`}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
});

const MessageRow = React.memo(({ item, categoriesMap }) => {
  const categoryLabels = useMemo(() => extractCategoryLabels(item), [item]);
  const href = item?.permalink || "#";
  const excerpt = useMemo(() => stripTags(item?.excerpt || ""), [item?.excerpt]);

  return (
    <a
      href={href}
      className="block rounded-xl border border-schemesOutlineVariant bg-schemesSurfaceContainerLowest hover:bg-schemesSurfaceContainer focus:outline-none focus:ring-2 focus:ring-schemesPrimary transition"
    >
      <div className="flex gap-3 md:gap-4 p-3 md:p-4">
        <LeadingIcon categoryLabels={categoryLabels} categoriesMap={categoriesMap} />
        <div className="flex-1 min-w-0">
          <CategoryBadges labels={categoryLabels} />
          <h3 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized text-schemesOnSurface mb-0.5 md:mb-1 line-clamp-2">
            {item?.title}
          </h3>
          {excerpt && (
            <p className="Blueprint-body-small text-schemesOnSurfaceVariant line-clamp-2">
              {excerpt}
            </p>
          )}
        </div>
      </div>
    </a >
  );
});

const SkeletonRow = React.memo(() => (
  <div className="rounded-xl border border-schemesOutlineVariant overflow-hidden bg-schemesSurface">
    <div className="flex gap-3 md:gap-4 p-3 md:p-4">
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-schemesSurfaceContainerHighest animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 md:h-5 w-3/5 bg-schemesSurfaceContainerHigh animate-pulse rounded" />
        <div className="h-3 md:h-4 w-4/5 bg-schemesSurfaceContainerHigh animate-pulse rounded" />
        <div className="h-3 md:h-4 w-2/3 bg-schemesSurfaceContainerHigh animate-pulse rounded" />
      </div>
    </div>
  </div>
));

const CategoryChips = React.memo(({ options, selected, onSelect }) => (
  <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto pb-3 mb-2 md:mb-3 -mx-4 px-4 md:mx-0 md:px-0">
    <button
      type="button"
      onClick={() => onSelect("")}
      className={`px-2.5 py-1.5 md:px-3 md:py-2 rounded-full whitespace-nowrap transition-colors Blueprint-label-small ${!selected
        ? "bg-gray-700 text-white"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
    >
      All
    </button>
    {options.map((opt) => {
      const isSelected = String(selected) === String(opt.id);
      const color = getCategoryColor(opt.name, isSelected);
      return (
        <button
          key={opt.id}
          type="button"
          onClick={() => onSelect(opt.id)}
          className={`px-2.5 py-1.5 md:px-3 md:py-2 rounded-full whitespace-nowrap transition-colors ${color.bg} ${color.text} ${!isSelected ? "hover:opacity-80" : ""
            } Blueprint-label-small`}
        >
          {opt.name}
        </button>
      );
    })}
  </div>
));

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function MessageBoardArchivePage({
  postType,
  taxonomy,
  currentTerm,
  filters = [],
  endpoint,
  baseQuery = {},
  title,
  subtitle,
  breadcrumbs = [],
  categories = [],
}) {
  // ─────────────────────────────────────────────────────────────────────────
  // Memoized lookups
  // ─────────────────────────────────────────────────────────────────────────

  // Build a Map for O(1) category lookups by name/slug
  const categoriesMap = useMemo(() => {
    const map = new Map();
    categories.forEach((cat) => {
      map.set(cat.name.toLowerCase(), cat);
      map.set(cat.slug.toLowerCase(), cat);
    });
    return map;
  }, [categories]);

  // Identify category taxonomy for chips
  const categoryTax = useMemo(() => {
    const f = filters.find((f) => f.isCategory || CATEGORY_PATTERN.test(f.taxonomy));
    return f?.taxonomy || null;
  }, [filters]);

  // Sidebar filters (exclude category tax)
  const displayedFilters = useMemo(() =>
    filters.filter((f) => f.taxonomy !== taxonomy && f.taxonomy !== categoryTax),
    [filters, taxonomy, categoryTax]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────────────────

  const [page, setPage] = useState(1);
  const [selectedTerms, setSelectedTerms] = useState(() => {
    if (taxonomy && currentTerm?.id) {
      return { [taxonomy]: [String(currentTerm.id)] };
    }
    return {};
  });
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [termsOptions, setTermsOptions] = useState({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [retryTick, setRetryTick] = useState(0);

  // Refs
  const fetchSeqRef = useRef(0);
  const fetchedTaxonomiesRef = useRef(new Set());
  const firstCloseBtnRef = useRef(null);

  // ─────────────────────────────────────────────────────────────────────────
  // Debounce search
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ─────────────────────────────────────────────────────────────────────────
  // Load terms for filters (only taxonomies we need)
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const toFetch = displayedFilters
      .filter((f) => !fetchedTaxonomiesRef.current.has(f.taxonomy))
      .map((f) => f.taxonomy);

    if (categoryTax && !fetchedTaxonomiesRef.current.has(categoryTax)) {
      toFetch.unshift(categoryTax);
    }

    if (!toFetch.length) return;

    let cancelled = false;

    Promise.all(
      toFetch.map(async (tax) => {
        try {
          const res = await fetch(
            `/wp-json/tsb/v1/terms?taxonomy=${encodeURIComponent(tax)}&per_page=100`
          );
          if (!res.ok) throw new Error();
          const json = await res.json();

          const rows = (Array.isArray(json) ? json : []).map((t) => ({
            id: String(t.id),
            name: t.name,
            slug: t.slug,
            parent: String(t.parent ?? 0),
          }));

          const isHier = rows.some((r) => r.parent !== "0");
          return {
            tax,
            data: isHier ? buildTreeAndDescendants(rows).tree : rows
          };
        } catch {
          return { tax, data: [] };
        }
      })
    ).then((results) => {
      if (cancelled) return;

      const next = {};
      results.forEach(({ tax, data }) => {
        next[tax] = data;
        fetchedTaxonomiesRef.current.add(tax);
      });

      setTermsOptions((prev) => ({ ...prev, ...next }));
    });

    return () => { cancelled = true; };
  }, [displayedFilters, categoryTax]);

  // ─────────────────────────────────────────────────────────────────────────
  // Fetch posts
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;
    const seq = ++fetchSeqRef.current;

    setLoading(true);
    setError("");

    const payload = { ...baseQuery, page };

    // Build tax query
    const baseTax = Array.isArray(baseQuery.tax) ? baseQuery.tax : baseQuery.tax ? [baseQuery.tax] : [];
    const uiTax = Object.entries(selectedTerms)
      .filter(([, ids]) => ids?.length)
      .map(([taxKey, ids]) => ({
        taxonomy: taxKey,
        field: "term_id",
        terms: ids.map((id) => parseInt(id, 10)).filter(Number.isFinite),
        operator: "IN",
        include_children: true,
      }));

    const finalTax = [...baseTax, ...uiTax];
    if (finalTax.length) {
      payload.tax = finalTax;
      if (baseQuery.tax_relation) payload.tax_relation = baseQuery.tax_relation;
    }

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (cancelled || seq !== fetchSeqRef.current) return;
        setItems(json.items || []);
        setTotalPages(json.total_pages || 1);
        setTotal(json.total ?? undefined);
      })
      .catch((err) => {
        if (cancelled || seq !== fetchSeqRef.current) return;
        setError(err.message || "Failed to load");
      })
      .finally(() => {
        if (cancelled || seq !== fetchSeqRef.current) return;
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [baseQuery, endpoint, page, selectedTerms, retryTick]);

  // ─────────────────────────────────────────────────────────────────────────
  // Client-side search filtering
  // ─────────────────────────────────────────────────────────────────────────

  const filteredItems = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return items;

    const words = q.split(/\s+/).filter(Boolean);
    return items.filter((item) => {
      const searchText = [
        item.title,
        item.excerpt,
        ...(item.categories || []),
        ...Object.values(item.taxonomies || {}).flat().map((t) => t?.name || ""),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return words.every((w) => searchText.includes(w));
    });
  }, [items, debouncedSearch]);

  // ─────────────────────────────────────────────────────────────────────────
  // Derived state
  // ─────────────────────────────────────────────────────────────────────────

  const categoryOptions = termsOptions[categoryTax] || [];
  const currentCategorySel = (selectedTerms[categoryTax] || [])[0] || "";
  const isSearching = debouncedSearch.trim().length > 0;

  const hasActiveFilters = useMemo(() =>
    Object.entries(selectedTerms).some(
      ([k, arr]) => k !== categoryTax && arr?.length > 0
    ),
    [selectedTerms, categoryTax]
  );

  const filterCount = useMemo(() => {
    let count = isSearching ? 1 : 0;
    for (const [k, arr] of Object.entries(selectedTerms)) {
      if (k !== categoryTax) count += arr?.length || 0;
    }
    return count;
  }, [selectedTerms, categoryTax, isSearching]);

  // ─────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────

  const setCategory = useCallback((id) => {
    setSelectedTerms((prev) => ({
      ...prev,
      [categoryTax]: id ? [String(id)] : []
    }));
    setPage(1);
  }, [categoryTax]);

  const handleFilterChange = useCallback((taxonomy, id, checked) => {
    setSelectedTerms((prev) => {
      const current = prev[taxonomy] || [];
      const next = checked
        ? [...current, id]
        : current.filter((x) => x !== id);
      return { ...prev, [taxonomy]: next };
    });
    setPage(1);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedTerms((prev) => ({ [categoryTax]: prev[categoryTax] || [] }));
    setPage(1);
  }, [categoryTax]);

  const closeFilters = useCallback(() => setIsFiltersOpen(false), []);

  // ─────────────────────────────────────────────────────────────────────────
  // Mobile drawer effects
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isFiltersOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") closeFilters();
    };
    window.addEventListener("keydown", onKey);

    setTimeout(() => firstCloseBtnRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isFiltersOpen, closeFilters]);

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="archive-container bg-schemesSurface">
      {/* Header */}
      <div className="bg-schemesPrimaryFixed py-6 md:py-8">
        <div className="tsb-container">
          <Breadcrumbs items={breadcrumbs} textColour="text-schemesPrimary" />
          <h1 className="Blueprint-headline-medium md:Blueprint-headline-large text-schemesOnSurface mb-1">
            {title}
          </h1>
          {subtitle && (
            <p className="Blueprint-body-small md:Blueprint-body-medium text-schemesOnPrimaryFixedVariant">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Mobile search + filters button */}
      <div className="tsb-container pt-4 md:pt-6">
        <div className="lg:hidden flex items-center gap-2 mb-3 md:mb-4">
          <div className="relative flex-1">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="Blueprint-body-medium w-full pl-4 pr-10 py-2.5 md:py-3 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-schemesPrimary"
            />
            <MagnifyingGlass
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant"
              weight="bold"
            />
          </div>
          <Button
            onClick={() => setIsFiltersOpen(true)}
            icon={<FunnelSimple />}
            label={filterCount ? `(${filterCount})` : "Filters"}
            variant="outlined"
            size="sm"
          />
        </div>
      </div>

      <div className="tsb-container flex flex-col lg:flex-row py-2 md:py-4 lg:py-8 gap-4 md:gap-6 lg:gap-8">
        {/* Desktop sidebar */}
        {displayedFilters.length > 0 && (
          <aside className="hidden lg:block lg:w-64 xl:w-72 shrink-0">
            <div className="mb-6">
              <div className="bg-schemesSurfaceContainer flex items-center gap-2 rounded-full px-4 py-3">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by keyword"
                  className="w-full outline-none Blueprint-body-medium text-schemesOnSurface placeholder:text-schemesOnSurfaceVariant bg-transparent"
                />
                {!searchQuery && (
                  <MagnifyingGlass size={20} className="text-schemesOnSurfaceVariant" weight="bold" />
                )}
              </div>
            </div>

            <h2 className="Blueprint-headline-small-emphasized mb-4 text-schemesOnSurfaceVariant">
              Filters
            </h2>

            {(hasActiveFilters || searchQuery) && (
              <div className="mb-4 flex flex-wrap gap-2">
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
                    handleFilterChange(f.taxonomy, String(e.target.value), e.target.checked);
                  }}
                />
              </div>
            ))}
          </aside>
        )}

        {/* Main content */}
        <section className="flex-1 min-w-0">
          {/* Category chips */}
          {categoryTax && categoryOptions.length > 0 && (
            <CategoryChips
              options={categoryOptions}
              selected={currentCategorySel}
              onSelect={setCategory}
            />
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="mb-6 md:mb-8 rounded-xl border border-schemesOutlineVariant bg-schemesSurface p-4 md:p-6">
              <div className="Blueprint-title-small-emphasized mb-2 text-schemesError">
                Something went wrong
              </div>
              <p className="Blueprint-body-medium text-schemesOnSurfaceVariant mb-4">{error}</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="filled" label="Try again" onClick={() => setRetryTick((n) => n + 1)} />
                {hasActiveFilters && (
                  <Button variant="tonal" label="Clear filters" onClick={clearAllFilters} />
                )}
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredItems.length === 0 && (
            <div className="rounded-2xl border border-schemesOutlineVariant bg-schemesSurface p-6 md:p-10 text-center mb-6 md:mb-8">
              <div className="Blueprint-headline-small mb-2">No results found</div>
              <p className="Blueprint-body-medium text-schemesOnSurfaceVariant mb-6">
                {searchQuery
                  ? "Try a different keyword or clear search."
                  : "Try adjusting or clearing your filters."}
              </p>
              <div className="flex justify-center flex-wrap gap-3">
                {searchQuery ? (
                  <Button variant="filled" label="Clear search" onClick={() => setSearchQuery("")} />
                ) : (
                  <Button variant="filled" label="Clear all filters" onClick={clearAllFilters} />
                )}
                <Button variant="tonal" label="Reload" onClick={() => setRetryTick((n) => n + 1)} />
              </div>
            </div>
          )}

          {/* Results */}
          {!loading && !error && filteredItems.length > 0 && (
            <>
              <div className="mb-2 md:mb-3">
                <p className="Blueprint-body-small md:Blueprint-body-medium text-schemesOnSurfaceVariant">
                  {isSearching
                    ? `${filteredItems.length} match${filteredItems.length === 1 ? "" : "es"}`
                    : typeof total === "number"
                      ? `${total.toLocaleString()} result${total === 1 ? "" : "s"}`
                      : null}
                </p>
              </div>

              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                {filteredItems.map((item) => (
                  <MessageRow
                    key={item.id}
                    item={item}
                    categoriesMap={categoriesMap}
                  />
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && !isSearching && (
            <div className="flex justify-center items-center gap-2 md:gap-3">
              <Button
                size="sm"
                variant="tonal"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                label="Prev"
              />
              <span className="Blueprint-body-small md:Blueprint-body-medium text-schemesOnSurfaceVariant">
                {page} / {totalPages}
              </span>
              <Button
                size="sm"
                variant="tonal"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                label="Next"
              />
            </div>
          )}
        </section>
      </div>

      {/* Mobile filters drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-[70] ${isFiltersOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!isFiltersOpen}
      >
        <div
          onClick={closeFilters}
          className={`absolute inset-0 transition-opacity duration-200 ${isFiltersOpen ? "opacity-100 bg-black/40" : "opacity-0"
            }`}
        />

        <div
          role="dialog"
          aria-modal="true"
          className={`absolute left-0 right-0 bottom-0 max-h-[85vh] rounded-t-2xl bg-schemesSurface shadow-[0_-16px_48px_rgba(0,0,0,0.25)] transition-transform duration-300 flex flex-col ${isFiltersOpen ? "translate-y-0" : "translate-y-full"
            }`}
        >
          <div className="px-4 py-3 border-b border-schemesOutlineVariant shrink-0">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-schemesOutlineVariant" />
            <div className="mt-3 flex items-center justify-between">
              <span className="Blueprint-title-small-emphasized">Filters</span>
              <button
                ref={firstCloseBtnRef}
                type="button"
                onClick={closeFilters}
                className="rounded-full p-2 hover:bg-schemesSurfaceContainerHigh text-schemesOnSurfaceVariant"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="px-4 py-4 overflow-y-auto flex-1 space-y-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="Blueprint-body-medium w-full pl-4 pr-10 py-2.5 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-schemesPrimary"
              />
              <MagnifyingGlass
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant"
                weight="bold"
              />
            </div>

            {displayedFilters.map((f) => (
              <FilterGroup
                key={`m-${f.taxonomy}`}
                title={f.label || f.taxonomy}
                options={termsOptions[f.taxonomy] || []}
                selected={selectedTerms[f.taxonomy] || []}
                onChangeHandler={(e) => {
                  handleFilterChange(f.taxonomy, String(e.target.value), e.target.checked);
                }}
              />
            ))}
          </div>

          <div className="px-4 py-3 bg-schemesSurface border-t border-schemesOutlineVariant flex gap-2 shrink-0">
            <Button onClick={clearAllFilters} variant="outlined" label="Clear all" className="flex-1" />
            <Button onClick={closeFilters} variant="filled" label="Apply" className="flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}