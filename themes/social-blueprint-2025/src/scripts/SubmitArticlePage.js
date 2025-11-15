import React, { useMemo, useRef, useState } from "react";
import { TextField } from "./TextField";
import { RichTextField } from "./RichTextField";
import SelectField from "./SelectField";
import ImageDropField from "./ImageDropField";
import { Button } from "./Button";

export default function SubmitArticleForm({ restUrl, wpNonce, taxonomies = {} }) {
  console.log(taxonomies)
  const [acf, setAcf] = useState({ title: "", subtitle: "", article_content: "" });
  const [img, setImg] = useState(null);
  const [topics, setTopics] = useState([]);
  const [theme, setTheme] = useState("");
  const [audience, setAudience] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(null);

  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const themeRef = useRef(null);

  const topicOptions = useMemo(() =>
    (taxonomies?.topic_tag || []).map(t => [t.id, t.name]),
    [taxonomies]
  );
  const themeOptions = useMemo(() =>
    (taxonomies?.theme || []).map(t => [t.id, t.name]),
    [taxonomies]
  );
  const audienceOptions = useMemo(() =>
    (taxonomies?.audience_tag || []).map(t => [t.id, t.name]),
    [taxonomies]
  );

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_INLINE_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB for inline images

  const update = (k, v) => {
    setAcf((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validateImageFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!file) return { valid: true };

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

    return { valid: true };
  };

  const resizeImage = (file, maxWidth = 1920, maxHeight = 1280, quality = 0.9) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        try {
          let { width, height } = img;

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

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to resize image'));
                return;
              }

              // Create a new file with the original name but resized content
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });

              resolve(resizedFile);
            },
            file.type,
            quality
          );
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

  const processInlineImages = async (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const imgs = Array.from(div.querySelectorAll("img[src^='data:']"));

    let processedCount = 0;
    const totalImages = imgs.length;

    if (totalImages > 0) {
      setUploadProgress({ current: 0, total: totalImages, status: 'Processing inline images...' });
    }

    for (const img of imgs) {
      try {
        const res = await fetch(img.src);
        const blob = await res.blob();

        // Check inline image size
        if (blob.size > MAX_INLINE_IMAGE_SIZE) {
          throw new Error(`Inline image is too large (${(blob.size / (1024 * 1024)).toFixed(1)}MB). Please use images smaller than 5MB.`);
        }

        const file = new File([blob], "inline-image.png", { type: blob.type });

        // Resize inline image if it's too large
        const processedFile = blob.size > 1024 * 1024 ? await resizeImage(file, 1200, 800, 0.8) : file;

        const url = await uploadInlineImage(processedFile);
        img.src = url;

        processedCount++;
        setUploadProgress({ current: processedCount, total: totalImages, status: `Processed ${processedCount}/${totalImages} images` });
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

  const uploadInlineImage = async (file) => {
    const fd = new FormData();
    fd.append("file", file, file.name);

    const res = await fetch("/wp-json/wp/v2/media", {
      method: "POST",
      headers: { "X-WP-Nonce": wpNonce },
      body: fd,
      credentials: "include",
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

  const stripHtml = (html) => {
    const el = document.createElement("div");
    el.innerHTML = html || "";
    return (el.textContent || el.innerText || "").replace(/\u200B/g, "").trim();
  };

  const focusField = (ref) => {
    const node = ref?.current?.querySelector('input, textarea, select, [contenteditable="true"]');
    if (node) {
      node.focus({ preventScroll: true });
      setTimeout(() => {
        node.scrollIntoView({ behavior: "smooth", block: "center" });
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
      const first = order.find((k) => nextErrors[k]);

      if (first === "title") focusField(titleRef);
      else if (first === "article_content") focusField(contentRef);
      else if (first === "theme") focusField(themeRef);

      return false;
    }

    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setUploadProgress(null);

    if (!validate()) return;

    setBusy(true);

    try {
      setUploadProgress({ current: 0, total: 100, status: 'Preparing submission...' });

      // Process inline images first
      let processedContent = acf.article_content;
      if (acf.article_content.includes('data:image/')) {
        processedContent = await processInlineImages(acf.article_content);
      }

      setUploadProgress({ current: 50, total: 100, status: 'Processing main image...' });

      // Process main image if needed
      let finalImage = img;
      if (img && img.size > 2 * 1024 * 1024) { // Resize if larger than 2MB
        try {
          finalImage = await resizeImage(img);
        } catch (resizeError) {
          console.warn('Image resize failed, using original:', resizeError);
          finalImage = img; // Fall back to original if resize fails
        }
      }

      setUploadProgress({ current: 75, total: 100, status: 'Submitting article...' });

      const fd = new FormData();
      fd.append("website", ""); // Honeypot

      // Add ACF data
      Object.entries(acf).forEach(([k, v]) =>
        fd.append(`acf[${k}]`, k === "article_content" ? processedContent : v)
      );

      // Add taxonomies
      topics.forEach((id) => fd.append("topic_tags[]", String(id)));
      if (theme) fd.append("theme", String(theme));
      if (audience) fd.append("audience_tag", String(audience));

      // Add image
      if (finalImage) fd.append("acf_files[article_image]", finalImage);

      const res = await fetch(restUrl, {
        method: "POST",
        headers: { "X-WP-Nonce": wpNonce },
        body: fd,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data?.message || `Submission failed (${res.status})`;
        throw new Error(errorMessage);
      }

      if (!data?.ok) {
        throw new Error(data?.message || "Submission failed - please try again");
      }

      setUploadProgress({ current: 100, total: 100, status: 'Success!' });
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

  const handleImageChange = (file) => {
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setErrors((e) => ({ ...e, image: validation.error }));
        return;
      }
    }
    setImg(file);
    setErrors((e) => ({ ...e, image: "" }));
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-4 py-8 md:py-16 min-h-[50vh]">
        <h1 className="Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large text-schemesOnSurface">
          Your article was successfully submitted
        </h1>
        <p className="Blueprint-body-medium text-schemesOnSurfaceVariant">
          Thank you for your submission! Your article is now pending review by our editorial team.
        </p>
        <p className="Blueprint-body-medium text-schemesOnSurfaceVariant">
          Go to <a href="/account-listings" className="text-schemesPrimary underline hover:text-schemesPrimary/80 transition-colors">Account Listings</a> to view your submissions.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-schemesSurface px-4 lg:px-0">
      <form onSubmit={submit} className="max-w-[1000px] grid grid-cols-1 gap-8 w-full py-8 md:py-16 mx-auto" noValidate>
        <div className="flex flex-col gap-3">
          <h1 className="Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large text-schemesOnSurface text-center italic">
            Submit your story
          </h1>
          <p className="Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large text-schemesOnSurfaceVariant text-center mb-4 max-w-xl mx-auto">
            We'd love to hear from you. Share your journey, reflections, or insights with the Melbourne Jewish community.
            Please note: submissions are reviewed by our editorial team and not every story will be published.
          </p>
        </div>

        {/* Progress indicator */}
        {uploadProgress && (
          <div className="bg-surfaceContainerHigh rounded-lg p-4 border border-schemesOutlineVariant">
            <div className="flex items-center justify-between mb-2">
              <span className="Blueprint-body-medium text-schemesOnSurface">{uploadProgress.status}</span>
              <span className="Blueprint-body-small text-schemesOnSurfaceVariant">
                {uploadProgress.current}/{uploadProgress.total}
              </span>
            </div>
            <div className="w-full bg-schemesOutlineVariant rounded-full h-2">
              <div
                className="bg-schemesPrimary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Error/Success Messages */}
        {msg && (
          <div
            role="alert"
            aria-live="assertive"
            className={`p-4 rounded-lg border ${msg.t === "success"
              ? "bg-stateSuccess/10 border-stateSuccess text-stateSuccess"
              : "bg-stateError/10 border-stateError text-stateError"
              }`}
          >
            <div className="Blueprint-body-medium">{msg.m}</div>
          </div>
        )}

        {/* Title */}
        <div ref={titleRef}>
          <TextField
            label="Story Title"
            required
            value={acf.title}
            onChange={(e) => update("title", e.target.value)}
            style="outlined"
            error={errors.title || ""}
            disabled={busy}
          />
        </div>

        {/* Subtitle (optional) */}
        <TextField
          label="Subtitle / Short Introduction"
          value={acf.subtitle}
          onChange={(e) => update("subtitle", e.target.value)}
          style="outlined"
          error=""
          disabled={busy}
        />

        {/* Content */}
        <div ref={contentRef}>
          <RichTextField
            label="Your Story"
            required
            value={acf.article_content}
            onChange={(e) => update("article_content", e.target.value)}
            onUpload={uploadInlineImage}
            error={errors.article_content || ""}
            disabled={busy}
          />
          {errors.article_content && (
            <p className="Blueprint-body-small text-schemesError mt-1">{errors.article_content}</p>
          )}
        </div>

        {/* Featured image (optional) */}
        <div>
          <ImageDropField
            label="Upload an Image"
            value={null}
            onChange={handleImageChange}
            required={false}
            helpText="Landscape image (3:2 ratio, min 1200x800px, max 10MB). Best with no text overlays. Large images will be automatically resized."
            disabled={busy}
          />
          {errors.image && (
            <p className="Blueprint-body-small text-schemesError mt-1">{errors.image}</p>
          )}
          {img && (
            <p className="Blueprint-body-small text-schemesOnSurfaceVariant mt-1">
              Selected: {img.name} ({(img.size / (1024 * 1024)).toFixed(1)}MB)
            </p>
          )}
        </div>

        {/* Theme */}
        <div ref={themeRef}>
          <SelectField
            label="Theme"
            required
            value={theme}
            onChange={(e) => {
              setTheme(e.target.value);
              setErrors((er) => ({ ...er, theme: "" }));
            }}
            options={themeOptions}
            error={errors.theme || ""}
            disabled={busy}
          />
          {errors.theme && (
            <p className="Blueprint-body-small text-schemesError mt-1">{errors.theme}</p>
          )}
        </div>

        {/* Topics */}
        <div className="flex flex-col gap-2">
          <label className="Blueprint-label-large text-schemesOnSurface">Topics</label>
          <div className="flex flex-wrap gap-2">
            {topicOptions.map(([id, name]) => {
              const checked = topics.includes(Number(id));
              return (
                <label
                  key={id}
                  className={`flex items-center gap-2 bg-surfaceContainerHigh border border-schemesOutlineVariant rounded-lg px-3 py-2 cursor-pointer select-none transition-colors ${busy ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surfaceContainerHighest'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={busy}
                    onChange={() => {
                      if (busy) return;
                      setTopics((prev) =>
                        checked
                          ? prev.filter((x) => x !== Number(id))
                          : [...prev, Number(id)]
                      );
                    }}
                  />
                  <span className="Blueprint-body-medium text-schemesOnSurface">{name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Audience (optional) */}
        <SelectField
          label="Audience"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          options={audienceOptions}
          error=""
          disabled={busy}
        />

        <Button
          type="submit"
          label={busy ? "Submitting..." : "Submit Story"}
          variant="filled"
          size="base"
          disabled={busy || Object.keys(errors).some(key => errors[key])}
        />
      </form>
    </div>
  );
}