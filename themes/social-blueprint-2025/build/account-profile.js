"use strict";
(globalThis["webpackChunkbrads_boilerplate_theme"] = globalThis["webpackChunkbrads_boilerplate_theme"] || []).push([["account-profile"],{

/***/ "./src/scripts/AccountChangePassword.js":
/*!**********************************************!*\
  !*** ./src/scripts/AccountChangePassword.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccountChangePassword: () => (/* binding */ AccountChangePassword)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _TextField__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TextField */ "./src/scripts/TextField.js");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Button */ "./src/scripts/Button.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




const AccountChangePassword = ({
  user
}) => {
  const [form, setForm] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [status, setStatus] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [submitting, setSubmitting] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [errors, setErrors] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [showPasswordRequirements, setShowPasswordRequirements] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [passwordStrength, setPasswordStrength] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    score: 0,
    feedback: ''
  });
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field-specific errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear status messages when user starts typing
    if (status) {
      setStatus(null);
    }

    // Check password strength for new password
    if (name === 'newPassword') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };
  const checkPasswordStrength = password => {
    if (!password) return {
      score: 0,
      feedback: ''
    };
    let score = 0;
    const feedback = [];

    // Length check
    if (password.length >= 8) score++;else feedback.push('at least 8 characters');

    // Uppercase check
    if (/[A-Z]/.test(password)) score++;else feedback.push('an uppercase letter');

    // Lowercase check
    if (/[a-z]/.test(password)) score++;else feedback.push('a lowercase letter');

    // Number check
    if (/\d/.test(password)) score++;else feedback.push('a number');

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;else feedback.push('a special character');
    const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthLevel = strengthLevels[Math.min(score, 4)];
    let feedbackText = '';
    if (score < 3) {
      feedbackText = `${strengthLevel} - Add ${feedback.slice(0, 2).join(' and ')}`;
    } else {
      feedbackText = strengthLevel;
    }
    return {
      score,
      feedback: feedbackText
    };
  };
  const validateForm = () => {
    const newErrors = {};
    if (!form.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!form.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (form.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    } else if (form.newPassword === form.currentPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }
    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);
    if (!validateForm()) {
      setStatus({
        error: true,
        message: 'Please fix the errors below'
      });
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('/wp-json/custom/v1/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.WPData?.nonce || ''
        },
        credentials: 'include',
        body: JSON.stringify({
          current_password: form.currentPassword,
          new_password: form.newPassword
        })
      });
      const result = await response.json();
      if (!response.ok) {
        // Handle specific error cases from the backend
        if (result.code === 'incorrect_password') {
          setErrors({
            currentPassword: result.message
          });
          setStatus({
            error: true,
            message: 'Please check your current password'
          });
        } else if (result.code === 'weak_password') {
          setErrors({
            newPassword: result.message
          });
          setStatus({
            error: true,
            message: 'Please choose a stronger password'
          });
        } else if (result.code === 'same_password') {
          setErrors({
            newPassword: result.message
          });
          setStatus({
            error: true,
            message: 'Please choose a different password'
          });
        } else {
          throw new Error(result.message || 'Password change failed');
        }
        return;
      }

      // Success
      setStatus({
        success: true,
        message: result.message || 'Password updated successfully! You remain logged in.'
      });
      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordStrength({
        score: 0,
        feedback: ''
      });
    } catch (error) {
      console.error('Password change error:', error);
      setStatus({
        error: true,
        message: error.message || 'An unexpected error occurred'
      });
    } finally {
      setSubmitting(false);
    }
  };
  const getPasswordStrengthColor = score => {
    const colors = ['bg-stateError',
    // Very Weak
    'bg-stateError',
    // Weak  
    'bg-yellow-500',
    // Fair
    'bg-blue-500',
    // Good
    'bg-stateSuccess' // Strong
    ];
    return colors[Math.min(score, 4)];
  };
  const isFormValid = form.currentPassword && form.newPassword && form.confirmPassword && form.newPassword === form.confirmPassword && form.newPassword.length >= 8 && form.newPassword !== form.currentPassword;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "max-w-2xl mx-auto px-4 lg:px-0",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h2", {
      className: "Blueprint-headline-small-emphasized mb-1",
      children: "Change Password"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
      className: "Blueprint-body-medium mb-6 text-schemesOnSurfaceVariant",
      children: "Update your password to keep your account secure."
    }), status && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: `mb-6 p-4 rounded-lg border ${status.success ? 'bg-stateSuccess/10 border-stateSuccess text-stateSuccess' : 'bg-stateError/10 border-stateError text-stateError'}`,
      role: "alert",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "Blueprint-body-medium",
        children: status.message
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("form", {
      onSubmit: handleSubmit,
      className: "space-y-6",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
        type: "password",
        name: "currentPassword",
        label: "Current Password",
        value: form.currentPassword,
        onChange: handleChange,
        disabled: submitting,
        required: true,
        error: errors.currentPassword,
        autoComplete: "current-password"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
          type: "password",
          name: "newPassword",
          label: "New Password",
          value: form.newPassword,
          onChange: handleChange,
          disabled: submitting,
          required: true,
          error: errors.newPassword,
          autoComplete: "new-password",
          onFocus: () => setShowPasswordRequirements(true),
          onBlur: () => setShowPasswordRequirements(false)
        }), form.newPassword && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "mt-2",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "flex items-center gap-2 mb-1",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
              className: "flex-1 bg-schemesOutlineVariant rounded-full h-2 overflow-hidden",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
                className: `h-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`,
                style: {
                  width: `${passwordStrength.score / 5 * 100}%`
                }
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
              className: "Blueprint-body-small text-schemesOnSurfaceVariant min-w-fit",
              children: passwordStrength.feedback
            })]
          })
        }), showPasswordRequirements && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "mt-2 p-3 bg-surfaceContainerHigh rounded-lg border border-schemesOutlineVariant",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
            className: "Blueprint-body-small text-schemesOnSurfaceVariant mb-2 font-medium",
            children: "Password Requirements:"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("ul", {
            className: "Blueprint-body-small text-schemesOnSurfaceVariant space-y-1",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("li", {
              className: form.newPassword.length >= 8 ? 'text-stateSuccess' : '',
              children: "\u2713 At least 8 characters"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("li", {
              className: /[A-Z]/.test(form.newPassword) ? 'text-stateSuccess' : '',
              children: "\u2713 One uppercase letter"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("li", {
              className: /[a-z]/.test(form.newPassword) ? 'text-stateSuccess' : '',
              children: "\u2713 One lowercase letter"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("li", {
              className: /\d/.test(form.newPassword) ? 'text-stateSuccess' : '',
              children: "\u2713 One number"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("li", {
              className: /[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword) ? 'text-stateSuccess' : '',
              children: "\u2713 One special character"
            })]
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
        type: "password",
        name: "confirmPassword",
        label: "Confirm New Password",
        value: form.confirmPassword,
        onChange: handleChange,
        disabled: submitting,
        required: true,
        error: errors.confirmPassword,
        autoComplete: "new-password"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "flex flex-col sm:flex-row gap-3 pt-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
          label: submitting ? 'Updating Password...' : 'Update Password',
          type: "submit",
          disabled: submitting || !isFormValid,
          variant: "filled",
          size: "base"
        }), (form.currentPassword || form.newPassword || form.confirmPassword) && !submitting && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
          label: "Clear Form",
          type: "button",
          variant: "outlined",
          size: "base",
          onClick: () => {
            setForm({
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            });
            setErrors({});
            setStatus(null);
            setPasswordStrength({
              score: 0,
              feedback: ''
            });
          }
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "mt-8 p-4 bg-surfaceContainerLow rounded-lg border border-schemesOutlineVariant",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h3", {
          className: "Blueprint-body-medium font-medium text-schemesOnSurface mb-2",
          children: "\uD83D\uDD12 Password Security Tips"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("ul", {
          className: "Blueprint-body-small text-schemesOnSurfaceVariant space-y-1",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("li", {
            children: "\u2022 Use a unique password you don't use anywhere else"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("li", {
            children: "\u2022 Consider using a password manager to generate and store strong passwords"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("li", {
            children: "\u2022 Avoid using personal information like names, birthdays, or addresses"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("li", {
            children: "\u2022 Change your password regularly, especially if you suspect it may be compromised"
          })]
        })]
      })]
    })]
  });
};

/***/ }),

