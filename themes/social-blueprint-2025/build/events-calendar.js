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

/***/ "./src/scripts/DropdownSelect.js":
/*!***************************************!*\
  !*** ./src/scripts/DropdownSelect.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DropdownSelect: () => (/* binding */ DropdownSelect)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.mjs");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/CaretDown.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/CaretRight.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/Check.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/MagnifyingGlass.es.js");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Button */ "./src/scripts/Button.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);





/**
 * Flattens nested options into a flat array with depth info
 */

function flattenOptions(options, depth = 0, parentExpanded = true) {
  let result = [];
  for (const option of options) {
    result.push({
      ...option,
      depth,
      hasChildren: Array.isArray(option.children) && option.children.length > 0
    });
    if (option.children && option.children.length > 0) {
      result = result.concat(flattenOptions(option.children, depth + 1, parentExpanded));
    }
  }
  return result;
}

/**
 * Recursively filter options based on search query
 * Returns options that match OR have children that match
 */
function filterOptionsRecursive(options, searchLower) {
  if (!searchLower) return options;
  return options.reduce((acc, option) => {
    const labelMatches = option.label.toLowerCase().includes(searchLower);

    // Check if any children match
    let filteredChildren = [];
    if (option.children && option.children.length > 0) {
      filteredChildren = filterOptionsRecursive(option.children, searchLower);
    }

    // Include if label matches OR has matching children
    if (labelMatches || filteredChildren.length > 0) {
      acc.push({
        ...option,
        children: filteredChildren.length > 0 ? filteredChildren : option.children,
        // Mark as matching if the label itself matches (for highlighting)
        _matches: labelMatches
      });
    }
    return acc;
  }, []);
}

/**
 * Get all descendant values of an option
 */
function getDescendantValues(option) {
  let values = [];
  if (option.children) {
    for (const child of option.children) {
      values.push(child.value);
      values = values.concat(getDescendantValues(child));
    }
  }
  return values;
}

/**
 * Find an option by value in nested structure
 */
