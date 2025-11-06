"use strict";
(globalThis["webpackChunkbrads_boilerplate_theme"] = globalThis["webpackChunkbrads_boilerplate_theme"] || []).push([["events-calendar"],{

/***/ "./src/scripts/Button.js":
/*!*******************************!*\
  !*** ./src/scripts/Button.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Button: () => (/* binding */ Button)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function Button({
  className = '',
  label = 'Label',
  size = 'base',
  variant = 'filled',
  shape = 'square',
  icon,
  disabled = false,
  onClick = () => {},
  type = 'button'
}) {
  const sizeStyles = {
    xs: 'px-3 py-1.5 Blueprint-label-small md:Blueprint-label-medium lg:Blueprint-label-large',
    sm: 'px-4 py-2 Blueprint-label-small md:Blueprint-label-medium lg:Blueprint-label-large',
    base: 'px-4 py-2.5 Blueprint-title-small md:Blueprint-title-medium lg:Blueprint-title-large',
    lg: 'px-4 py-4 Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large',
    xl: 'px-8 py-6 Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large'
  }[size];
  const rounded = {
    square: {
      xs: 'rounded-xl',
      sm: 'rounded-xl',
      base: 'rounded-[16px]',
      lg: 'rounded-[16px]',
      xl: 'rounded-[28px]'
    },
    pill: {
      xs: 'rounded-[100px]',
      sm: 'rounded-[100px]',
      base: 'rounded-[100px]',
      lg: 'rounded-[100px]',
      xl: 'rounded-[100px]'
    }
  };
  const variantStyles = {
    filled: 'bg-[var(--schemesPrimary)] text-[var(--schemesOnPrimary)] hover:bg-[var(--palettesPrimary40)]',
    tonal: 'bg-[var(--schemesPrimaryFixed)] text-[var(--schemesOnPrimaryFixedVariant)] hover:bg-[var(--schemesPrimaryFixedDim)]',
    outline: 'border border-[var(--schemesOnPrimary)] text-[var(--schemesOnPrimary)] hover:bg-[var(--palettesOnPrimary40)]',
    elevated: 'bg-[var(--schemesSurfaceContainerHigh)] text-[var(--schemesPrimary)] shadow-3x3 hover:bg-[var(--stateLayersSurfaceContainerHighOpacity08)]',
    text: 'bg-transparent text-[var(--schemesPrimary)] hover:bg-[var(--palettesPrimary60)]'
  }[variant];

  // cursor + disabled handling
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';
  const baseCursor = disabled ? '' : 'cursor-pointer';
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("button", {
    type: type,
    onClick: onClick,
    disabled: disabled,
    "aria-disabled": disabled,
    className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])('inline-flex items-center justify-center gap-2 transition-colors duration-150', baseCursor,
    // pointer on hover for enabled buttons
    sizeStyles, rounded[shape][size], variantStyles, disabledStyles,
    // overrides cursor when disabled
    className),
    children: [icon && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
      className: "shrink-0",
      children: icon
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
      className: "Blueprint-label-large",
      children: label
    })]
  });
}

/***/ }),

/***/ "./src/scripts/EventsCalendar.js":
/*!***************************************!*\
  !*** ./src/scripts/EventsCalendar.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventsCalendar: () => (/* binding */ EventsCalendar)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fullcalendar_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fullcalendar/react */ "./node_modules/@fullcalendar/react/dist/index.js");
/* harmony import */ var _fullcalendar_daygrid__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fullcalendar/daygrid */ "./node_modules/@fullcalendar/daygrid/index.js");
/* harmony import */ var _fullcalendar_list__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @fullcalendar/list */ "./node_modules/@fullcalendar/list/index.js");
/* harmony import */ var _FilterGroup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FilterGroup */ "./src/scripts/FilterGroup.js");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Button */ "./src/scripts/Button.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/FunnelSimple.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/ArrowLeft.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/ArrowRight.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/X.es.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);








