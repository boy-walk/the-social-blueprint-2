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
  helpText = "Landscape image (3:2 ratio, min 1200x800px). Best with no text overlays. Use tinypng to reduce size",
  minW = 1200,
  minH = 800,
  aspect = 3 / 2,
  aspectTolerance = 0.08
}) {
  const id = (0,react__WEBPACK_IMPORTED_MODULE_0__.useId)();
  const inputRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [file, setFile] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [preview, setPreview] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const [drag, setDrag] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const currentPreview = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (preview) return preview;
    if (typeof value === "string") return value;
    return "";
  }, [preview, value]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => () => preview && URL.revokeObjectURL(preview), [preview]);
  const validateAndSet = f => {
    if (!f) return;
    setError("");
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setFile(f);
      setPreview(url);
      onChange?.(f);
    };
    img.onerror = () => {
      setError("Invalid image");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };
  const clearFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview("");
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };
  const pick = () => inputRef.current?.click();
  const onDrop = e => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) validateAndSet(f);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "w-full",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      role: "button",
      tabIndex: 0,
      "aria-describedby": `${id}-hint`,
      onClick: pick,
      onKeyDown: e => (e.key === "Enter" || e.key === " ") && pick(),
      onDragOver: e => {
        e.preventDefault();
        setDrag(true);
      },
      onDragLeave: () => setDrag(false),
      onDrop: onDrop,
      className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])("relative w-full rounded-xl border transition-colors", drag ? "border-schemesPrimaryContainer" : "border-schemesOutline", error ? "border-schemesError" : "", "bg-schemesSurfaceContainerLow min-h-[260px] md:min-h-[300px] flex items-center justify-center overflow-hidden"),
      children: [!currentPreview && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("span", {
        className: "absolute top-3 left-3 px-3 py-1 rounded-md Blueprint-label-large bg-schemesPrimaryFixed text-schemesOnSurfaceVariant shadow-sm",
        children: [label, required ? " *" : ""]
      }), !currentPreview && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "px-6 text-center pointer-events-none",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "Blueprint-title-small-emphasized text-schemesOnSurface",
          children: "Featured Image / Article Image"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "Blueprint-body-small text-schemesOnSurfaceVariant mt-1",
          children: "Click to select or drag & drop"
        })]
      }), currentPreview && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("img", {
          src: currentPreview,
          alt: "",
          className: "w-full h-full object-cover",
          draggable: false
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          type: "button",
          onClick: e => {
            e.stopPropagation();
            clearFile();
          },
          className: "absolute top-3 right-3 bg-schemesError text-schemesOnError rounded-lg py-2 px-3 shadow-md hover:bg-schemesErrorContainer hover:text-schemesOnErrorContainer transition",
          "aria-label": "Remove image",
          children: "\u2715"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
        ref: inputRef,
        id: id,
        type: "file",
        accept: accept,
        required: required && !file && !value,
        onChange: e => validateAndSet(e.target.files?.[0] || null),
        className: "hidden"
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      id: `${id}-hint`,
      className: "mt-2 Blueprint-body-small text-schemesOnSurfaceVariant",
      children: helpText
    }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "mt-1 Blueprint-body-small text-schemesError",
      children: error
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
/* harmony import */ var _tiptap_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @tiptap/react */ "./node_modules/@tiptap/react/dist/index.js");
/* harmony import */ var _tiptap_starter_kit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tiptap/starter-kit */ "./node_modules/@tiptap/starter-kit/dist/index.js");
/* harmony import */ var _tiptap_extension_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @tiptap/extension-link */ "./node_modules/@tiptap/extension-link/dist/index.js");
/* harmony import */ var _tiptap_extension_image__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @tiptap/extension-image */ "./node_modules/@tiptap/extension-image/dist/index.js");
/* harmony import */ var _tiptap_extension_text_align__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @tiptap/extension-text-align */ "./node_modules/@tiptap/extension-text-align/dist/index.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/X.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/TextB.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/TextItalic.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/TextAUnderline.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/AlignLeft.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/AlignCenterHorizontal.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/AlignRight.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/List.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/ListNumbers.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/Quotes.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/Code.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/Link.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/ImageSquare.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/ArrowCounterClockwise.es.js");
/* harmony import */ var _phosphor_icons_react__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @phosphor-icons/react */ "./node_modules/@phosphor-icons/react/dist/csr/ArrowClockwise.es.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);








