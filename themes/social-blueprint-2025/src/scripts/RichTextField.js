import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  TextBolderIcon,
  TextItalicIcon,
  TextAUnderlineIcon,
  AlignLeftIcon,
  AlignCenterHorizontalIcon,
  AlignRightIcon,
  LinkIcon,
  ListIcon,
  ListNumbersIcon,
  QuotesIcon,
  CodeIcon,
  ImageSquareIcon,
  XIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";

// Improved ResizableImage component with proper drag handling
const ResizableImage = (props) => {
  const { node, updateAttributes, deleteNode, selected } = props;
  const { src, alt, width } = node.attrs;
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const imageRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
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

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;

    e.preventDefault();
    const deltaX = e.clientX - startX;
    const newWidth = Math.max(60, Math.min(800, startWidth + deltaX));

    updateAttributes({ width: newWidth });
  }, [isResizing, startX, startWidth, updateAttributes]);

  const handleMouseUp = useCallback(() => {
    if (!isResizing) return;

    setIsResizing(false);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }, [isResizing]);

  // Add global mouse event listeners during resize
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <NodeViewWrapper
      className="relative inline-block group my-2"
      style={{ userSelect: isResizing ? 'none' : 'auto' }}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt || "Uploaded image"}
        style={{
          width: width || "auto",
          maxWidth: "100%",
          height: "auto",
          display: "block"
        }}
        className={clsx(
          "rounded-md transition-all duration-150",
          selected ? "ring-2 ring-schemesPrimary shadow-lg" : "",
          isResizing ? "transition-none" : ""
        )}
        draggable={false}
      />

      {selected && (
        <>
          {/* Delete button */}
          <button
            type="button"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-schemesError text-schemesOnError shadow-md hover:bg-schemesError/90 transition-colors focus:outline-none focus:ring-2 focus:ring-schemesError focus:ring-offset-1"
            onClick={(e) => {
              e.stopPropagation();
              deleteNode?.();
            }}
            aria-label="Delete image"
          >
            <XIcon size={14} className="mx-auto" />
          </button>

          {/* Resize handle */}
          <div
            className={clsx(
              "absolute -bottom-2 -right-2 w-4 h-4 bg-schemesPrimaryContainer border-2 border-schemesPrimary rounded-sm shadow cursor-se-resize",
              "hover:bg-schemesPrimary hover:scale-110 transition-all duration-150",
              isResizing ? "bg-schemesPrimary scale-110" : ""
            )}
            onMouseDown={handleMouseDown}
            aria-label="Resize image"
            title="Drag to resize image"
          />

          {/* Size indicator */}
          {(width || imageRef.current) && (
            <div className="absolute -bottom-8 left-0 bg-black/75 text-white px-2 py-1 rounded text-xs font-medium">
              {Math.round(width || imageRef.current?.getBoundingClientRect()?.width || 0)}px
            </div>
          )}
        </>
      )}
    </NodeViewWrapper>
  );
};

