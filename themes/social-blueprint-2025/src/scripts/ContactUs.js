import React, { useMemo, useEffect, useState } from "react";
import { TextField } from "./TextField";
import { Button } from "./Button";
import ContactUs from "../../assets/contact-us.svg";

export function ContactForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
    agreed: false,
  });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const handleToggle = (key) => () =>
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));

  const cf7 = useMemo(() => {
    const root = document.getElementById("cf7-proxy");
    return root ? root.querySelector("form.wpcf7-form") : null;
  }, []);

  useEffect(() => {
    if (!cf7) return;
    const onOk = () => {
      setSubmitting(false);
      setSent(true);
    };
    const onFail = () => setSubmitting(false);
    cf7.addEventListener("wpcf7mailsent", onOk);
    cf7.addEventListener("wpcf7mailfailed", onFail);
    cf7.addEventListener("wpcf7invalid", onFail);
    return () => {
      cf7.removeEventListener("wpcf7mailsent", onOk);
      cf7.removeEventListener("wpcf7mailfailed", onFail);
      cf7.removeEventListener("wpcf7invalid", onFail);
    };
  }, [cf7]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cf7) return;
    setSubmitting(true);

    const setVal = (name, value) => {
      const el = cf7.querySelector(`[name="${name}"]`);
      if (!el) return;
      el.value = value;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    };
    const fullName = [form.firstName, form.lastName].filter(Boolean).join(" ");
    setVal("your-name", fullName);
    setVal("your-phone", form.phone);
    setVal("your-email", form.email);
    setVal("your-subject", form.topic);
    setVal("your-message", form.message);

    if (cf7.requestSubmit) cf7.requestSubmit();
    else cf7.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  };

  if (sent) {
    return (
      <section className="bg-schemesPrimaryContainer text-schemesOnPrimaryContainer py-16 px-6 sm:px-12 lg:px-20 text-center rounded-3xl w-full">
        <h2 className="Blueprint-display-small-emphasized mb-4">
          Thanks for reaching out
        </h2>
        <p className="Blueprint-body-large">
          We’ll get back to you shortly.
        </p>
      </section>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-schemesSurfaceVariant">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 py-10 flex flex-row items-end justify-between gap-4">
          <h1 className="whitespace-nowrap Blueprint-display-small-emphasized md:Blueprint-display-medium-emphasized lg:Blueprint-display-large text-schemesOnSurface">
            Contact us
          </h1>
          <img
            src={ContactUs}
            alt="Contact us"
            className="block h-auto translate-y-4"
          />
        </div>
      </div>

      {/* Main section */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="md:col-span-2 flex flex-col gap-10"
          >
            <header className="space-y-3">
              <h2 className="Blueprint-headline-medium-emphasized lg:Blueprint-headline-large-emphasized text-schemesOnSurface">
                Send us a message
              </h2>
              <p className="Blueprint-body-large text-schemesOnSurfaceVariant">
                Use the form below and we’ll get back to you as soon as we can.
              </p>
            </header>

            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="First name"
                  value={form.firstName}
                  onChange={handleChange("firstName")}
                  style="outlined"
                />
                <TextField
                  label="Last name"
                  value={form.lastName}
                  onChange={handleChange("lastName")}
                  style="outlined"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Email"
                  value={form.email}
                  onChange={handleChange("email")}
                  style="outlined"
                />
                <TextField
                  label="Phone number"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  style="outlined"
                />
              </div>

              <TextField
                label="Topic"
                value={form.topic}
                onChange={handleChange("topic")}
                style="outlined"
              />
              <TextField
                label="Message"
                value={form.message}
                onChange={handleChange("message")}
                multiline
                style="outlined"
              />

              <label className="flex items-start gap-3 Blueprint-body-medium text-schemesOnSurface">
                <input
                  type="checkbox"
                  className="accent-schemesPrimary mt-1"
                  checked={form.agreed}
                  onChange={handleToggle("agreed")}
                />
                By submitting this form, you agree to provide accurate information and communicate respectfully. The Social Blueprint does not offer crisis or emergency support. Any personal details you share will be handled in line with our Privacy Policy and will not be sold or shared with third parties. We are not responsible for the outcomes of any interactions you may have with organisations listed on this site.
              </label>

              <Button
                label={submitting ? "Sending…" : "Send a message"}
                size="lg"
                style="filled"
                disabled={!form.agreed || submitting}
              />
            </div>
          </form>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">
            {[
              {
                title: "Medical Emergency · Hatzolah",
                desc: "24/7 volunteer-run Jewish medical response",
                items: ["(03) 9527 5111"],
              },
              {
                title: "Mental Health Support · Jewish Care",
                desc: "Free sessions for community members 16+",
                items: ["(03) 8517 5999", "Mon–Fri, 9am–5pm"],
              },
              {
                title: "Report Antisemitism · CSG",
                desc: "Emergency team available 24/7",
                items: ["1300 000 274", "via the Jeap App"],
                link: true,
              },
            ].map((box, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-schemesSurfaceContainer shadow-3x3"
              >
                <p className="Blueprint-title-large-emphasized text-schemesOnSurface mb-2">
                  {box.title}
                </p>
                <p className="Blueprint-body-large text-schemesOnSurfaceVariant mb-3">
                  {box.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {box.items.map((it, j) =>
                    box.link && j === 1 ? (
                      <a
                        key={j}
                        href="#"
                        className="Blueprint-label-large underline px-3 py-1 rounded-full bg-schemesSurfaceVariant text-schemesOnSurface"
                      >
                        {it}
                      </a>
                    ) : (
                      <span
                        key={j}
                        className="Blueprint-body-large-emphasized px-3 py-1 rounded-full bg-schemesSurfaceVariant text-schemesOnSurface"
                      >
                        {it}
                      </span>
                    )
                  )}
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </div>
  );
}
