import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import { FilterGroup } from "./FilterGroup";
import { Button } from "./Button";
import { ArrowLeftIcon, ArrowRightIcon, FunnelSimpleIcon, XIcon } from "@phosphor-icons/react"; // + funnel & close

export function EventsCalendar({ types, topics, audiences, locations }) {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeywordValue, setDebouncedKeywordValue] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [requestParams, setRequestParams] = useState({ per_page: 100 });

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedAudiences, setSelectedAudiences] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const calendarRef = useRef(null);
  const isFirstDatesSet = useRef(true);

  // NEW: mobile filters drawer
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const firstCloseBtnRef = useRef(null);

  // tooltip state (unchanged)
  const [tip, setTip] = useState({ visible: false, x: 0, y: 0, html: "" });
  const moveHandlerRef = useRef(null);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeywordValue(keyword), 500);
    return () => clearTimeout(t);
  }, [keyword]);

  const handlePrevClick = () => calendarRef.current.getApi().prev();
  const handleNextClick = () => calendarRef.current.getApi().next();
  const clearEvents = () => calendarRef.current.getApi().removeAllEvents();

  const onType = (e) =>
    setSelectedTypes((s) => (e.target.checked ? [...s, e.target.value] : s.filter((v) => v !== e.target.value)));
  const onTopic = (e) =>
    setSelectedTopics((s) => (e.target.checked ? [...s, e.target.value] : s.filter((v) => v !== e.target.value)));
  const onAudience = (e) =>
    setSelectedAudiences((s) => (e.target.checked ? [...s, e.target.value] : s.filter((v) => v !== e.target.value)));
  const onLocation = (e) =>
    setSelectedLocations((s) => (e.target.checked ? [...s, e.target.value] : s.filter((v) => v !== e.target.value)));

  const datesSet = (info) => {
    const start = info.startStr.split("T")[0];
    const end = info.endStr.split("T")[0];
    setDateRange({ start, end });
  };

  const slugify = (s = "") =>
    s.toString().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  // Preselects (unchanged) ...
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const audienceParam = params.get("audience");
    const featuredParam = params.get("featured");
    const themeParam = params.get("theme");
    if (themeParam) {
      const matchedType = (types || []).find(opt => {
        const idStr = String(opt.id);
        const optSlug = (opt.slug ? String(opt.slug) : slugify(opt.name || "")).toLowerCase();
        return themeParam === idStr || themeParam === optSlug;
      });
      if (matchedType) setSelectedTypes([String(matchedType.id)]);
    }
    if (featuredParam === "1") setOnlyFeatured(true);
    if (!audienceParam) return;

    const requested = audienceParam.split(",").map(v => v.trim().toLowerCase()).filter(Boolean);
    if (!requested.length) return;

    const matchedIds = (audiences || [])
      .filter(opt => {
        const idStr = String(opt.id);
        const optSlug = (opt.slug ? String(opt.slug) : slugify(opt.name || "")).toLowerCase();
        return requested.includes(idStr) || requested.includes(optSlug);
      })
      .map(opt => String(opt.id));

    if (matchedIds.length) setSelectedAudiences(matchedIds);
  }, [audiences]);

  // Fetch when request changes (unchanged) ...
  useEffect(() => {
    if (isFirstDatesSet.current) {
      isFirstDatesSet.current = false;
      return;
    }
    let cancelled = false;
    setIsLoading(true);

    (async () => {
      try {
        const qs = new URLSearchParams(requestParams).toString();
        const res = await fetch(`/wp-json/sbp/v1/events${qs ? "?" + qs : ""}`, { headers: { Accept: "application/json" } });
        const json = await res.json();
        if (cancelled) return;

        clearEvents();
        const api = calendarRef.current.getApi();
        (json.events || []).forEach((ev) => {
          api.addEvent({
            id: ev.id,
            title: ev.title || "Untitled",
            start: ev.start,
            end: ev.end,
            url: ev.url,
            extendedProps: {
              image: ev.image || null,
              description: ev.description || "",
              venue: ev.venue || "",
              location: ev.location || "",
            },
          });
        });
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [requestParams]);

  // Rebuild request on filter/date/search change (unchanged)
  useEffect(() => {
    setRequestParams(prev => ({
      ...prev,
      start_date: dateRange.start,
      end_date: dateRange.end,
      types: selectedTypes.toString(),
      topics: selectedTopics.toString(),
      audience: selectedAudiences.toString(),
      locations: selectedLocations.toString(),
      is_featured: onlyFeatured ? "1" : "",
      s: debouncedKeywordValue,
    }));
  }, [dateRange, selectedTypes, selectedTopics, selectedAudiences, selectedLocations, onlyFeatured, debouncedKeywordValue]);

  // Responsive view (unchanged)
  const applyResponsiveView = (api) => {
    if (!api || typeof window === "undefined") return;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const desired = mobile ? "listMonth" : "dayGridMonth";
    if (api.view?.type !== desired) api.changeView(desired);
  };
  useEffect(() => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    applyResponsiveView(api);
    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = () => applyResponsiveView(api);
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);
    const hideTip = () => setTip(t => ({ ...t, visible: false }));
    window.addEventListener("scroll", hideTip, true);
    window.addEventListener("resize", hideTip);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
      window.removeEventListener("scroll", hideTip, true);
      window.removeEventListener("resize", hideTip);
    };
  }, []);

  // Tooltip helpers (unchanged) ...
  const fmtRange = (event) => { /* ... */ };
  const showTooltip = (info) => { /* ... */ };
  const hideTooltip = () => { /* ... */ };

  // ---- Mobile filter UX helpers ----
  const filterCount =
    selectedTypes.length +
    selectedTopics.length +
    selectedAudiences.length +
    selectedLocations.length +
    (onlyFeatured ? 1 : 0) +
    (debouncedKeywordValue ? 1 : 0);

  const openFilters = () => setIsFiltersOpen(true);
  const closeFilters = () => setIsFiltersOpen(false);

  // lock scroll on open + esc to close + focus the close button
  useEffect(() => {
    if (isFiltersOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const onKey = (e) => { if (e.key === "Escape") closeFilters(); };
      window.addEventListener("keydown", onKey);
      setTimeout(() => firstCloseBtnRef.current?.focus(), 0);
      return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
    }
  }, [isFiltersOpen]);

  const clearAll = () => {
    setKeyword("");
    setSelectedTypes([]);
    setSelectedTopics([]);
    setSelectedAudiences([]);
    setSelectedLocations([]);
    setOnlyFeatured(false);
  };

  // ---- Render ----
  return (
    <div className="bg-schemesSurface">
      {/* Hero */}
      <div className="bg-schemesPrimaryFixed">
        <div className="tsb-container">
          <div className="py-16 flex flex-col justify-end items-start gap-2 max-w-3xl">
            <div className="py-4 px-1.5 Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large">
              Upcoming Community Events
            </div>
            <div className="lg:Blueprint-body-large md:Blueprint-body-medium Blueprint-body-small text-schemesOnPrimaryFixedVariant">
              Stay informed and connected. Find community jobs, volunteer opportunities, local notices, and informal support through our active message boards and groups.
            </div>
          </div>
        </div>
      </div>

      <div className={`tsb-container py-8 flex flex-grow ${isLoading ? "cursor-wait" : ""}`}>
        {/* DESKTOP/LG filters sidebar */}
        <aside className={`hidden md:hidden lg:block calendar-sidebar pr-4 basis-[20%] shrink-0 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
          <div className="relative flex items-center mb-6">
            <input
              type="text"
              placeholder="Search by keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large w-full pl-4 pr-10 py-3 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-[var(--schemesPrimary)]"
            />
            <svg className="absolute right-3 text-[var(--schemesOnSurfaceVariant)] w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="flex flex-col gap-4 px-4">
            <h2 className="Blueprint-headline-small-emphasized text-schemesOnSurfaceVariant">Filters</h2>

            <FilterGroup
              options={[{ id: "1", name: "Featured only" }]}
              selected={onlyFeatured ? ["1"] : []}
              onChangeHandler={(e) => setOnlyFeatured(!!e.target.checked)}
            />

            <FilterGroup title="Theme" options={types} selected={selectedTypes} onChangeHandler={onType} />
            <FilterGroup title="Topic" options={topics} selected={selectedTopics} onChangeHandler={onTopic} />
            <FilterGroup title="Audience" options={audiences} selected={selectedAudiences} onChangeHandler={onAudience} />
            <FilterGroup title="Location" options={locations} selected={selectedLocations} onChangeHandler={onLocation} />
          </div>
        </aside>

        {/* Calendar + MOBILE header actions */}
        <section className={`flex-1 min-w-0 transition duration-100 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
          {/* Mobile search + filter button */}
          <div className="lg:hidden px-3 sm:px-4 md:px-6 flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="Blueprint-body-medium w-full pl-4 pr-10 py-3 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-[var(--schemesPrimary)]"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--schemesOnSurfaceVariant)] w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
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

          {/* Calendar header */}
          <div className="flex items-center justify-between rounded-t-2xl px-3 sm:px-4 md:px-6 lg:px-8 h-14 mb-6">
            <div className="flex items-center justify-end gap-2 w-full">
              <Button onClick={handlePrevClick} icon={<ArrowLeftIcon />} label="Previous Month" />
              <Button onClick={handleNextClick} label="Next Month" icon={<ArrowRightIcon />} />
            </div>
          </div>

          {/* Calendar */}
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-3 rounded-b-2xl">
            <div className="bg-[var(--schemesSurface)] rounded-2xl overflow-hidden">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, listPlugin]}
                initialView="dayGridMonth"
                headerToolbar={false}
                fixedWeekCount={false}
                dayMaxEvents={4}
                dayMaxEventRows={3}
                eventDisplay="block"
                datesSet={datesSet}
                eventMouseEnter={showTooltip}
                eventMouseLeave={hideTooltip}
                views={{
                  dayGridMonth: {
                    showNonCurrentDates: false,
                    displayEventTime: false,
                    dayHeaderFormat: { weekday: "short" },
                  },
                  listMonth: {
                    noEventsContent: "No events this month",
                  },
                }}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Tooltip layer (unchanged) */}
      {tip.visible && (
        <div
          className="pointer-events-none fixed z-[60] max-w-[22rem] rounded-xl border bg-[var(--schemesSurface)] text-[var(--schemesOnSurface)] border-[var(--schemesOutlineVariant)] shadow-[0_12px_24px_rgba(0,0,0,0.18)] px-4 py-3"
          style={{ left: Math.min(window.innerWidth - 16, tip.x + 12), top: Math.min(window.innerHeight - 16, tip.y + 12) }}
          dangerouslySetInnerHTML={{ __html: tip.html }}
        />
      )}

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
          className={`
            absolute left-0 right-0 bottom-0 max-h-[85vh]
            rounded-t-2xl bg-schemesSurface shadow-[0_-16px_48px_rgba(0,0,0,0.25)]
            transition-transform duration-300
            ${isFiltersOpen ? "translate-y-0" : "translate-y-full"}
          `}
        >
          {/* Drag handle + header */}
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

          {/* Content */}
          <div className="px-4 py-4 overflow-y-auto space-y-4">
            {/* Keyword on mobile inside sheet too (optional secondary) */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="Blueprint-body-medium w-full pl-4 pr-10 py-3 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-[var(--schemesPrimary)]"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--schemesOnSurfaceVariant)] w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <FilterGroup
              options={[{ id: "1", name: "Featured only" }]}
              selected={onlyFeatured ? ["1"] : []}
              onChangeHandler={(e) => setOnlyFeatured(!!e.target.checked)}
            />
            <FilterGroup title="Theme" options={types} selected={selectedTypes} onChangeHandler={onType} />
            <FilterGroup title="Topic" options={topics} selected={selectedTopics} onChangeHandler={onTopic} />
            <FilterGroup title="Audience" options={audiences} selected={selectedAudiences} onChangeHandler={onAudience} />
            <FilterGroup title="Location" options={locations} selected={selectedLocations} onChangeHandler={onLocation} />
          </div>

          {/* Footer actions */}
          <div className="sticky bottom-0 px-4 py-3 bg-schemesSurface border-t border-[var(--schemesOutlineVariant)] flex gap-2">
            <Button
              onClick={clearAll}
              variant="outlined"
              label="Clear all"
              className="flex-1"
            />
            <Button
              onClick={closeFilters}
              variant="filled"
              label="Apply"
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