/***/ "./src/scripts/AccountLayout.js":
/*!**************************************!*\
  !*** ./src/scripts/AccountLayout.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccountLayout: () => (/* binding */ AccountLayout)
/* harmony export */ });
/* harmony import */ var _AccountSidebar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AccountSidebar */ "./src/scripts/AccountSidebar.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function AccountLayout({
  children,
  active,
  links
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("main", {
    className: "bg-schemesSurface text-schemesOnSurface",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "p-6 md:p-8 lg:p-12 max-w-[1600px] mx-auto",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "mx-auto lg:max-w-[1600px] px-0 lg:px-16",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "flex flex-col lg:flex-row lg:gap-16",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_AccountSidebar__WEBPACK_IMPORTED_MODULE_0__.AccountSidebar, {
            active: active,
            links: links
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
            className: "flex-1 min-w-0",
            children: children
          })]
        })
      })
    })
  });
}

/***/ }),

/***/ "./src/scripts/AccountProfilePage.js":
/*!*******************************************!*\
  !*** ./src/scripts/AccountProfilePage.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccountChangePasswordPage: () => (/* binding */ AccountChangePasswordPage),
/* harmony export */   AccountEditProfilePage: () => (/* binding */ AccountEditProfilePage)
/* harmony export */ });
/* harmony import */ var _AccountLayout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AccountLayout */ "./src/scripts/AccountLayout.js");
/* harmony import */ var _AccountSettingsPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AccountSettingsPage */ "./src/scripts/AccountSettingsPage.js");
/* harmony import */ var _AccountChangePassword__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AccountChangePassword */ "./src/scripts/AccountChangePassword.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
// pages/AccountEditProfilePage.jsx




