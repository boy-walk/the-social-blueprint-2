"use strict";
(globalThis["webpackChunkbrads_boilerplate_theme"] = globalThis["webpackChunkbrads_boilerplate_theme"] || []).push([["register-organisation"],{

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

/***/ "./src/scripts/RegisterOrganisation.js":
/*!*********************************************!*\
  !*** ./src/scripts/RegisterOrganisation.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RegisterOrganisation: () => (/* binding */ RegisterOrganisation)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _TextField__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TextField */ "./src/scripts/TextField.js");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Button */ "./src/scripts/Button.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




function RegisterOrganisation() {
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [success, setSuccess] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [touched, setTouched] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [form, setForm] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    organisation: '',
    businessType: 'For Profit',
    password: '',
    confirm: '',
    newsOptIn: false,
    agreed: false
  });

  /* helpers ------------------------------------------------------------- */
  const handleChange = key => e => {
    setForm(prev => ({
      ...prev,
      [key]: e.target.value
    }));
    setTouched(prev => ({
      ...prev,
      [key]: true
    }));
  };
  const handleBlur = key => () => setTouched(prev => ({
    ...prev,
    [key]: true
  }));
  const handleToggle = key => () => setForm(prev => ({
    ...prev,
    [key]: !prev[key]
  }));
  const handleBusinessType = e => setForm(prev => ({
    ...prev,
    businessType: e.target.value
  }));

  // Validation functions
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validatemobile = mobile => {
    const mobileRegex = /^[\d\s\+\-\(\)]+$/;
    return mobile.length >= 10 && mobileRegex.test(mobile);
  };
  const validatePassword = password => {
    return password.length >= 8;
  };

  // Error messages
  const errors = {
    firstName: touched.firstName && !form.firstName ? 'First name is required' : '',
    lastName: touched.lastName && !form.lastName ? 'Last name is required' : '',
    email: touched.email && !form.email ? 'Email is required' : touched.email && !validateEmail(form.email) ? 'Please enter a valid email address' : '',
    mobile: touched.mobile && !form.mobile ? 'mobile number is required' : touched.mobile && !validatemobile(form.mobile) ? 'Please enter a valid mobile number' : '',
    organisation: touched.organisation && !form.organisation ? 'Organisation name is required' : '',
    password: touched.password && !form.password ? 'Password is required' : touched.password && !validatePassword(form.password) ? 'Password must be at least 8 characters' : '',
    confirm: touched.confirm && !form.confirm ? 'Please confirm your password' : touched.confirm && form.password && form.confirm && form.password !== form.confirm ? 'Passwords do not match' : ''
  };
  const hasErrors = Object.values(errors).some(error => error !== '');
  const passwordMismatch = form.password && form.confirm && form.password !== form.confirm;
  const canSubmit = form.firstName && form.lastName && form.email && form.mobile && form.organisation && form.password && form.confirm && form.agreed && !hasErrors;

  /* submit -------------------------------------------------------------- */
  const handleSubmit = async e => {
    e.preventDefault();

    // Mark all fields as touched to show validation errors
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      mobile: true,
      organisation: true,
      password: true,
      confirm: true
    });
    if (!canSubmit) return;
    try {
      const res = await fetch('/wp-json/uwp-custom/v1/register-organisation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // ⭐ REMOVED: X-WP-Nonce header - not needed for registration
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          first_name: form.firstName,
          last_name: form.lastName,
          organisation: form.organisation,
          business_type: form.businessType,
          mobile: form.mobile,
          news_opt_in: form.newsOptIn ? 'yes' : 'no',
          agree: form.agreed ? 'yes' : 'no'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      }
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };
  if (success) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("main", {
      className: "flex flex-col max-w-xl mx-auto px-4 py-16 gap-8",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "text-center space-y-6",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "w-20 h-20 mx-auto rounded-full bg-schemesSecondaryContainer flex items-center justify-center",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("svg", {
            className: "w-10 h-10 text-schemesOnSecondaryContainer",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("path", {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M5 13l4 4L19 7"
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "space-y-2",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h1", {
            className: "Blueprint-headline-large-emphasized text-schemesOnSurface",
            children: "Organisation Account Created!"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("p", {
            className: "Blueprint-body-large text-schemesOnSurfaceVariant",
            children: ["Welcome to The Social Blueprint, ", form.organisation, "!"]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "bg-schemesSurfaceContainerHigh rounded-2xl p-6 space-y-4 text-left",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h2", {
            className: "Blueprint-title-medium text-schemesOnSurface",
            children: "What's next?"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("ul", {
            className: "space-y-3 Blueprint-body-medium text-schemesOnSurfaceVariant",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("li", {
              className: "flex items-start gap-3",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
                className: "text-schemesPrimary mt-1",
                children: "\u2713"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("span", {
                children: ["Check your email at ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
                  className: "text-schemesOnSurface",
                  children: form.email
                }), " to verify your account"]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("li", {
              className: "flex items-start gap-3",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
                className: "text-schemesPrimary mt-1",
                children: "\u2713"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
                children: "Complete your organisation profile and add listings"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("li", {
              className: "flex items-start gap-3",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
                className: "text-schemesPrimary mt-1",
                children: "\u2713"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
                children: "Connect with the community and promote your services"
              })]
            })]
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "flex flex-col gap-3",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
          label: "Go to Dashboard",
          style: "filled",
          size: "base",
          shape: "square",
          className: "w-full",
          onClick: () => window.location.href = '/account'
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
          label: "Browse Community",
          style: "outlined",
          size: "base",
          shape: "square",
          className: "w-full",
          onClick: () => window.location.href = '/'
        })]
      })]
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("main", {
    className: "flex flex-col max-w-xl mx-auto px-4 py-16 gap-16",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("header", {
      className: "text-center space-y-4",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h1", {
        className: "italic Blueprint-headline-large-emphasized",
        children: "Registration for Organisations"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("p", {
        className: "Blueprint-body-large text-schemesOnSurfaceVariant",
        children: ["For Individuals\xA0", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("a", {
          href: "/register-individual",
          className: "underline",
          children: "Click here"
        }), ' ', "to Register."]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("form", {
      onSubmit: handleSubmit,
      className: "flex flex-col gap-5",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
          label: "First name",
          placeholder: "Input",
          value: form.firstName,
          onChange: handleChange('firstName'),
          onBlur: handleBlur('firstName'),
          error: errors.firstName
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
          label: "Last name",
          placeholder: "Input",
          value: form.lastName,
          onChange: handleChange('lastName'),
          onBlur: handleBlur('lastName'),
          error: errors.lastName
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
          label: "Email",
          placeholder: "Input",
          value: form.email,
          onChange: handleChange('email'),
          onBlur: handleBlur('email'),
          type: "email",
          error: errors.email
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
          label: "Phone Number",
          placeholder: "Input",
          value: form.mobile,
          onChange: handleChange('mobile'),
          onBlur: handleBlur('mobile'),
          type: "tel",
          error: errors.mobile
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
        label: "Organisation Name",
        placeholder: "This will be your display name",
        value: form.organisation,
        onChange: handleChange('organisation'),
        onBlur: handleBlur('organisation'),
        error: errors.organisation
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("fieldset", {
        className: "flex flex-wrap gap-3",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("legend", {
          className: "Blueprint-title-medium mb-4",
          children: "Business type"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
          className: "flex items-center gap-2 Blueprint-body-medium",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "radio",
            name: "businessType",
            value: "For Profit",
            checked: form.businessType === 'For Profit',
            onChange: handleBusinessType
          }), "For Profit"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
          className: "flex items-center gap-2 Blueprint-body-medium",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
            type: "radio",
            name: "businessType",
            value: "Not for Profit",
            checked: form.businessType === 'Not for Profit',
            onChange: handleBusinessType
          }), "Not for Profit"]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
        label: "Password",
        placeholder: "Input",
        value: form.password,
        onChange: handleChange('password'),
        onBlur: handleBlur('password'),
        type: "password",
        error: errors.password,
        supportingText: !errors.password ? 'Must be at least 8 characters' : ''
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
        label: "Confirm Password",
        placeholder: "Input",
        value: form.confirm,
        onChange: handleChange('confirm'),
        onBlur: handleBlur('confirm'),
        type: "password",
        error: errors.confirm
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
        className: "flex items-start gap-3 Blueprint-body-medium",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
          type: "checkbox",
          className: "accent-schemesPrimary mt-1",
          checked: form.newsOptIn,
          onChange: handleToggle('newsOptIn')
        }), "Yes please, sign me up for The Social Blueprint news and exclusive offers."]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
        className: "flex items-start gap-3 Blueprint-body-medium",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
          type: "checkbox",
          className: "accent-schemesPrimary mt-1",
          checked: form.agreed,
          onChange: handleToggle('agreed'),
          required: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          children: ["By subscribing and / or creating an account you agree to The Social Blueprint Inc's", ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("a", {
            href: "/terms",
            className: "underline",
            children: "Terms\xA0&\xA0Conditions and Privacy Policy"
          }), ". ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
            className: "text-schemesOnContainerPrimary",
            children: "*"
          })]
        })]
      }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "text-schemesError text-center",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
          className: "Blueprint-body-medium",
          children: error
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "flex w-full",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
        label: "Create account",
        style: "filled",
        size: "base",
        shape: "square",
        className: "w-full mt-8",
        disabled: !canSubmit,
        onClick: handleSubmit
      })
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
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/EyeClosed.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/Eye.es.js");
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
  const [showPassword, setShowPassword] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? showPassword ? 'text' : 'password' : type;
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
    className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])(inputBase, multiline && 'resize-none', (isPassword || trailingIcon) && 'pr-12')
  };
  const renderTrailingIcon = () => {
    if (isPassword) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
        type: "button",
        onClick: () => setShowPassword(prev => !prev),
        className: "absolute right-4 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant hover:text-schemesOnSurface",
        tabIndex: -1,
        "aria-label": showPassword ? 'Hide password' : 'Show password',
        children: showPassword ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_3__.EyeClosed, {
          size: 20
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_4__.Eye, {
          size: 20
        })
      });
    }
    if (trailingIcon) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
        type: "button",
        className: "absolute right-4 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant hover:text-schemesOnSurface",
        tabIndex: -1,
        children: trailingIcon
      });
    }
    return null;
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
        type: inputType,
        ...commonProps
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
        htmlFor: inputId,
        className: labelBase,
        children: label
      }), renderTrailingIcon()]
    }), helperText ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
      id: msgId,
      className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])('ml-4 Blueprint-body-small', hasError ? 'text-schemesError' : 'text-schemesOnSurfaceVariant'),
      children: helperText
    }) : null]
  });
}

/***/ })

}]);
//# sourceMappingURL=register-organisation.js.map?ver=4398720dd7ccfcc7e144