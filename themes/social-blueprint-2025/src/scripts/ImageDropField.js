import React, { useEffect, useId, useMemo, useRef, useState, useCallback } from "react";
import clsx from "clsx";

export default function ImageDropField({
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
  error = "",
}) {
  const id = useId();
  const inputRef = useRef(null);
  const dragCounterRef = useRef(0);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [internalError, setInternalError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const finalError = error || internalError;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const currentPreview = useMemo(() => {
    if (preview) return preview;
    if (typeof value === "string") return value;
    return "";
  }, [preview, value]);

  // Cleanup preview URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const validateFile = useCallback((f) => {
    if (!f) return { valid: false, error: "No file selected" };

    // File type validation
    if (!f.type.startsWith('image/')) {
      return { valid: false, error: "Please select an image file" };
    }

    // File size validation
    if (f.size > MAX_FILE_SIZE) {
      const sizeMB = (f.size / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        error: `File too large (${sizeMB}MB). Maximum size is 10MB. Try compressing with TinyPNG.`
      };
    }

    return { valid: true };
  }, []);

  const validateAndSet = useCallback((f) => {
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

  const clearFile = useCallback(() => {
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

  const pick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  // Fixed drag event handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    dragCounterRef.current++;

    if (e.dataTransfer?.types?.includes('Files')) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
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

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    // Set the drop effect
    e.dataTransfer.dropEffect = 'copy';
  }, [disabled]);

  const handleDrop = useCallback((e) => {
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

  const handleFileInputChange = useCallback((e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSet(selectedFile);
    }
  }, [validateAndSet]);

  const handleKeyDown = useCallback((e) => {
    if ((e.key === "Enter" || e.key === " ") && !disabled) {
      e.preventDefault();
      pick();
    }
  }, [disabled, pick]);

  const dropZoneClasses = clsx(
    "relative w-full rounded-xl border transition-all duration-200 ease-in-out",
    "bg-schemesSurfaceContainerLow min-h-[260px] md:min-h-[300px]",
    "flex items-center justify-center overflow-hidden",
    "focus-within:outline-none focus-within:ring-2 focus-within:ring-schemesPrimary focus-within:ring-offset-2",
    {
      // Normal state
      "border-schemesOutline cursor-pointer hover:bg-schemesSurfaceContainerHigh hover:border-schemesOutline": !disabled && !isDragOver && !finalError,

      // Drag over state
      "border-schemesPrimary bg-schemesPrimary/5 border-2 scale-[1.01] shadow-lg": !disabled && isDragOver,

      // Error state
      "border-schemesError bg-schemesError/5": finalError,

      // Disabled state
      "opacity-50 cursor-not-allowed bg-schemesOutlineVariant": disabled,

      // Processing state
      "pointer-events-none": isProcessing,
    }
  );

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-describedby={`${id}-hint`}
        aria-label={`${label}${required ? ' (required)' : ''} drop zone`}
        onClick={pick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={dropZoneClasses}
      >
        {/* Label overlay for empty state */}
        {!currentPreview && !isProcessing && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-md Blueprint-label-large bg-schemesPrimaryFixed text-schemesOnSurfaceVariant shadow-sm z-10">
            {label}{required ? " *" : ""}
          </span>
        )}

        {/* Processing state */}
        {isProcessing && (
          <div className="px-6 text-center">
            <div className="mx-auto w-8 h-8 mb-4">
              <div className="w-full h-full border-3 border-schemesPrimary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="Blueprint-body-medium text-schemesOnSurface">
              Processing image...
            </div>
          </div>
        )}

        {/* Empty state */}
        {!currentPreview && !isProcessing && (
          <div className="px-6 text-center pointer-events-none">
            <div className="mx-auto w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-schemesPrimaryContainer/20">
              <svg
                className="w-6 h-6 text-schemesPrimary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            <div className="Blueprint-title-small-emphasized text-schemesOnSurface mb-2">
              {isDragOver ? 'Drop your image here' : 'Featured Image / Article Image'}
            </div>
            <div className="Blueprint-body-small text-schemesOnSurfaceVariant">
              {isDragOver ? 'Release to upload' : 'Click to select or drag & drop'}
            </div>
          </div>
        )}

        {/* Preview state */}
        {currentPreview && !isProcessing && (
          <>
            <img
              src={currentPreview}
              alt="Preview"
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              disabled={disabled}
              className="absolute top-3 right-3 bg-schemesError text-schemesOnError rounded-lg py-2 px-3 shadow-md hover:bg-schemesError/90 transition-colors focus:outline-none focus:ring-2 focus:ring-schemesError focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Remove image"
            >
              ✕
            </button>
            {file && (
              <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-md Blueprint-body-small">
                {file.name} ({(file.size / (1024 * 1024)).toFixed(1)}MB)
              </div>
            )}
          </>
        )}

        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          required={required && !file && !value}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="sr-only"
        />
      </div>

      {/* Help text */}
      <div id={`${id}-hint`} className="mt-2 Blueprint-body-small text-schemesOnSurfaceVariant">
        {helpText}
      </div>

      {/* Error display */}
      {finalError && (
        <div className="mt-1 Blueprint-body-small text-schemesError" role="alert">
          {finalError}
        </div>
      )}
    </div>
  );
}