function EventsCalendar({
  types,
  topics,
  audiences,
  locations
}) {
  const [keyword, setKeyword] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const [debouncedKeywordValue, setDebouncedKeywordValue] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const [dateRange, setDateRange] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    start: "",
    end: ""
  });
  const [requestParams, setRequestParams] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    per_page: 100
  });
  const [selectedTypes, setSelectedTypes] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [selectedTopics, setSelectedTopics] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [selectedAudiences, setSelectedAudiences] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [selectedLocations, setSelectedLocations] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [onlyFeatured, setOnlyFeatured] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const calendarRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const isFirstDatesSet = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(true);
  const [isFiltersOpen, setIsFiltersOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const firstCloseBtnRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [tip, setTip] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    visible: false,
    x: 0,
    y: 0,
    title: "",
    range: "",
    venue: "",
    location: "",
    description: "",
    image: null,
    url: ""
  });
  const moveHandlerRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const rafRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const t = setTimeout(() => setDebouncedKeywordValue(keyword), 500);
    return () => clearTimeout(t);
  }, [keyword]);
  const handlePrevClick = () => calendarRef.current.getApi().prev();
  const handleNextClick = () => calendarRef.current.getApi().next();
  const clearEvents = () => calendarRef.current.getApi().removeAllEvents();
  const onType = e => setSelectedTypes(s => e.target.checked ? [...s, e.target.value] : s.filter(v => v !== e.target.value));
  const onTopic = e => setSelectedTopics(s => e.target.checked ? [...s, e.target.value] : s.filter(v => v !== e.target.value));
  const onAudience = e => setSelectedAudiences(s => e.target.checked ? [...s, e.target.value] : s.filter(v => v !== e.target.value));
  const onLocation = e => setSelectedLocations(s => e.target.checked ? [...s, e.target.value] : s.filter(v => v !== e.target.value));
  const datesSet = info => {
    const start = info.startStr.split("T")[0];
    const end = info.endStr.split("T")[0];
    setDateRange({
      start,
      end
    });
  };
  const slugify = (s = "") => s.toString().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
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
    const matchedIds = (audiences || []).filter(opt => {
      const idStr = String(opt.id);
      const optSlug = (opt.slug ? String(opt.slug) : slugify(opt.name || "")).toLowerCase();
      return requested.includes(idStr) || requested.includes(optSlug);
    }).map(opt => String(opt.id));
    if (matchedIds.length) setSelectedAudiences(matchedIds);
  }, [audiences, types]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isFirstDatesSet.current) {
      isFirstDatesSet.current = false;
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    (async () => {
      try {
        const qs = new URLSearchParams(requestParams).toString();
        const res = await fetch(`/wp-json/sbp/v1/events${qs ? "?" + qs : ""}`, {
          headers: {
            Accept: "application/json"
          }
        });
        const json = await res.json();
        if (cancelled) return;
        clearEvents();
        const api = calendarRef.current.getApi();
        (json.events || []).forEach(ev => {
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
              location: ev.location || ""
            }
          });
        });
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [requestParams]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setRequestParams(prev => ({
      ...prev,
      start_date: dateRange.start,
      end_date: dateRange.end,
      types: selectedTypes.toString(),
      topics: selectedTopics.toString(),
      audience: selectedAudiences.toString(),
      location_type: selectedLocations.toString(),
      is_featured: onlyFeatured ? "1" : "",
      s: debouncedKeywordValue
    }));
  }, [dateRange, selectedTypes, selectedTopics, selectedAudiences, selectedLocations, onlyFeatured, debouncedKeywordValue]);
  const applyResponsiveView = api => {
    if (!api || typeof window === "undefined") return;
    const mobile = window.matchMedia("(max-width: 568px)").matches;
    const desired = mobile ? "listMonth" : "dayGridMonth";
    if (api.view?.type !== desired) api.changeView(desired);
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    applyResponsiveView(api);
    const mql = window.matchMedia("(max-width: 568px)");
    const onChange = () => applyResponsiveView(api);
    if (mql.addEventListener) mql.addEventListener("change", onChange);else mql.addListener(onChange);
    const hideTip = () => setTip(t => ({
      ...t,
      visible: false
    }));
    window.addEventListener("scroll", hideTip, true);
    window.addEventListener("resize", hideTip);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);else mql.removeListener(onChange);
      window.removeEventListener("scroll", hideTip, true);
      window.removeEventListener("resize", hideTip);
    };
  }, []);
  const fmtRange = event => {
    const s = event.start ? new Date(event.start) : null;
    const e = event.end ? new Date(event.end) : null;
    if (!s) return "";
    const dateFmt = new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    const timeFmt = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit"
    });
    const sameDay = e && s.toDateString() === e.toDateString();
    if (!e) return `${dateFmt.format(s)} • ${timeFmt.format(s)}`;
    if (sameDay) return `${dateFmt.format(s)} • ${timeFmt.format(s)}–${timeFmt.format(e)}`;
    return `${dateFmt.format(s)} ${timeFmt.format(s)} → ${dateFmt.format(e)} ${timeFmt.format(e)}`;
  };
  const showTooltip = info => {
    const {
      event,
      jsEvent
    } = info;
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
      url: event.url || ""
    };
    setTip(nextTip);
    const onMove = e => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setTip(t => ({
          ...t,
          x: e.clientX,
          y: e.clientY
        }));
      });
    };
    moveHandlerRef.current = onMove;
    document.addEventListener("mousemove", onMove, {
      passive: true
    });
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
    setTip(t => ({
      ...t,
      visible: false
    }));
  };
  const filterCount = selectedTypes.length + selectedTopics.length + selectedAudiences.length + selectedLocations.length + (onlyFeatured ? 1 : 0) + (debouncedKeywordValue ? 1 : 0);
  const openFilters = () => setIsFiltersOpen(true);
  const closeFilters = () => setIsFiltersOpen(false);
  const locationTypeOptions = [{
    id: "In Person",
    name: "In Person"
  }, {
    id: "Online",
    name: "Online"
  }];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isFiltersOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const onKey = e => {
        if (e.key === "Escape") closeFilters();
      };
      window.addEventListener("keydown", onKey);
      setTimeout(() => firstCloseBtnRef.current?.focus(), 0);
      return () => {
        document.body.style.overflow = prev;
        window.removeEventListener("keydown", onKey);
      };
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
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "bg-schemesSurface",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "bg-schemesPrimaryFixed",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "tsb-container",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "py-16 flex flex-col justify-end items-start gap-2 max-w-3xl",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            className: "py-4 px-1.5 Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large",
            children: "Upcoming Community Events"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            className: "lg:Blueprint-body-large md:Blueprint-body-medium Blueprint-body-small text-schemesOnPrimaryFixedVariant",
            children: "Connect. Celebrate. Belong. Explore Melbourne\u2019s Jewish Events."
          })]
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: `tsb-container py-8 flex flex-grow ${isLoading ? "cursor-wait" : ""}`,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("aside", {
        className: `hidden md:hidden lg:block calendar-sidebar pr-4 basis-[20%] shrink-0 ${isLoading ? "opacity-50 pointer-events-none" : ""}`,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "relative flex items-center mb-6",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "text",
            placeholder: "Search by keyword",
            value: keyword,
            onChange: e => setKeyword(e.target.value),
            className: "Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large w-full pl-4 pr-10 py-3 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-[var(--schemesPrimary)]"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("svg", {
            className: "absolute right-3 text-[var(--schemesOnSurfaceVariant)] w-5 h-5",
            viewBox: "0 0 24 24",
            fill: "none",
            "aria-hidden": true,
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("path", {
              d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "flex flex-col gap-4 px-4",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h2", {
            className: "Blueprint-headline-small-emphasized text-schemesOnSurfaceVariant",
            children: "Filters"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_FilterGroup__WEBPACK_IMPORTED_MODULE_1__.FilterGroup, {
            options: [{
              id: "1",
              name: "Featured only"
            }],
            selected: onlyFeatured ? ["1"] : [],
            onChangeHandler: e => setOnlyFeatured(!!e.target.checked)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_FilterGroup__WEBPACK_IMPORTED_MODULE_1__.FilterGroup, {
            title: "Theme",
            options: types,
            selected: selectedTypes,
            onChangeHandler: onType
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_FilterGroup__WEBPACK_IMPORTED_MODULE_1__.FilterGroup, {
            title: "Topic",
            options: topics,
            selected: selectedTopics,
            onChangeHandler: onTopic
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_FilterGroup__WEBPACK_IMPORTED_MODULE_1__.FilterGroup, {
            title: "Audience",
            options: audiences,
            selected: selectedAudiences,
            onChangeHandler: onAudience
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_FilterGroup__WEBPACK_IMPORTED_MODULE_1__.FilterGroup, {
            title: "Location Type",
            options: locationTypeOptions,
            selected: selectedLocations,
            onChangeHandler: onLocation
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("section", {
        className: `flex-1 min-w-0 transition duration-100 ${isLoading ? "opacity-50 pointer-events-none" : ""}`,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "lg:hidden px-3 sm:px-4 md:px-6 flex items-center gap-2 mb-4",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "relative flex-1",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
              type: "text",
              placeholder: "Search by keyword",
              value: keyword,
              onChange: e => setKeyword(e.target.value),
              className: "Blueprint-body-medium w-full pl-4 pr-10 py-3 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-[var(--schemesPrimary)]"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("svg", {
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-[var(--schemesOnSurfaceVariant)] w-5 h-5",
              viewBox: "0 0 24 24",
              fill: "none",
              "aria-hidden": true,
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("path", {
                d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round"
              })
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
            onClick: openFilters,
            icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_4__.FunnelSimpleIcon, {}),
            label: filterCount ? `Filters (${filterCount})` : "Filters",
            variant: "outlined",
            size: "base",
            "aria-expanded": isFiltersOpen ? "true" : "false",
            "aria-controls": "mobile-filters"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "flex items-center justify-between rounded-t-2xl px-3 sm:px-4 md:px-6 lg:px-8 h-14 mb-6",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "flex items-center justify-end gap-2 w-full",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
              onClick: handlePrevClick,
              icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_5__.ArrowLeftIcon, {}),
              label: "Previous Month"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
              onClick: handleNextClick,
              label: "Next Month",
              icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_6__.ArrowRightIcon, {})
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "bg-white rounded-2xl border border-schemesOutlineVariant overflow-hidden",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_fullcalendar_react__WEBPACK_IMPORTED_MODULE_7__["default"], {
            ref: calendarRef,
            plugins: [_fullcalendar_daygrid__WEBPACK_IMPORTED_MODULE_8__["default"], _fullcalendar_list__WEBPACK_IMPORTED_MODULE_9__["default"]],
            initialView: "dayGridMonth",
            headerToolbar: false,
            fixedWeekCount: false,
            dayMaxEvents: 4,
            dayMaxEventRows: 3,
            eventColor: "var(--schemesPrimaryFixed)",
            eventTextColor: "var(--schemesOnPrimaryFixed)",
            eventDisplay: "block",
            height: "800px",
            datesSet: datesSet,
            eventMouseEnter: showTooltip,
            eventMouseLeave: hideTooltip,
            views: {
              dayGridMonth: {
                showNonCurrentDates: false,
                displayEventTime: false,
                dayHeaderFormat: {
                  weekday: "short"
                }
              },
              listMonth: {
                noEventsContent: "No events this month"
              }
            }
          })
        })]
      })]
    }), tip.visible && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      role: "tooltip",
      className: "pointer-events-none fixed z-[60] max-w-[22rem] rounded-xl border bg-schemesSurface text-schemesOnSurface border-schemesOutlineVariant shadow-3x3 px-4 py-3",
      style: {
        left: Math.min(window.innerWidth - 16, tip.x + 12),
        top: Math.min(window.innerHeight - 16, tip.y + 12)
      },
      "aria-hidden": tip.visible ? "false" : "true",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "flex gap-3",
        children: [tip.image ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("img", {
          src: tip.image,
          alt: "",
          className: "max-h-25 rounded-lg object-cover shrink-0",
          loading: "lazy",
          decoding: "async"
        }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "min-w-0",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            className: "Blueprint-title-small-emphasized truncate",
            children: tip.title
          }), tip.range ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            className: "Blueprint-label-small text-schemesOnSurfaceVariant mt-0.5",
            children: tip.range
          }) : null, tip.venue || tip.location ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            className: "Blueprint-label-small text-schemesOnSurfaceVariant truncate mt-0.5",
            children: [tip.venue, tip.location].filter(Boolean).join(" • ")
          }) : null, tip.description ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            className: "Blueprint-body-small text-schemesOnSurface mt-2 line-clamp-3 ",
            dangerouslySetInnerHTML: {
              __html: tip.description
            }
          }) : null]
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      id: "mobile-filters",
      className: `lg:hidden fixed inset-0 z-[70] ${isFiltersOpen ? "" : "pointer-events-none"}`,
      "aria-hidden": isFiltersOpen ? "false" : "true",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        onClick: closeFilters,
        className: `absolute inset-0 transition-opacity ${isFiltersOpen ? "opacity-100" : "opacity-0"} bg-[color:rgb(0_0_0_/_0.44)]`
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Filters",
        className: `
            absolute left-0 right-0 bottom-0 max-h-[85vh]
            rounded-t-2xl bg-schemesSurface shadow-[0_-16px_48px_rgba(0,0,0,0.25)]
            transition-transform duration-300
            ${isFiltersOpen ? "translate-y-0" : "translate-y-full"}
          `,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "relative px-4 py-3 border-b border-[var(--schemesOutlineVariant)]",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            className: "mx-auto h-1.5 w-12 rounded-full bg-[var(--schemesOutlineVariant)]"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "mt-3 flex items-center justify-between",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
              className: "Blueprint-title-small-emphasized",
              children: "Filters"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
              ref: firstCloseBtnRef,
              type: "button",
              onClick: closeFilters,
              className: "rounded-full p-2 hover:bg-surfaceContainerHigh text-schemesOnSurfaceVariant",
              "aria-label": "Close filters",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_10__.XIcon, {})
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "px-4 py-4 overflow-y-auto space-y-4",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "relative",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
              type: "text",
              placeholder: "Search by keyword",
              value: keyword,
              onChange: e => setKeyword(e.target.value),
              className: "Blueprint-body-medium w-full pl-4 pr-10 py-3 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-[var(--schemesPrimary)]"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("svg", {
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-[var(--schemesOnSurfaceVariant)] w-5 h-5",
              viewBox: "0 0 24 24",
              fill: "none",
              "aria-hidden": true,
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("path", {
                d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round"
              })
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_FilterGroup__WEBPACK_IMPORTED_MODULE_1__.FilterGroup, {
            options: [{
              id: "1",
              name: "Featured only"
            }],
            selected: onlyFeatured ? ["1"] : [],
            onChangeHandler: e => setOnlyFeatured(!!e.target.checked)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_FilterGroup__WEBPACK_IMPORTED_MODULE_1__.FilterGroup, {
            title: "Theme",
            options: types,
            selected: selectedTypes,
            onChangeHandler: onType
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_FilterGroup__WEBPACK_IMPORTED_MODULE_1__.FilterGroup, {
            title: "Topic",
            options: topics,
            selected: selectedTopics,
            onChangeHandler: onTopic
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_FilterGroup__WEBPACK_IMPORTED_MODULE_1__.FilterGroup, {
            title: "Audience",
            options: audiences,
            selected: selectedAudiences,
            onChangeHandler: onAudience
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_FilterGroup__WEBPACK_IMPORTED_MODULE_1__.FilterGroup, {
            title: "Location",
            options: locations,
            selected: selectedLocations,
            onChangeHandler: onLocation
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "sticky bottom-0 px-4 py-3 bg-schemesSurface border-t border-[var(--schemesOutlineVariant)] flex gap-2",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
            onClick: clearAll,
            variant: "outlined",
            label: "Clear all",
            className: "flex-1"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
            onClick: closeFilters,
            variant: "filled",
            label: "Apply",
            className: "flex-1"
          })]
        })]
      })]
    })]
  });
}