function AccountEditProfilePage(props) {
  const {
    links
  } = props; // { profileHref, passwordHref, logoutHref }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_AccountLayout__WEBPACK_IMPORTED_MODULE_0__.AccountLayout, {
    active: "profile",
    links: links,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_AccountSettingsPage__WEBPACK_IMPORTED_MODULE_1__.AccountSettings, {
      ...props
    })
  });
}
function AccountChangePasswordPage(props) {
  const {
    links
  } = props;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_AccountLayout__WEBPACK_IMPORTED_MODULE_0__.AccountLayout, {
    active: "password",
    links: links,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_AccountChangePassword__WEBPACK_IMPORTED_MODULE_2__.AccountChangePassword, {
      ...props
    })
  });
}

/***/ }),

/***/ "./src/scripts/AccountSettingsPage.js":
/*!********************************************!*\
  !*** ./src/scripts/AccountSettingsPage.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccountSettings: () => (/* binding */ AccountSettings)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _TextField__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TextField */ "./src/scripts/TextField.js");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Button */ "./src/scripts/Button.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




function AccountSettings({
  profile
}) {
  const [editing, setEditing] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [form, setForm] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(profile);
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };
  const resetChanges = () => {
    setForm(profile);
    setEditing(false);
  };
  const saveChanges = async () => {
    await fetch('/wp-json/custom/v1/user-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.WPData?.nonce
      },
      body: JSON.stringify(form)
    });
    setForm(form);
    setEditing(false);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "max-w-2xl mx-auto px-4 lg:px-0",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h2", {
      className: "Blueprint-headline-small-emphasized mb-1",
      children: "Profile"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
      className: "Blueprint-body-medium mb-6 text-schemesOnSurfaceVariant",
      children: "View your profile details and make changes when needed."
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "flex items-center gap-4 mb-8",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("img", {
        src: form.avatar || '/wp-content/plugins/userswp/assets/images/no_profile.png',
        alt: "Avatar",
        className: "rounded-lg w-24 h-24 mb-2"
      }), editing && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
          type: "file",
          accept: "image/*",
          id: "avatarUpload",
          style: {
            display: 'none'
          },
          onChange: async e => {
            const file = e.target.files[0];
            if (!file) return;
            const formData = new FormData();
            formData.append('avatar', file);
            const res = await fetch('/wp-json/custom/v1/upload-avatar', {
              method: 'POST',
              headers: {
                'X-WP-Nonce': window.WPData?.nonce
              },
              body: formData
            });
            const json = await res.json();
            if (res.ok) {
              setForm(prev => ({
                ...prev,
                avatar: json.url
              }));
            } else {
              alert(json.message || 'Upload failed');
            }
          }
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
          label: "Change photo",
          variant: "tonal",
          size: "sm",
          onClick: () => document.getElementById('avatarUpload').click()
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("form", {
      className: "flex flex-col gap-6",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "flex gap-6",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
          label: "First name",
          name: "first_name",
          value: form.first_name,
          onChange: handleChange,
          disabled: !editing
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
          label: "Last name",
          name: "last_name",
          value: form.last_name,
          onChange: handleChange,
          disabled: !editing
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "flex gap-6",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
          label: "Display name",
          name: "display_name",
          value: form.display_name,
          onChange: handleChange,
          disabled: !editing
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
          label: "Phone",
          name: "phone",
          value: form.phone,
          onChange: handleChange,
          disabled: !editing
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
        label: "Email",
        name: "email",
        value: form.email,
        onChange: handleChange,
        disabled: !editing
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
        label: "Bio",
        name: "bio",
        value: form.bio,
        onChange: handleChange,
        disabled: !editing,
        multiline: true
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "flex gap-4 mt-6",
      children: editing ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
          label: "Reset Changes",
          variant: "tonal",
          onClick: resetChanges
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
          label: "Save Changes",
          onClick: saveChanges
        })]
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Button, {
        label: "Edit Profile",
        onClick: () => setEditing(true)
      })
    })]
  });
}

