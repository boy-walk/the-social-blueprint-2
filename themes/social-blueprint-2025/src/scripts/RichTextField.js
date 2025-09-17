import React, { useCallback, useState, useRef } from "react";
import { EditorContent, useEditor, ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";

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
  ArrowCounterClockwiseIcon,
  ArrowClockwiseIcon,
  ImageSquareIcon,
  XIcon,
} from "@phosphor-icons/react";

/* --- Custom React Image Node --- */
const ResizableImage = (props) => {
  const { node, updateAttributes, deleteNode, selected } = props;
  const { src, alt, width, uploading } = node.attrs;
  const dragRef = useRef(null);

  const startResize = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = parseInt(width) || e.target.previousSibling.offsetWidth;

    const onMove = (moveEvt) => {
      const dx = moveEvt.clientX - startX;
      const newW = Math.max(60, startW + dx);
      updateAttributes({ width: newW });
    };

    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  };

  return (
    <NodeViewWrapper className="relative inline-block group">
      <img
        src={src}
        alt={alt}
        style={{ width: width || "auto", maxWidth: "100%", height: "auto" }}
        className={`rounded-md ${selected ? "ring-2 ring-schemesPrimary" : ""}`}
      />
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm rounded-md">
          Uploading…
        </div>
      )}
      {selected && (
        <>
          {/* Delete */}
          <button
            type="button"
            className="absolute -top-3 -right-3 rounded-full bg-schemesError text-schemesOnError p-1 shadow-md"
            onClick={() => deleteNode?.()}
          >
            <XIcon size={14} />
          </button>
          {/* Resize handle */}
          <div
            ref={dragRef}
            role="slider"
            aria-label="Resize image"
            className="absolute -bottom-2 -right-2 w-4 h-4 bg-schemesPrimaryContainer rounded-sm cursor-se-resize shadow"
            onPointerDown={startResize}
          />
        </>
      )}
    </NodeViewWrapper>
  );
};

/* --- Main Editor --- */
export const RichTextField = ({
  label = "Content",
  value,
  onChange,
  required = false,
}) => {
  const [uploadError, setUploadError] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ blockquote: true, codeBlock: true }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.extend({
        addNodeView() {
          return ReactNodeViewRenderer(ResizableImage);
        },
        addAttributes() {
          return {
            ...this.parent?.(),
            width: { default: null },
            uploading: { default: false },
          };
        },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange?.({ target: { value: editor.getHTML() } });
    },
  });

  /* Insert image as DataURL (upload later) */
  const insertImage = useCallback(async () => {
    try {
      const file = await new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = () => resolve(input.files[0]);
        input.click();
      });
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        editor
          .chain()
          .focus()
          .setImage({ src: reader.result, uploading: false })
          .run();
      };
      reader.readAsDataURL(file);
      setUploadError("");
    } catch (err) {
      setUploadError(err?.message || "Image selection failed.");
    }
  }, [editor]);

  /* Extract images for real upload on submit */
  const extractImages = useCallback(() => {
    if (!editor) return [];
    const json = editor.getJSON();
    const images = [];

    const traverse = (node) => {
      if (node.type === "image" && node.attrs.src?.startsWith("data:")) {
        images.push(node.attrs.src);
      }
      if (node.content) node.content.forEach(traverse);
    };

    traverse(json);
    return images;
  }, [editor]);

  if (!editor) return null;

  const Btn = ({ onClick, active, children, title }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={`px-2 py-1 rounded-md border transition ${active
        ? "bg-schemesPrimary text-white"
        : "border-schemesOutlineVariant text-schemesOnSurfaceVariant hover:text-schemesOnSurface"
        }`}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full">
      <span className="px-1 Blueprint-label-medium bg-schemesPrimaryFixed rounded-sm text-schemesOnSurface">
        {label}
        {required ? " *" : ""}
      </span>
      <div className="relative w-full rounded-lg border border-schemesOutline bg-schemesSurfaceContainerLow">
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-schemesOutlineVariant">
          <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
            <TextBolderIcon size={18} />
          </Btn>
          <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
            <TextItalicIcon size={18} />
          </Btn>
          <Btn
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline"
          >
            <TextAUnderlineIcon size={18} />
          </Btn>

          <Btn onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Align left">
            <AlignLeftIcon size={18} />
          </Btn>
          <Btn onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Align center">
            <AlignCenterHorizontalIcon size={18} />
          </Btn>
          <Btn onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Align right">
            <AlignRightIcon size={18} />
          </Btn>

          <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
            <ListIcon size={18} />
          </Btn>
          <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list">
            <ListNumbersIcon size={18} />
          </Btn>

          <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote">
            <QuotesIcon size={18} />
          </Btn>
          <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code">
            <CodeIcon size={18} />
          </Btn>

          <Btn
            onClick={() => {
              const url = window.prompt("Enter URL");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            active={editor.isActive("link")}
            title="Insert link"
          >
            <LinkIcon size={18} />
          </Btn>

          <Btn onClick={insertImage} title="Insert image">
            <ImageSquareIcon size={18} />
          </Btn>

          <Btn onClick={() => editor.chain().focus().undo().run()} title="Undo">
            <ArrowCounterClockwiseIcon size={18} />
          </Btn>
          <Btn onClick={() => editor.chain().focus().redo().run()} title="Redo">
            <ArrowClockwiseIcon size={18} />
          </Btn>
        </div>

        {/* Editor */}
        <div className="cursor-text" onClick={() => editor.chain().focus().run()}>
          <EditorContent
            editor={editor}
            className="tiptap min-h-[300px] px-3 py-3 Blueprint-body-medium text-schemesOnSurface"
          />
        </div>
      </div>

      {uploadError && (
        <p className="mt-1 ml-1 Blueprint-body-small text-schemesError">
          {uploadError}
        </p>
      )}

      {/* Example: expose extractImages */}
      {/* In parent form you can call editorRef.current.extractImages() */}
    </div>
  );
};
