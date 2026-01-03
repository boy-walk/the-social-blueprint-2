"use strict";
(globalThis["webpackChunkbrads_boilerplate_theme"] = globalThis["webpackChunkbrads_boilerplate_theme"] || []).push([["mb-archive"],{

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
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/CaretRight.es.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);




function FilterGroup({
  title,
  options,
  selected,
  onChangeHandler,
  expanded = false,
  onToggleExpand,
  onShowLess,
  initialShowCount = 8
}) {
  const isNested = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => Array.isArray(options) && options.some(o => Array.isArray(o.children) && o.children.length > 0), [options]);
  const parents = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => isNested ? options : options, [isNested, options]);
  const totalCount = isNested ? parents.length : options.length;
  const hasMore = totalCount > initialShowCount;
  const displayCount = expanded ? totalCount : initialShowCount;
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
    const expanded = checked || hasKids && anyChildSelected(childNode);
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "w-full",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "flex items-center gap-1",
        style: {
          marginLeft: depth * 16
        },
        children: [hasKids && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_3__.CaretRight, {
          size: 16,
          weight: "bold",
          className: `text-schemesOnSurfaceVariant transition-transform flex-shrink-0 ${expanded ? 'rotate-90' : ''}`
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "flex-1 min-w-0",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_StyledCheckbox__WEBPACK_IMPORTED_MODULE_1__.StyledCheckbox, {
            id: childNode.id,
            label: childNode.name,
            checked: checked,
            onChangeHandler: e => onChildChange(parentNode, childNode, e.target.checked)
          })
        })]
      }), hasKids && expanded && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "mt-4 mb-2 space-y-4",
        children: childNode.children.map((g, idx) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ChildRow, {
          parentNode: parentNode,
          childNode: g,
          isLast: idx === childNode.children.length - 1,
          depth: depth + 1
        }, `c-${childNode.id}-${g.id}`))
      })]
    }, `c-${childNode.id}`);
  };
  const renderParent = node => {
    const checked = isChecked(node.id);
    const expanded = checked || anyChildSelected(node);
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "w-full",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "flex items-center gap-1 my-1",
        children: [hasChildren && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_3__.CaretRight, {
          size: 16,
          weight: "bold",
          className: `text-schemesOnSurfaceVariant transition-transform flex-shrink-0 ${expanded ? 'rotate-90' : ''}`
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "flex-1 min-w-0",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_StyledCheckbox__WEBPACK_IMPORTED_MODULE_1__.StyledCheckbox, {
            id: node.id,
            label: node.name,
            checked: checked,
            onChangeHandler: e => onParentChange(node, e.target.checked)
          })
        })]
      }), hasChildren && expanded && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "relative mt-4 mb-2",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "pl-6 space-y-4",
          children: node.children.map((child, idx) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ChildRow, {
            parentNode: node,
            childNode: child,
            isLast: idx === node.children.length - 1,
            depth: 0
          }, `c-${child.id}`))
        })
      })]
    }, `p-${node.id}`);
  };

  // FLAT
  if (!isNested) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "mb-4",
      children: [title && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h3", {
        className: "Blueprint-title-small-emphasized text-schemesOnSurfaceVariant mb-3",
        children: title
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "flex flex-wrap gap-4",
        children: options.slice(0, displayCount).map(option => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_StyledCheckbox__WEBPACK_IMPORTED_MODULE_1__.StyledCheckbox, {
          id: option.id,
          label: option.name,
          checked: selected.includes(String(option.id)),
          onChangeHandler: onChangeHandler
        }, option.id))
      }), hasMore && !expanded && onToggleExpand && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("button", {
        type: "button",
        onClick: onToggleExpand,
        className: "mt-2 text-sm text-schemesPrimary hover:underline Blueprint-label-large",
        children: ["Show all (", totalCount, ")"]
      }), hasMore && expanded && onToggleExpand && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
        type: "button",
        onClick: onShowLess,
        className: "mt-2 text-sm text-schemesPrimary hover:underline Blueprint-label-large",
        children: "Show less"
      })]
    });
  }

  // NESTED
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "mb-4",
    children: [title && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h3", {
      className: "Blueprint-title-small-emphasized text-schemesOnSurfaceVariant mb-3",
      children: title
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "flex flex-col gap-2",
      children: (parents || []).slice(0, displayCount).map(renderParent)
    }), hasMore && !expanded && onToggleExpand && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("button", {
      type: "button",
      onClick: onToggleExpand,
      className: "mt-2 text-sm text-schemesPrimary hover:underline Blueprint-label-large",
      children: ["Show all (", totalCount, ")"]
    })]
  });
}