/***/ }),

/***/ "./src/scripts/AccountSidebar.js":
/*!***************************************!*\
  !*** ./src/scripts/AccountSidebar.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccountSidebar: () => (/* binding */ AccountSidebar)
/* harmony export */ });
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/SmileySticker.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/LockKey.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/SignOut.es.js");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Button */ "./src/scripts/Button.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
// components/account/AccountSidebar.jsx



function AccountSidebar({
  active = "profile",
  links
}) {
  const items = [{
    key: "profile",
    label: "Profile",
    href: links.profileHref,
    Icon: _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_2__.SmileyStickerIcon
  }, {
    key: "password",
    label: "Change Password",
    href: links.passwordHref,
    Icon: _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_3__.LockKeyIcon
  }];
  const IconBadge = ({
    children
  }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
    className: "inline-flex items-center justify-center rounded-full p-2",
    children: children
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("nav", {
    className: "flex gap-3 overflow-x-auto lg:overflow-visible w-auto lg:flex-col lg:w-64 lg:shrink-0 lg:sticky lg:top-16 p-1 lg:mb-0 mb-4 scrollbar-hidden justify-start",
    children: [items.map(({
      key,
      label,
      href,
      Icon
    }) => {
      const isActive = active === key;
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_0__.Button, {
        label: label,
        icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(IconBadge, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Icon, {
            size: 24,
            weight: "bold"
          })
        }),
        size: "xs",
        shape: "pill",
        variant: isActive ? "tonal" : "text",
        className: "justify-start shrink-0",
        onClick: e => {
          e.preventDefault();
          window.location.href = href;
        }
      }, key);
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_0__.Button, {
      label: "Log out",
      icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(IconBadge, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_4__.SignOutIcon, {
          size: 24,
          weight: "bold"
        })
      }),
      size: "xs",
      shape: "pill",
      variant: "text",
      className: "w-full justify-start shrink-0",
      onClick: e => {
        e.preventDefault();
        window.location.href = links.logoutHref;
      }
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
//# sourceMappingURL=account-profile.js.map?ver=91668a1ebdbeda7c6971