export const RichTextField = ({
  label = "Content",
  value,
  onChange,
  onUpload,
  required = false,
  error = "",
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: true,
        codeBlock: true,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-schemesPrimary underline hover:text-schemesPrimary/80'
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.extend({
        addNodeView() {
          return ReactNodeViewRenderer(ResizableImage);
        },
      }),
    ],
    content: value || "",
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange?.({ target: { value: editor.getHTML() } });
    },
  });

  // Update content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [editor, value]);

  const exec = useCallback(
    (command, attrs) => {
      if (!editor || disabled) return;
      editor.chain().focus()[command](attrs).run();
    },
    [editor, disabled]
  );

  const addLink = useCallback(() => {
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
      exec("setLink", { href: urlObj.href });
    } catch {
      alert("Invalid URL. Please enter a valid web address.");
    }
  }, [editor, disabled, exec]);

  const insertImage = useCallback(async () => {
    if (!editor || disabled) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = false;

    input.onchange = async (e) => {
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
        reader.onload = (e) => {
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
  const isActive = useCallback((format, attrs) => {
    if (!editor) return false;
    return editor.isActive(format, attrs);
  }, [editor]);

  const Btn = ({ title, onClick, children, disabled: btnDisabled, format, attrs }) => {
    const active = format ? isActive(format, attrs) : false;

    return (
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        disabled={disabled || btnDisabled}
        title={title}
        className={clsx(
          "px-2 py-1.5 rounded-md border Blueprint-label-medium transition-all duration-150",
          "focus:outline-none focus:ring-2 focus:ring-schemesPrimaryContainer",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          active
            ? "border-schemesPrimary bg-schemesPrimary text-schemesOnPrimary shadow-sm"
            : "border-schemesOutlineVariant text-schemesOnSurfaceVariant hover:text-schemesOnSurface hover:bg-surfaceContainerHigh hover:border-schemesOutline"
        )}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="w-full">
      <div className={clsx(
        "relative w-full rounded-lg border bg-schemesSurfaceContainerLow transition-colors",
        error ? "border-schemesError" : "border-schemesOutline",
        disabled ? "opacity-60 cursor-not-allowed" : ""
      )}>
        {/* Label */}
        <span className="absolute left-4 -top-3 px-2 Blueprint-label-medium bg-schemesPrimaryFixed text-schemesOnSurfaceVariant rounded-sm shadow-sm">
          {label}
          {required ? <span className="text-schemesError ml-1">*</span> : ""}
        </span>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 px-3 pt-6 pb-2 border-b border-schemesOutlineVariant">
          <Btn
            title="Bold (Ctrl+B)"
            onClick={() => exec("toggleBold")}
            format="bold"
          >
            <TextBolderIcon size={18} />
          </Btn>
          <Btn
            title="Italic (Ctrl+I)"
            onClick={() => exec("toggleItalic")}
            format="italic"
          >
            <TextItalicIcon size={18} />
          </Btn>
          <Btn
            title="Underline (Ctrl+U)"
            onClick={() => exec("toggleUnderline")}
            format="underline"
          >
            <TextAUnderlineIcon size={18} />
          </Btn>

          <div className="w-px h-6 bg-schemesOutlineVariant mx-1" />

          <Btn
            title="Align left"
            onClick={() => exec("setTextAlign", "left")}
            format={{ textAlign: "left" }}
          >
            <AlignLeftIcon size={18} />
          </Btn>
          <Btn
            title="Align center"
            onClick={() => exec("setTextAlign", "center")}
            format={{ textAlign: "center" }}
          >
            <AlignCenterHorizontalIcon size={18} />
          </Btn>
          <Btn
            title="Align right"
            onClick={() => exec("setTextAlign", "right")}
            format={{ textAlign: "right" }}
          >
            <AlignRightIcon size={18} />
          </Btn>

          <div className="w-px h-6 bg-schemesOutlineVariant mx-1" />

          <Btn
            title="Bulleted list"
            onClick={() => exec("toggleBulletList")}
            format="bulletList"
          >
            <ListIcon size={18} />
          </Btn>
          <Btn
            title="Numbered list"
            onClick={() => exec("toggleOrderedList")}
            format="orderedList"
          >
            <ListNumbersIcon size={18} />
          </Btn>

          <div className="w-px h-6 bg-schemesOutlineVariant mx-1" />

          <Btn
            title="Quote"
            onClick={() => exec("toggleBlockquote")}
            format="blockquote"
          >
            <QuotesIcon size={18} />
          </Btn>
          <Btn
            title="Code block"
            onClick={() => exec("toggleCodeBlock")}
            format="codeBlock"
          >
            <CodeIcon size={18} />
          </Btn>
          <Btn
            title="Insert/Edit link"
            onClick={addLink}
            format="link"
          >
            <LinkIcon size={18} />
          </Btn>

          <div className="w-px h-6 bg-schemesOutlineVariant mx-1" />

          <Btn
            title="Insert image"
            onClick={insertImage}
            disabled={uploading}
          >
            {uploading ? (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">Uploading</span>
              </div>
            ) : (
              <ImageSquareIcon size={18} />
            )}
          </Btn>
        </div>

        {/* Editor */}
        <div
          className={clsx(
            "cursor-text transition-colors",
            disabled ? "cursor-not-allowed" : ""
          )}
          onClick={() => !disabled && editor?.chain().focus().run()}
        >
          <EditorContent
            editor={editor}
            className={clsx(
              "tiptap min-h-[300px] px-4 py-3 outline-none Blueprint-body-medium text-schemesOnSurface",
              "[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[280px]",
              "[&_blockquote]:border-l-4 [&_blockquote]:border-schemesOutline [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-schemesOnSurfaceVariant",
              "[&_pre]:bg-surfaceContainerHigh [&_pre]:p-4 [&_pre]:rounded [&_pre]:font-mono [&_pre]:text-sm [&_pre]:overflow-x-auto",
              "[&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1",
              "[&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-1"
            )}
          />
        </div>

        {/* Placeholder */}
        {editor && editor.isEmpty && (
          <div className="absolute top-[76px] left-4 text-schemesOnSurfaceVariant Blueprint-body-medium pointer-events-none">
            Start writing your story...
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 ml-1 Blueprint-body-small text-schemesError" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};