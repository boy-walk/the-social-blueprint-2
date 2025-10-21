"use strict";
(globalThis["webpackChunkbrads_boilerplate_theme"] = globalThis["webpackChunkbrads_boilerplate_theme"] || []).push([["account-dashboard"],{

/***/ "./src/scripts/AccountDashboard.js":
/*!*****************************************!*\
  !*** ./src/scripts/AccountDashboard.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccountDashboard: () => (/* binding */ AccountDashboard)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/StackPlus.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/Pencil.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/Gear.es.js");
/* harmony import */ var _Card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Card */ "./src/scripts/Card.js");
/* harmony import */ var _PostsSlider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PostsSlider */ "./src/scripts/PostsSlider.js");
/* harmony import */ var _NewsletterBanner__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./NewsletterBanner */ "./src/scripts/NewsletterBanner.js");
/* harmony import */ var _node_modules_react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../node_modules/react-i18next */ "./node_modules/react-i18next/dist/es/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);







function AccountDashboard({
  user,
  events
}) {
  const {
    t
  } = (0,_node_modules_react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    className: "min-h-screen",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: "bg-schemesPrimaryFixed",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "px-6 lg:px-16 py-8 max-w-[1600px] mx-auto",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h1", {
          className: "Blueprint-display-small-emphasized",
          children: t('welcome', {
            name: user?.first_name || "[FirstName]"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
          className: "mt-3 Blueprint-title-large text-schemesOnPrimaryFixedVariant",
          children: t('manageCommunity')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "flex flex-col gap-8 mt-8",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
            className: "Blueprint-headline-medium",
            children: t('quickLinks')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            className: "grid grid-cols-1 md:grid-cols-3 gap-4",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_Card__WEBPACK_IMPORTED_MODULE_1__.Card, {
              href: "/add-listing-hub",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                className: "flex flex-col gap-8 h-full justify-between items-start p-4 w-full",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                  className: "bg-schemesPrimaryFixed rounded-[12px] p-1",
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_6__.StackPlusIcon, {
                    size: 22
                  })
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                  className: "Blueprint-title-medium",
                  children: "Add a new listing"
                })]
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_Card__WEBPACK_IMPORTED_MODULE_1__.Card, {
              href: "/account-listings",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                className: "flex flex-col gap-8 h-full justify-between items-start p-4 w-full",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                  className: "bg-schemesPrimaryFixed rounded-[12px] p-1",
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_7__.PencilIcon, {
                    size: 22
                  })
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                  className: "Blueprint-title-medium",
                  children: t('activeListings')
                })]
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_Card__WEBPACK_IMPORTED_MODULE_1__.Card, {
              href: "/account-settings",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                className: "flex flex-col gap-8 h-full justify-between items-start p-4 w-full",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                  className: "bg-schemesPrimaryFixed rounded-[12px] p-1",
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_8__.GearIcon, {
                    size: 22
                  })
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                  className: "Blueprint-title-medium",
                  children: t('accountSettings')
                })]
              })
            })]
          })]
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "px-6 lg:px-16 py-8 max-w-[1600px] mx-auto",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h2", {
        className: "Blueprint-headline-medium text-schemesOnSurface mb-6",
        children: "Your upcoming events"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_PostsSlider__WEBPACK_IMPORTED_MODULE_2__.PostsSlider, {
        events: events
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: "mx-auto px-4 sm:px-6 lg:px-16 py-8 max-w-[1600px]",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_NewsletterBanner__WEBPACK_IMPORTED_MODULE_3__.NewsletterBanner, {})
    })]
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
  label,
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

/***/ }),

