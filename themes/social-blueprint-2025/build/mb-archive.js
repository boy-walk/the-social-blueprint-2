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






// ─────────────────────────────────────────────────────────────────────────────
// Constants & Helpers (outside component to avoid recreation)
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_COLORS = [{
  bg: "bg-blue-100",
  text: "text-blue-800",
  selectedBg: "bg-blue-600"
}, {
  bg: "bg-emerald-100",
  text: "text-emerald-800",
  selectedBg: "bg-emerald-600"
}, {
  bg: "bg-amber-100",
  text: "text-amber-800",
  selectedBg: "bg-amber-600"
}, {
  bg: "bg-rose-100",
  text: "text-rose-800",
  selectedBg: "bg-rose-600"
}, {
  bg: "bg-violet-100",
  text: "text-violet-800",
  selectedBg: "bg-violet-600"
}, {
  bg: "bg-cyan-100",
  text: "text-cyan-800",
  selectedBg: "bg-cyan-600"
}, {
  bg: "bg-orange-100",
  text: "text-orange-800",
  selectedBg: "bg-orange-600"
}, {
  bg: "bg-pink-100",
  text: "text-pink-800",
  selectedBg: "bg-pink-600"
}, {
  bg: "bg-teal-100",
  text: "text-teal-800",
  selectedBg: "bg-teal-600"
}, {
  bg: "bg-indigo-100",
  text: "text-indigo-800",
  selectedBg: "bg-indigo-600"
}, {
  bg: "bg-lime-100",
  text: "text-lime-800",
  selectedBg: "bg-lime-600"
}, {
  bg: "bg-fuchsia-100",
  text: "text-fuchsia-800",
  selectedBg: "bg-fuchsia-600"
}];
const hashString = str => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};
const getCategoryColor = (label, isSelected = false) => {
  const color = CATEGORY_COLORS[hashString(label) % CATEGORY_COLORS.length];
  return isSelected ? {
    bg: color.selectedBg,
    text: "text-white"
  } : {
    bg: color.bg,
    text: color.text
  };
};
const stripTags = html => {
  if (typeof html !== "string") return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || "").trim();
};
const CATEGORY_PATTERN = /(_category|_categories|category|categories|cat)$/i;
const extractCategoryLabels = item => {
  const seen = new Set();
  const labels = [];
  const push = val => {
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
const buildTreeAndDescendants = rows => {
  const byId = {};
  rows.forEach(r => {
    var _r$parent;
    const id = String(r.id);
    byId[id] = {
      id,
      name: r.name,
      slug: r.slug,
      parent: String((_r$parent = r.parent) !== null && _r$parent !== void 0 ? _r$parent : 0),
      children: []
    };
  });
  const roots = [];
  rows.forEach(r => {
    const id = String(r.id);
    const p = byId[id].parent;
    if (p !== "0" && byId[p]) {
      byId[p].children.push(byId[id]);
    } else {
      roots.push(byId[id]);
    }
  });
  const descendants = {};
  const collect = n => {
    const acc = [];
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

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components (memoized)
// ─────────────────────────────────────────────────────────────────────────────

const LeadingIcon = react__WEBPACK_IMPORTED_MODULE_0___default().memo(({
  categoryLabels,
  categoriesMap
}) => {
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
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden shrink-0",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("img", {
        src: imageUrl.startsWith('http') ? imageUrl : `/wp-content/uploads/${imageUrl}`,
        alt: "",
        className: "w-full h-full object-cover",
        loading: "lazy"
      })
    });
  }
  if (faIcon) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center shrink-0",
      style: {
        backgroundColor: color || 'var(--schemesSecondaryContainer)'
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("i", {
        className: `${faIcon} text-xl md:text-2xl`,
        style: {
          color: color ? '#fff' : 'var(--schemesOnSecondaryContainer)'
        }
      })
    });
  }

  // Fallback to first letter
  const letter = (categoryLabels[0]?.[0] || "•").toUpperCase();
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
    className: "w-14 h-14 md:w-16 md:h-16 rounded-xl bg-schemesSecondaryContainer flex items-center justify-center shrink-0",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
      className: "Blueprint-title-large md:Blueprint-headline-medium text-schemesOnSecondaryContainer",
      children: letter
    })
  });
});
const CategoryBadges = react__WEBPACK_IMPORTED_MODULE_0___default().memo(({
  labels
}) => {
  if (!labels.length) return null;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
    className: "flex flex-wrap gap-1.5 md:gap-2 mb-1.5 md:mb-2",
    children: labels.map((label, idx) => {
      const color = getCategoryColor(label);
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
        className: `px-2 py-1 md:px-3 md:py-1.5 rounded-lg ${color.bg} ${color.text} Blueprint-label-small`,
        children: label
      }, idx);
    })
  });
});
const MessageRow = react__WEBPACK_IMPORTED_MODULE_0___default().memo(({
  item,
  categoriesMap
}) => {
  const categoryLabels = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => extractCategoryLabels(item), [item]);
  const href = item?.permalink || "#";
  const excerpt = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => stripTags(item?.excerpt || ""), [item?.excerpt]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("a", {
    href: href,
    className: "block rounded-xl border border-schemesOutlineVariant bg-schemesSurfaceContainerLowest hover:bg-schemesSurfaceContainer focus:outline-none focus:ring-2 focus:ring-schemesPrimary transition",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "flex gap-3 md:gap-4 p-3 md:p-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(LeadingIcon, {
        categoryLabels: categoryLabels,
        categoriesMap: categoriesMap
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "flex-1 min-w-0",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(CategoryBadges, {
          labels: categoryLabels
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
          className: "Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized text-schemesOnSurface mb-0.5 md:mb-1 line-clamp-2",
          children: item?.title
        }), excerpt && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          className: "Blueprint-body-small text-schemesOnSurfaceVariant line-clamp-2",
          children: excerpt
        })]
      })]
    })
  });
});
const SkeletonRow = react__WEBPACK_IMPORTED_MODULE_0___default().memo(() => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
  className: "rounded-xl border border-schemesOutlineVariant overflow-hidden bg-schemesSurface",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: "flex gap-3 md:gap-4 p-3 md:p-4",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "w-14 h-14 md:w-16 md:h-16 rounded-xl bg-schemesSurfaceContainerHighest animate-pulse shrink-0"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "flex-1 space-y-2",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "h-4 md:h-5 w-3/5 bg-schemesSurfaceContainerHigh animate-pulse rounded"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "h-3 md:h-4 w-4/5 bg-schemesSurfaceContainerHigh animate-pulse rounded"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "h-3 md:h-4 w-2/3 bg-schemesSurfaceContainerHigh animate-pulse rounded"
      })]
    })]
  })
}));
const CategoryChips = react__WEBPACK_IMPORTED_MODULE_0___default().memo(({
  options,
  selected,
  onSelect
}) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
  className: "flex items-center gap-1.5 md:gap-2 overflow-x-auto pb-3 mb-2 md:mb-3 -mx-4 px-4 md:mx-0 md:px-0",
  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
    type: "button",
    onClick: () => onSelect(""),
    className: `px-2.5 py-1.5 md:px-3 md:py-2 rounded-full whitespace-nowrap transition-colors Blueprint-label-small ${!selected ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`,
    children: "All"
  }), options.map(opt => {
    const isSelected = String(selected) === String(opt.id);
    const color = getCategoryColor(opt.name, isSelected);
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
      type: "button",
      onClick: () => onSelect(opt.id),
      className: `px-2.5 py-1.5 md:px-3 md:py-2 rounded-full whitespace-nowrap transition-colors ${color.bg} ${color.text} ${!isSelected ? "hover:opacity-80" : ""} Blueprint-label-small`,
      children: opt.name
    }, opt.id);
  })]
}));

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

