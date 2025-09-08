import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import clsx from "clsx";

export default function ImageDropField({
  label = "Upload an Image",
  value = null,
  onChange,
  accept = "image/*",
  required = false,
  helpText = "Landscape image (3:2 ratio, min 1200x800px). Best with no text overlays. Use tinypng to reduce size",
  minW = 1200,
  minH = 800,
  aspect = 3 / 2,
  aspectTolerance = 0.08,
}) {
  const id = useId();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState("");

  const currentPreview = useMemo(() => {
    if (preview) return preview;
    if (typeof value === "string") return value;
    return "";
  }, [preview, value]);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const validateAndSet = (f) => {
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

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) validateAndSet(f);
  };

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        aria-describedby={`${id}-hint`}
        onClick={pick}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && pick()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={clsx(
          "relative w-full rounded-xl border transition-colors",
          drag ? "border-schemesPrimaryContainer" : "border-schemesOutline",
          error ? "border-schemesError" : "",
          "bg-schemesSurfaceContainerLow min-h-[260px] md:min-h-[300px] flex items-center justify-center overflow-hidden"
        )}
      >
        {!currentPreview && (<span className="absolute top-3 left-3 px-3 py-1 rounded-md Blueprint-label-large bg-schemesPrimaryFixed text-schemesOnSurfaceVariant shadow-sm">
          {label}{required ? " *" : ""}
        </span>
        )}

        {!currentPreview && (
          <div className="px-6 text-center pointer-events-none">
            <div className="Blueprint-title-small-emphasized text-schemesOnSurface">
              Featured Image / Article Image
            </div>
            <div className="Blueprint-body-small text-schemesOnSurfaceVariant mt-1">
              Click to select or drag & drop
            </div>
          </div>
        )}

        {currentPreview && (
          <>
            <img
              src={currentPreview}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="absolute top-3 right-3 bg-schemesError text-schemesOnError rounded-lg py-2 px-3 shadow-md hover:bg-schemesErrorContainer hover:text-schemesOnErrorContainer transition"
              aria-label="Remove image"
            >
              ✕
            </button>
          </>
        )}

        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          required={required && !file && !value}
          onChange={(e) => validateAndSet(e.target.files?.[0] || null)}
          className="hidden"
        />
      </div>

      <div id={`${id}-hint`} className="mt-2 Blueprint-body-small text-schemesOnSurfaceVariant">
        {helpText}
      </div>
      {error && <div className="mt-1 Blueprint-body-small text-schemesError">{error}</div>}
    </div>
  );
}