/***/ "./src/scripts/ContentCard.js":
/*!************************************!*\
  !*** ./src/scripts/ContentCard.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContentCard: () => (/* binding */ ContentCard)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Card */ "./src/scripts/Card.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function ContentCard({
  image,
  title,
  date,
  subtitle,
  badge,
  href,
  author,
  fullHeight = false,
  fullWidth = false,
  shadow = false
}) {
  const cardStyles = `
    group
    flex flex-col
    ${shadow ? "shadow-3x3" : ""}
    ${fullHeight ? "h-full" : ""}
    ${fullWidth ? "w-full" : ""}
    p-2
    transition-all duration-300 ease-in-out
    hover:shadow-lg
    hover:-translate-y-1
    transform-gpu
    [transform-origin:center]
  `.trim();
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_Card__WEBPACK_IMPORTED_MODULE_1__.Card, {
    href: href,
    styles: cardStyles,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "flex h-full min-h-0 flex-col",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: ["relative overflow-hidden rounded-lg bg-gray-100", fullHeight ? "aspect-[4/3] max-h-60 md:max-h-50 lg:max-h-100" : "aspect-[4/3] max-h-56 md:max-h-40 lg:max-h-75"].join(" "),
        children: [image && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("img", {
          src: image,
          alt: title,
          className: " h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 [transform-origin:center] ",
          loading: "lazy",
          decoding: "async"
        }), badge && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
          className: "absolute left-2 top-2 z-10 rounded bg-schemesSurfaceContainer px-4 py-1.5 Blueprint-label-small font-medium transition-colors duration-200 group-hover:bg-blue-100",
          children: badge
        })]
      }), title && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: " relative p-4 pt-3 h-auto md:h-[116px] lg:h-[128px] md:overflow-hidden ",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: " pointer-events-none absolute inset-x-0 bottom-0 h-8 opacity-0 md:opacity-100 transition-opacity duration-200 md:group-hover:opacity-0 "
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "transition-transform duration-200 ease-in-out",
          children: [date && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
            className: "Blueprint-body-small md:Blueprint-body-small lg:Blueprint-body-medium text-schemesOnSurfaceVariant transition-colors duration-200 group-hover:text-schemesOnSurface",
            children: date
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h3", {
            className: " Blueprint-body-medium-emphasized md:Blueprint-body-medium-emphasized lg:Blueprint-body-large-emphasized line-clamp-2 transition-colors duration-200 group-hover:text-[var(--schemesPrimary)] ",
            children: title
          }), subtitle && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
            className: " Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large text-schemesOnSurfaceVariant line-clamp-2 transition-colors duration-200 group-hover:text-schemesOnSurface ",
            children: subtitle
          }), author && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
            className: "mt-1 Blueprint-body-small lg:Blueprint-body-medium text-schemesOnSurfaceVariant transition-colors duration-200 group-hover:text-schemesOnSurface",
            children: author
          })]
        })]
      })]
    })
  });
}

/***/ }),

/***/ "./src/scripts/NewsletterBanner.js":
/*!*****************************************!*\
  !*** ./src/scripts/NewsletterBanner.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NewsletterBanner: () => (/* binding */ NewsletterBanner)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const NewsletterBanner = () => {
  const formId = "68bced8dbed9ca618cdd69c2";
  const ref = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!window.fd) return; // rely on global loader in header.php
    if (!ref.current || ref.current.dataset.fdMounted) return;
    const id = `fd-form-${formId}`;
    ref.current.id = id;
    window.fd("form", {
      formId,
      containerEl: `#${id}`
    });
    ref.current.dataset.fdMounted = "1";
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("section", {
    className: "bg-schemesPrimaryContainer text-schemesOnPrimaryContainer py-12 px-4 sm:px-8 lg:px-16 text-center rounded-3xl w-full",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "mx-auto",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        ref: ref
      })
    })
  });
};

/***/ }),

/***/ "./src/scripts/PostsSlider.js":
/*!************************************!*\
  !*** ./src/scripts/PostsSlider.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PostsSlider: () => (/* binding */ PostsSlider)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/ArrowLeft.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/ArrowRight.es.js");
/* harmony import */ var _ContentCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ContentCard */ "./src/scripts/ContentCard.js");
/* harmony import */ var _getBadge__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getBadge */ "./src/scripts/getBadge.js");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Button */ "./src/scripts/Button.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);