/***/ }),

/***/ "./src/scripts/FilterGroup.js":
/*!************************************!*\
  !*** ./src/scripts/FilterGroup.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FilterGroup: () => (/* binding */ FilterGroup)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _StyledCheckbox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StyledCheckbox */ "./src/scripts/StyledCheckbox.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function FilterGroup({
  title,
  options,
  selected,
  onChangeHandler
}) {
  const [visibleCount, setVisibleCount] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(5);
  const isNested = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => Array.isArray(options) && options.some(o => Array.isArray(o.children) && o.children.length > 0), [options]);
  const parents = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => isNested ? options : options, [isNested, options]);
  const hasMore = isNested ? parents.length > 5 : options.length > 5;
  const showingAll = visibleCount >= (isNested ? parents.length : options.length);
  const handleToggleShowMore = () => {
    if (showingAll) setVisibleCount(5);else setVisibleCount(prev => prev + 5);
  };
  const isChecked = id => selected.includes(String(id));
  const collectDescendantIds = (node, bag = []) => {
    (node.children || []).forEach(c => {
      bag.push(String(c.id));
      collectDescendantIds(c, bag);
    });
    return bag;
  };
  const anyChildSelected = node => {
    const kids = collectDescendantIds(node, []);
    return kids.some(id => isChecked(id));
  };
  const fireChange = (id, checked) => {
    onChangeHandler({
      target: {
        value: String(id),
        checked: !!checked
      }
    });
  };
  const onParentChange = (node, checked) => {
    if (checked) {
      fireChange(node.id, true);
      return;
    }
    fireChange(node.id, false);
    const kids = collectDescendantIds(node, []);
    kids.forEach(id => {
      if (isChecked(id)) fireChange(id, false);
    });
  };
  const onChildChange = (parentNode, childNode, checked) => {
    fireChange(childNode.id, checked);
    if (checked && isChecked(parentNode.id)) {
      fireChange(parentNode.id, false);
    }
  };

  // one row of a child with connector lines
  const ChildRow = ({
    parentNode,
    childNode,
    isLast,
    depth = 0
  }) => {
    const show = isChecked(parentNode.id) || anyChildSelected(parentNode);
    if (!show) return null;
    const hasKids = Array.isArray(childNode.children) && childNode.children.length > 0;
    const checked = isChecked(childNode.id);
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "w-full",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "flex items-start relative",
        style: {
          marginLeft: depth * 16
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "flex-1 pt-1",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_StyledCheckbox__WEBPACK_IMPORTED_MODULE_1__.StyledCheckbox, {
            id: childNode.id,
            label: childNode.name,
            checked: checked,
            onChangeHandler: e => onChildChange(parentNode, childNode, e.target.checked)
          })
        })
      }), hasKids && childNode.children.map((g, idx) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ChildRow, {
        parentNode: parentNode // keep same top-level parent to control visibility
        ,
        childNode: g,
        isLast: idx === childNode.children.length - 1,
        depth: depth + 1
      }, `c-${childNode.id}-${g.id}`))]
    }, `c-${childNode.id}`);
  };
  const renderParent = node => {
    const checked = isChecked(node.id);
    const expanded = checked || anyChildSelected(node);
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "w-full",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "flex items-center my-1",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_StyledCheckbox__WEBPACK_IMPORTED_MODULE_1__.StyledCheckbox, {
          id: node.id,
          label: node.name,
          checked: checked,
          onChangeHandler: e => onParentChange(node, e.target.checked)
        })
      }), hasChildren && expanded && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "relative mt-2",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "absolute left-3 -top-0 bottom-0 border-l border-schemesOutlineVariant"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "pl-6 py-3 space-y-4",
          children: node.children.map((child, idx) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ChildRow, {
            parentNode: node,
            childNode: child,
            isLast: idx === node.children.length - 1,
            depth: 0
          }, `c-${child.id}`))
        })]
      })]
    }, `p-${node.id}`);
  };

  // FLAT
  if (!isNested) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "mb-4",
      children: [title && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h3", {
        className: "Blueprint-title-small mb-8",
        children: title
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "flex flex-wrap gap-5",
        children: options.slice(0, visibleCount).map(option => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_StyledCheckbox__WEBPACK_IMPORTED_MODULE_1__.StyledCheckbox, {
          id: option.id,
          label: option.name,
          checked: selected.includes(String(option.id)),
          onChangeHandler: onChangeHandler
        }, option.id))
      }), hasMore && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
        type: "button",
        onClick: handleToggleShowMore,
        className: "mt-4 text-schemesPrimary Blueprint-label-large hover:underline",
        children: showingAll ? "Show less" : "Show more"
      })]
    });
  }

  // NESTED
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "mb-4",
    children: [title && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h3", {
      className: "Blueprint-title-small mb-8",
      children: title
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "flex flex-col gap-3",
      children: (parents || []).slice(0, visibleCount).map(renderParent)
    }), hasMore && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
      type: "button",
      onClick: handleToggleShowMore,
      className: "mt-4 text-schemesPrimary Blueprint-label-large hover:underline",
      children: showingAll ? "Show less" : "Show more"
    })]
  });
}

/***/ }),

/***/ "./src/scripts/StyledCheckbox.js":
/*!***************************************!*\
  !*** ./src/scripts/StyledCheckbox.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StyledCheckbox: () => (/* binding */ StyledCheckbox)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

function StyledCheckbox({
  id,
  label,
  onChangeHandler,
  checked
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", {
      type: "checkbox",
      id: `filter-${id}`,
      value: id,
      checked: checked // ✅ controlled by parent
      ,
      className: "peer hidden",
      onChange: onChangeHandler
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", {
      htmlFor: `filter-${id}`,
      className: "cursor-pointer px-3 py-2 rounded-md Blueprint-label-small transition-colors duration-200 peer-checked:bg-gray-500 peer-checked:text-white peer-checked:border-grey-700 peer-not-checked:bg-[var(--schemesSurfaceContainer)] peer-not-checked:text-gray-700 peer-not-checked:border-gray-300",
      children: label
    })]
  }, id);
}

/***/ })

}]);
//# sourceMappingURL=events-calendar.js.map?ver=4c2664ee2ac7fcecb416