/* --- Custom React Image Node --- */

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
    width,
    uploading
  } = node.attrs;
  const dragRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const startResize = e => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = parseInt(width) || e.target.previousSibling.offsetWidth;
    const onMove = moveEvt => {
      const dx = moveEvt.clientX - startX;
      const newW = Math.max(60, startW + dx);
      updateAttributes({
        width: newW
      });
    };
    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_tiptap_react__WEBPACK_IMPORTED_MODULE_6__.NodeViewWrapper, {
    className: "relative inline-block group",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("img", {
      src: src,
      alt: alt,
      style: {
        width: width || "auto",
        maxWidth: "100%",
        height: "auto"
      },
      className: `rounded-md ${selected ? "ring-2 ring-schemesPrimary" : ""}`
    }), uploading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: "absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm rounded-md",
      children: "Uploading\u2026"
    }), selected && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
        type: "button",
        className: "absolute -top-3 -right-3 rounded-full bg-schemesError text-schemesOnError p-1 shadow-md",
        onClick: () => deleteNode?.(),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_7__.XIcon, {
          size: 14
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        ref: dragRef,
        role: "slider",
        "aria-label": "Resize image",
        className: "absolute -bottom-2 -right-2 w-4 h-4 bg-schemesPrimaryContainer rounded-sm cursor-se-resize shadow",
        onPointerDown: startResize
      })]
    })]
  });
};