function PostsSlider({
  title = null,
  description = null,
  events,
  itemsToDisplay = 4,
  viewAllUrl = null
}) {
  const scrollRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const itemRefs = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([]);
  const [currentIndex, setCurrentIndex] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [itemsPerView, setItemsPerView] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(itemsToDisplay);
  const [maxCardHeight, setMaxCardHeight] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);

  // Detect screen size
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      setItemsPerView(width < 640 ? 1 : itemsToDisplay);
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, [itemsToDisplay]);

  // Equalize heights (watch content + resize)
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!itemRefs.current?.length || 0) return;
    const measure = () => {
      const h = Math.max(0, ...itemRefs.current?.map(el => el ? el.offsetHeight : 0));
      setMaxCardHeight(h);
    };

    // Observe size changes (images, fonts, etc.)
    const ro = new ResizeObserver(() => measure());
    itemRefs.current.forEach(el => el && ro.observe(el));
    measure();
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [events, itemsPerView]);
  const totalSlides = Math.ceil((events?.length || 0) / itemsPerView);
  const scrollToIndex = index => {
    if (!scrollRef.current) return;
    const itemWidth = scrollRef.current.offsetWidth / itemsPerView;
    const scrollLeft = itemWidth * itemsPerView * index;
    scrollRef.current.scrollTo({
      left: scrollLeft,
      behavior: "smooth"
    });
    setCurrentIndex(index);
  };
  const next = () => currentIndex < totalSlides - 1 && scrollToIndex(currentIndex + 1);
  const prev = () => currentIndex > 0 && scrollToIndex(currentIndex - 1);

  // Keep refs array in sync
  itemRefs.current = Array(events?.length || 0);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: "flex flex-col w-full",
    children: [title && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "flex flex-col md:flex-row items-start md:items-end justify-between mb-6 gap-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "flex flex-col gap-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h2", {
          className: "Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSurface",
          children: title
        }), description && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          className: "Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large text-schemesOnSurfaceVariant mt-1 max-w-2xl",
          children: description
        })]
      }), viewAllUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_3__.Button, {
        label: "View All",
        variant: "tonal",
        size: "sm",
        onClick: () => {
          window.location.href = viewAllUrl;
        }
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "overflow-x-hidden py-2",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        ref: scrollRef,
        className: "flex items-stretch transition-transform duration-300 ease-in-out overflow-x-auto scrollbar-hidden overflow-y-visible",
        children: events?.map((post, idx) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "flex-shrink-0 flex px-0 lg:px-1 py-1",
          style: {
            width: `${100 / itemsPerView}%`
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("a", {
            href: post.permalink,
            className: "block w-full h-full",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
              ref: el => itemRefs.current[idx] = el,
              style: maxCardHeight ? {
                minHeight: maxCardHeight
              } : undefined,
              className: "h-full",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ContentCard__WEBPACK_IMPORTED_MODULE_1__.ContentCard, {
                image: post.thumbnail,
                date: post.date,
                author: post.author,
                title: post.title,
                badge: (0,_getBadge__WEBPACK_IMPORTED_MODULE_2__.getBadge)(post.post_type),
                subtitle: post.meta?.location || post.subtitle || "",
                href: post.link,
                fullHeight: true
              })
            })
          })
        }, post.id))
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "flex justify-between gap-4 mt-6",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
        onClick: prev,
        className: `bg-schemesSurface rounded-xl py-1.5 px-3 flex items-center justify-center transition-opacity ${currentIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:opacity-80"}`,
        disabled: currentIndex === 0,
        "aria-label": "Previous slide",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_5__.ArrowLeftIcon, {
          size: 20,
          weight: "bold"
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
        onClick: next,
        className: `bg-schemesSurface rounded-xl py-1.5 px-3 flex items-center justify-center transition-opacity ${currentIndex >= totalSlides - 1 ? "opacity-30 cursor-not-allowed" : "hover:opacity-80"}`,
        disabled: currentIndex >= totalSlides - 1,
        "aria-label": "Next slide",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_6__.ArrowRightIcon, {
          size: 20,
          weight: "bold"
        })
      })]
    })]
  });
}

/***/ }),

/***/ "./src/scripts/getBadge.js":
/*!*********************************!*\
  !*** ./src/scripts/getBadge.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBadge: () => (/* binding */ getBadge)
/* harmony export */ });
const getBadge = type => {
  switch (type?.toLowerCase()) {
    case 'tribe_events':
      return 'Event';
    case 'podcast':
      return 'Podcast';
    case 'article':
      return 'Article';
    case 'directory':
      return 'Directory';
    case 'resource':
      return 'Resource';
    case 'gd_discount':
      return 'Message Board';
    case 'gd_aid_listing':
      return 'Aid Listing';
    case 'gd_health_listing':
      return 'Health Listing';
    case 'gd_business':
      return 'Business';
    case 'gd_photo_gallery':
      return 'Photo Gallery';
    case 'gd_cost_of_living':
      return 'Cost of Living';
    default:
      return "Post";
  }
};

/***/ })

}]);
//# sourceMappingURL=account-dashboard.js.map?ver=0190589990c0ec4a3eea