function findOptionByValue(options, value) {
  for (const option of options) {
    if (option.value === value) return option;
    if (option.children) {
      const found = findOptionByValue(option.children, value);
      if (found) return found;
    }
  }
  return null;
}
function DropdownSelect({
  label = 'Select',
  options = [],
  value = [],
  onChange,
  multiple = false,
  searchable = true,
  searchPlaceholder = 'Search...',
  placeholder = 'Select an option',
  disabled = false,
  error = '',
  supportingText = '',
  collapsible = false // Whether parent items can be collapsed
}) {
  const [isOpen, setIsOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [search, setSearch] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [expandedNodes, setExpandedNodes] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(new Set());
  const dropdownRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const triggerRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const id = (0,react__WEBPACK_IMPORTED_MODULE_0__.useId)();

  // Normalize value to array for consistent handling
  const selectedValues = multiple ? Array.isArray(value) ? value : [] : value ? [value] : [];

  // Check if options are nested
  const isNested = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return options.some(opt => opt.children && opt.children.length > 0);
  }, [options]);

  // Filter options based on search
  const filteredOptions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const searchLower = search.toLowerCase().trim();
    if (!searchLower) return options;
    return filterOptionsRecursive(options, searchLower);
  }, [options, search]);

  // Flatten for rendering
  const flatOptions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return flattenOptions(filteredOptions);
  }, [filteredOptions]);

  // Auto-expand all when searching
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (search && isNested) {
      const allParentValues = new Set();
      const collectParents = opts => {
        for (const opt of opts) {
          if (opt.children && opt.children.length > 0) {
            allParentValues.add(opt.value);
            collectParents(opt.children);
          }
        }
      };
      collectParents(filteredOptions);
      setExpandedNodes(allParentValues);
    }
  }, [search, filteredOptions, isNested]);

  // Initialize expanded state to show all by default
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isNested && !collapsible) {
      const allParentValues = new Set();
      const collectParents = opts => {
        for (const opt of opts) {
          if (opt.children && opt.children.length > 0) {
            allParentValues.add(opt.value);
            collectParents(opt.children);
          }
        }
      };
      collectParents(options);
      setExpandedNodes(allParentValues);
    }
  }, [options, isNested, collapsible]);

  // Close on outside click
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !triggerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on escape
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const handleEscape = e => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);
  const toggleExpanded = (optionValue, e) => {
    e.stopPropagation();
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(optionValue)) {
        next.delete(optionValue);
      } else {
        next.add(optionValue);
      }
      return next;
    });
  };
  const handleSelect = optionValue => {
    if (multiple) {
      const newValue = selectedValues.includes(optionValue) ? selectedValues.filter(v => v !== optionValue) : [...selectedValues, optionValue];
      onChange?.(newValue);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
      setSearch('');
    }
  };
  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;

    // Find labels from nested structure
    const findLabels = (opts, values) => {
      let labels = [];
      for (const opt of opts) {
        if (values.includes(opt.value)) {
          labels.push(opt.label);
        }
        if (opt.children) {
          labels = labels.concat(findLabels(opt.children, values));
        }
      }
      return labels;
    };
    const selectedLabels = findLabels(options, selectedValues);
    if (selectedLabels.length === 1) return selectedLabels[0];
    return `${selectedLabels.length} selected`;
  };
  const hasError = typeof error === 'string' && error.length > 0;
  const helperText = hasError ? error : supportingText;

  // Check if an option or any of its ancestors is hidden due to collapsed parent
  const isOptionVisible = (option, index) => {
    if (!collapsible || option.depth === 0) return true;

    // Find parent option
    for (let i = index - 1; i >= 0; i--) {
      const prevOption = flatOptions[i];
      if (prevOption.depth < option.depth) {
        // This is a potential parent
        if (prevOption.hasChildren && !expandedNodes.has(prevOption.value)) {
          return false;
        }
        if (prevOption.depth === 0) break;
      }
    }
    return true;
  };

  // Render a single option
  const renderOption = (option, index) => {
    // Skip if parent is collapsed
    if (collapsible && !isOptionVisible(option, index)) {
      return null;
    }
    const isSelected = selectedValues.includes(option.value);
    const isExpanded = expandedNodes.has(option.value);
    const indent = option.depth * 24;
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("li", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("button", {
        type: "button",
        onClick: () => handleSelect(option.value),
        className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg', 'Blueprint-body-medium text-left', 'transition-colors duration-150', isSelected ? 'bg-schemesPrimaryContainer text-schemesOnPrimaryContainer' : 'text-schemesOnSurface hover:bg-schemesSurfaceContainerHigh'),
        style: {
          paddingLeft: `${12 + indent}px`
        },
        role: "option",
        "aria-selected": isSelected,
        children: [collapsible && option.hasChildren ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
          type: "button",
          onClick: e => toggleExpanded(option.value, e),
          className: "p-0.5 -ml-1 rounded hover:bg-schemesOutlineVariant/30",
          "aria-label": isExpanded ? 'Collapse' : 'Expand',
          children: isExpanded ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_4__.CaretDown, {
            size: 16,
            className: "text-schemesOnSurfaceVariant"
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_5__.CaretRight, {
            size: 16,
            className: "text-schemesOnSurfaceVariant"
          })
        }) : option.depth > 0 && collapsible && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
          className: "w-5"
        }) // Spacer for alignment
        , /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
          className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])('flex items-center justify-center w-5 h-5 shrink-0', 'border-2 transition-colors duration-150', multiple ? 'rounded' : 'rounded-full', isSelected ? 'bg-schemesPrimary border-schemesPrimary' : 'border-schemesOutline bg-transparent'),
          children: isSelected && (multiple ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_6__.Check, {
            size: 14,
            weight: "bold",
            className: "text-schemesOnPrimary"
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
            className: "w-2 h-2 rounded-full bg-schemesOnPrimary"
          }))
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
          className: "flex-1 min-w-0 truncate",
          children: option.label
        }), option.image && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("img", {
          src: option.image,
          alt: "",
          className: "w-6 h-6 rounded-full object-cover"
        })]
      })
    }, option.value);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "relative flex flex-col gap-2",
    children: [label && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
      className: "Blueprint-label-medium text-schemesOnSurface",
      children: label
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("button", {
      ref: triggerRef,
      type: "button",
      onClick: () => !disabled && setIsOpen(!isOpen),
      disabled: disabled,
      className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])('w-full flex items-center justify-between gap-2', 'px-4 py-3 rounded-xl', 'Blueprint-body-medium text-left', 'border bg-schemesSurfaceContainerLow', 'transition-colors duration-150', hasError ? 'border-schemesError' : 'border-schemesOutline hover:border-schemesOnSurfaceVariant focus:border-schemesPrimary', disabled && 'opacity-50 cursor-not-allowed', !disabled && 'cursor-pointer'),
      "aria-haspopup": "listbox",
      "aria-expanded": isOpen,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
        className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])('truncate', selectedValues.length === 0 && 'text-schemesOnSurfaceVariant'),
        children: getDisplayText()
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_4__.CaretDown, {
        size: 20,
        className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])('text-schemesOnSurfaceVariant transition-transform duration-200 shrink-0', isOpen && 'rotate-180')
      })]
    }), isOpen && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      ref: dropdownRef,
      className: "absolute top-full left-0 right-0 z-50 mt-1 bg-schemesSurface border border-schemesOutlineVariant rounded-xl shadow-lg overflow-hidden",
      role: "listbox",
      "aria-multiselectable": multiple,
      children: [searchable && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "p-2 border-b border-schemesOutlineVariant",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "relative",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_7__.MagnifyingGlass, {
            size: 18,
            className: "absolute left-3 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "text",
            value: search,
            onChange: e => setSearch(e.target.value),
            placeholder: searchPlaceholder,
            className: "w-full pl-10 pr-4 py-2 Blueprint-body-medium bg-schemesSurfaceContainerHigh border border-schemesOutline rounded-lg text-schemesOnSurface placeholder:text-schemesOnSurfaceVariant focus:outline-none focus:ring-2 focus:ring-schemesPrimary focus:border-schemesPrimary",
            autoFocus: true
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("ul", {
        className: "max-h-60 overflow-y-auto p-2",
        children: flatOptions.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("li", {
          className: "px-4 py-3 Blueprint-body-medium text-schemesOnSurfaceVariant text-center",
          children: "No results found"
        }) : flatOptions.map((option, index) => renderOption(option, index))
      }), multiple && selectedValues.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "p-2 border-t border-schemesOutlineVariant",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
          label: "Clear selection",
          variant: "text",
          size: "sm",
          className: "w-full",
          onClick: () => {
            onChange?.([]);
            setIsOpen(false);
          }
        })
      })]
    }), helperText && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
      className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])('ml-4 Blueprint-body-small', hasError ? 'text-schemesError' : 'text-schemesOnSurfaceVariant'),
      children: helperText
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
/* harmony import */ var _fullcalendar_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fullcalendar/react */ "./node_modules/@fullcalendar/react/dist/index.js");
/* harmony import */ var _fullcalendar_daygrid__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @fullcalendar/daygrid */ "./node_modules/@fullcalendar/daygrid/index.js");
/* harmony import */ var _fullcalendar_list__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @fullcalendar/list */ "./node_modules/@fullcalendar/list/index.js");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Button */ "./src/scripts/Button.js");
/* harmony import */ var _DropdownSelect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DropdownSelect */ "./src/scripts/DropdownSelect.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/MagnifyingGlass.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/FunnelSimple.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/ArrowLeft.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/ArrowRight.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/X.es.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);








