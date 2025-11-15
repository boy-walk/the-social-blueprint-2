"use strict";
(globalThis["webpackChunkbrads_boilerplate_theme"] = globalThis["webpackChunkbrads_boilerplate_theme"] || []).push([["submit-article"],{

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

/***/ "./src/scripts/ImageDropField.js":
/*!***************************************!*\
  !*** ./src/scripts/ImageDropField.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ImageDropField)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function ImageDropField({
  label = "Upload an Image",
  value = null,
  onChange,
  accept = "image/*",
  required = false,
  helpText = "Landscape image (3:2 ratio, min 1200x800px, max 10MB). Best with no text overlays.",
  minW = 450,
  minH = 300,
  aspect = 3 / 2,
  aspectTolerance = 0.3,
  disabled = false,
  error = ""
}) {
  const id = (0,react__WEBPACK_IMPORTED_MODULE_0__.useId)();
  const inputRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const dragCounterRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(0);
  const [file, setFile] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [preview, setPreview] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const [isDragOver, setIsDragOver] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [internalError, setInternalError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const [isProcessing, setIsProcessing] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const finalError = error || internalError;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const currentPreview = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (preview) return preview;
    if (typeof value === "string") return value;
    return "";
  }, [preview, value]);

  // Cleanup preview URL on unmount or when preview changes
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);
  const validateFile = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(f => {
    if (!f) return {
      valid: false,
      error: "No file selected"
    };

    // File type validation
    if (!f.type.startsWith('image/')) {
      return {
        valid: false,
        error: "Please select an image file"
      };
    }

    // File size validation
    if (f.size > MAX_FILE_SIZE) {
      const sizeMB = (f.size / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        error: `File too large (${sizeMB}MB). Maximum size is 10MB. Try compressing with TinyPNG.`
      };
    }
    return {
      valid: true
    };
  }, []);
  const validateAndSet = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(f => {
    if (!f) return;
    setInternalError("");
    setIsProcessing(true);
    const validation = validateFile(f);
    if (!validation.valid) {
      setInternalError(validation.error);
      setIsProcessing(false);
      return;
    }
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      // Optional: dimension validation
      if (minW && img.width < minW) {
        setInternalError(`Image width (${img.width}px) is below minimum (${minW}px)`);
        URL.revokeObjectURL(url);
        setIsProcessing(false);
        return;
      }
      if (minH && img.height < minH) {
        setInternalError(`Image height (${img.height}px) is below minimum (${minH}px)`);
        URL.revokeObjectURL(url);
        setIsProcessing(false);
        return;
      }

      // Optional: aspect ratio validation
      if (aspect && aspectTolerance) {
        const fileAspect = img.width / img.height;
        const aspectDiff = Math.abs(fileAspect - aspect);
        if (aspectDiff > aspectTolerance) {
          setInternalError(`Image aspect ratio (${fileAspect.toFixed(2)}) should be close to ${aspect.toFixed(2)} (±${aspectTolerance})`);
          URL.revokeObjectURL(url);
          setIsProcessing(false);
          return;
        }
      }

      // Clean up old preview
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
      setFile(f);
      setPreview(url);
      setIsProcessing(false);
      onChange?.(f);
    };
    img.onerror = () => {
      setInternalError("Invalid or corrupted image file");
      URL.revokeObjectURL(url);
      setIsProcessing(false);
    };
    img.src = url;
  }, [validateFile, minW, minH, aspect, aspectTolerance, preview, onChange]);
  const clearFile = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview("");
    setInternalError("");
    onChange?.(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [preview, onChange]);
  const pick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  // Fixed drag event handlers
  const handleDragEnter = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    dragCounterRef.current++;
    if (e.dataTransfer?.types?.includes('Files')) {
      setIsDragOver(true);
    }
  }, [disabled]);
  const handleDragLeave = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    dragCounterRef.current--;

    // Only hide drag state when we've left all nested elements
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDragOver(false);
    }
  }, [disabled]);
  const handleDragOver = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    // Set the drop effect
    e.dataTransfer.dropEffect = 'copy';
  }, [disabled]);
  const handleDrop = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    e.preventDefault();
    e.stopPropagation();

    // Reset drag state
    dragCounterRef.current = 0;
    setIsDragOver(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    if (imageFile) {
      validateAndSet(imageFile);
    } else if (files.length > 0) {
      setInternalError("Please drop an image file");
    }
  }, [disabled, validateAndSet]);
  const handleFileInputChange = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSet(selectedFile);
    }
  }, [validateAndSet]);
  const handleKeyDown = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    if ((e.key === "Enter" || e.key === " ") && !disabled) {
      e.preventDefault();
      pick();
    }
  }, [disabled, pick]);
  const dropZoneClasses = (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])("relative w-full rounded-xl border transition-all duration-200 ease-in-out", "bg-schemesSurfaceContainerLow min-h-[260px] md:min-h-[300px]", "flex items-center justify-center overflow-hidden", "focus-within:outline-none focus-within:ring-2 focus-within:ring-schemesPrimary focus-within:ring-offset-2", {
    // Normal state
    "border-schemesOutline cursor-pointer hover:bg-schemesSurfaceContainerHigh hover:border-schemesOutline": !disabled && !isDragOver && !finalError,
    // Drag over state
    "border-schemesPrimary bg-schemesPrimary/5 border-2 scale-[1.01] shadow-lg": !disabled && isDragOver,
    // Error state
    "border-schemesError bg-schemesError/5": finalError,
    // Disabled state
    "opacity-50 cursor-not-allowed bg-schemesOutlineVariant": disabled,
    // Processing state
    "pointer-events-none": isProcessing
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "w-full",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      role: "button",
      tabIndex: disabled ? -1 : 0,
      "aria-describedby": `${id}-hint`,
      "aria-label": `${label}${required ? ' (required)' : ''} drop zone`,
      onClick: pick,
      onKeyDown: handleKeyDown,
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      className: dropZoneClasses,
      children: [!currentPreview && !isProcessing && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("span", {
        className: "absolute top-3 left-3 px-3 py-1 rounded-md Blueprint-label-large bg-schemesPrimaryFixed text-schemesOnSurfaceVariant shadow-sm z-10",
        children: [label, required ? " *" : ""]
      }), isProcessing && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "px-6 text-center",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "mx-auto w-8 h-8 mb-4",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
            className: "w-full h-full border-3 border-schemesPrimary border-t-transparent rounded-full animate-spin"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "Blueprint-body-medium text-schemesOnSurface",
          children: "Processing image..."
        })]
      }), !currentPreview && !isProcessing && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "px-6 text-center pointer-events-none",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "mx-auto w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-schemesPrimaryContainer/20",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
            className: "w-6 h-6 text-schemesPrimary",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "Blueprint-title-small-emphasized text-schemesOnSurface mb-2",
          children: isDragOver ? 'Drop your image here' : 'Featured Image / Article Image'
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "Blueprint-body-small text-schemesOnSurfaceVariant",
          children: isDragOver ? 'Release to upload' : 'Click to select or drag & drop'
        })]
      }), currentPreview && !isProcessing && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("img", {
          src: currentPreview,
          alt: "Preview",
          className: "w-full h-full object-cover",
          draggable: false
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          type: "button",
          onClick: e => {
            e.stopPropagation();
            clearFile();
          },
          disabled: disabled,
          className: "absolute top-3 right-3 bg-schemesError text-schemesOnError rounded-lg py-2 px-3 shadow-md hover:bg-schemesError/90 transition-colors focus:outline-none focus:ring-2 focus:ring-schemesError focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          "aria-label": "Remove image",
          children: "\u2715"
        }), file && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-md Blueprint-body-small",
          children: [file.name, " (", (file.size / (1024 * 1024)).toFixed(1), "MB)"]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
        ref: inputRef,
        id: id,
        type: "file",
        accept: accept,
        required: required && !file && !value,
        onChange: handleFileInputChange,
        disabled: disabled,
        className: "sr-only"
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      id: `${id}-hint`,
      className: "mt-2 Blueprint-body-small text-schemesOnSurfaceVariant",
      children: helpText
    }), finalError && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "mt-1 Blueprint-body-small text-schemesError",
      role: "alert",
      children: finalError
    })]
  });
}

/***/ }),

/***/ "./src/scripts/RichTextField.js":
/*!**************************************!*\
  !*** ./src/scripts/RichTextField.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RichTextField: () => (/* binding */ RichTextField)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/X.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/TextB.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/TextItalic.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/TextAUnderline.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/AlignLeft.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/AlignCenterHorizontal.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/AlignRight.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/List.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/ListNumbers.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/Quotes.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/Code.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/Link.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/ImageSquare.es.js");
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.mjs");
/* harmony import */ var _tiptap_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @tiptap/react */ "./node_modules/@tiptap/react/dist/index.js");
/* harmony import */ var _tiptap_starter_kit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @tiptap/starter-kit */ "./node_modules/@tiptap/starter-kit/dist/index.js");
/* harmony import */ var _tiptap_extension_underline__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @tiptap/extension-underline */ "./node_modules/@tiptap/extension-underline/dist/index.js");
/* harmony import */ var _tiptap_extension_link__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @tiptap/extension-link */ "./node_modules/@tiptap/extension-link/dist/index.js");
/* harmony import */ var _tiptap_extension_image__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @tiptap/extension-image */ "./node_modules/@tiptap/extension-image/dist/index.js");
/* harmony import */ var _tiptap_extension_text_align__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @tiptap/extension-text-align */ "./node_modules/@tiptap/extension-text-align/dist/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);










