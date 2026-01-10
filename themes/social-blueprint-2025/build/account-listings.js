"use strict";
(globalThis["webpackChunkbrads_boilerplate_theme"] = globalThis["webpackChunkbrads_boilerplate_theme"] || []).push([["account-listings"],{

/***/ "./src/scripts/AccountListings.js":
/*!****************************************!*\
  !*** ./src/scripts/AccountListings.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccountListings: () => (/* binding */ AccountListings)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Card */ "./src/scripts/Card.js");
/* harmony import */ var _Breadcrumbs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Breadcrumbs */ "./src/scripts/Breadcrumbs.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




const TABS = [{
  key: "all",
  label: "All"
}, {
  key: "event",
  label: "Events"
}, {
  key: "article",
  label: "Articles"
}, {
  key: "message",
  label: "Message board"
}, {
  key: "directory",
  label: "Directory"
}];
function typeLabel(item) {
  if (item.post_type === "gd_discount") return "Message board";
  if (item.post_type === "article") return "Article";
  if (item.post_type === "tribe_events") return "Event";
  if (item.post_type?.startsWith("gd_")) return "Directory";
  return "Listing";
}
function tabKey(item) {
  const t = typeLabel(item);
  if (t === "Event") return "event";
  if (t === "Article") return "article";
  if (t === "Message board") return "message";
  if (t === "Directory") return "directory";
  return "all";
}
function statusChip(status) {
  const map = {
    publish: {
      label: "Published",
      cls: "bg-[#DFF5E7] text-[#145A32]"
    },
    pending: {
      label: "Pending Review",
      cls: "bg-[#FFF4CC] text-[#7A5B00]"
    },
    draft: {
      label: "Draft",
      cls: "bg-slate-200 text-slate-700"
    },
    future: {
      label: "Scheduled",
      cls: "bg-[#E0ECFF] text-[#0B4DB6]"
    },
    private: {
      label: "Private",
      cls: "bg-slate-200 text-slate-700"
    },
    expired: {
      label: "Expired",
      cls: "bg-[#FFE0E0] text-[#8B1A1A]"
    }
  };
  return map[status] || {
    label: status,
    cls: "bg-slate-200 text-slate-700"
  };
}

/** Shared grid so header + every card line up perfectly from md+ */
const COLS = "md:grid-cols-[140px_1fr_160px_140px]";
function HeaderRow() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: `hidden md:grid ${COLS} gap-3 px-4 py-2 Blueprint-label-medium`,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      children: "Type"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      children: "Title"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      children: "Status"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "text-right",
      children: "Actions"
    })]
  });
}
function RowCard({
  item
}) {
  const t = typeLabel(item);
  const chip = statusChip(item.status);
  const node = document.getElementById("account-listings-root");
  // You already solved Events edit links; keep that logic.
  // Here we add GD front-end edit support:
  const gdBase = (node?.dataset?.gdAddBase || "/add-listing/").replace(/\/?$/, "/");

  // Build a GD edit URL if this is a GeoDirectory CPT
  const gdEditUrl = item.post_type?.startsWith("gd_") ? `${gdBase}?listing_type=${encodeURIComponent(item.post_type)}&action=edit&pid=${item.id}` : null;
  const eventEditUrl = item.post_type === "tribe_events" ? `/events-calendar/community/edit/${item.id}/` : null;
  const frontEditUrl = gdEditUrl !== null && gdEditUrl !== void 0 ? gdEditUrl : eventEditUrl;
  const secondary = item.start ? new Date(item.start).toLocaleString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit"
  }) : `Last updated ${new Intl.RelativeTimeFormat("en-AU", {
    numeric: "auto"
  }).format(Math.round((new Date(item.modified) - new Date()) / (1000 * 60 * 60 * 24)), "day")}`;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Card__WEBPACK_IMPORTED_MODULE_1__.Card, {
    styles: "p-0",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "grid md:grid-cols-[140px_1fr_160px_140px] gap-3 items-center px-4 py-3",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "hidden md:block",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
          className: "Blueprint-label-medium px-2 py-1 rounded-md bg-schemesSurfaceContainer text-schemesOnSurfaceVariant",
          children: t
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "min-w-0",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "md:hidden mb-1",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
            className: "Blueprint-label-medium px-2 py-1 rounded-md bg-schemesSurfaceContainer text-schemesOnSurfaceVariant",
            children: t
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("a", {
          href: item.permalink,
          className: "Blueprint-title-small-emphasized hover:underline line-clamp-2",
          children: item.title || "(no title)"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "Blueprint-label-medium text-schemesOnSurfaceVariant",
          children: secondary
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
          className: `Blueprint-label-medium px-2 py-1 rounded ${chip.cls}`,
          children: chip.label
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "text-left md:text-right flex gap-2 justify-start md:justify-end",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("a", {
          href: item.permalink,
          className: "Blueprint-label-medium rounded-lg bg-schemesPrimary text-schemesOnPrimary px-3 py-1 inline-block",
          children: "View"
        }), frontEditUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("a", {
          href: frontEditUrl,
          className: "Blueprint-label-medium rounded-lg bg-schemesSecondary text-schemesOnSecondary px-3 py-1 inline-block",
          children: "Edit"
        })]
      })]
    })
  });
}
function AccountListings() {
  const node = document.getElementById("account-listings-root");
  const items = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!node) return [];
    try {
      return JSON.parse(node.dataset.items || "[]");
    } catch {
      return [];
    }
  }, [node]);
  const breadcrumbs = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!node) return [];
    try {
      return JSON.parse(node.dataset.breadcrumbs || "[]");
    } catch {
      return [];
    }
  }, [node]);
  const [tab, setTab] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("all");
  const filtered = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => tab === "all" ? items : items.filter(i => tabKey(i) === tab), [items, tab]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("main", {
    className: "bg-schemesSurface text-schemesOnSurface",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "bg-schemesPrimaryFixed",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "hidden md:block md:px-8 md:pt-8 lg:px-16 lg:pt-8",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Breadcrumbs__WEBPACK_IMPORTED_MODULE_2__.Breadcrumbs, {
          items: breadcrumbs,
          textColour: "text-schemesPrimary"
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 py-8",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h1", {
          className: "Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large",
          children: "My Active Listings"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
          className: "Blueprint-body-medium text-schemesOnSurfaceVariant mt-1",
          children: "Update or request changes to your listed events, articles and directory items."
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 py-6",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "flex flex-wrap gap-2 mb-4",
        children: TABS.map(t => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
          onClick: () => setTab(t.key),
          className: `px-3 py-1.5 rounded-full Blueprint-label-medium ${tab === t.key ? "bg-schemesPrimary text-schemesOnPrimary" : "bg-schemesSurfaceContainer text-schemesOnSurfaceVariant"}`,
          children: t.label
        }, t.key))
      }), filtered.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(HeaderRow, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "mt-2 flex flex-col gap-3",
        children: filtered.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(RowCard, {
          item: item
        }, `${item.post_type}-${item.id}`))
      })]
    })]
  });
}