/* --- Main Editor --- */
const RichTextField = ({
  label = "Content",
  value,
  onChange,
  required = false
}) => {
  const [uploadError, setUploadError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const editor = (0,_tiptap_react__WEBPACK_IMPORTED_MODULE_6__.useEditor)({
    extensions: [_tiptap_starter_kit__WEBPACK_IMPORTED_MODULE_1__["default"].configure({
      blockquote: true,
      codeBlock: true
    }), _tiptap_extension_link__WEBPACK_IMPORTED_MODULE_2__["default"].configure({
      openOnClick: false
    }), _tiptap_extension_text_align__WEBPACK_IMPORTED_MODULE_4__["default"].configure({
      types: ["heading", "paragraph"]
    }), _tiptap_extension_image__WEBPACK_IMPORTED_MODULE_3__["default"].extend({
      addNodeView() {
        return (0,_tiptap_react__WEBPACK_IMPORTED_MODULE_6__.ReactNodeViewRenderer)(ResizableImage);
      },
      addAttributes() {
        return {
          ...this.parent?.(),
          width: {
            default: null
          },
          uploading: {
            default: false
          }
        };
      }
    })],
    content: value || "",
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

  /* Insert image as DataURL (upload later) */
  const insertImage = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    try {
      const file = await new Promise(resolve => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = () => resolve(input.files[0]);
        input.click();
      });
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({
          src: reader.result,
          uploading: false
        }).run();
      };
      reader.readAsDataURL(file);
      setUploadError("");
    } catch (err) {
      setUploadError(err?.message || "Image selection failed.");
    }
  }, [editor]);

  /* Extract images for real upload on submit */
  const extractImages = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (!editor) return [];
    const json = editor.getJSON();
    const images = [];
    const traverse = node => {
      if (node.type === "image" && node.attrs.src?.startsWith("data:")) {
        images.push(node.attrs.src);
      }
      if (node.content) node.content.forEach(traverse);
    };
    traverse(json);
    return images;
  }, [editor]);
  if (!editor) return null;
  const Btn = ({
    onClick,
    active,
    children,
    title
  }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
    type: "button",
    onMouseDown: e => e.preventDefault(),
    onClick: onClick,
    title: title,
    className: `px-2 py-1 rounded-md border transition ${active ? "bg-schemesPrimary text-white" : "border-schemesOutlineVariant text-schemesOnSurfaceVariant hover:text-schemesOnSurface"}`,
    children: children
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    className: "w-full",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("span", {
      className: "px-1 Blueprint-label-medium bg-schemesPrimaryFixed rounded-sm text-schemesOnSurface",
      children: [label, required ? " *" : ""]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "relative w-full rounded-lg border border-schemesOutline bg-schemesSurfaceContainerLow",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "flex flex-wrap items-center gap-2 px-3 py-2 border-b border-schemesOutlineVariant",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Btn, {
          onClick: () => editor.chain().focus().toggleBold().run(),
          active: editor.isActive("bold"),
          title: "Bold",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_8__.TextBIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Btn, {
          onClick: () => editor.chain().focus().toggleItalic().run(),
          active: editor.isActive("italic"),
          title: "Italic",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_9__.TextItalicIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Btn, {
          onClick: () => editor.chain().focus().toggleUnderline().run(),
          active: editor.isActive("underline"),
          title: "Underline",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_10__.TextAUnderlineIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Btn, {
          onClick: () => editor.chain().focus().setTextAlign("left").run(),
          title: "Align left",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_11__.AlignLeftIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Btn, {
          onClick: () => editor.chain().focus().setTextAlign("center").run(),
          title: "Align center",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_12__.AlignCenterHorizontalIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Btn, {
          onClick: () => editor.chain().focus().setTextAlign("right").run(),
          title: "Align right",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_13__.AlignRightIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Btn, {
          onClick: () => editor.chain().focus().toggleBulletList().run(),
          active: editor.isActive("bulletList"),
          title: "Bullet list",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_14__.ListIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Btn, {
          onClick: () => editor.chain().focus().toggleOrderedList().run(),
          active: editor.isActive("orderedList"),
          title: "Numbered list",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_15__.ListNumbersIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Btn, {
          onClick: () => editor.chain().focus().toggleBlockquote().run(),
          active: editor.isActive("blockquote"),
          title: "Quote",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_16__.QuotesIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Btn, {
          onClick: () => editor.chain().focus().toggleCodeBlock().run(),
          active: editor.isActive("codeBlock"),
          title: "Code",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_17__.CodeIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Btn, {
          onClick: () => {
            const url = window.prompt("Enter URL");
            if (url) editor.chain().focus().setLink({
              href: url
            }).run();
          },
          active: editor.isActive("link"),
          title: "Insert link",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_18__.LinkIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Btn, {
          onClick: insertImage,
          title: "Insert image",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_19__.ImageSquareIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Btn, {
          onClick: () => editor.chain().focus().undo().run(),
          title: "Undo",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_20__.ArrowCounterClockwiseIcon, {
            size: 18
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Btn, {
          onClick: () => editor.chain().focus().redo().run(),
          title: "Redo",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_phosphor_icons_react__WEBPACK_IMPORTED_MODULE_21__.ArrowClockwiseIcon, {
            size: 18
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        className: "cursor-text",
        onClick: () => editor.chain().focus().run(),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_tiptap_react__WEBPACK_IMPORTED_MODULE_6__.EditorContent, {
          editor: editor,
          className: "tiptap min-h-[300px] px-3 py-3 Blueprint-body-medium text-schemesOnSurface"
        })
      })]
    }), uploadError && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
      className: "mt-1 ml-1 Blueprint-body-small text-schemesError",
      children: uploadError
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
  const [errors, setErrors] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({}); // { title: '...', article_content: '...', theme: '...' }

  const titleRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const contentRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const themeRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const topicOptions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => Object.entries(taxonomies?.topic_tag || {}), [taxonomies]);
  const themeOptions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => Object.entries(taxonomies?.theme || {}), [taxonomies]);
  const audienceOptions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => Object.entries(taxonomies?.audience_tag || {}), [taxonomies]);
  const update = (k, v) => {
    setAcf(s => ({
      ...s,
      [k]: v
    }));
    setErrors(e => ({
      ...e,
      [k]: ""
    })); // clear error as user types
  };
  const processInlineImages = async html => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const imgs = Array.from(div.querySelectorAll("img[src^='data:']"));
    for (const img of imgs) {
      try {
        const res = await fetch(img.src);
        const blob = await res.blob();
        const file = new File([blob], "inline-image.png", {
          type: blob.type
        });
        const url = await uploadInlineImage(file);
        img.src = url;
      } catch (err) {
        console.error("Inline image upload failed", err);
      }
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
    if (!res.ok || !data?.source_url) throw new Error(data?.message || "Upload failed");
    return data.source_url;
  };
  const stripHtml = html => {
    const el = document.createElement("div");
    el.innerHTML = html || "";
    return (el.textContent || el.innerText || "").replace(/\u200B/g, "");
  };
  const focusField = ref => {
    const node = ref?.current?.querySelector('input, textarea, select, [contenteditable="true"]');
    if (node) {
      node.focus({
        preventScroll: true
      });
      node.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  };
  const validate = () => {
    const next = {};
    if (!acf.title.trim()) next.title = "Please enter a title";
    if (!stripHtml(acf.article_content).trim()) next.article_content = "Please enter the article content";
    if (!theme) next.theme = "Please choose a theme";
    setErrors(next);
    if (Object.keys(next).length) {
      const order = ["title", "article_content", "theme"];
      const first = order.find(k => next[k]);
      if (first === "title") focusField(titleRef);else if (first === "article_content") focusField(contentRef);else if (first === "theme") focusField(themeRef);
      return false;
    }
    return true;
  };
  const submit = async e => {
    e.preventDefault();
    setMsg(null);
    if (!validate()) return;
    setBusy(true);
    try {
      const processedContent = await processInlineImages(acf.article_content);
      const fd = new FormData();
      fd.append("website", "");
      Object.entries(acf).forEach(([k, v]) => fd.append(`acf[${k}]`, k === "article_content" ? processedContent : v));
      topics.forEach(id => fd.append("topic_tags[]", String(id)));
      if (theme) fd.append("theme", String(theme));
      if (audience) fd.append("audience_tag", String(audience));
      if (img) fd.append("acf_files[article_image]", img);
      const res = await fetch(restUrl, {
        method: "POST",
        headers: {
          "X-WP-Nonce": wpNonce
        },
        body: fd,
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.message || "Submission failed");
      setSubmitted(true);
    } catch (err) {
      setMsg({
        t: "error",
        m: err.message
      });
    } finally {
      setBusy(false);
    }
  };
  if (submitted) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "max-w-2xl mx-auto text-center space-y-4 py-8 md:py-16 min-h-[50vwh]",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h1", {
        className: "Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large text-schemesOnSurface",
        children: "Your article was successfully submitted"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("p", {
        className: "Blueprint-body-medium text-schemesOnSurfaceVariant",
        children: ["Go to ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
          href: "/account-listings",
          className: "text-schemesPrimary underline",
          children: "Account Listings"
        }), " to view."]
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
          children: "We\u2019d love to hear from you. Share your journey, reflections, or insights with the Melbourne Jewish community. Please note: submissions are reviewed by our editorial team and not every story will be published."
        })]
      }), msg && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        role: "status",
        "aria-live": "polite",
        className: msg.t === "success" ? "Blueprint-body-medium text-stateSuccess" : "Blueprint-body-medium text-stateError",
        children: msg.m
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        ref: titleRef,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
          label: "Story Title",
          required: true,
          value: acf.title,
          onChange: e => update("title", e.target.value),
          style: "outlined",
          error: errors.title || ""
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_TextField__WEBPACK_IMPORTED_MODULE_1__.TextField, {
        label: "Subtitle / Short Introduction",
        value: acf.subtitle,
        onChange: e => update("subtitle", e.target.value),
        style: "outlined",
        error: ""
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        ref: contentRef,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_RichTextField__WEBPACK_IMPORTED_MODULE_2__.RichTextField, {
          label: "Your Story",
          required: true,
          value: acf.article_content,
          onChange: e => update("article_content", e.target.value),
          onUpload: uploadInlineImage,
          error: errors.article_content || "" // supported in our RTE; if not, message below is still helpful
        }), errors.article_content ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
          className: "Blueprint-body-small text-schemesError mt-1",
          children: errors.article_content
        }) : null]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ImageDropField__WEBPACK_IMPORTED_MODULE_4__["default"], {
        label: "Upload an Image",
        value: null,
        onChange: f => setImg(f),
        required: false,
        helpText: "Landscape image (3:2 ratio, min 1200x800px). Best with no text overlays. Use tinypng to reduce size"
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
          error: errors.theme || ""
        }), errors.theme ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
          className: "Blueprint-body-small text-schemesError mt-1",
          children: errors.theme
        }) : null]
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
              className: "flex items-center gap-2 bg-surfaceContainerHigh border border-schemesOutlineVariant rounded-lg px-3 py-2 cursor-pointer select-none",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("input", {
                type: "checkbox",
                checked: checked,
                onChange: () => setTopics(prev => checked ? prev.filter(x => x !== Number(id)) : [...prev, Number(id)])
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
        error: ""
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_5__.Button, {
        type: "submit",
        label: busy ? "Submitting..." : "Submit Story",
        variant: "filled",
        size: "base",
        disabled: busy
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
//# sourceMappingURL=submit-article.js.map?ver=090de09cef0589049850