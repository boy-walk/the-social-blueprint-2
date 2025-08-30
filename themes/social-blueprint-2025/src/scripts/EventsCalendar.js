import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import { FilterGroup } from "./FilterGroup";
import { Button } from "./Button";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";

export function EventsCalendar({ types, topics, audiences, locations }) {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeywordValue, setDebouncedKeywordValue] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [requestParams, setRequestParams] = useState({ per_page: 100 });
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedAudiences, setSelectedAudiences] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const calendarRef = useRef(null);
  const isFirstDatesSet = useRef(true);

  // ---- TOOLTIP STATE ----
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

  // Preselect audience from URL once
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const audienceParam = params.get("audience");
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

  // Fetch when request changes
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
            // Pass extras for tooltip (when available)
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

  // Rebuild request on filter/date/search change
  useEffect(() => {
    setRequestParams(prev => ({
      ...prev,
      start_date: dateRange.start,
      end_date: dateRange.end,
      types: selectedTypes.toString(),
      topics: selectedTopics.toString(),
      audience: selectedAudiences.toString(),
      locations: selectedLocations.toString(),
      s: debouncedKeywordValue,
    }));
  }, [dateRange, selectedTypes, selectedTopics, selectedAudiences, selectedLocations, debouncedKeywordValue]);

  // Switch view at md breakpoint
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

  // ---- Tooltip helpers ----
  const fmtRange = (event) => {
    const s = event.start, e = event.end;
    if (!s) return "";
    const dOpts = { year: "numeric", month: "short", day: "numeric" };
    const tOpts = { hour: "2-digit", minute: "2-digit" };

    const sD = s.toLocaleDateString(undefined, dOpts);
    const sT = event.allDay ? "" : s.toLocaleTimeString(undefined, tOpts);

    if (!e || s.toDateString() === e.toDateString()) {
      return event.allDay ? sD : `${sD} • ${sT}`;
    }
    const eD = e.toLocaleDateString(undefined, dOpts);
    const eT = event.allDay ? "" : e.toLocaleTimeString(undefined, tOpts);
    return event.allDay ? `${sD} → ${eD}` : `${sD} ${sT} → ${eD} ${eT}`;
  };

  const showTooltip = (info) => {
    const { event, jsEvent } = info;
    const { image, description, venue, location } = event.extendedProps || {};
    const when = fmtRange(event);
    const where = [venue, location].filter(Boolean).join(" • ");

    const html = `
      <div class="space-y-2">
        <div class="Blueprint-title-small-emphasized">${event.title || "Untitled event"}</div>
        ${when ? `<div class="Blueprint-body-small text-[var(--schemesOnSurfaceVariant)]">${when}</div>` : ""}
        ${where ? `<div class="Blueprint-body-small text-[var(--schemesOnSurfaceVariant)]">${where}</div>` : ""}
        ${image ? `<img src="${image}" alt="" class="w-full h-28 object-cover rounded-lg" />` : ""}
        ${description ? `<div class="Blueprint-body-small line-clamp-7">${description}</div>` : ""}
      </div>
    `;

    setTip({ visible: true, x: jsEvent.clientX, y: jsEvent.clientY, html });

    // follow the cursor
    const onMove = (e) => setTip(t => ({ ...t, x: e.clientX, y: e.clientY }));
    moveHandlerRef.current = onMove;
    document.addEventListener("mousemove", onMove);
  };

  const hideTooltip = () => {
    setTip(t => ({ ...t, visible: false }));
    if (moveHandlerRef.current) {
      document.removeEventListener("mousemove", moveHandlerRef.current);
      moveHandlerRef.current = null;
    }
  };

  // ---- Render ----
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
        {/* Filters */}
        <aside className={`hidden md:hidden lg:block calendar-sidebar pr-4 basis-[20%] shrink-0 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
          <div className="relative flex items-center mb-6">
            <input
              type="text"
              placeholder="Search by keyword"
              onChange={(e) => setKeyword(e.target.value)}
              className="Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large w-full pl-4 pr-10 py-3 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-[var(--schemesPrimary)]"
            />
            <svg className="absolute right-3 text-[var(--schemesOnSurfaceVariant)] w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="flex flex-col gap-4 px-4">
            <h2 className="Blueprint-headline-small-emphasized text-schemesOnSurfaceVariant">Filters</h2>
            <FilterGroup title="Theme" options={types} selected={selectedTypes} onChangeHandler={onType} />
            <FilterGroup title="Topic" options={topics} selected={selectedTopics} onChangeHandler={onTopic} />
            <FilterGroup title="Audience" options={audiences} selected={selectedAudiences} onChangeHandler={onAudience} />
            <FilterGroup title="Location" options={locations} selected={selectedLocations} onChangeHandler={onLocation} />
          </div>
        </aside>

        {/* Calendar */}
        <section className={`flex-1 min-w-0 transition duration-100 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
          <div className="flex items-center justify-between rounded-t-2xl px-3 sm:px-4 md:px-6 lg:px-8 h-14 mb-6">
            <div className="flex items-center justify-end gap-2 w-full">
              <Button onClick={handlePrevClick} icon={<ArrowLeftIcon />} label="Previous Month" />
              <Button onClick={handleNextClick} label="Next Month" icon={<ArrowRightIcon />} />
            </div>
          </div>

          <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-3 rounded-b-2xl">
            <div className="bg-[var(--schemesSurface)] rounded-2xl overflow-hidden">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, listPlugin]}
                initialView="dayGridMonth"
                headerToolbar={false}
                height={800}
                fixedWeekCount={false}
                dayMaxEvents={4}
                dayMaxEventRows={3}
                eventDisplay="block"
                datesSet={datesSet}
                // 👇 TOOLTIP HOOKS
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

      {/* Tooltip layer */}
      {tip.visible && (
        <div
          className="
            pointer-events-none fixed z-[9999]
            max-w-[22rem] rounded-xl border
            bg-[var(--schemesSurface)] text-[var(--schemesOnSurface)]
            border-[var(--schemesOutlineVariant)]
            shadow-[0_12px_24px_rgba(0,0,0,0.18)]
            px-4 py-3
          "
          style={{
            left: Math.min(window.innerWidth - 16, tip.x + 12),
            top: Math.min(window.innerHeight - 16, tip.y + 12),
          }}
          // Render string HTML produced above (safe: we control content; URLs/images come from your API)
          dangerouslySetInnerHTML={{ __html: tip.html }}
        />
      )}
    </div>
  );
}
