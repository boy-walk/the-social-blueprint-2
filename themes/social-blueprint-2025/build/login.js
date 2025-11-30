"use strict";
(globalThis["webpackChunkbrads_boilerplate_theme"] = globalThis["webpackChunkbrads_boilerplate_theme"] || []).push([["login"],{

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

/***/ "./src/scripts/LoginForm.js":
/*!**********************************!*\
  !*** ./src/scripts/LoginForm.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LoginForm: () => (/* binding */ LoginForm)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _TextField__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TextField */ "./src/scripts/TextField.js");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Button */ "./src/scripts/Button.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




function LoginForm() {
  const [form, setForm] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    user: '',
    pass: '',
    remember: false
  });
  const [errors, setErrors] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    user: '',
    pass: '',
    general: ''
  });
  const [touched, setTouched] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    user: false,
    pass: false
  });
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const handle = key => e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({
      ...prev,
      [key]: value
    }));

    // Clear field error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: '',
        general: ''
      }));
    }
  };
  const handleBlur = key => () => {
    setTouched(prev => ({
      ...prev,
      [key]: true
    }));
    validateField(key, form[key]);
  };
  const validateField = (key, value) => {
    let error = '';
    if (key === 'user') {
      if (!value.trim()) {
        error = 'Username or email is required';
      } else if (value.includes('@')) {
        // If it looks like an email, validate it
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          error = 'Please enter a valid email address';
        }
      }
    }
    if (key === 'pass') {
      if (!value) {
        error = 'Password is required';
      }
    }
    setErrors(prev => ({
      ...prev,
      [key]: error
    }));
    return error;
  };
  const validateForm = () => {
    const userError = validateField('user', form.user);
    const passError = validateField('pass', form.pass);
    setTouched({
      user: true,
      pass: true
    });
    return !userError && !passError;
  };

  // Helper to strip HTML tags from error messages
  const stripHtml = html => {
    if (typeof html !== 'string') return html;
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };
  const canSubmit = form.user && form.pass && !errors.user && !errors.pass && !loading;
  const handleSubmit = async e => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setErrors(prev => ({
      ...prev,
      general: ''
    }));
    try {
      const res = await fetch('/wp-json/uwp-custom/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window?.wpApiSettings?.nonce || ''
        },
        body: JSON.stringify({
          email: form.user,
          password: form.pass
        })
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = '/';
      } else {
        // Handle specific error cases and strip HTML tags
        const rawMessage = data.message || 'Login failed. Please check your credentials.';
        const errorMessage = stripHtml(rawMessage);
        if (errorMessage.toLowerCase().includes('username') || errorMessage.toLowerCase().includes('email')) {
          setErrors(prev => ({
            ...prev,
            user: errorMessage,
            general: ''
          }));
        } else if (errorMessage.toLowerCase().includes('password')) {
          setErrors(prev => ({
            ...prev,
            pass: errorMessage,
            general: ''
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            general: errorMessage
          }));
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors(prev => ({
        ...prev,
        general: 'Network error. Please check your connection and try again.'
      }));
    } finally {
      setLoading(false);
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("main", {
    className: "flex flex-col max-w-xl mx-auto px-4 py-20 gap-14",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("header", {
      className: "text-center space-y-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h1", {
        className: "italic Blueprint-headline-large-emphasized",
        children: " Log\xA0in"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
        className: "Blueprint-body-large text-schemesOnSurfaceVariant",
        children: "Access your account to post, connect, and explore everything happening in the Melbourne Jewish community."
      })]
    }), errors.general && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "rounded-xl bg-schemesErrorContainer border border-schemesError p-4",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
        className: "Blueprint-body-medium text-schemesOnErrorContainer",
        children: errors.general
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("form", {
      onSubmit: handleSubmit,
      className: "flex flex-col gap-6",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
        label: "Username or Email",
        placeholder: "Input",
        value: form.user,
        onChange: handle('user'),
        onBlur: handleBlur('user'),
        error: touched.user && errors.user,
        helperText: touched.user && errors.user ? errors.user : ''
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
        label: "Password",
        type: "password",
        placeholder: "Input",
        value: form.pass,
        onChange: handle('pass'),
        onBlur: handleBlur('pass'),
        error: touched.pass && errors.pass,
        helperText: touched.pass && errors.pass ? errors.pass : ''
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
        className: "flex items-center gap-2 Blueprint-body-medium select-none",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
          type: "checkbox",
          className: "accent-schemesPrimary",
          checked: form.remember,
          onChange: handle('remember')
        }), " Remember Me"]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
        label: loading ? "Logging in..." : "Log in",
        style: "filled",
        size: "base",
        shape: "square",
        className: "w-full mt-4",
        disabled: !canSubmit,
        onClick: handleSubmit
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "flex justify-between text-schemesPrimary Blueprint-body-medium pt-2",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("a", {
          href: "/register-individual",
          className: "hover:underline",
          children: " Create account"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("a", {
          href: "/forgot-password",
          className: "hover:underline",
          children: " Forgot password?"
        })]
      })]
    })]
  });
}

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
//# sourceMappingURL=login.js.map?ver=bd54bf688689c669155a