/***/ }),

/***/ "./src/scripts/MessageBoardArchivePage.js":
/*!************************************************!*\
  !*** ./src/scripts/MessageBoardArchivePage.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MessageBoardArchivePage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _FilterGroup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FilterGroup */ "./src/scripts/FilterGroup.js");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Button */ "./src/scripts/Button.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/MagnifyingGlass.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/FunnelSimple.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/X.es.js");
/* harmony import */ var _Breadcrumbs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Breadcrumbs */ "./src/scripts/Breadcrumbs.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);






function MessageBoardArchivePage(props) {
  const {
    postType,
    taxonomy,
    currentTerm,
    filters = [],
    endpoint,
    baseQuery = {},
    title,
    subtitle,
    breadcrumbs = []
  } = props;
  const CPT = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (Array.isArray(postType) ? postType[0] : postType) || "gd_discount", [postType]);

  // ---------------- State ----------------
  const [page, setPage] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1);

  // Parse URL query params for initial category filter
  const getInitialCategoryFromURL = () => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('cat') || null;
  };

  // Seed once for taxonomy archives
  const [selectedTerms, setSelectedTerms] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(() => {
    if (taxonomy && currentTerm?.id) return {
      [taxonomy]: [String(currentTerm.id)]
    };
    return {};
  });

  // Track if we've initialized from URL
  const urlInitializedRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const initialCategorySlug = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(getInitialCategoryFromURL());
  const [items, setItems] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [totalPages, setTotalPages] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1);
  const [total, setTotal] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(undefined);
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const [searchQuery, setSearchQuery] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");

  // Filters / terms
  const [termsOptions, setTermsOptions] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [descendantsMap, setDescendantsMap] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [retryTick, setRetryTick] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);

  // ---- identify the "Category" taxonomy to promote to chips ----
  const categoryFilter = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const re = /(_category|_categories|category|categories|cat)$/i;
    return (filters || []).find(f => f.isCategory || re.test(f.taxonomy));
  }, [filters]);
  const categoryTax = categoryFilter?.taxonomy || null;

  // Sidebar filters (exclude the scoped taxonomy and the category)
  const displayedFilters = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return (filters || []).filter(f => f.taxonomy !== taxonomy && f.taxonomy !== categoryTax);
  }, [filters, taxonomy, categoryTax]);

  // ---------------- Helpers ----------------
  const buildTreeAndDescendants = rows => {
    const byId = {};
    rows.forEach(r => {
      var _r$parent;
      const id = String(r.id);
      byId[id] = {
        id,
        name: r.name,
        slug: r.slug,
        parent: String(((_r$parent = r.parent) !== null && _r$parent !== void 0 ? _r$parent : 0) || "0"),
        children: []
      };
    });
    const roots = [];
    rows.forEach(r => {
      const id = String(r.id);
      const p = String(r.parent || "0");
      if (p !== "0" && byId[p]) byId[p].children.push(byId[id]);else roots.push(byId[id]);
    });
    const descendants = {};
    const collect = n => {
      let acc = [];
      n.children.forEach(c => {
        acc.push(String(c.id), ...collect(c));
      });
      descendants[String(n.id)] = acc;
      return acc;
    };
    roots.forEach(collect);
    const sortTree = nodes => {
      nodes.sort((a, b) => a.name.localeCompare(b.name));
      nodes.forEach(n => sortTree(n.children));
    };
    sortTree(roots);
    return {
      tree: roots,
      descendants
    };
  };

  // ---------------- Load term options ----------------
  const fetchedOnceRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(new Set());
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const toFetch = [...displayedFilters];
    if (categoryTax) toFetch.unshift({
      taxonomy: categoryTax
    });
    if (!toFetch.length) {
      setTermsOptions({});
      setDescendantsMap({});
      return;
    }
    let cancelled = false;
    (async () => {
      const nextOptions = {};
      const nextDesc = {};
      for (const f of toFetch) {
        const tax = f.taxonomy;
        if (fetchedOnceRef.current.has(tax)) continue;
        try {
          const res = await fetch(`/wp-json/tsb/v1/terms?taxonomy=${encodeURIComponent(tax)}&per_page=100`, {
            headers: {
              Accept: "application/json"
            }
          });
          if (!res.ok) throw new Error(`Terms fetch failed for ${tax} (HTTP ${res.status})`);
          const json = await res.json();
          const rows = (Array.isArray(json) ? json : []).map(t => {
            var _t$parent;
            return {
              id: String(t.id),
              name: t.name,
              slug: t.slug,
              parent: String(((_t$parent = t.parent) !== null && _t$parent !== void 0 ? _t$parent : 0) || "0")
            };
          });
          const isHier = rows.some(r => r.parent !== "0");
          if (isHier) {
            const {
              tree,
              descendants
            } = buildTreeAndDescendants(rows);
            nextOptions[tax] = tree;
            nextDesc[tax] = descendants;
          } else {
            nextOptions[tax] = rows.map(({
              id,
              name,
              slug
            }) => ({
              id,
              name,
              slug
            }));
          }
          fetchedOnceRef.current.add(tax);
        } catch {
          nextOptions[f.taxonomy] = [];
        }
      }
      if (!cancelled && (Object.keys(nextOptions).length || Object.keys(nextDesc).length)) {
        setTermsOptions(prev => ({
          ...prev,
          ...nextOptions
        }));
        setDescendantsMap(prev => ({
          ...prev,
          ...nextDesc
        }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [displayedFilters, categoryTax]);

  // ---------------- Scope filter UI for taxonomy archives (UI-only) ----------------
  const didScopeRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (didScopeRef.current) return;
    if (!taxonomy || !currentTerm?.id) return;
    const opts = termsOptions[taxonomy];
    if (!opts || !opts.length) return;
    const isTree = Array.isArray(opts) && Array.isArray(opts[0]?.children);
    if (isTree) {
      const stack = [...opts];
      let node = null;
      while (stack.length) {
        const n = stack.pop();
        if (String(n.id) === String(currentTerm.id)) {
          node = n;
          break;
        }
        (n.children || []).forEach(c => stack.push(c));
      }
      if (node) {
        setTermsOptions(prev => ({
          ...prev,
          [taxonomy]: [node]
        }));
        didScopeRef.current = true;
      }
    } else {
      setTermsOptions(prev => ({
        ...prev,
        [taxonomy]: (prev[taxonomy] || []).filter(o => String(o.id) === String(currentTerm.id))
      }));
      didScopeRef.current = true;
    }
  }, [termsOptions, taxonomy, currentTerm]);

  // ---------------- Initialize category from URL query param ----------------
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (urlInitializedRef.current) return;
    if (!categoryTax || !initialCategorySlug.current) return;
    const opts = termsOptions[categoryTax];
    if (!opts || !opts.length) return;

    // Find term by slug
    const findBySlug = items => {
      for (const item of items) {
        if (item.slug === initialCategorySlug.current) {
          return item;
        }
        // Check children if it's a tree structure
        if (Array.isArray(item.children) && item.children.length > 0) {
          const found = findBySlug(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    const matchedTerm = findBySlug(opts);
    if (matchedTerm) {
      setSelectedTerms(prev => ({
        ...prev,
        [categoryTax]: [String(matchedTerm.id)]
      }));
      urlInitializedRef.current = true;
    }
  }, [termsOptions, categoryTax]);

  // ---------------- Fetch posts ----------------
  const fetchSeq = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(0);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    let cancelled = false;
    const seq = ++fetchSeq.current;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const payload = {
          ...baseQuery,
          page
        };

        // base tax
        const baseTax = Array.isArray(baseQuery.tax) ? baseQuery.tax.slice() : baseQuery.tax ? [baseQuery.tax] : [];

        // UI selections
        const uiTax = [];
        for (const [taxKey, termIds] of Object.entries(selectedTerms)) {
          if (termIds && termIds.length) {
            uiTax.push({
              taxonomy: taxKey,
              field: "term_id",
              terms: termIds.map(id => parseInt(id, 10)).filter(Number.isFinite),
              operator: "IN",
              include_children: true
            });
          }
        }
        const finalTax = [...baseTax, ...uiTax];
        if (finalTax.length) {
          payload.tax = finalTax;
          if (baseQuery.tax_relation) payload.tax_relation = baseQuery.tax_relation;
        }
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled && seq === fetchSeq.current) {
          setItems(json.items || []);
          setTotalPages(json.total_pages || 1);
          setTotal(typeof json.total === "number" ? json.total : undefined);
        }
      } catch (err) {
        if (!cancelled && seq === fetchSeq.current) setError(err.message || "Failed to load data");
      } finally {
        if (!cancelled && seq === fetchSeq.current) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [baseQuery, endpoint, page, selectedTerms, retryTick]);

  // ---------------- Client-side search ----------------
  const searchIndex = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const idx = new Map();
    const collect = (val, bag) => {
      if (!val) return;
      if (Array.isArray(val)) val.forEach(v => collect(v, bag));else if (typeof val === "object") {
        if (typeof val.name === "string") bag.push(val.name);
        if (typeof val.slug === "string") bag.push(val.slug.replace(/-/g, " "));
        Object.values(val).forEach(v => collect(v, bag));
      } else if (typeof val === "string") bag.push(val);
    };
    (items || []).forEach(item => {
      const bag = [];
      collect(item.title, bag);
      collect(item.subtitle, bag);
      collect(item.excerpt, bag);
      collect(item.categories, bag);
      collect(item.tags, bag);
      collect(item.terms, bag);
      collect(item.taxonomies, bag);
      idx.set(item.id, bag.join(" ").toLowerCase());
    });
    return idx;
  }, [items]);
  const filteredItems = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    const words = q.split(/\s+/).filter(Boolean);
    return items.filter(it => {
      const hay = searchIndex.get(it.id) || "";
      return words.every(w => hay.includes(w));
    });
  }, [items, searchQuery, searchIndex]);
  const searching = searchQuery.trim().length > 0;
  const hasActiveFilters = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => Object.entries(selectedTerms).some(([k, arr]) => k !== categoryTax && (arr || []).length > 0), [selectedTerms, categoryTax]);

  // ---------------- Category chips ----------------
  const categoryOptionsRaw = termsOptions[categoryTax] || [];
  const isCatTree = Array.isArray(categoryOptionsRaw[0]?.children);
  const categoryRoots = isCatTree ? categoryOptionsRaw : categoryOptionsRaw; // we only show roots/flat
  const currentCategorySel = (selectedTerms[categoryTax] || [])[0] || "";
  const setCategory = id => {
    setSelectedTerms(prev => ({
      ...prev,
      [categoryTax]: id ? [String(id)] : []
    }));
    setPage(1);
  };

  // ---------------- Mobile filters drawer ----------------
  const [isFiltersOpen, setIsFiltersOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const firstCloseBtnRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const openFilters = () => setIsFiltersOpen(true);
  const closeFilters = () => setIsFiltersOpen(false);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isFiltersOpen) return;
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
  }, [isFiltersOpen]);
  const clearAllFilters = () => {
    setSelectedTerms(prev => ({
      [categoryTax]: prev[categoryTax] || []
    })); // keep category; clear others
    setPage(1);
  };
  const filterCount = (hasActiveFilters ? Object.values(selectedTerms).reduce((n, arr, k) => n + (Object.keys(selectedTerms)[k] === categoryTax ? 0 : (arr || []).length), 0) : 0) + (searching ? 1 : 0);

  // ---------------- Row rendering helpers ----------------
  const stripTags = html => {
    if (typeof html !== "string") return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return (tmp.textContent || tmp.innerText || "").trim();
  };
  const extractCategoryLabels = item => {
    const labels = [];
    const seen = new Set();
    const push = val => {
      const name = typeof val === "string" ? val : val?.name || val?.title || "";
      const text = (name || "").toString().trim();
      if (!text) return;
      const key = text.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      labels.push(text);
    };
    if (Array.isArray(item?.categories)) item.categories.forEach(push);
    if (item?.taxonomies && typeof item.taxonomies === "object") {
      Object.entries(item.taxonomies).forEach(([tx, arr]) => {
        if (!Array.isArray(arr)) return;
        if (/_category$/.test(tx) || /categories?$/.test(tx) || /cat$/.test(tx)) {
          arr.forEach(push);
        }
      });
    }
    Object.keys(item || {}).forEach(k => {
      if (!/_category$/.test(k) && !/categories?$/.test(k) && !/cat$/.test(k)) return;
      const v = item[k];
      if (Array.isArray(v)) v.forEach(push);
    });
    return labels;
  };
  const LeadingIcon = ({
    item
  }) => {
    const letter = (String(item?.title || "").trim()[0] || "â€¢").toUpperCase();
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "w-16 h-16 rounded-xl bg-[var(--schemesSecondaryContainer)] flex items-center justify-center shrink-0",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
        className: "Blueprint-headline-medium text-[var(--schemesOnSecondaryContainer)]",
        children: letter
      })
    });
  };
  const MessageRow = ({
    item
  }) => {
    const href = item?.permalink || "#";
    const categories = extractCategoryLabels(item);
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("a", {
      href: href,
      className: "block rounded-xl border border-[var(--schemesOutlineVariant)] bg-[var(--schemesSurfaceContainerLowest)] hover:bg-[var(--schemesSurfaceContainer)] focus:outline-none focus:ring-2 focus:ring-[var(--schemesPrimary)] transition",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "flex gap-4 p-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(LeadingIcon, {
          item: item
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "flex-1",
          children: [categories.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "flex flex-wrap gap-2 mb-2",
            children: categories.map((label, idx) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
              className: "px-3 py-2 rounded-lg bg-[var(--schemesSurfaceContainerHigh)] text-[var(--schemesOnSurface)] Blueprint-label-small",
              children: label
            }, `${item.id}-cat-${idx}`))
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "Blueprint-title-small-emphasized text-[var(--schemesOnSurface)] mb-1",
            children: item?.title
          }), item?.excerpt && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
            className: "Blueprint-body-small text-[var(--schemesOnSurfaceVariant)]",
            style: {
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            },
            children: stripTags(item.excerpt)
          })]
        })]
      })
    });
  };

  // ---------------- Skeletons ----------------
  const skeletonRows = Array.from({
    length: 8
  }).map((_, i) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
    className: "rounded-xl border border-[var(--schemesOutlineVariant)] overflow-hidden bg-[var(--schemesSurface)]",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "flex gap-4 p-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "w-16 h-16 rounded-xl bg-[var(--schemesSurfaceContainerHighest)] animate-pulse"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "flex-1 space-y-2",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "h-5 w-3/5 bg-[var(--schemesSurfaceContainerHigh)] animate-pulse rounded"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "h-4 w-4/5 bg-[var(--schemesSurfaceContainerHigh)] animate-pulse rounded"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "h-4 w-2/3 bg-[var(--schemesSurfaceContainerHigh)] animate-pulse rounded"
        })]
      })]
    })
  }, `sk-${i}`));
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: "archive-container bg-schemesSurface",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "bg-schemesPrimaryFixed py-8",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "tsb-container",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.Breadcrumbs, {
          items: breadcrumbs,
          textColour: "text-schemesPrimary"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h1", {
          className: "Blueprint-headline-large text-schemesOnSurface mb-1",
          children: title
        }), subtitle && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          className: "Blueprint-body-medium text-schemesOnPrimaryFixedVariant",
          children: subtitle
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "tsb-container pt-6",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "lg:hidden flex items-center gap-2 mb-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "relative flex-1",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
            id: "archive-search-mobile",
            type: "search",
            value: searchQuery,
            onChange: e => setSearchQuery(e.target.value),
            placeholder: "Search by keyword",
            className: "Blueprint-body-medium w-full pl-4 pr-10 py-3 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-[var(--schemesPrimary)]"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_5__.MagnifyingGlassIcon, {
            size: 20,
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant",
            weight: "bold",
            "aria-hidden": true
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: () => setIsFiltersOpen(true),
          icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_6__.FunnelSimpleIcon, {}),
          label: filterCount ? `Filters (${filterCount})` : "Filters",
          variant: "outlined",
          size: "base",
          "aria-expanded": isFiltersOpen ? "true" : "false",
          "aria-controls": "mobile-filters"
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "tsb-container flex flex-col lg:flex-row py-4 lg:py-8 gap-8",
      children: [displayedFilters.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("aside", {
        className: "hidden lg:block lg:w-64 xl:w-72",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "mb-6",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("label", {
            htmlFor: "archive-search",
            className: "sr-only",
            children: "Search by keyword"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "flex items-center gap-2",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
              className: "bg-schemesSurfaceContainer flex-1 flex items-center gap-2 rounded-full px-4 py-3",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
                id: "archive-search",
                type: "search",
                value: searchQuery,
                onChange: e => setSearchQuery(e.target.value),
                placeholder: "Search by keyword",
                className: "w-full outline-none Blueprint-body-medium text-schemesOnSurface placeholder:text-schemesOnSurfaceVariant"
              }), !searchQuery && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_5__.MagnifyingGlassIcon, {
                size: 20,
                className: "text-schemesOnSurfaceVariant",
                weight: "bold"
              })]
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h2", {
          className: "Blueprint-headline-small-emphasized mb-4 text-schemesOnSurfaceVariant",
          children: "Filters"
        }), (hasActiveFilters || searchQuery) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "mb-4 flex gap-2",
          children: [hasActiveFilters && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
            size: "sm",
            variant: "tonal",
            onClick: clearAllFilters,
            label: "Clear filters"
          }), searchQuery && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
            size: "sm",
            variant: "tonal",
            onClick: () => setSearchQuery(""),
            label: "Clear search"
          })]
        }), displayedFilters.map(f => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "mb-4",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_FilterGroup__WEBPACK_IMPORTED_MODULE_1__.FilterGroup, {
            title: f.label || f.taxonomy,
            options: termsOptions[f.taxonomy] || [],
            selected: selectedTerms[f.taxonomy] || [],
            onChangeHandler: e => {
              const id = String(e.target.value);
              const checked = !!e.target.checked;
              setSelectedTerms(prev => {
                const current = prev[f.taxonomy] || [];
                const next = checked ? [...current, id] : current.filter(x => x !== id);
                return {
                  ...prev,
                  [f.taxonomy]: next
                };
              });
              setPage(1);
            }
          })
        }, f.taxonomy))]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("section", {
        className: "flex-1",
        children: [categoryTax && categoryRoots?.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "flex items-center gap-2 overflow-x-auto pb-3 mb-3",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
            type: "button",
            onClick: () => setCategory(""),
            className: `px-3 py-2 rounded-sm whitespace-nowrap ${currentCategorySel ? "bg-[var(--schemesSurfaceContainerHigh)]" : "bg-gray-500 text-[var(--schemesOnPrimary)]"} Blueprint-label-small`,
            children: "All"
          }), categoryRoots.map(opt => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
            type: "button",
            onClick: () => setCategory(opt.id),
            className: `px-3 py-2 rounded-sm whitespace-nowrap ${String(currentCategorySel) === String(opt.id) ? "bg-gray-500 text-[var(--schemesOnPrimary)]" : "bg-[var(--schemesSurfaceContainerHigh)]"} Blueprint-label-small`,
            title: opt.name,
            children: opt.name
          }, opt.id))]
        }), error && !loading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "mb-8 rounded-xl border border-[var(--schemesOutlineVariant)] bg-[var(--schemesSurface)] p-6",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "Blueprint-title-small-emphasized mb-2 text-[var(--schemesError)]",
            children: "Something went wrong"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
            className: "Blueprint-body-medium text-[var(--schemesOnSurfaceVariant)] mb-4",
            children: error
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "flex gap-2",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
              variant: "filled",
              label: "Try again",
              onClick: () => setRetryTick(n => n + 1)
            }), hasActiveFilters && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
              variant: "tonal",
              label: "Clear filters",
              onClick: clearAllFilters
            })]
          })]
        }), loading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "space-y-4 mb-8",
          "aria-hidden": "true",
          children: skeletonRows
        }), !loading && !error && filteredItems.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "rounded-2xl border border-[var(--schemesOutlineVariant)] bg-[var(--schemesSurface)] p-10 text-center mb-8",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "Blueprint-headline-small mb-2",
            children: "No results found"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
            className: "Blueprint-body-medium text-[var(--schemesOnSurfaceVariant)] mb-6",
            children: searchQuery ? "Try a different keyword or clear search." : "Try adjusting or clearing your filters to see more results."
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "flex justify-center gap-3",
            children: [searchQuery ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
              variant: "filled",
              label: "Clear search",
              onClick: () => setSearchQuery("")
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
              variant: "filled",
              label: "Clear all filters",
              onClick: clearAllFilters
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
              variant: "tonal",
              label: "Reload",
              onClick: () => setRetryTick(n => n + 1)
            })]
          })]
        }), !loading && !error && filteredItems.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "flex items-center justify-between mb-3",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
              className: "Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large text-[var(--schemesOnSurfaceVariant)]",
              "aria-live": "polite",
              children: searchQuery ? `${filteredItems.length} match${filteredItems.length === 1 ? "" : "s"} on this page` : typeof total === "number" ? `${total.toLocaleString()} result${total === 1 ? "" : "s"}` : null
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "space-y-4 mb-8",
            children: filteredItems.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(MessageRow, {
              item: item
            }, item.id))
          })]
        }), !loading && !error && totalPages > 1 && !searching && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "flex justify-center items-center gap-3 mt-2",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
            size: "base",
            variant: "tonal",
            disabled: page <= 1,
            onClick: () => setPage(p => Math.max(1, p - 1)),
            label: "Prev"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("span", {
            className: "Blueprint-body-medium text-schemesOnSurfaceVariant",
            children: [page, " / ", totalPages]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
            size: "base",
            variant: "tonal",
            disabled: page >= totalPages,
            onClick: () => setPage(p => Math.min(totalPages, p + 1)),
            label: "Next"
          })]
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      id: "mobile-filters",
      className: `lg:hidden fixed inset-0 z-[70] ${isFiltersOpen ? "" : "pointer-events-none"}`,
      "aria-hidden": isFiltersOpen ? "false" : "true",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        onClick: closeFilters,
        className: `absolute inset-0 transition-opacity ${isFiltersOpen ? "opacity-100" : "opacity-0"} bg-[color:rgb(0_0_0_/_0.44)]`
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Filters",
        className: `absolute left-0 right-0 bottom-0 max-h-[85vh] rounded-t-2xl bg-schemesSurface shadow-[0_-16px_48px_rgba(0,0,0,0.25)] transition-transform duration-300 ${isFiltersOpen ? "translate-y-0" : "translate-y-full"}`,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "relative px-4 py-3 border-b border-[var(--schemesOutlineVariant)]",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "mx-auto h-1.5 w-12 rounded-full bg-[var(--schemesOutlineVariant)]"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "mt-3 flex items-center justify-between",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
              className: "Blueprint-title-small-emphasized",
              children: "Filters"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
              ref: firstCloseBtnRef,
              type: "button",
              onClick: closeFilters,
              className: "rounded-full p-2 hover:bg-surfaceContainerHigh text-schemesOnSurfaceVariant",
              "aria-label": "Close filters",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_7__.XIcon, {})
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "px-4 py-4 overflow-y-auto space-y-4",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "relative",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
              type: "search",
              placeholder: "Search by keyword",
              value: searchQuery,
              onChange: e => setSearchQuery(e.target.value),
              className: "Blueprint-body-medium w-full pl-4 pr-10 py-3 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-[var(--schemesPrimary)]"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_5__.MagnifyingGlassIcon, {
              size: 20,
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant",
              weight: "bold",
              "aria-hidden": true
            })]
          }), displayedFilters.map(f => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_FilterGroup__WEBPACK_IMPORTED_MODULE_1__.FilterGroup, {
            title: f.label || f.taxonomy,
            options: termsOptions[f.taxonomy] || [],
            selected: selectedTerms[f.taxonomy] || [],
            onChangeHandler: e => {
              const id = String(e.target.value);
              const checked = !!e.target.checked;
              setSelectedTerms(prev => {
                const current = prev[f.taxonomy] || [];
                const next = checked ? [...current, id] : current.filter(x => x !== id);
                return {
                  ...prev,
                  [f.taxonomy]: next
                };
              });
              setPage(1);
            }
          }, `m-${f.taxonomy}`))]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "sticky bottom-0 px-4 py-3 bg-schemesSurface border-t border-[var(--schemesOutlineVariant)] flex gap-2",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
            onClick: clearAllFilters,
            variant: "outlined",
            label: "Clear all",
            className: "flex-1"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
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
//# sourceMappingURL=mb-archive.js.map?ver=97ba3f48a63d7444de19