/***/ }),

/***/ "./src/scripts/Breadcrumbs.js":
/*!************************************!*\
  !*** ./src/scripts/Breadcrumbs.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Breadcrumbs: () => (/* binding */ Breadcrumbs)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
// components/Breadcrumbs.jsx


function Breadcrumbs({
  items = [],
  textColour = 'text-schemesOnSurfaceVariant'
}) {
  if (!items || !items.length) return null;
  const filteredItems = items.map(it => {
    if (it.url.includes('events-calendar')) {
      return {
        ...it,
        url: it.url.replace('events-calendar', 'events')
      };
    }
    return it;
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("nav", {
    "aria-label": "Breadcrumb",
    className: "mb-3 lg:mb-6",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("ol", {
      className: `flex flex-wrap items-center gap-1 Blueprint-label-small lg:Blueprint-label-large ${textColour}`,
      children: filteredItems.map((it, i) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), {
        children: [i > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("li", {
          className: "px-1",
          children: '>'
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("li", {
          children: it.url ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a", {
            href: it.url,
            className: "no-underline hover:underline ",
            children: it.label
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
            children: it.label
          })
        })]
      }, i))
    })
  });
}

/***/ }),

/***/ "./src/scripts/Card.js":
/*!*****************************!*\
  !*** ./src/scripts/Card.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Card: () => (/* binding */ Card)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const Card = ({
  children,
  styles,
  href
}) => {
  const baseClass = `relative rounded-xl bg-white border border-[color:var(--schemesOutlineVariant,#C9C7BD)] shadow-none ${styles} before:absolute before:inset-0 before:rounded-lg before:mix-blend-multiply before:z-0 before:content-['']`;
  const innerClass = "relative z-10 w-full h-full";
  const content = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: baseClass,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: innerClass,
      children: children
    })
  });
  return href ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a", {
    href: href,
    className: "h-full block",
    children: content
  }) : content;
};

/***/ })

}]);
//# sourceMappingURL=account-listings.js.map?ver=36c1c1486b87c24544a0