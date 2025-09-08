import React, { useMemo, useRef, useState } from "react";
import { TextField } from "./TextField";
import { RichTextField } from "./RichTextField";
import SelectField from "./SelectField";
import ImageDropField from "./ImageDropField";
import { Button } from "./Button";

export default function SubmitArticleForm({ restUrl, wpNonce, taxonomies = {} }) {
  const [acf, setAcf] = useState({ title: "", subtitle: "", article_content: "" });
  const [img, setImg] = useState(null);
  const [topics, setTopics] = useState([]);
  const [theme, setTheme] = useState("");
  const [audience, setAudience] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({}); // { title: '...', article_content: '...', theme: '...' }

  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const themeRef = useRef(null);

  const topicOptions = useMemo(() => Object.entries(taxonomies?.topic_tag || {}), [taxonomies]);
  const themeOptions = useMemo(() => Object.entries(taxonomies?.theme || {}), [taxonomies]);
  const audienceOptions = useMemo(() => Object.entries(taxonomies?.audience_tag || {}), [taxonomies]);

  const update = (k, v) => {
    setAcf((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" })); // clear error as user types
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
    if (!res.ok || !data?.source_url) throw new Error(data?.message || "Upload failed");
    return data.source_url;
  };

  const stripHtml = (html) => {
    const el = document.createElement("div");
    el.innerHTML = html || "";
    return (el.textContent || el.innerText || "").replace(/\u200B/g, "");
  };

  const focusField = (ref) => {
    const node = ref?.current?.querySelector('input, textarea, select, [contenteditable="true"]');
    if (node) {
      node.focus({ preventScroll: true });
      node.scrollIntoView({ behavior: "smooth", block: "center" });
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
      const first = order.find((k) => next[k]);
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
    if (!validate()) return;

    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("website", "");
      Object.entries(acf).forEach(([k, v]) => fd.append(`acf[${k}]`, v));
      topics.forEach((id) => fd.append("topic_tags[]", String(id)));
      if (theme) fd.append("theme", String(theme));
      if (audience) fd.append("audience_tag", String(audience));
      if (img) fd.append("acf_files[article_image]", img);

      const res = await fetch(restUrl, {
        method: "POST",
        headers: { "X-WP-Nonce": wpNonce },
        body: fd,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.message || "Submission failed");
      setSubmitted(true);
    } catch (err) {
      setMsg({ t: "error", m: err.message });
    } finally {
      setBusy(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-4 py-8 md:py-16 min-h-[50vwh]">
        <h1 className="Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large text-schemesOnSurface">
          Your article was successfully submitted
        </h1>
        <p className="Blueprint-body-medium text-schemesOnSurfaceVariant">
          Go to <a href="/account-listings" className="text-schemesPrimary underline">Account Listings</a> to view.
        </p>
      </div>
    );
  }

  console.log(errors)

  return (
    <div className="bg-schemesSurface">
      <form onSubmit={submit} className="max-w-[1000px] grid grid-cols-1 gap-8 w-full py-8 md:py-16 mx-auto" noValidate>
        <div className="flex flex-col gap-3">
          <h1 className="Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large text-schemesOnSurface text-center italic">Submit your story</h1>
          <p className="Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large text-schemesOnSurfaceVariant text-center mb-4 max-w-xl mx-auto">
            We’d love to hear from you. Share your journey, reflections, or insights with the Melbourne Jewish community. Please note: submissions are reviewed by our editorial team and not every story will be published.
          </p>
        </div>

        {msg && (
          <div role="status" aria-live="polite" className={msg.t === "success" ? "Blueprint-body-medium text-stateSuccess" : "Blueprint-body-medium text-stateError"}>
            {msg.m}
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
          />
        </div>

        {/* Subtitle (optional) */}
        <TextField
          label="Subtitle / Short Introduction"
          value={acf.subtitle}
          onChange={(e) => update("subtitle", e.target.value)}
          style="outlined"
          error={""}
        />

        {/* Content */}
        <div ref={contentRef}>
          <RichTextField
            label="Your Story"
            required
            value={acf.article_content}
            onChange={(e) => update("article_content", e.target.value)}
            onUpload={uploadInlineImage}
            error={errors.article_content || ""} // supported in our RTE; if not, message below is still helpful
          />
          {errors.article_content ? (
            <p className="Blueprint-body-small text-schemesError mt-1">{errors.article_content}</p>
          ) : null}
        </div>

        {/* Featured image (optional) */}
        <ImageDropField
          label="Upload an Image"
          value={null}
          onChange={(f) => setImg(f)}
          required={false}
          helpText="Landscape image (3:2 ratio, min 1200x800px). Best with no text overlays. Use tinypng to reduce size"
        />

        {/* Theme */}
        <div ref={themeRef}>
          <SelectField
            label="Theme"
            required
            value={theme}
            onChange={(e) => { setTheme(e.target.value); setErrors((er) => ({ ...er, theme: "" })); }}
            options={themeOptions}
            error={errors.theme || ""}
          />
          {errors.theme ? (
            <p className="Blueprint-body-small text-schemesError mt-1">{errors.theme}</p>
          ) : null}
        </div>

        {/* Topics */}
        <div className="flex flex-col gap-2">
          <label className="Blueprint-label-large text-schemesOnSurface">Topics</label>
          <div className="flex flex-wrap gap-2">
            {topicOptions.map(([id, name]) => {
              const checked = topics.includes(Number(id));
              return (
                <label key={id} className="flex items-center gap-2 bg-surfaceContainerHigh border border-schemesOutlineVariant rounded-lg px-3 py-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setTopics((prev) => checked ? prev.filter((x) => x !== Number(id)) : [...prev, Number(id)])
                    }
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
          error={""}
        />

        <Button type="submit" label={busy ? "Submitting..." : "Submit Story"} variant="filled" size="base" disabled={busy} />
      </form>
    </div>
  );
}
