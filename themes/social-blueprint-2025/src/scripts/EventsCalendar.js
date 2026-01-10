import React, { useEffect, useRef, useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import { Button } from "./Button";
import { DropdownSelect } from "./DropdownSelect";
import { ArrowLeft, ArrowRight, FunnelSimple, X, MagnifyingGlass } from "@phosphor-icons/react";

export function EventsCalendar({ categories, types, topics, audiences, locations }) {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeywordValue, setDebouncedKeywordValue] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [requestParams, setRequestParams] = useState({ per_page: 100 });

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedAudiences, setSelectedAudiences] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [supportsHover, setSupportsHover] = useState(true);

  const calendarRef = useRef(null);
  const isFirstDatesSet = useRef(true);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const firstCloseBtnRef = useRef(null);

  const [tip, setTip] = useState({
    visible: false,
    x: 0,
    y: 0,
    title: "",
    range: "",
    venue: "",
    location: "",
    description: "",
    image: null,
    url: "",
  });
  const moveHandlerRef = useRef(null);
  const rafRef = useRef(null);

  // Convert options to DropdownSelect format
  const categoryOptions = useMemo(() =>
    (categories || []).map(opt => ({ value: String(opt.id), label: opt.name })),
    [categories]
  );

  const typeOptions = useMemo(() =>
    (Object.values(types) || []).map(opt => ({ value: String(opt.id), label: opt.name })),
    [types]
  );

  const topicOptions = useMemo(() =>
    (Object.values(topics) || []).map(opt => ({ value: String(opt.id), label: opt.name })),
    [topics]
  );

  const audienceOptions = useMemo(() =>
    (audiences || []).map(opt => ({ value: String(opt.id), label: opt.name })),
    [audiences]
  );

  const locationTypeOptions = useMemo(() => [
    { value: "In Person", label: "In Person" },
    { value: "Online", label: "Online" }
  ], []);

  // Detect if device supports hover
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setSupportsHover(hoverQuery.matches);

    const onChange = (e) => setSupportsHover(e.matches);
    if (hoverQuery.addEventListener) {
      hoverQuery.addEventListener("change", onChange);
    } else {
      hoverQuery.addListener(onChange);
    }

    return () => {
      if (hoverQuery.removeEventListener) {
        hoverQuery.removeEventListener("change", onChange);
      } else {
        hoverQuery.removeListener(onChange);
      }
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeywordValue(keyword), 500);
    return () => clearTimeout(t);
  }, [keyword]);

  const getApi = () => {
    const cal = calendarRef.current;
    if (!cal) return null;
    return cal.getApi();
  };

  const handlePrevClick = () => {
    const api = getApi();
    if (api) api.prev();
  };

  const handleNextClick = () => {
    const api = getApi();
    if (api) api.next();
  };

  const handleTodayClick = () => {
    const api = getApi();
    if (api) api.today();
  };

  const clearEvents = () => {
    const api = getApi();
    if (api) api.removeAllEvents();
  };

  const changeView = (viewName) => {
    const api = getApi();
    if (api) api.changeView(viewName);
  };

  const datesSet = (info) => {
    const start = info.startStr.split("T")[0];
    const end = info.endStr.split("T")[0];
    setDateRange({ start, end });
    setCurrentView(info.view.type);
  };

  const slugify = (s = "") =>
    s.toString().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const audienceParam = params.get("audience");
    const featuredParam = params.get("featured");
    const themeParam = params.get("theme");
    const categoryParam = params.get("category");

    if (categoryParam) {
      const matchedCategory = (categories || []).find(opt => {
        const idStr = String(opt.id);
        const optSlug = (opt.slug ? String(opt.slug) : slugify(opt.name || "")).toLowerCase();
        return categoryParam === idStr || categoryParam === optSlug;
      });
      if (matchedCategory) setSelectedCategories([String(matchedCategory.id)]);
    }

    if (themeParam) {
      const matchedType = (Object.values(types) || []).find(opt => {
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
  }, [audiences, types, categories]);

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

  useEffect(() => {
    setRequestParams(prev => ({
      ...prev,
      start_date: dateRange.start,
      end_date: dateRange.end,
      categories: selectedCategories.toString(),
      types: selectedTypes.toString(),
      topics: selectedTopics.toString(),
      audience: selectedAudiences.toString(),
      location_type: selectedLocations.toString(),
      is_featured: onlyFeatured ? "1" : "",
      s: debouncedKeywordValue,
    }));
  }, [dateRange, selectedCategories, selectedTypes, selectedTopics, selectedAudiences, selectedLocations, onlyFeatured, debouncedKeywordValue]);

  const applyResponsiveView = (api) => {
    if (!api || typeof window === "undefined") return;
    const mobile = window.matchMedia("(max-width: 568px)").matches;
    if (mobile) {
      if (api.view?.type !== "listMonth") {
        api.changeView("listMonth");
        setCurrentView("listMonth");
      }
    }
  };

  useEffect(() => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    applyResponsiveView(api);
    const mql = window.matchMedia("(max-width: 568px)");
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

  const fmtRange = (event) => {
    const s = event.start ? new Date(event.start) : null;
    const e = event.end ? new Date(event.end) : null;
    if (!s) return "";
    const dateFmt = new Intl.DateTimeFormat(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    const timeFmt = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
    const sameDay = e && s.toDateString() === e.toDateString();
    if (!e) return `${dateFmt.format(s)} • ${timeFmt.format(s)}`;
    if (sameDay) return `${dateFmt.format(s)} • ${timeFmt.format(s)}–${timeFmt.format(e)}`;
    return `${dateFmt.format(s)} ${timeFmt.format(s)} → ${dateFmt.format(e)} ${timeFmt.format(e)}`;
  };

  const showTooltip = (info) => {
    const { event, jsEvent } = info;
    const ep = event.extendedProps || {};
    const nextTip = {
      visible: true,
      x: jsEvent.clientX,
      y: jsEvent.clientY,
      title: event.title || "",
      range: fmtRange(event),
      venue: ep.venue || "",
      location: ep.location || "",
      description: ep.description || "",
      image: ep.image || null,
      url: event.url || "",
    };
    setTip(nextTip);

    const onMove = (e) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setTip((t) => ({
          ...t,
          x: e.clientX,
          y: e.clientY,
        }));
      });
    };
    moveHandlerRef.current = onMove;
    document.addEventListener("mousemove", onMove, { passive: true });
  };

  const hideTooltip = () => {
    if (moveHandlerRef.current) {
      document.removeEventListener("mousemove", moveHandlerRef.current);
      moveHandlerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setTip(t => ({ ...t, visible: false }));
  };

  const filterCount =
    selectedCategories.length +
    selectedTypes.length +
    selectedTopics.length +
    selectedAudiences.length +
    selectedLocations.length +
    (onlyFeatured ? 1 : 0) +
    (debouncedKeywordValue ? 1 : 0);

  const openFilters = () => setIsFiltersOpen(true);
  const closeFilters = () => setIsFiltersOpen(false);

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
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSelectedTopics([]);
    setSelectedAudiences([]);
    setSelectedLocations([]);
    setOnlyFeatured(false);
  };

  const viewOptions = [
    { key: "dayGridMonth", label: "Month" },
    { key: "listWeek", label: "Week" },
    { key: "listDay", label: "Day" },
  ];

  // Render filters (reusable for desktop and mobile)
  const renderFilters = (isMobile = false) => (
    <div className="space-y-4">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={onlyFeatured}
          onChange={(e) => setOnlyFeatured(e.target.checked)}
          className="w-5 h-5 rounded border-schemesOutline text-schemesPrimary focus:ring-schemesPrimary"
        />
        <span className="Blueprint-body-medium text-schemesOnSurface">
          Featured only
        </span>
      </label>

      {categoryOptions.length > 0 && (
        <DropdownSelect
          label="Category"
          placeholder="Select categories..."
          multiple
          searchable
          searchPlaceholder="Search categories..."
          options={categoryOptions}
          value={selectedCategories}
          onChange={setSelectedCategories}
        />
      )}

      {typeOptions.length > 0 && (
        <DropdownSelect
          label="Theme"
          placeholder="Select themes..."
          multiple
          searchable
          searchPlaceholder="Search themes..."
          options={typeOptions}
          value={selectedTypes}
          onChange={setSelectedTypes}
        />
      )}

      {topicOptions.length > 0 && (
        <DropdownSelect
          label="Topic"
          placeholder="Select topics..."
          multiple
          searchable
          searchPlaceholder="Search topics..."
          options={topicOptions}
          value={selectedTopics}
          onChange={setSelectedTopics}
        />
      )}

      {audienceOptions.length > 0 && (
        <DropdownSelect
          label="Audience"
          placeholder="Select audiences..."
          multiple
          searchable
          searchPlaceholder="Search audiences..."
          options={audienceOptions}
          value={selectedAudiences}
          onChange={setSelectedAudiences}
        />
      )}

      <DropdownSelect
        label="Location Type"
        placeholder="Select location type..."
        multiple
        searchable={false}
        options={locationTypeOptions}
        value={selectedLocations}
        onChange={setSelectedLocations}
      />
    </div>
  );

  return (
    <div className="bg-schemesSurface">
      {/* Calendar CSS fixes */}
      <style>{`
        .calendar-wrapper .fc {
          font-family: inherit;
        }
        
        /* Month view events */
        .calendar-wrapper .fc-daygrid-event {
          padding: 2px 4px;
          font-size: 0.8125rem;
          line-height: 1.3;
          border-radius: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .calendar-wrapper .fc-daygrid-day-frame {
          min-height: 100px;
        }
        .calendar-wrapper .fc-daygrid-event .fc-event-time {
          font-weight: 600;
          margin-right: 4px;
        }
        
        /* List view styles */
        .calendar-wrapper .fc-list {
          border: none;
        }
        .calendar-wrapper .fc-list-day-cushion {
          background-color: var(--schemesSurfaceContainerHigh) !important;
          padding: 12px 16px;
        }
        .calendar-wrapper .fc-list-day-text {
          font-weight: 600;
          color: var(--schemesOnSurface);
        }
        .calendar-wrapper .fc-list-event {
          cursor: pointer;
        }
        .calendar-wrapper .fc-list-event:hover td {
          background-color: var(--schemesSurfaceContainerHighest) !important;
        }
        .calendar-wrapper .fc-list-event-time {
          padding: 12px 16px;
          font-weight: 500;
          color: var(--schemesOnSurfaceVariant);
          white-space: nowrap;
        }
        .calendar-wrapper .fc-list-event-graphic {
          padding: 12px 8px;
        }
        .calendar-wrapper .fc-list-event-dot {
          border-color: var(--schemesPrimary) !important;
        }
        .calendar-wrapper .fc-list-event-title {
          padding: 12px 16px;
          font-weight: 500;
        }
        .calendar-wrapper .fc-list-event-title a {
          color: var(--schemesOnSurface);
          text-decoration: none;
        }
        .calendar-wrapper .fc-list-event-title a:hover {
          color: var(--schemesPrimary);
        }
        
        /* Day view - taller minimum height */
        .calendar-wrapper .fc-listDay-view {
          min-height: 500px;
        }
        .calendar-wrapper .fc-listDay-view .fc-list-empty {
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Headers */
        .calendar-wrapper .fc-col-header-cell {
          padding: 12px 0;
          font-weight: 600;
        }
        
        /* Borders */
        .calendar-wrapper .fc-scrollgrid {
          border: none !important;
        }
        .calendar-wrapper .fc-scrollgrid td,
        .calendar-wrapper .fc-scrollgrid th {
          border-color: var(--schemesOutlineVariant) !important;
        }
        
        /* Today highlight */
        .calendar-wrapper .fc-day-today {
          background-color: var(--schemesPrimaryContainer) !important;
        }
      `}</style>

      <div className="bg-schemesPrimaryFixed">
        <div className="tsb-container">
          <div className="py-16 flex flex-col justify-end items-start gap-2 max-w-3xl">
            <div className="py-4 px-1.5 Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large">
              Upcoming Community Events
            </div>
            <div className="lg:Blueprint-body-large md:Blueprint-body-medium Blueprint-body-small text-schemesOnPrimaryFixedVariant">
              Connect. Celebrate. Belong. Explore Melbourne's Jewish Events.
            </div>
          </div>
        </div>
      </div>

      <div className={`tsb-container py-8 flex flex-grow ${isLoading ? "cursor-wait" : ""}`}>
        {/* Desktop sidebar */}
        <aside className={`hidden lg:block calendar-sidebar pr-4 basis-[20%] shrink-0 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
          {/* Search */}
          <div className="mb-6">
            <label htmlFor="calendar-search" className="sr-only">Search by keyword</label>
            <div className="relative">
              <input
                id="calendar-search"
                type="text"
                placeholder="Search by keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="Blueprint-body-medium w-full pl-4 pr-10 py-3 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-schemesPrimary"
              />
              <MagnifyingGlass
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant"
                weight="bold"
              />
            </div>
          </div>

          <h2 className="Blueprint-headline-small-emphasized text-schemesOnSurfaceVariant mb-4">Filters</h2>

          {filterCount > 0 && (
            <div className="mb-4">
              <Button size="sm" variant="tonal" onClick={clearAll} label="Clear all filters" />
            </div>
          )}

          {renderFilters(false)}
        </aside>

        <section className={`flex-1 min-w-0 transition duration-100 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
          {/* Mobile: Search + Filter button */}
          <div className="lg:hidden px-3 sm:px-4 md:px-6 flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="Blueprint-body-medium w-full pl-4 pr-10 py-3 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-schemesPrimary"
              />
              <MagnifyingGlass
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant"
                weight="bold"
              />
            </div>

            <Button
              onClick={openFilters}
              icon={<FunnelSimple />}
              label={filterCount ? `Filters (${filterCount})` : "Filters"}
              variant="outlined"
              size="base"
              aria-expanded={isFiltersOpen}
              aria-controls="mobile-filters"
            />
          </div>

          {/* Calendar controls: nav + view switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-3 sm:px-4 md:px-6 lg:px-8 mb-6">
            {/* Navigation buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevClick}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-schemesOutline text-schemesOnSurface Blueprint-label-large hover:bg-schemesSurfaceContainerHigh transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <button
                type="button"
                onClick={handleTodayClick}
                className="px-4 py-2 rounded-full bg-schemesPrimaryContainer text-schemesOnPrimaryContainer Blueprint-label-large hover:bg-schemesPrimary hover:text-schemesOnPrimary transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handleNextClick}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-schemesOutline text-schemesOnSurface Blueprint-label-large hover:bg-schemesSurfaceContainerHigh transition-colors"
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* View switcher - hidden on mobile */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-schemesSurfaceContainerHigh">
              {viewOptions.map((opt) => {
                const isActive = currentView === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => changeView(opt.key)}
                    className={`px-4 py-2 rounded-full Blueprint-label-large transition-colors ${isActive
                      ? "bg-schemesPrimary text-schemesOnPrimary"
                      : "text-schemesOnSurfaceVariant hover:bg-schemesSurfaceContainerHighest"
                      }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-schemesOutlineVariant overflow-hidden calendar-wrapper">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={false}
              fixedWeekCount={false}
              dayMaxEvents={3}
              dayMaxEventRows={3}
              eventColor="var(--schemesPrimaryFixed)"
              eventTextColor="var(--schemesOnPrimaryFixed)"
              eventDisplay="block"
              height="auto"
              datesSet={datesSet}
              eventMouseEnter={supportsHover ? showTooltip : undefined}
              eventMouseLeave={supportsHover ? hideTooltip : undefined}
              nowIndicator={true}
              eventTimeFormat={{
                hour: "numeric",
                minute: "2-digit",
                meridiem: "short",
              }}
              views={{
                dayGridMonth: {
                  showNonCurrentDates: false,
                  displayEventTime: false,
                  dayHeaderFormat: { weekday: "short" },
                  dayMaxEvents: 3,
                },
                listWeek: {
                  listDayFormat: { weekday: "long", month: "long", day: "numeric" },
                  listDaySideFormat: false,
                  noEventsContent: "No events this week",
                },
                listDay: {
                  listDayFormat: { weekday: "long", month: "long", day: "numeric", year: "numeric" },
                  listDaySideFormat: false,
                  noEventsContent: "No events today",
                },
                listMonth: {
                  noEventsContent: "No events this month",
                },
              }}
            />
          </div>
        </section>
      </div>

      {/* Tooltip */}
      {supportsHover && tip.visible && (() => {
        const tooltipWidth = 448;
        const tooltipHeight = 200;
        const offset = 12;
        const padding = 16;

        const spaceOnRight = window.innerWidth - tip.x - offset - padding;
        const spaceOnLeft = tip.x - offset - padding;
        const showOnLeft = spaceOnRight < tooltipWidth && spaceOnLeft > spaceOnRight;

        const spaceBelow = window.innerHeight - tip.y - offset - padding;
        const spaceAbove = tip.y - offset - padding;
        const showAbove = spaceBelow < tooltipHeight && spaceAbove > spaceBelow;

        const style = {
          ...(showOnLeft
            ? { right: window.innerWidth - tip.x + offset }
            : { left: tip.x + offset }
          ),
          ...(showAbove
            ? { bottom: window.innerHeight - tip.y + offset }
            : { top: tip.y + offset }
          ),
        };

        return (
          <div
            role="tooltip"
            className="pointer-events-none fixed z-[10000] max-w-md rounded-2xl border bg-schemesSurface text-schemesOnSurface border-schemesOutlineVariant shadow-3x3 p-5"
            style={style}
            aria-hidden={!tip.visible}
          >
            <div className="flex gap-4">
              {tip.image && (
                <img
                  src={tip.image}
                  alt=""
                  className="w-28 h-28 rounded-xl object-cover shrink-0"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="Blueprint-title-medium-emphasized line-clamp-2">{tip.title}</div>
                {tip.range && <div className="Blueprint-body-small text-schemesOnSurfaceVariant mt-1">{tip.range}</div>}
                {(tip.venue || tip.location) && (
                  <div className="Blueprint-body-small text-schemesOnSurfaceVariant mt-1">
                    {[tip.venue, tip.location].filter(Boolean).join(" • ")}
                  </div>
                )}
                {tip.description && (
                  <div className="Blueprint-body-medium text-schemesOnSurface mt-3 line-clamp-4" dangerouslySetInnerHTML={{ __html: tip.description }} />
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Mobile filters drawer */}
      <div
        id="mobile-filters"
        className={`lg:hidden fixed inset-0 z-[70] ${isFiltersOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!isFiltersOpen}
      >
        <div
          onClick={closeFilters}
          className={`absolute inset-0 transition-opacity ${isFiltersOpen ? "opacity-100" : "opacity-0"} bg-black/40`}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className={`absolute left-0 right-0 bottom-0 max-h-[85vh] rounded-t-2xl bg-schemesSurface shadow-[0_-16px_48px_rgba(0,0,0,0.25)] transition-transform duration-300 flex flex-col ${isFiltersOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="relative px-4 py-3 border-b border-schemesOutlineVariant shrink-0">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-schemesOutlineVariant" />
            <div className="mt-3 flex items-center justify-between">
              <div className="Blueprint-title-small-emphasized">Filters</div>
              <button
                ref={firstCloseBtnRef}
                type="button"
                onClick={closeFilters}
                className="rounded-full p-2 hover:bg-schemesSurfaceContainerHigh text-schemesOnSurfaceVariant"
                aria-label="Close filters"
              >
                <X />
              </button>
            </div>
          </div>

          <div className="px-4 py-4 overflow-y-auto flex-1 space-y-4">
            {/* Search in drawer */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="Blueprint-body-medium w-full pl-4 pr-10 py-3 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-schemesPrimary"
              />
              <MagnifyingGlass
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant"
                weight="bold"
              />
            </div>

            {renderFilters(true)}
          </div>

          <div className="sticky bottom-0 px-4 py-3 bg-schemesSurface border-t border-schemesOutlineVariant flex gap-2 shrink-0">
            <Button onClick={clearAll} variant="outlined" label="Clear all" className="flex-1" />
            <Button onClick={closeFilters} variant="filled" label="Apply" className="flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}