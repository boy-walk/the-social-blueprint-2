"use strict";
(globalThis["webpackChunkbrads_boilerplate_theme"] = globalThis["webpackChunkbrads_boilerplate_theme"] || []).push([["forgot-password"],{

/***/ "./node_modules/clsx/dist/clsx.mjs":
/*!*****************************************!*\
  !*** ./node_modules/clsx/dist/clsx.mjs ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clsx: () => (/* binding */ clsx),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f)}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (clsx);

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

/***/ "./src/scripts/ForgotPassword.js":
/*!***************************************!*\
  !*** ./src/scripts/ForgotPassword.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ForgotPassword: () => (/* binding */ ForgotPassword),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _TextField__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TextField */ "./src/scripts/TextField.js");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Button */ "./src/scripts/Button.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




function ForgotPassword({
  restUrl,
  wpNonce,
  loginUrl
}) {
  const [email, setEmail] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const [busy, setBusy] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [errors, setErrors] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [success, setSuccess] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const emailRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const validateEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  const validate = () => {
    const nextErrors = {};
    if (!email.trim()) {
      nextErrors.email = "Please enter your email address";
    } else if (!validateEmail(email)) {
      nextErrors.email = "Please enter a valid email address";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      emailRef.current?.querySelector('input')?.focus();
      return false;
    }
    return true;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setBusy(true);
    setErrors({});
    try {
      const response = await fetch(restUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": wpNonce
        },
        body: JSON.stringify({
          email
        }),
        credentials: "include"
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to send reset email");
      }
      if (!data.success) {
        throw new Error(data?.message || "Failed to send reset email");
      }
      setSuccess(true);
    } catch (err) {
      console.error("Password reset error:", err);
      setErrors({
        email: err.message || "An error occurred. Please try again."
      });
    } finally {
      setBusy(false);
    }
  };
  if (success) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "bg-schemesSurface min-h-[60vh] flex items-center justify-center px-4",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "max-w-md w-full space-y-6 text-center",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "w-16 h-16 mx-auto bg-stateSuccess/10 rounded-full flex items-center justify-center",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("svg", {
            className: "w-8 h-8 text-stateSuccess",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("path", {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "2",
              d: "M5 13l4 4L19 7"
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "space-y-3",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h1", {
            className: "Blueprint-headline-small md:Blueprint-headline-medium text-schemesOnSurface",
            children: "Check your email"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("p", {
            className: "Blueprint-body-medium text-schemesOnSurfaceVariant",
            children: ["We've sent password reset instructions to ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
              className: "text-schemesOnSurface",
              children: email
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
            className: "Blueprint-body-small text-schemesOnSurfaceVariant",
            children: "Didn't receive the email? Check your spam folder or try again in a few minutes."
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "pt-4",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("a", {
            href: loginUrl,
            className: "inline-flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer px-4 py-2.5 Blueprint-title-medium rounded-[16px] bg-schemesPrimary text-schemesOnPrimary hover:bg-palettesPrimary40",
            children: "Return to Login"
          })
        })]
      })
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: "bg-schemesSurface min-h-[60vh] flex items-center justify-center px-4",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "max-w-md w-full",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("form", {
        onSubmit: handleSubmit,
        className: "space-y-6",
        noValidate: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "space-y-3 text-center",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h1", {
            className: "Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large text-schemesOnSurface",
            children: "Reset your password"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
            className: "Blueprint-body-medium text-schemesOnSurfaceVariant",
            children: "Enter your email address and we'll send you instructions to reset your password."
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          ref: emailRef,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
            label: "Email Address",
            type: "email",
            required: true,
            value: email,
            onChange: e => {
              setEmail(e.target.value);
              setErrors(e => ({
                ...e,
                email: ""
              }));
            },
            style: "outlined",
            error: errors.email || "",
            disabled: busy,
            autoComplete: "email"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "space-y-3",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
            type: "submit",
            label: busy ? "Sending..." : "Send Reset Instructions",
            variant: "filled",
            size: "base",
            disabled: busy,
            className: "w-full"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            className: "text-center",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("a", {
              href: loginUrl,
              className: "Blueprint-body-medium text-schemesPrimary hover:text-schemesPrimary/80 transition-colors",
              children: "Back to Login"
            })
          })]
        })]
      })
    })
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForgotPassword);

/***/ }),

/***/ "./src/scripts/TextField.js":
/*!**********************************!*\
  !*** ./src/scripts/TextField.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TextField: () => (/* binding */ TextField)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function TextField({
  label = 'Label',
  value = '',
  onChange,
  placeholder = '',
  supportingText = '',
  leadingIcon = null,
  trailingIcon = null,
  error = '',
  disabled = false,
  required = false,
  style = 'outlined',
  type = 'text',
  multiline = false,
  name,
  id
}) {
  const inputId = id || (0,react__WEBPACK_IMPORTED_MODULE_0__.useId)();
  const msgId = `${inputId}-msg`;
  const hasError = typeof error === 'string' && error.length > 0;
  const helperText = hasError ? error : supportingText;
  const containerBase = 'relative w-full rounded-xl text-schemesOnSurface Blueprint-body-medium';
  const variantMap = {
    outlined: 'border border-schemesOutline bg-schemesSurfaceContainerLow hover:border-schemesOnSurfaceVariant ' + 'focus-within:border-schemesPrimaryContainer',
    filled: 'bg-schemesSurfaceVariant hover:bg-schemesSurface focus-within:bg-schemesSurface'
  };
  const errorClasses = hasError ? 'border-schemesError focus-within:border-schemesError' : '';
  const disabledClasses = disabled ? 'opacity-50 pointer-events-none cursor-not-allowed' : '';
  const labelBase = 'absolute left-4 -translate-y-1/2 px-1 transition-all duration-150 leading-tight ' + 'Blueprint-label-medium pointer-events-none bg-schemesPrimaryFixed peer-focus:bg-schemesSurfaceContainerLow rounded-sm';
  const inputBase = 'peer w-full py-3 pr-4 pl-3 bg-transparent outline-none ' + 'text-schemesOnSurface placeholder:opacity-0 disabled:bg-transparent';
  const commonProps = {
    id: inputId,
    name,
    value,
    onChange,
    placeholder: placeholder || label,
    required,
    disabled,
    'aria-invalid': hasError ? 'true' : undefined,
    'aria-describedby': helperText ? msgId : undefined,
    className: multiline ? (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])(inputBase, 'resize-none') : inputBase
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "flex flex-col gap-2",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])(containerBase, variantMap[style], errorClasses, disabledClasses),
      children: [leadingIcon && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
        className: "absolute left-4 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant pointer-events-none",
        children: leadingIcon
      }), multiline ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("textarea", {
        ...commonProps
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
        type: type,
        ...commonProps
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
        htmlFor: inputId,
        className: labelBase,
        children: label
      }), trailingIcon && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
        type: "button",
        className: "absolute right-4 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant hover:text-schemesOnSurface",
        tabIndex: -1,
        children: trailingIcon
      })]
    }), helperText ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
      id: msgId,
      className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])('ml-4 Blueprint-body-small', hasError ? 'text-schemesError' : 'text-schemesOnSurfaceVariant'),
      children: helperText
    }) : null]
  });
}

/***/ })

}]);
//# sourceMappingURL=forgot-password.js.map?ver=bfe1d43732314aa573ce