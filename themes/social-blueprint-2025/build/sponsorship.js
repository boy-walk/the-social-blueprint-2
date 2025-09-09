"use strict";
(globalThis["webpackChunkbrads_boilerplate_theme"] = globalThis["webpackChunkbrads_boilerplate_theme"] || []).push([["sponsorship"],{

/***/ "./src/scripts/Sponsorship.js":
/*!************************************!*\
  !*** ./src/scripts/Sponsorship.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SponsorshipBanner: () => (/* binding */ SponsorshipBanner)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

const SponsorshipBanner = ({
  imgSrc,
  enabled,
  href
}) => {
  if (!enabled) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a", {
    href: href || "#",
    target: "_blank",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
      className: "flex justify-center",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", {
        src: imgSrc,
        alt: "Sponsorship Banner",
        className: "w-full h-auto object-fit rounded-xl"
      })
    })
  });
};

/***/ })

}]);
//# sourceMappingURL=sponsorship.js.map?ver=44e416f702ff7d9081e8