function MessageBoardArchivePage({
  postType,
  taxonomy,
  currentTerm,
  filters = [],
  endpoint,
  baseQuery = {},
  title,
  subtitle,
  breadcrumbs = [],
  categories = []
}) {
  // ─────────────────────────────────────────────────────────────────────────
  // Memoized lookups
  // ─────────────────────────────────────────────────────────────────────────

  // Build a Map for O(1) category lookups by name/slug
  const categoriesMap = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const map = new Map();
    categories.forEach(cat => {
      map.set(cat.name.toLowerCase(), cat);
      map.set(cat.slug.toLowerCase(), cat);
    });
    return map;
  }, [categories]);

  // Identify category taxonomy for chips
  const categoryTax = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const f = filters.find(f => f.isCategory || CATEGORY_PATTERN.test(f.taxonomy));
    return f?.taxonomy || null;
  }, [filters]);

  // Sidebar filters (exclude category tax)
  const displayedFilters = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => filters.filter(f => f.taxonomy !== taxonomy && f.taxonomy !== categoryTax), [filters, taxonomy, categoryTax]);

  // ─────────────────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────────────────

  const [page, setPage] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1);
  const [selectedTerms, setSelectedTerms] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(() => {
    if (taxonomy && currentTerm?.id) {
      return {
        [taxonomy]: [String(currentTerm.id)]
      };
    }
    return {};
  });
  const [items, setItems] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [totalPages, setTotalPages] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1);
  const [total, setTotal] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(undefined);
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const [searchQuery, setSearchQuery] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const [debouncedSearch, setDebouncedSearch] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const [termsOptions, setTermsOptions] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [isFiltersOpen, setIsFiltersOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [retryTick, setRetryTick] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);

  // Refs
  const fetchSeqRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(0);
  const fetchedTaxonomiesRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(new Set());
  const firstCloseBtnRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);

  // ─────────────────────────────────────────────────────────────────────────
  // Debounce search
  // ─────────────────────────────────────────────────────────────────────────

  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ─────────────────────────────────────────────────────────────────────────
  // Load terms for filters (only taxonomies we need)
  // ─────────────────────────────────────────────────────────────────────────

  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const toFetch = displayedFilters.filter(f => !fetchedTaxonomiesRef.current.has(f.taxonomy)).map(f => f.taxonomy);
    if (categoryTax && !fetchedTaxonomiesRef.current.has(categoryTax)) {
      toFetch.unshift(categoryTax);
    }
    if (!toFetch.length) return;
    let cancelled = false;
    Promise.all(toFetch.map(async tax => {
      try {
        const res = await fetch(`/wp-json/tsb/v1/terms?taxonomy=${encodeURIComponent(tax)}&per_page=100`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        const rows = (Array.isArray(json) ? json : []).map(t => {
          var _t$parent;
          return {
            id: String(t.id),
            name: t.name,
            slug: t.slug,
            parent: String((_t$parent = t.parent) !== null && _t$parent !== void 0 ? _t$parent : 0)
          };
        });
        const isHier = rows.some(r => r.parent !== "0");
        return {
          tax,
          data: isHier ? buildTreeAndDescendants(rows).tree : rows
        };
      } catch {
        return {
          tax,
          data: []
        };
      }
    })).then(results => {
      if (cancelled) return;
      const next = {};
      results.forEach(({
        tax,
        data
      }) => {
        next[tax] = data;
        fetchedTaxonomiesRef.current.add(tax);
      });
      setTermsOptions(prev => ({
        ...prev,
        ...next
      }));
    });
    return () => {
      cancelled = true;
    };
  }, [displayedFilters, categoryTax]);

  // ─────────────────────────────────────────────────────────────────────────
  // Fetch posts
  // ─────────────────────────────────────────────────────────────────────────

  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    let cancelled = false;
    const seq = ++fetchSeqRef.current;
    setLoading(true);
    setError("");
    const payload = {
      ...baseQuery,
      page
    };

    // Build tax query
    const baseTax = Array.isArray(baseQuery.tax) ? baseQuery.tax : baseQuery.tax ? [baseQuery.tax] : [];
    const uiTax = Object.entries(selectedTerms).filter(([, ids]) => ids?.length).map(([taxKey, ids]) => ({
      taxonomy: taxKey,
      field: "term_id",
      terms: ids.map(id => parseInt(id, 10)).filter(Number.isFinite),
      operator: "IN",
      include_children: true
    }));
    const finalTax = [...baseTax, ...uiTax];
    if (finalTax.length) {
      payload.tax = finalTax;
      if (baseQuery.tax_relation) payload.tax_relation = baseQuery.tax_relation;
    }
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    }).then(json => {
      var _json$total;
      if (cancelled || seq !== fetchSeqRef.current) return;
      setItems(json.items || []);
      setTotalPages(json.total_pages || 1);
      setTotal((_json$total = json.total) !== null && _json$total !== void 0 ? _json$total : undefined);
    }).catch(err => {
      if (cancelled || seq !== fetchSeqRef.current) return;
      setError(err.message || "Failed to load");
    }).finally(() => {
      if (cancelled || seq !== fetchSeqRef.current) return;
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [baseQuery, endpoint, page, selectedTerms, retryTick]);

  // ─────────────────────────────────────────────────────────────────────────
  // Client-side search filtering
  // ─────────────────────────────────────────────────────────────────────────

  const filteredItems = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return items;
    const words = q.split(/\s+/).filter(Boolean);
    return items.filter(item => {
      const searchText = [item.title, item.excerpt, ...(item.categories || []), ...Object.values(item.taxonomies || {}).flat().map(t => t?.name || "")].filter(Boolean).join(" ").toLowerCase();
      return words.every(w => searchText.includes(w));
    });
  }, [items, debouncedSearch]);

  // ─────────────────────────────────────────────────────────────────────────
  // Derived state
  // ─────────────────────────────────────────────────────────────────────────

  const categoryOptions = termsOptions[categoryTax] || [];
  const currentCategorySel = (selectedTerms[categoryTax] || [])[0] || "";
  const isSearching = debouncedSearch.trim().length > 0;
  const hasActiveFilters = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => Object.entries(selectedTerms).some(([k, arr]) => k !== categoryTax && arr?.length > 0), [selectedTerms, categoryTax]);
  const filterCount = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    let count = isSearching ? 1 : 0;
    for (const [k, arr] of Object.entries(selectedTerms)) {
      if (k !== categoryTax) count += arr?.length || 0;
    }
    return count;
  }, [selectedTerms, categoryTax, isSearching]);

  // ─────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────

  const setCategory = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(id => {
    setSelectedTerms(prev => ({
      ...prev,
      [categoryTax]: id ? [String(id)] : []
    }));
    setPage(1);
  }, [categoryTax]);
  const handleFilterChange = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((taxonomy, id, checked) => {
    setSelectedTerms(prev => {
      const current = prev[taxonomy] || [];
      const next = checked ? [...current, id] : current.filter(x => x !== id);
      return {
        ...prev,
        [taxonomy]: next
      };
    });
    setPage(1);
  }, []);
  const clearAllFilters = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setSelectedTerms(prev => ({
      [categoryTax]: prev[categoryTax] || []
    }));
    setPage(1);
  }, [categoryTax]);
  const closeFilters = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => setIsFiltersOpen(false), []);

  // ─────────────────────────────────────────────────────────────────────────
  // Mobile drawer effects
  // ─────────────────────────────────────────────────────────────────────────

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
  }, [isFiltersOpen, closeFilters]);

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: "archive-container bg-schemesSurface",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "bg-schemesPrimaryFixed py-6 md:py-8",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "tsb-container",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.Breadcrumbs, {
          items: breadcrumbs,
          textColour: "text-schemesPrimary"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h1", {
          className: "Blueprint-headline-medium md:Blueprint-headline-large text-schemesOnSurface mb-1",
          children: title
        }), subtitle && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          className: "Blueprint-body-small md:Blueprint-body-medium text-schemesOnPrimaryFixedVariant",
          children: subtitle
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "tsb-container pt-4 md:pt-6",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "lg:hidden flex items-center gap-2 mb-3 md:mb-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "relative flex-1",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
            type: "search",
            value: searchQuery,
            onChange: e => setSearchQuery(e.target.value),
            placeholder: "Search...",
            className: "Blueprint-body-medium w-full pl-4 pr-10 py-2.5 md:py-3 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-schemesPrimary"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_5__.MagnifyingGlass, {
            size: 18,
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant",
            weight: "bold"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: () => setIsFiltersOpen(true),
          icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_6__.FunnelSimple, {}),
          label: filterCount ? `(${filterCount})` : "Filters",
          variant: "outlined",
          size: "sm"
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "tsb-container flex flex-col lg:flex-row py-2 md:py-4 lg:py-8 gap-4 md:gap-6 lg:gap-8",
      children: [displayedFilters.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("aside", {
        className: "hidden lg:block lg:w-64 xl:w-72 shrink-0",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "mb-6",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "bg-schemesSurfaceContainer flex items-center gap-2 rounded-full px-4 py-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
              type: "search",
              value: searchQuery,
              onChange: e => setSearchQuery(e.target.value),
              placeholder: "Search by keyword",
              className: "w-full outline-none Blueprint-body-medium text-schemesOnSurface placeholder:text-schemesOnSurfaceVariant bg-transparent"
            }), !searchQuery && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_5__.MagnifyingGlass, {
              size: 20,
              className: "text-schemesOnSurfaceVariant",
              weight: "bold"
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h2", {
          className: "Blueprint-headline-small-emphasized mb-4 text-schemesOnSurfaceVariant",
          children: "Filters"
        }), (hasActiveFilters || searchQuery) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "mb-4 flex flex-wrap gap-2",
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
              handleFilterChange(f.taxonomy, String(e.target.value), e.target.checked);
            }
          })
        }, f.taxonomy))]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("section", {
        className: "flex-1 min-w-0",
        children: [categoryTax && categoryOptions.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(CategoryChips, {
          options: categoryOptions,
          selected: currentCategorySel,
          onSelect: setCategory
        }), error && !loading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "mb-6 md:mb-8 rounded-xl border border-schemesOutlineVariant bg-schemesSurface p-4 md:p-6",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "Blueprint-title-small-emphasized mb-2 text-schemesError",
            children: "Something went wrong"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
            className: "Blueprint-body-medium text-schemesOnSurfaceVariant mb-4",
            children: error
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "flex flex-wrap gap-2",
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
          className: "space-y-3 md:space-y-4 mb-6 md:mb-8",
          children: Array.from({
            length: 6
          }).map((_, i) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(SkeletonRow, {}, i))
        }), !loading && !error && filteredItems.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "rounded-2xl border border-schemesOutlineVariant bg-schemesSurface p-6 md:p-10 text-center mb-6 md:mb-8",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "Blueprint-headline-small mb-2",
            children: "No results found"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
            className: "Blueprint-body-medium text-schemesOnSurfaceVariant mb-6",
            children: searchQuery ? "Try a different keyword or clear search." : "Try adjusting or clearing your filters."
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "flex justify-center flex-wrap gap-3",
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
            className: "mb-2 md:mb-3",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              className: "Blueprint-body-small md:Blueprint-body-medium text-schemesOnSurfaceVariant",
              children: isSearching ? `${filteredItems.length} match${filteredItems.length === 1 ? "" : "es"}` : typeof total === "number" ? `${total.toLocaleString()} result${total === 1 ? "" : "s"}` : null
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "space-y-3 md:space-y-4 mb-6 md:mb-8",
            children: filteredItems.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(MessageRow, {
              item: item,
              categoriesMap: categoriesMap
            }, item.id))
          })]
        }), !loading && !error && totalPages > 1 && !isSearching && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "flex justify-center items-center gap-2 md:gap-3",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
            size: "sm",
            variant: "tonal",
            disabled: page <= 1,
            onClick: () => setPage(p => Math.max(1, p - 1)),
            label: "Prev"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("span", {
            className: "Blueprint-body-small md:Blueprint-body-medium text-schemesOnSurfaceVariant",
            children: [page, " / ", totalPages]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
            size: "sm",
            variant: "tonal",
            disabled: page >= totalPages,
            onClick: () => setPage(p => Math.min(totalPages, p + 1)),
            label: "Next"
          })]
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: `lg:hidden fixed inset-0 z-[70] ${isFiltersOpen ? "" : "pointer-events-none"}`,
      "aria-hidden": !isFiltersOpen,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        onClick: closeFilters,
        className: `absolute inset-0 transition-opacity duration-200 ${isFiltersOpen ? "opacity-100 bg-black/40" : "opacity-0"}`
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        role: "dialog",
        "aria-modal": "true",
        className: `absolute left-0 right-0 bottom-0 max-h-[85vh] rounded-t-2xl bg-schemesSurface shadow-[0_-16px_48px_rgba(0,0,0,0.25)] transition-transform duration-300 flex flex-col ${isFiltersOpen ? "translate-y-0" : "translate-y-full"}`,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "px-4 py-3 border-b border-schemesOutlineVariant shrink-0",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "mx-auto h-1.5 w-12 rounded-full bg-schemesOutlineVariant"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "mt-3 flex items-center justify-between",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
              className: "Blueprint-title-small-emphasized",
              children: "Filters"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
              ref: firstCloseBtnRef,
              type: "button",
              onClick: closeFilters,
              className: "rounded-full p-2 hover:bg-schemesSurfaceContainerHigh text-schemesOnSurfaceVariant",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_7__.X, {
                size: 20
              })
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "px-4 py-4 overflow-y-auto flex-1 space-y-4",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "relative",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
              type: "search",
              placeholder: "Search...",
              value: searchQuery,
              onChange: e => setSearchQuery(e.target.value),
              className: "Blueprint-body-medium w-full pl-4 pr-10 py-2.5 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-schemesPrimary"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_5__.MagnifyingGlass, {
              size: 18,
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant",
              weight: "bold"
            })]
          }), displayedFilters.map(f => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_FilterGroup__WEBPACK_IMPORTED_MODULE_1__.FilterGroup, {
            title: f.label || f.taxonomy,
            options: termsOptions[f.taxonomy] || [],
            selected: selectedTerms[f.taxonomy] || [],
            onChangeHandler: e => {
              handleFilterChange(f.taxonomy, String(e.target.value), e.target.checked);
            }
          }, `m-${f.taxonomy}`))]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "px-4 py-3 bg-schemesSurface border-t border-schemesOutlineVariant flex gap-2 shrink-0",
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
//# sourceMappingURL=mb-archive.js.map?ver=9eb0d856e2426b1d4e28