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

  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileWidgetId, setTurnstileWidgetId] = useState(null);

  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (turnstile !== undefined) {
      const siteKey = document.getElementById('turnstile_site_key');
      if (siteKey === null) return;
      const widgetId = turnstile.render("#turnstile-container", {
        sitekey: siteKey.value,
        callback: function (token) {
          setTurnstileToken(token);
        },
        'expired-callback': function() {
          setTurnstileToken('');
        },
        'timeout-callback': function() {
          setTurnstileToken('');
        }
      });

      setTurnstileWidgetId(widgetId);
    }

  }, []);

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const handleToggle = (key) => () =>
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = [form.firstName, form.lastName].filter(Boolean).join(" ");

    const formId = document.getElementById('cf7_form_id');

    if (!formId) return;

    setSubmitting(true);

    const formDataRaw = {
      'your-name': fullName,
      'your-email': form.email,
      'your-phone': form.phone,
      'your-topic': form.topic,
      'your-message': form.message,
      '_wpcf7_unit_tag': formId.value,
      '_wpcf7_turnstile_response': turnstileToken
    };
    const formData = new FormData();

    for (const name in formDataRaw) {
      formData.append(name, formDataRaw[name]);
    }

    const res = await fetch('/wp-json/contact-form-7/v1/contact-forms/' + formId.value + '/feedback', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      console.log(data);

      // Response will be like this:
      // var response = {
      //   "contact_form_id": 39254,
      //   "status": "mail_sent",
      //   "message": "Thank you for your message. It has been sent.",
      //   "posted_data_hash": "f566d2051f627ed7984beac3920af97b",
      //   "into": "#39254",
      //   "invalid_fields": []
      // }

      setSent(true);
      if (turnstile !== undefined) {
        turnstile.reset(turnstileWidgetId);
      }
    } else {
      console.log('Error with request', data.message);
    }

    setSubmitting(false);
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

              <div id="turnstile-container"></div>

              <Button
                label={submitting ? "Sending…" : "Send a message"}
                size="lg"
                style="filled"
                type="submit"
                disabled={!form.agreed || submitting || turnstileToken == ''}
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