// Improved ResizableImage component with proper drag handling

const ResizableImage = props => {
  const {
    node,
    updateAttributes,
    deleteNode,
    selected
  } = props;
  const {
    src,
    alt,
    width
  } = node.attrs;
  const [isResizing, setIsResizing] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [startX, setStartX] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [startWidth, setStartWidth] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const imageRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const handleMouseDown = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    e.preventDefault();
    e.stopPropagation();
    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect) return;
    setIsResizing(true);
    setStartX(e.clientX);
    setStartWidth(width || rect.width);

    // Prevent text selection during resize
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'se-resize';
  }, [width]);
  const handleMouseMove = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    if (!isResizing) return;
    e.preventDefault();
    const deltaX = e.clientX - startX;
    const newWidth = Math.max(60, Math.min(800, startWidth + deltaX));
    updateAttributes({
      width: newWidth
    });
  }, [isResizing, startX, startWidth, updateAttributes]);
  const handleMouseUp = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (!isResizing) return;
    setIsResizing(false);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }, [isResizing]);

  // Add global mouse event listeners during resize
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_tiptap_react__WEBPACK_IMPORTED_MODULE_8__.NodeViewWrapper, {
    className: "relative inline-block group my-2",
    style: {
      userSelect: isResizing ? 'none' : 'auto'
    },
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("img", {
      ref: imageRef,
      src: src,
      alt: alt || "Uploaded image",
      style: {
        width: width || "auto",
        maxWidth: "100%",
        height: "auto",
        display: "block"
      },
      className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])("rounded-md transition-all duration-150", selected ? "ring-2 ring-schemesPrimary shadow-lg" : "", isResizing ? "transition-none" : ""),
      draggable: false
    }), selected && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
        type: "button",
        className: "absolute -top-2 -right-2 w-6 h-6 rounded-full bg-schemesError text-schemesOnError shadow-md hover:bg-schemesError/90 transition-colors focus:outline-none focus:ring-2 focus:ring-schemesError focus:ring-offset-1",
        onClick: e => {
          e.stopPropagation();
          deleteNode?.();
        },
        "aria-label": "Delete image",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_9__.XIcon, {
          size: 14,
          className: "mx-auto"
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
        className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])("absolute -bottom-2 -right-2 w-4 h-4 bg-schemesPrimaryContainer border-2 border-schemesPrimary rounded-sm shadow cursor-se-resize", "hover:bg-schemesPrimary hover:scale-110 transition-all duration-150", isResizing ? "bg-schemesPrimary scale-110" : ""),
        onMouseDown: handleMouseDown,
        "aria-label": "Resize image",
        title: "Drag to resize image"
      }), (width || imageRef.current) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "absolute -bottom-8 left-0 bg-black/75 text-white px-2 py-1 rounded text-xs font-medium",
        children: [Math.round(width || imageRef.current?.getBoundingClientRect()?.width || 0), "px"]
      })]
    })]
  });
};
const RichTextField = ({
  label = "Content",
  value,
  onChange,
  onUpload,
  required = false,
  error = "",
  disabled = false
}) => {
  const [uploading, setUploading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const editor = (0,_tiptap_react__WEBPACK_IMPORTED_MODULE_8__.useEditor)({
    extensions: [_tiptap_starter_kit__WEBPACK_IMPORTED_MODULE_2__["default"].configure({
      blockquote: true,
      codeBlock: true
    }), _tiptap_extension_underline__WEBPACK_IMPORTED_MODULE_3__["default"], _tiptap_extension_link__WEBPACK_IMPORTED_MODULE_4__["default"].configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-schemesPrimary underline hover:text-schemesPrimary/80'
      }
    }), _tiptap_extension_text_align__WEBPACK_IMPORTED_MODULE_6__["default"].configure({
      types: ['heading', 'paragraph']
    }), _tiptap_extension_image__WEBPACK_IMPORTED_MODULE_5__["default"].extend({
      addNodeView() {
        return (0,_tiptap_react__WEBPACK_IMPORTED_MODULE_8__.ReactNodeViewRenderer)(ResizableImage);
      }
    })],
    content: value || "",
    editable: !disabled,
    onUpdate: ({
      editor
    }) => {
      onChange?.({
        target: {
          value: editor.getHTML()
        }
      });
    }
  });

  // Update content when value prop changes
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [editor, value]);
  const exec = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((command, attrs) => {
    if (!editor || disabled) return;
    editor.chain().focus()[command](attrs).run();
  }, [editor, disabled]);
  const addLink = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (!editor || disabled) return;
    const previousUrl = editor.getAttributes('link').href;
    let url = window.prompt("Enter URL (https://…)", previousUrl || "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    try {
      if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
      }
      const urlObj = new URL(url);
      if (!/^https?:$/.test(urlObj.protocol)) {
        throw new Error("Invalid protocol");
      }
      exec("setLink", {
        href: urlObj.href
      });
    } catch {
      alert("Invalid URL. Please enter a valid web address.");
    }
  }, [editor, disabled, exec]);
  const insertImage = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    if (!editor || disabled) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = false;
    input.onchange = async e => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file size (5MB limit for inline images)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`Image is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please use images smaller than 5MB.`);
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a JPEG, PNG, GIF, or WebP image.');
        return;
      }
      setUploading(true);
      try {
        // Always store as data URL initially - will be converted to real URLs during submission
        const reader = new FileReader();
        reader.onload = e => {
          const dataUrl = e.target.result;
          editor.chain().focus().setImage({
            src: dataUrl,
            alt: file.name,
            title: `Temporary image: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`
          }).run();
          setUploading(false);
        };
        reader.onerror = () => {
          setUploading(false);
          alert("Failed to read image file. Please try again.");
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Image processing failed:", error);
        alert("Could not process image. Please try again.");
        setUploading(false);
      }
    };
    input.click();
  }, [editor, disabled]);

  // Helper function to check if a format is active
  const isActive = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((format, attrs) => {
    if (!editor) return false;
    return editor.isActive(format, attrs);
  }, [editor]);
  const Btn = ({
    title,
    onClick,
    children,
    disabled: btnDisabled,
    format,
    attrs
  }) => {
    const active = format ? isActive(format, attrs) : false;
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
      type: "button",
      onMouseDown: e => e.preventDefault(),
      onClick: onClick,
      disabled: disabled || btnDisabled,
      title: title,
      className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])("px-2 py-1.5 rounded-md border Blueprint-label-medium transition-all duration-150", "focus:outline-none focus:ring-2 focus:ring-schemesPrimaryContainer", "disabled:opacity-50 disabled:cursor-not-allowed", active ? "border-schemesPrimary bg-schemesPrimary text-schemesOnPrimary shadow-sm" : "border-schemesOutlineVariant text-schemesOnSurfaceVariant hover:text-schemesOnSurface hover:bg-surfaceContainerHigh hover:border-schemesOutline"),
      children: children
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "w-full",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])("relative w-full rounded-lg border bg-schemesSurfaceContainerLow transition-colors", error ? "border-schemesError" : "border-schemesOutline", disabled ? "opacity-60 cursor-not-allowed" : ""),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("span", {
        className: "absolute left-4 -top-3 px-2 Blueprint-label-medium bg-schemesPrimaryFixed text-schemesOnSurfaceVariant rounded-sm shadow-sm",
        children: [label, required ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
          className: "text-schemesError ml-1",
          children: "*"
        }) : ""]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "flex flex-wrap items-center gap-1 px-3 pt-6 pb-2 border-b border-schemesOutlineVariant",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Btn, {
          title: "Bold (Ctrl+B)",
          onClick: () => exec("toggleBold"),
          format: "bold",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_10__.TextBIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Btn, {
          title: "Italic (Ctrl+I)",
          onClick: () => exec("toggleItalic"),
          format: "italic",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_11__.TextItalicIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Btn, {
          title: "Underline (Ctrl+U)",
          onClick: () => exec("toggleUnderline"),
          format: "underline",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_12__.TextAUnderlineIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "w-px h-6 bg-schemesOutlineVariant mx-1"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Btn, {
          title: "Align left",
          onClick: () => exec("setTextAlign", "left"),
          format: {
            textAlign: "left"
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_13__.AlignLeftIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Btn, {
          title: "Align center",
          onClick: () => exec("setTextAlign", "center"),
          format: {
            textAlign: "center"
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_14__.AlignCenterHorizontalIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Btn, {
          title: "Align right",
          onClick: () => exec("setTextAlign", "right"),
          format: {
            textAlign: "right"
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_15__.AlignRightIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "w-px h-6 bg-schemesOutlineVariant mx-1"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Btn, {
          title: "Bulleted list",
          onClick: () => exec("toggleBulletList"),
          format: "bulletList",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_16__.ListIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Btn, {
          title: "Numbered list",
          onClick: () => exec("toggleOrderedList"),
          format: "orderedList",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_17__.ListNumbersIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "w-px h-6 bg-schemesOutlineVariant mx-1"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Btn, {
          title: "Quote",
          onClick: () => exec("toggleBlockquote"),
          format: "blockquote",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_18__.QuotesIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Btn, {
          title: "Code block",
          onClick: () => exec("toggleCodeBlock"),
          format: "codeBlock",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_19__.CodeIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Btn, {
          title: "Insert/Edit link",
          onClick: addLink,
          format: "link",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_20__.LinkIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "w-px h-6 bg-schemesOutlineVariant mx-1"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Btn, {
          title: "Insert image",
          onClick: insertImage,
          disabled: uploading,
          children: uploading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
            className: "flex items-center gap-1",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
              className: "w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
              className: "text-xs",
              children: "Uploading"
            })]
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_21__.ImageSquareIcon, {
            size: 18
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
        className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])("cursor-text transition-colors", disabled ? "cursor-not-allowed" : ""),
        onClick: () => !disabled && editor?.chain().focus().run(),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_tiptap_react__WEBPACK_IMPORTED_MODULE_8__.EditorContent, {
          editor: editor,
          className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])("tiptap min-h-[300px] px-4 py-3 outline-none Blueprint-body-medium text-schemesOnSurface", "[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[280px]", "[&_blockquote]:border-l-4 [&_blockquote]:border-schemesOutline [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-schemesOnSurfaceVariant", "[&_pre]:bg-surfaceContainerHigh [&_pre]:p-4 [&_pre]:rounded [&_pre]:font-mono [&_pre]:text-sm [&_pre]:overflow-x-auto", "[&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1", "[&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-1")
        })
      }), editor && editor.isEmpty && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
        className: "absolute top-[76px] left-4 text-schemesOnSurfaceVariant Blueprint-body-medium pointer-events-none",
        children: "Start writing your story..."
      })]
    }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
      className: "mt-1 ml-1 Blueprint-body-small text-schemesError",
      role: "alert",
      children: error
    })]
  });
};

