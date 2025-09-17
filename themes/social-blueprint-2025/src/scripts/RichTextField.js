import React, { useCallback, useState } from "react";
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

// Custom React node view for images
const ResizableImage = (props) => {
  const { node, updateAttributes, deleteNode, selected } = props;
  const { src, alt, width } = node.attrs;

  return (
    <NodeViewWrapper className="relative inline-block group">
      <img
        src={src}
        alt={alt}
        style={{ width: width || "auto", maxWidth: "100%", height: "auto" }}
        className={`rounded-md ${selected ? "ring-2 ring-schemesPrimary" : ""}`}
      />

      {selected && (
        <>
          {/* Delete button */}
          <button
            type="button"
            className="absolute -top-3 -right-3 rounded-full bg-schemesError text-schemesOnError p-1 shadow-md"
            onClick={() => deleteNode?.()}
          >
            <XIcon size={14} />
          </button>

          {/* Resize handle */}
          <div
            role="slider"
            aria-label="Resize image"
            className="absolute -bottom-2 -right-2 w-4 h-4 bg-schemesPrimaryContainer rounded-sm cursor-se-resize shadow"
            draggable
            onDrag={(e) => {
              if (!e.clientX) return;
              const newWidth = Math.max(60, e.clientX - e.target.getBoundingClientRect().left);
              updateAttributes({ width: newWidth });
            }}
          />
        </>
      )}
    </NodeViewWrapper>
  );
};

export const RichTextField = ({
  label = "Content",
  value,
  onChange,
  required = false,
  error = "",
}) => {
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: true,
        codeBlock: true,
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image.extend({
        addNodeView() {
          return ReactNodeViewRenderer(ResizableImage);
        },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange?.({ target: { value: editor.getHTML() } });
    },
  });

  const exec = useCallback(
    (command, attrs) => {
      if (!editor) return;
      editor.chain().focus()[command](attrs).run();
    },
    [editor]
  );

  const addLink = () => {
    if (!editor) return;
    let url = window.prompt("Enter URL (https://…)");
    if (!url) return;

    try {
      if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
      }
      const u = new URL(url);
      if (!/^https?:$/.test(u.protocol)) return;
      exec("setLink", { href: u.href });
    } catch {
      alert("Invalid URL");
    }
  };

  const insertImage = async () => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target.result;
          editor.chain().focus().setImage({ src: dataUrl }).run();
        };
        reader.readAsDataURL(file);
      } catch {
        alert("Could not load image");
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  const Btn = ({ title, onClick, children, disabled }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={clsx(
        "px-2 py-1.5 rounded-md border Blueprint-label-medium transition",
        "border-schemesOutlineVariant text-schemesOnSurfaceVariant hover:text-schemesOnSurface hover:bg-surfaceContainerHigh",
        "focus:outline-none focus:ring-2 focus:ring-schemesPrimaryContainer disabled:opacity-50"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full">
      <div className="relative w-full rounded-lg border border-schemesOutline bg-schemesSurfaceContainerLow">
        {/* Label */}
        <span className="absolute left-4 -top-3 px-1 Blueprint-label-medium bg-schemesPrimaryFixed rounded-sm">
          {label}
          {required ? " *" : ""}
        </span>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 px-3 pt-6 pb-2 border-b border-schemesOutlineVariant">
          <Btn title="Bold" onClick={() => exec("toggleBold")}>
            <TextBolderIcon size={18} />
          </Btn>
          <Btn title="Italic" onClick={() => exec("toggleItalic")}>
            <TextItalicIcon size={18} />
          </Btn>
          <Btn title="Underline" onClick={() => exec("toggleUnderline")}>
            <TextAUnderlineIcon size={18} />
          </Btn>

          <div className="w-px h-6 bg-schemesOutlineVariant mx-1" />

          <Btn title="Align left" onClick={() => exec("setTextAlign", "left")}>
            <AlignLeftIcon size={18} />
          </Btn>
          <Btn title="Align center" onClick={() => exec("setTextAlign", "center")}>
            <AlignCenterHorizontalIcon size={18} />
          </Btn>
          <Btn title="Align right" onClick={() => exec("setTextAlign", "right")}>
            <AlignRightIcon size={18} />
          </Btn>

          <div className="w-px h-6 bg-schemesOutlineVariant mx-1" />

          <Btn title="Bulleted list" onClick={() => exec("toggleBulletList")}>
            <ListIcon size={18} />
          </Btn>
          <Btn title="Numbered list" onClick={() => exec("toggleOrderedList")}>
            <ListNumbersIcon size={18} />
          </Btn>

          <div className="w-px h-6 bg-schemesOutlineVariant mx-1" />

          <Btn title="Quote" onClick={() => exec("toggleBlockquote")}>
            <QuotesIcon size={18} />
          </Btn>
          <Btn title="Code block" onClick={() => exec("toggleCodeBlock")}>
            <CodeIcon size={18} />
          </Btn>
          <Btn title="Insert link" onClick={addLink}>
            <LinkIcon size={18} />
          </Btn>

          <div className="w-px h-6 bg-schemesOutlineVariant mx-1" />

          <Btn title="Insert image" onClick={insertImage} disabled={uploading}>
            {uploading ? (
              <span className="text-xs font-semibold px-1">Uploading…</span>
            ) : (
              <ImageSquareIcon size={18} />
            )}
          </Btn>
        </div>

        {/* Editor */}
        <div
          className="cursor-text"
          onClick={() => editor?.chain().focus().run()}
        >
          <EditorContent
            editor={editor}
            className="tiptap min-h-[300px] px-3 py-3 outline-none Blueprint-body-medium text-schemesOnSurface"
          />
        </div>
      </div>

      {error ? (
        <p className="mt-1 ml-1 Blueprint-body-small text-schemesError">{error}</p>
      ) : null}
    </div>
  );
};
