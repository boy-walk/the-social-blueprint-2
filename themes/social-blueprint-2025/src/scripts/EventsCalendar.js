import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import { FilterGroup } from "./FilterGroup";
import { Button } from "./Button";
import { ArrowLeftIcon, ArrowRightIcon, FunnelSimpleIcon, XIcon } from "@phosphor-icons/react";

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
  }, [audiences, types]);

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
          console.log(ev);
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
      types: selectedTypes.toString(),
      topics: selectedTopics.toString(),
      audience: selectedAudiences.toString(),
      locations: selectedLocations.toString(),
      is_featured: onlyFeatured ? "1" : "",
      s: debouncedKeywordValue,
    }));
  }, [dateRange, selectedTypes, selectedTopics, selectedAudiences, selectedLocations, onlyFeatured, debouncedKeywordValue]);

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
    setSelectedTypes([]);
    setSelectedTopics([]);
    setSelectedAudiences([]);
    setSelectedLocations([]);
    setOnlyFeatured(false);
  };

  return (
    <div className="bg-schemesSurface">
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
            <FilterGroup title="Location Type" options={locations} selected={selectedLocations} onChangeHandler={onLocation} />
          </div>
        </aside>

        <section className={`flex-1 min-w-0 transition duration-100 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
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

          <div className="flex items-center justify-between rounded-t-2xl px-3 sm:px-4 md:px-6 lg:px-8 h-14 mb-6">
            <div className="flex items-center justify-end gap-2 w-full">
              <Button onClick={handlePrevClick} icon={<ArrowLeftIcon />} label="Previous Month" />
              <Button onClick={handleNextClick} label="Next Month" icon={<ArrowRightIcon />} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-schemesOutlineVariant overflow-hidden">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={false}
              fixedWeekCount={false}
              dayMaxEvents={4}
              dayMaxEventRows={3}
              eventColor="var(--schemesPrimaryFixed)"
              eventTextColor="var(--schemesOnPrimaryFixed)"
              eventDisplay="block"
              height="800px"
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
        </section>
      </div>

      {tip.visible && (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-[60] max-w-[22rem] rounded-xl border bg-schemesSurface text-schemesOnSurface border-schemesOutlineVariant shadow-3x3 px-4 py-3"
          style={{
            left: Math.min(window.innerWidth - 16, tip.x + 12),
            top: Math.min(window.innerHeight - 16, tip.y + 12),
          }}
          aria-hidden={tip.visible ? "false" : "true"}
        >
          <div className="flex gap-3">
            {tip.image ? (
              <img
                src={tip.image}
                alt=""
                className="w-16 h-16 rounded-lg object-cover shrink-0"
                loading="lazy"
                decoding="async"
              />
            ) : null}
            <div className="min-w-0">
              <div className="Blueprint-title-small-emphasized truncate">{tip.title}</div>
              {tip.range ? <div className="Blueprint-label-small text-schemesOnSurfaceVariant mt-0.5">{tip.range}</div> : null}
              {(tip.venue || tip.location) ? (
                <div className="Blueprint-label-small text-schemesOnSurfaceVariant truncate mt-0.5">
                  {[tip.venue, tip.location].filter(Boolean).join(" • ")}
                </div>
              ) : null}
              {tip.description ? (
                <div className="Blueprint-body-small text-schemesOnSurface mt-2 line-clamp-3 " dangerouslySetInnerHTML={{ __html: tip.description }} />
              ) : null}
            </div>
          </div>
        </div>
      )}

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
          className={`
            absolute left-0 right-0 bottom-0 max-h-[85vh]
            rounded-t-2xl bg-schemesSurface shadow-[0_-16px_48px_rgba(0,0,0,0.25)]
            transition-transform duration-300
            ${isFiltersOpen ? "translate-y-0" : "translate-y-full"}
          `}
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

          <div className="sticky bottom-0 px-4 py-3 bg-schemesSurface border-t border-[var(--schemesOutlineVariant)] flex gap-2">
            <Button onClick={clearAll} variant="outlined" label="Clear all" className="flex-1" />
            <Button onClick={closeFilters} variant="filled" label="Apply" className="flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