/***/ }),

/***/ "./src/scripts/SelectField.js":
/*!************************************!*\
  !*** ./src/scripts/SelectField.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SelectField)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function SelectField({
  label = "Select",
  value = "",
  onChange,
  options = [],
  required = false
}) {
  const id = (0,react__WEBPACK_IMPORTED_MODULE_0__.useId)();
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "relative w-full rounded-lg border border-schemesOutline bg-transparent focus-within:border-schemesPrimaryContainer",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("label", {
      htmlFor: id,
      className: "absolute left-4 -translate-y-1/2 px-1 Blueprint-label-medium bg-schemesPrimaryFixed rounded-sm",
      children: [label, required ? " *" : ""]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("select", {
      id: id,
      value: value,
      onChange: onChange,
      required: required,
      className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])("w-full py-3 pr-4 pl-3 bg-schemesSurfaceContainerLow rounded-lg outline-none Blueprint-body-medium text-schemesOnSurface"),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("option", {
        value: "",
        children: "Choose one"
      }), options.map(([id, name]) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("option", {
        value: id,
        children: name
      }, id))]
    })]
  });
}

/***/ }),

/***/ "./src/scripts/SubmitArticlePage.js":
/*!******************************************!*\
  !*** ./src/scripts/SubmitArticlePage.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SubmitArticleForm)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _TextField__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TextField */ "./src/scripts/TextField.js");