function EventsCalendar({
  categories,
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
  const [selectedCategories, setSelectedCategories] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [selectedTypes, setSelectedTypes] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [selectedTopics, setSelectedTopics] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [selectedAudiences, setSelectedAudiences] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [selectedLocations, setSelectedLocations] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [onlyFeatured, setOnlyFeatured] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [currentView, setCurrentView] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("dayGridMonth");
  const [supportsHover, setSupportsHover] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
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

  // Convert options to DropdownSelect format
  const categoryOptions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (categories || []).map(opt => ({
    value: String(opt.id),
    label: opt.name
  })), [categories]);
  const typeOptions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (Object.values(types) || []).map(opt => ({
    value: String(opt.id),
    label: opt.name
  })), [types]);
  const topicOptions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (Object.values(topics) || []).map(opt => ({
    value: String(opt.id),
    label: opt.name
  })), [topics]);
  const audienceOptions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (audiences || []).map(opt => ({
    value: String(opt.id),
    label: opt.name
  })), [audiences]);
  const locationTypeOptions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => [{
    value: "In Person",
    label: "In Person"
  }, {
    value: "Online",
    label: "Online"
  }], []);

  // Detect if device supports hover
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (typeof window === "undefined") return;
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setSupportsHover(hoverQuery.matches);
    const onChange = e => setSupportsHover(e.matches);
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
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
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
  const changeView = viewName => {
    const api = getApi();
    if (api) api.changeView(viewName);
  };
  const datesSet = info => {
    const start = info.startStr.split("T")[0];
    const end = info.endStr.split("T")[0];
    setDateRange({
      start,
      end
    });
    setCurrentView(info.view.type);
  };
  const slugify = (s = "") => s.toString().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
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
    const matchedIds = (audiences || []).filter(opt => {
      const idStr = String(opt.id);
      const optSlug = (opt.slug ? String(opt.slug) : slugify(opt.name || "")).toLowerCase();
      return requested.includes(idStr) || requested.includes(optSlug);
    }).map(opt => String(opt.id));
    if (matchedIds.length) setSelectedAudiences(matchedIds);
  }, [audiences, types, categories]);
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
      categories: selectedCategories.toString(),
      types: selectedTypes.toString(),
      topics: selectedTopics.toString(),
      audience: selectedAudiences.toString(),
      location_type: selectedLocations.toString(),
      is_featured: onlyFeatured ? "1" : "",
      s: debouncedKeywordValue
    }));
  }, [dateRange, selectedCategories, selectedTypes, selectedTopics, selectedAudiences, selectedLocations, onlyFeatured, debouncedKeywordValue]);
  const applyResponsiveView = api => {
    if (!api || typeof window === "undefined") return;
    const mobile = window.matchMedia("(max-width: 568px)").matches;
    if (mobile) {
      if (api.view?.type !== "listMonth") {
        api.changeView("listMonth");
        setCurrentView("listMonth");
      }
    }
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
  const filterCount = selectedCategories.length + selectedTypes.length + selectedTopics.length + selectedAudiences.length + selectedLocations.length + (onlyFeatured ? 1 : 0) + (debouncedKeywordValue ? 1 : 0);
  const openFilters = () => setIsFiltersOpen(true);
  const closeFilters = () => setIsFiltersOpen(false);
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
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSelectedTopics([]);
    setSelectedAudiences([]);
    setSelectedLocations([]);
    setOnlyFeatured(false);
  };
  const viewOptions = [{
    key: "dayGridMonth",
    label: "Month"
  }, {
    key: "listWeek",
    label: "Week"
  }, {
    key: "listDay",
    label: "Day"
  }];

  // Render filters (reusable for desktop and mobile)
  const renderFilters = (isMobile = false) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "space-y-4",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
      className: "flex items-center gap-3 cursor-pointer",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
        type: "checkbox",
        checked: onlyFeatured,
        onChange: e => setOnlyFeatured(e.target.checked),
        className: "w-5 h-5 rounded border-schemesOutline text-schemesPrimary focus:ring-schemesPrimary"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
        className: "Blueprint-body-medium text-schemesOnSurface",
        children: "Featured only"
      })]
    }), categoryOptions.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_DropdownSelect__WEBPACK_IMPORTED_MODULE_2__.DropdownSelect, {
      label: "Category",
      placeholder: "Select categories...",
      multiple: true,
      searchable: true,
      searchPlaceholder: "Search categories...",
      options: categoryOptions,
      value: selectedCategories,
      onChange: setSelectedCategories
    }), typeOptions.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_DropdownSelect__WEBPACK_IMPORTED_MODULE_2__.DropdownSelect, {
      label: "Theme",
      placeholder: "Select themes...",
      multiple: true,
      searchable: true,
      searchPlaceholder: "Search themes...",
      options: typeOptions,
      value: selectedTypes,
      onChange: setSelectedTypes
    }), topicOptions.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_DropdownSelect__WEBPACK_IMPORTED_MODULE_2__.DropdownSelect, {
      label: "Topic",
      placeholder: "Select topics...",
      multiple: true,
      searchable: true,
      searchPlaceholder: "Search topics...",
      options: topicOptions,
      value: selectedTopics,
      onChange: setSelectedTopics
    }), audienceOptions.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_DropdownSelect__WEBPACK_IMPORTED_MODULE_2__.DropdownSelect, {
      label: "Audience",
      placeholder: "Select audiences...",
      multiple: true,
      searchable: true,
      searchPlaceholder: "Search audiences...",
      options: audienceOptions,
      value: selectedAudiences,
      onChange: setSelectedAudiences
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_DropdownSelect__WEBPACK_IMPORTED_MODULE_2__.DropdownSelect, {
      label: "Location Type",
      placeholder: "Select location type...",
      multiple: true,
      searchable: false,
      options: locationTypeOptions,
      value: selectedLocations,
      onChange: setSelectedLocations
    })]
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "bg-schemesSurface",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("style", {
      children: `
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
      `
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
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
            children: "Connect. Celebrate. Belong. Explore Melbourne's Jewish Events."
          })]
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: `tsb-container py-8 flex flex-grow ${isLoading ? "cursor-wait" : ""}`,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("aside", {
        className: `hidden lg:block calendar-sidebar pr-4 basis-[20%] shrink-0 ${isLoading ? "opacity-50 pointer-events-none" : ""}`,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "mb-6",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
            htmlFor: "calendar-search",
            className: "sr-only",
            children: "Search by keyword"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "relative",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
              id: "calendar-search",
              type: "text",
              placeholder: "Search by keyword",
              value: keyword,
              onChange: e => setKeyword(e.target.value),
              className: "Blueprint-body-medium w-full pl-4 pr-10 py-3 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-schemesPrimary"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_4__.MagnifyingGlass, {
              size: 20,
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant",
              weight: "bold"
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h2", {
          className: "Blueprint-headline-small-emphasized text-schemesOnSurfaceVariant mb-4",
          children: "Filters"
        }), filterCount > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "mb-4",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_1__.Button, {
            size: "sm",
            variant: "tonal",
            onClick: clearAll,
            label: "Clear all filters"
          })
        }), renderFilters(false)]
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
              className: "Blueprint-body-medium w-full pl-4 pr-10 py-3 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-schemesPrimary"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_4__.MagnifyingGlass, {
              size: 20,
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant",
              weight: "bold"
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_1__.Button, {
            onClick: openFilters,
            icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_5__.FunnelSimple, {}),
            label: filterCount ? `Filters (${filterCount})` : "Filters",
            variant: "outlined",
            size: "base",
            "aria-expanded": isFiltersOpen,
            "aria-controls": "mobile-filters"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-3 sm:px-4 md:px-6 lg:px-8 mb-6",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("button", {
              type: "button",
              onClick: handlePrevClick,
              className: "flex items-center gap-2 px-4 py-2 rounded-full border border-schemesOutline text-schemesOnSurface Blueprint-label-large hover:bg-schemesSurfaceContainerHigh transition-colors",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_6__.ArrowLeft, {
                size: 18
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
                className: "hidden sm:inline",
                children: "Previous"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
              type: "button",
              onClick: handleTodayClick,
              className: "px-4 py-2 rounded-full bg-schemesPrimaryContainer text-schemesOnPrimaryContainer Blueprint-label-large hover:bg-schemesPrimary hover:text-schemesOnPrimary transition-colors",
              children: "Today"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("button", {
              type: "button",
              onClick: handleNextClick,
              className: "flex items-center gap-2 px-4 py-2 rounded-full border border-schemesOutline text-schemesOnSurface Blueprint-label-large hover:bg-schemesSurfaceContainerHigh transition-colors",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
                className: "hidden sm:inline",
                children: "Next"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_7__.ArrowRight, {
                size: 18
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            className: "hidden md:flex items-center gap-1 p-1 rounded-full bg-schemesSurfaceContainerHigh",
            children: viewOptions.map(opt => {
              const isActive = currentView === opt.key;
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
                type: "button",
                onClick: () => changeView(opt.key),
                className: `px-4 py-2 rounded-full Blueprint-label-large transition-colors ${isActive ? "bg-schemesPrimary text-schemesOnPrimary" : "text-schemesOnSurfaceVariant hover:bg-schemesSurfaceContainerHighest"}`,
                children: opt.label
              }, opt.key);
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "bg-white rounded-2xl border border-schemesOutlineVariant overflow-hidden calendar-wrapper",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_fullcalendar_react__WEBPACK_IMPORTED_MODULE_8__["default"], {
            ref: calendarRef,
            plugins: [_fullcalendar_daygrid__WEBPACK_IMPORTED_MODULE_9__["default"], _fullcalendar_list__WEBPACK_IMPORTED_MODULE_10__["default"]],
            initialView: "dayGridMonth",
            headerToolbar: false,
            fixedWeekCount: false,
            dayMaxEvents: 3,
            dayMaxEventRows: 3,
            eventColor: "var(--schemesPrimaryFixed)",
            eventTextColor: "var(--schemesOnPrimaryFixed)",
            eventDisplay: "block",
            height: "auto",
            datesSet: datesSet,
            eventMouseEnter: supportsHover ? showTooltip : undefined,
            eventMouseLeave: supportsHover ? hideTooltip : undefined,
            nowIndicator: true,
            eventTimeFormat: {
              hour: "numeric",
              minute: "2-digit",
              meridiem: "short"
            },
            views: {
              dayGridMonth: {
                showNonCurrentDates: false,
                displayEventTime: false,
                dayHeaderFormat: {
                  weekday: "short"
                },
                dayMaxEvents: 3
              },
              listWeek: {
                listDayFormat: {
                  weekday: "long",
                  month: "long",
                  day: "numeric"
                },
                listDaySideFormat: false,
                noEventsContent: "No events this week"
              },
              listDay: {
                listDayFormat: {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                },
                listDaySideFormat: false,
                noEventsContent: "No events today"
              },
              listMonth: {
                noEventsContent: "No events this month"
              }
            }
          })
        })]
      })]
    }), supportsHover && tip.visible && (() => {
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
        ...(showOnLeft ? {
          right: window.innerWidth - tip.x + offset
        } : {
          left: tip.x + offset
        }),
        ...(showAbove ? {
          bottom: window.innerHeight - tip.y + offset
        } : {
          top: tip.y + offset
        })
      };
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        role: "tooltip",
        className: "pointer-events-none fixed z-[10000] max-w-md rounded-2xl border bg-schemesSurface text-schemesOnSurface border-schemesOutlineVariant shadow-3x3 p-5",
        style: style,
        "aria-hidden": !tip.visible,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "flex gap-4",
          children: [tip.image && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("img", {
            src: tip.image,
            alt: "",
            className: "w-28 h-28 rounded-xl object-cover shrink-0",
            loading: "lazy",
            decoding: "async"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "min-w-0 flex-1",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
              className: "Blueprint-title-medium-emphasized line-clamp-2",
              children: tip.title
            }), tip.range && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
              className: "Blueprint-body-small text-schemesOnSurfaceVariant mt-1",
              children: tip.range
            }), (tip.venue || tip.location) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
              className: "Blueprint-body-small text-schemesOnSurfaceVariant mt-1",
              children: [tip.venue, tip.location].filter(Boolean).join(" • ")
            }), tip.description && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
              className: "Blueprint-body-medium text-schemesOnSurface mt-3 line-clamp-4",
              dangerouslySetInnerHTML: {
                __html: tip.description
              }
            })]
          })]
        })
      });
    })(), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      id: "mobile-filters",
      className: `lg:hidden fixed inset-0 z-[70] ${isFiltersOpen ? "" : "pointer-events-none"}`,
      "aria-hidden": !isFiltersOpen,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        onClick: closeFilters,
        className: `absolute inset-0 transition-opacity ${isFiltersOpen ? "opacity-100" : "opacity-0"} bg-black/40`
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Filters",
        className: `absolute left-0 right-0 bottom-0 max-h-[85vh] rounded-t-2xl bg-schemesSurface shadow-[0_-16px_48px_rgba(0,0,0,0.25)] transition-transform duration-300 flex flex-col ${isFiltersOpen ? "translate-y-0" : "translate-y-full"}`,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "relative px-4 py-3 border-b border-schemesOutlineVariant shrink-0",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            className: "mx-auto h-1.5 w-12 rounded-full bg-schemesOutlineVariant"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "mt-3 flex items-center justify-between",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
              className: "Blueprint-title-small-emphasized",
              children: "Filters"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
              ref: firstCloseBtnRef,
              type: "button",
              onClick: closeFilters,
              className: "rounded-full p-2 hover:bg-schemesSurfaceContainerHigh text-schemesOnSurfaceVariant",
              "aria-label": "Close filters",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_11__.X, {})
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "px-4 py-4 overflow-y-auto flex-1 space-y-4",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "relative",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
              type: "text",
              placeholder: "Search by keyword",
              value: keyword,
              onChange: e => setKeyword(e.target.value),
              className: "Blueprint-body-medium w-full pl-4 pr-10 py-3 rounded-3xl bg-schemesSurfaceContainerHigh focus:outline-none focus:ring-2 focus:ring-schemesPrimary"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_4__.MagnifyingGlass, {
              size: 20,
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant",
              weight: "bold"
            })]
          }), renderFilters(true)]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "sticky bottom-0 px-4 py-3 bg-schemesSurface border-t border-schemesOutlineVariant flex gap-2 shrink-0",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_1__.Button, {
            onClick: clearAll,
            variant: "outlined",
            label: "Clear all",
            className: "flex-1"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_1__.Button, {
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

/***/ })

}]);
//# sourceMappingURL=events-calendar.js.map?ver=5b77f8def67713dbd383