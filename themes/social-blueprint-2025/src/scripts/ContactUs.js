import React, { useEffect, useState, useRef } from "react";
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
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const cf7Ref = useRef(null);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    // Clear error for this field when user starts typing
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleToggle = (key) => () => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    // Australian phone number format - supports various formats
    // Examples: 0412345678, 04 1234 5678, (03) 9123 4567, +61 3 9123 4567
    const cleaned = phone.replace(/[\s()-]/g, '');
    const re = /^(?:\+?61)?[2-478](?:[ -]?[0-9]){8}$/;
    return re.test(cleaned) || /^04\d{8}$/.test(cleaned);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = "Please enter a valid Australian phone number";
    }
    if (!form.topic.trim()) {
      newErrors.topic = "Topic is required";
    }
    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    }
    if (!form.agreed) {
      newErrors.agreed = "You must agree to the terms to submit";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Find CF7 form on mount
  useEffect(() => {
    const findForm = () => {
      const root = document.getElementById("cf7-proxy");
      if (root) {
        const form = root.querySelector("form.wpcf7-form");
        if (form) {
          cf7Ref.current = form;
        }
      }
    };

    findForm();
    const timeout = setTimeout(findForm, 500);
    return () => clearTimeout(timeout);
  }, []);

  // Set up event listeners
  useEffect(() => {
    const cf7 = cf7Ref.current;
    if (!cf7) return;

    const onOk = () => {
      setSubmitting(false);
      setSent(true);
      setError(false);
    };
    const onFail = () => {
      setSubmitting(false);
      setError(true);
    };

    cf7.addEventListener("wpcf7mailsent", onOk);
    cf7.addEventListener("wpcf7mailfailed", onFail);
    cf7.addEventListener("wpcf7invalid", onFail);
    cf7.addEventListener("wpcf7spam", onFail);

    return () => {
      cf7.removeEventListener("wpcf7mailsent", onOk);
      cf7.removeEventListener("wpcf7mailfailed", onFail);
      cf7.removeEventListener("wpcf7invalid", onFail);
      cf7.removeEventListener("wpcf7spam", onFail);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    const cf7 = cf7Ref.current;
    if (!cf7) {
      setError(true);
      return;
    }

    setSubmitting(true);
    setError(false);

    // Helper to set field value
    const setVal = (name, value) => {
      const el = cf7.querySelector(`[name="${name}"]`);
      if (!el) return;
      el.value = value;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    };

    // Map form data to CF7 fields
    const fullName = [form.firstName, form.lastName].filter(Boolean).join(" ");
    setVal("your-name", fullName);
    setVal("your-phone", form.phone);
    setVal("your-email", form.email);
    setVal("your-subject", form.topic);
    setVal("your-message", form.message);

    // Trigger CF7 submission
    try {
      if (cf7.requestSubmit) {
        cf7.requestSubmit();
      } else {
        cf7.submit();
      }
    } catch (err) {
      setSubmitting(false);
      setError(true);
    }
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      topic: "",
      message: "",
      agreed: false,
    });
    setErrors({});
    setSent(false);
    setError(false);
  };

  if (sent) {
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

        <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
          <div className="bg-schemesPrimaryContainer rounded-3xl p-8 md:p-12 lg:p-16 text-center max-w-2xl mx-auto">
            <div className="bg-schemesPrimary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="Blueprint-headline-large-emphasized text-schemesOnSurface mb-4">
              Thanks for reaching out!
            </h2>
            <p className="Blueprint-body-large text-schemesOnSurface mb-8">
              We've received your message and will get back to you as soon as possible. Usually within 1-2 business days.
            </p>
            <Button
              label="Send another message"
              size="lg"
              style="tonal"
              onClick={resetForm}
            />
          </div>
        </section>
      </div>
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
                Use the form below and we'll get back to you as soon as we can.
              </p>
            </header>

            {error && (
              <div className="bg-schemesErrorContainer text-schemesOnErrorContainer p-4 rounded-2xl">
                <p className="Blueprint-body-medium">
                  Something went wrong. Please try again in a few minutes.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="First name"
                  value={form.firstName}
                  onChange={handleChange("firstName")}
                  style="outlined"
                  error={errors.firstName}
                  required
                />
                <TextField
                  label="Last name"
                  value={form.lastName}
                  onChange={handleChange("lastName")}
                  style="outlined"
                  error={errors.lastName}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Email"
                  value={form.email}
                  onChange={handleChange("email")}
                  style="outlined"
                  error={errors.email}
                  type="email"
                  required
                />
                <TextField
                  label="Phone number"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  style="outlined"
                  error={errors.phone}
                  type="tel"
                  required
                />
              </div>

              <TextField
                label="Topic"
                value={form.topic}
                onChange={handleChange("topic")}
                style="outlined"
                error={errors.topic}
                required
              />
              <TextField
                label="Message"
                value={form.message}
                onChange={handleChange("message")}
                multiline
                style="outlined"
                error={errors.message}
                required
              />

              <div>
                <label className="flex items-start gap-3 Blueprint-body-medium text-schemesOnSurface">
                  <input
                    type="checkbox"
                    className="accent-schemesPrimary mt-1"
                    checked={form.agreed}
                    onChange={handleToggle("agreed")}
                  />
                  By submitting this form, you agree to provide accurate information and communicate respectfully. The Social Blueprint does not offer crisis or emergency support. Any personal details you share will be handled in line with our Privacy Policy and will not be sold or shared with third parties. We are not responsible for the outcomes of any interactions you may have with organisations listed on this site.
                </label>
                {errors.agreed && (
                  <p className="Blueprint-body-small text-schemesError mt-2">
                    {errors.agreed}
                  </p>
                )}
              </div>

              <Button
                label={submitting ? "Sending…" : "Send a message"}
                size="lg"
                style="filled"
                disabled={submitting}
                type="submit"
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