/* harmony import */ var _RichTextField__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./RichTextField */ "./src/scripts/RichTextField.js");
/* harmony import */ var _SelectField__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SelectField */ "./src/scripts/SelectField.js");
/* harmony import */ var _ImageDropField__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ImageDropField */ "./src/scripts/ImageDropField.js");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Button */ "./src/scripts/Button.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







function SubmitArticleForm({
  restUrl,
  wpNonce,
  taxonomies = {}
}) {
  console.log(taxonomies);
  const [acf, setAcf] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    title: "",
    subtitle: "",
    article_content: ""
  });
  const [img, setImg] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [topics, setTopics] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [theme, setTheme] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const [audience, setAudience] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const [busy, setBusy] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [msg, setMsg] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [submitted, setSubmitted] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [errors, setErrors] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [uploadProgress, setUploadProgress] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const titleRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const contentRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const themeRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const topicOptions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (taxonomies?.topic_tag || []).map(t => [t.id, t.name]), [taxonomies]);
  const themeOptions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (taxonomies?.theme || []).map(t => [t.id, t.name]), [taxonomies]);
  const audienceOptions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (taxonomies?.audience_tag || []).map(t => [t.id, t.name]), [taxonomies]);
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_INLINE_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB for inline images

  const update = (k, v) => {
    setAcf(s => ({
      ...s,
      [k]: v
    }));
    setErrors(e => ({
      ...e,
      [k]: ""
    }));
  };
  const validateImageFile = file => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!file) return {
      valid: true
    };
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `Image is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum size is 10MB. Please compress your image or use a tool like TinyPNG.`
      };
    }
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Please upload a JPEG, PNG, GIF, or WebP image.'
      };
    }
    return {
      valid: true
    };
  };
  const resizeImage = (file, maxWidth = 1920, maxHeight = 1280, quality = 0.9) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      img.onload = () => {
        try {
          let {
            width,
            height
          } = img;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height;
            if (width > height) {
              width = Math.min(width, maxWidth);
              height = width / aspectRatio;
            } else {
              height = Math.min(height, maxHeight);
              width = height * aspectRatio;
            }
          }

          // Set canvas size
          canvas.width = width;
          canvas.height = height;

          // Enable image smoothing for better quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(blob => {
            if (!blob) {
              reject(new Error('Failed to resize image'));
              return;
            }

            // Create a new file with the original name but resized content
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(resizedFile);
          }, file.type, quality);
        } catch (error) {
          reject(new Error('Failed to process image: ' + error.message));
        }
      };
      img.onerror = () => {
        reject(new Error('Failed to load image for resizing'));
      };

      // Create object URL and set as image source
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      // Clean up object URL after a delay to ensure image loads
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    });
  };
  const processInlineImages = async html => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const imgs = Array.from(div.querySelectorAll("img[src^='data:']"));
    let processedCount = 0;
    const totalImages = imgs.length;
    if (totalImages > 0) {
      setUploadProgress({
        current: 0,
        total: totalImages,
        status: 'Processing inline images...'
      });
    }
    for (const img of imgs) {
      try {
        const res = await fetch(img.src);
        const blob = await res.blob();

        // Check inline image size
        if (blob.size > MAX_INLINE_IMAGE_SIZE) {
          throw new Error(`Inline image is too large (${(blob.size / (1024 * 1024)).toFixed(1)}MB). Please use images smaller than 5MB.`);
        }
        const file = new File([blob], "inline-image.png", {
          type: blob.type
        });

        // Resize inline image if it's too large
        const processedFile = blob.size > 1024 * 1024 ? await resizeImage(file, 1200, 800, 0.8) : file;
        const url = await uploadInlineImage(processedFile);
        img.src = url;
        processedCount++;
        setUploadProgress({
          current: processedCount,
          total: totalImages,
          status: `Processed ${processedCount}/${totalImages} images`
        });
      } catch (err) {
        console.error("Inline image upload failed", err);
        throw new Error(`Failed to process inline image: ${err.message}`);
      }
    }
    if (totalImages > 0) {
      setUploadProgress(null);
    }
    return div.innerHTML;
  };
  const uploadInlineImage = async file => {
    const fd = new FormData();
    fd.append("file", file, file.name);
    const res = await fetch("/wp-json/wp/v2/media", {
      method: "POST",
      headers: {
        "X-WP-Nonce": wpNonce
      },
      body: fd,
      credentials: "include"
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || `Upload failed (${res.status})`);
    }
    if (!data?.source_url) {
      throw new Error("Upload succeeded but no URL returned");
    }
    return data.source_url;
  };
  const stripHtml = html => {
    const el = document.createElement("div");
    el.innerHTML = html || "";
    return (el.textContent || el.innerText || "").replace(/\u200B/g, "").trim();
  };
  const focusField = ref => {
    const node = ref?.current?.querySelector('input, textarea, select, [contenteditable="true"]');
    if (node) {
      node.focus({
        preventScroll: true
      });
      setTimeout(() => {
        node.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 100);
    }
  };
  const validate = () => {
    const nextErrors = {};
    if (!acf.title.trim()) {
      nextErrors.title = "Please enter a title";
    }
    if (!stripHtml(acf.article_content)) {
      nextErrors.article_content = "Please enter the article content";
    }
    if (!theme) {
      nextErrors.theme = "Please choose a theme";
    }

    // Validate image if present
    if (img) {
      const imageValidation = validateImageFile(img);
      if (!imageValidation.valid) {
        nextErrors.image = imageValidation.error;
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const order = ["title", "article_content", "theme", "image"];
      const first = order.find(k => nextErrors[k]);
      if (first === "title") focusField(titleRef);else if (first === "article_content") focusField(contentRef);else if (first === "theme") focusField(themeRef);
      return false;
    }
    return true;
  };
  const submit = async e => {
    e.preventDefault();
    setMsg(null);
    setUploadProgress(null);
    if (!validate()) return;
    setBusy(true);
    try {
      setUploadProgress({
        current: 0,
        total: 100,
        status: 'Preparing submission...'
      });

      // Process inline images first
      let processedContent = acf.article_content;
      if (acf.article_content.includes('data:image/')) {
        processedContent = await processInlineImages(acf.article_content);
      }
      setUploadProgress({
        current: 50,
        total: 100,
        status: 'Processing main image...'
      });

      // Process main image if needed
      let finalImage = img;
      if (img && img.size > 2 * 1024 * 1024) {
        // Resize if larger than 2MB
        try {
          finalImage = await resizeImage(img);
        } catch (resizeError) {
          console.warn('Image resize failed, using original:', resizeError);
          finalImage = img; // Fall back to original if resize fails
        }
      }
      setUploadProgress({
        current: 75,
        total: 100,
        status: 'Submitting article...'
      });
      const fd = new FormData();
      fd.append("website", ""); // Honeypot

      // Add ACF data
      Object.entries(acf).forEach(([k, v]) => fd.append(`acf[${k}]`, k === "article_content" ? processedContent : v));

      // Add taxonomies
      topics.forEach(id => fd.append("topic_tags[]", String(id)));
      if (theme) fd.append("theme", String(theme));
      if (audience) fd.append("audience_tag", String(audience));

      // Add image
      if (finalImage) fd.append("acf_files[article_image]", finalImage);
      const res = await fetch(restUrl, {
        method: "POST",
        headers: {
          "X-WP-Nonce": wpNonce
        },
        body: fd,
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMessage = data?.message || `Submission failed (${res.status})`;
        throw new Error(errorMessage);
      }
      if (!data?.ok) {
        throw new Error(data?.message || "Submission failed - please try again");
      }
      setUploadProgress({
        current: 100,
        total: 100,
        status: 'Success!'
      });
      setTimeout(() => setSubmitted(true), 500);
    } catch (err) {
      console.error('Submission error:', err);
      setMsg({
        t: "error",
        m: err.message || "An unexpected error occurred. Please try again."
      });
      setUploadProgress(null);
    } finally {
      setBusy(false);
    }
  };
  const handleImageChange = file => {
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setErrors(e => ({
          ...e,
          image: validation.error
        }));
        return;
      }
    }
    setImg(file);
    setErrors(e => ({
      ...e,
      image: ""
    }));
  };
  if (submitted) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "max-w-2xl mx-auto text-center space-y-4 py-8 md:py-16 min-h-[50vh]",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h1", {
        className: "Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large text-schemesOnSurface",
        children: "Your article was successfully submitted"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
        className: "Blueprint-body-medium text-schemesOnSurfaceVariant",
        children: "Thank you for your submission! Your article is now pending review by our editorial team."
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("p", {
        className: "Blueprint-body-medium text-schemesOnSurfaceVariant",
        children: ["Go to ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
          href: "/account-listings",
          className: "text-schemesPrimary underline hover:text-schemesPrimary/80 transition-colors",
          children: "Account Listings"
        }), " to view your submissions."]
      })]
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
    className: "bg-schemesSurface px-4 lg:px-0",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("form", {
      onSubmit: submit,
      className: "max-w-[1000px] grid grid-cols-1 gap-8 w-full py-8 md:py-16 mx-auto",
      noValidate: true,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "flex flex-col gap-3",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h1", {
          className: "Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large text-schemesOnSurface text-center italic",
          children: "Submit your story"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
          className: "Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large text-schemesOnSurfaceVariant text-center mb-4 max-w-xl mx-auto",
          children: "We'd love to hear from you. Share your journey, reflections, or insights with the Melbourne Jewish community. Please note: submissions are reviewed by our editorial team and not every story will be published."
        })]
      }), uploadProgress && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "bg-surfaceContainerHigh rounded-lg p-4 border border-schemesOutlineVariant",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          className: "flex items-center justify-between mb-2",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
            className: "Blueprint-body-medium text-schemesOnSurface",
            children: uploadProgress.status
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("span", {
            className: "Blueprint-body-small text-schemesOnSurfaceVariant",
            children: [uploadProgress.current, "/", uploadProgress.total]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "w-full bg-schemesOutlineVariant rounded-full h-2",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "bg-schemesPrimary h-2 rounded-full transition-all duration-300",
            style: {
              width: `${uploadProgress.current / uploadProgress.total * 100}%`
            }
          })
        })]
      }), msg && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        role: "alert",
        "aria-live": "assertive",
        className: `p-4 rounded-lg border ${msg.t === "success" ? "bg-stateSuccess/10 border-stateSuccess text-stateSuccess" : "bg-stateError/10 border-stateError text-stateError"}`,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "Blueprint-body-medium",
          children: msg.m
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        ref: titleRef,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
          label: "Story Title",
          required: true,
          value: acf.title,
          onChange: e => update("title", e.target.value),
          style: "outlined",
          error: errors.title || "",
          disabled: busy
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
        label: "Subtitle / Short Introduction",
        value: acf.subtitle,
        onChange: e => update("subtitle", e.target.value),
        style: "outlined",
        error: "",
        disabled: busy
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        ref: contentRef,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_RichTextField__WEBPACK_IMPORTED_MODULE_2__.RichTextField, {
          label: "Your Story",
          required: true,
          value: acf.article_content,
          onChange: e => update("article_content", e.target.value),
          onUpload: uploadInlineImage,
          error: errors.article_content || "",
          disabled: busy
        }), errors.article_content && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
          className: "Blueprint-body-small text-schemesError mt-1",
          children: errors.article_content
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ImageDropField__WEBPACK_IMPORTED_MODULE_4__["default"], {
          label: "Upload an Image",
          value: null,
          onChange: handleImageChange,
          required: false,
          helpText: "Landscape image (3:2 ratio, min 1200x800px, max 10MB). Best with no text overlays. Large images will be automatically resized.",
          disabled: busy
        }), errors.image && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
          className: "Blueprint-body-small text-schemesError mt-1",
          children: errors.image
        }), img && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("p", {
          className: "Blueprint-body-small text-schemesOnSurfaceVariant mt-1",
          children: ["Selected: ", img.name, " (", (img.size / (1024 * 1024)).toFixed(1), "MB)"]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        ref: themeRef,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_SelectField__WEBPACK_IMPORTED_MODULE_3__["default"], {
          label: "Theme",
          required: true,
          value: theme,
          onChange: e => {
            setTheme(e.target.value);
            setErrors(er => ({
              ...er,
              theme: ""
            }));
          },
          options: themeOptions,
          error: errors.theme || "",
          disabled: busy
        }), errors.theme && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
          className: "Blueprint-body-small text-schemesError mt-1",
          children: errors.theme
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "flex flex-col gap-2",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
          className: "Blueprint-label-large text-schemesOnSurface",
          children: "Topics"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "flex flex-wrap gap-2",
          children: topicOptions.map(([id, name]) => {
            const checked = topics.includes(Number(id));
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("label", {
              className: `flex items-center gap-2 bg-surfaceContainerHigh border border-schemesOutlineVariant rounded-lg px-3 py-2 cursor-pointer select-none transition-colors ${busy ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surfaceContainerHighest'}`,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("input", {
                type: "checkbox",
                checked: checked,
                disabled: busy,
                onChange: () => {
                  if (busy) return;
                  setTopics(prev => checked ? prev.filter(x => x !== Number(id)) : [...prev, Number(id)]);
                }
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
                className: "Blueprint-body-medium text-schemesOnSurface",
                children: name
              })]
            }, id);
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_SelectField__WEBPACK_IMPORTED_MODULE_3__["default"], {
        label: "Audience",
        value: audience,
        onChange: e => setAudience(e.target.value),
        options: audienceOptions,
        error: "",
        disabled: busy
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_5__.Button, {
        type: "submit",
        label: busy ? "Submitting..." : "Submit Story",
        variant: "filled",
        size: "base",
        disabled: busy || Object.keys(errors).some(key => errors[key])
      })]
    })
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
    className: multiline ? (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])(inputBase, 'resize-none h-32') : inputBase
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
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
      className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])('mt-1 ml-4 Blueprint-body-small', hasError ? 'text-schemesError' : 'text-schemesOnSurfaceVariant'),
      children: helperText
    }) : null]
  });
}

/***/ })

}]);
//# sourceMappingURL=submit-article.js.map?ver=e77a01c5f5433de7f18b