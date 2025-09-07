import React, { useMemo, useEffect, useState } from 'react';
import { TextField } from './TextField';
import { Button } from './Button';
import ContactUs from "../../assets/contact-us.svg";

export function ContactForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    topic: '',
    message: '',
    agreed: false,
  });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleToggle = (key) => () =>
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));

  // Locate the hidden CF7 form once it exists in the DOM
  const cf7 = useMemo(() => {
    const root = document.getElementById('cf7-proxy');
    return root ? root.querySelector('form.wpcf7-form') : null;
  }, []);

  // Listen for CF7 events
  useEffect(() => {
    if (!cf7) return;
    const onOk = () => { setSubmitting(false); setSent(true); };
    const onFail = () => { setSubmitting(false); };
    cf7.addEventListener('wpcf7mailsent', onOk);
    cf7.addEventListener('wpcf7mailfailed', onFail);
    cf7.addEventListener('wpcf7invalid', onFail);
    return () => {
      cf7.removeEventListener('wpcf7mailsent', onOk);
      cf7.removeEventListener('wpcf7mailfailed', onFail);
      cf7.removeEventListener('wpcf7invalid', onFail);
    };
  }, [cf7]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cf7) return;

    setSubmitting(true);

    // Map your React state → CF7 input names
    const setVal = (name, value) => {
      const el = cf7.querySelector(`[name="${name}"]`);
      if (!el) return;
      if (el.tagName === 'SELECT') {
        el.value = value;
      } else {
        el.value = value;
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const fullName = [form.firstName, form.lastName].filter(Boolean).join(' ').trim();

    setVal('your-name', fullName);
    setVal('your-phone', form.phone);
    setVal('your-email', form.email);
    setVal('your-subject', form.topic);    // using your "Topic" as subject
    setVal('your-message', form.message);

    // Trigger CF7's AJAX submit
    if (cf7.requestSubmit) {
      cf7.requestSubmit();
    } else {
      cf7.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  };

  if (sent) {
    return (
      <section className="bg-schemesPrimaryContainer text-schemesOnPrimaryContainer py-12 px-4 sm:px-8 lg:px-16 text-center rounded-3xl w-full">
        <h2 className="Blueprint-headline-medium mb-4">Thanks for reaching out</h2>
        <p className="Blueprint-body-large sm:Blueprint-body-medium">We’ll get back to you shortly.</p>
      </section>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-schemesSurfaceVariant hidden md:block">
        <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-16 py-12 flex items-end justify-between">
          <div className="Blueprint-display-large text-schemesOnSurface">Contact us</div>
          <img src={ContactUs} alt="Contact us" className="translate-y-4" />
        </div>
      </div>

      <section className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <form onSubmit={handleSubmit} className="md:col-span-2 w-full flex flex-col gap-8">
            <header className="space-y-2">
              <h1 className="Blueprint-headline-large-emphasized text-schemesOnSurface">Send us a message</h1>
              <p className="Blueprint-body-large text-schemesOnSurfaceVariant">Use the form below and we'll get back to you as soon as we can.</p>
            </header>

            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="First name" placeholder="Input" value={form.firstName} onChange={handleChange('firstName')} style="outlined" />
                <TextField label="Last name" placeholder="Input" value={form.lastName} onChange={handleChange('lastName')} style="outlined" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="Email" placeholder="Input" value={form.email} onChange={handleChange('email')} style="outlined" />
                <TextField label="Phone number" placeholder="Input" value={form.phone} onChange={handleChange('phone')} style="outlined" />
              </div>

              <TextField label="Topic (Subject)" placeholder="Input" value={form.topic} onChange={handleChange('topic')} trailingIcon={<span className="text-base">▾</span>} style="outlined" />
              <TextField label="Message" placeholder="Type your message" value={form.message} onChange={handleChange('message')} multiline style="outlined" />

              <label className="flex items-start gap-3 Blueprint-body-medium text-schemesOnSurface">
                <input type="checkbox" className="accent-schemesPrimary mt-1" checked={form.agreed} onChange={handleToggle('agreed')} />
                I accept the terms
              </label>

              <div className="flex">
                <Button label={submitting ? "Sending…" : "Send a message"} size="base" style="filled" disabled={!form.agreed || submitting} />
              </div>
            </div>
          </form>

          <aside className="md:col-span-1 w-full flex flex-col gap-6 Blueprint-body-medium text-schemesOnSurfaceVariant">
            <div className="p-5 rounded-xl">
              <p className="Blueprint-title-large-emphasized text-schemesOnSurface mb-1">
                Medical Emergency · Hatzolah
              </p>
              <p className="Blueprint-body-large mb-2">24/7 volunteer-run Jewish medical response</p>
              <div className="inline-flex items-center gap-2 flex-wrap">
                <span className="Blueprint-body-large-emphasized inline-block px-3 py-1 rounded-full bg-schemesSurfaceVariant text-schemesOnSurface">
                  (03) 9527 5111
                </span>
              </div>
            </div>

            <div className="p-5 rounded-xl">
              <p className="Blueprint-title-large-emphasized text-schemesOnSurface mb-1">
                Mental Health Support · Jewish Care
              </p>
              <p className="Blueprint-body-large mb-2">Free sessions for community members 16+</p>
              <div className="inline-flex items-center gap-2 flex-wrap">
                <span className="Blueprint-body-large-emphasized inline-block px-3 py-1 rounded-full bg-schemesSurfaceVariant text-schemesOnSurface">
                  (03) 8517 5999
                </span>
                <span className="Blueprint-label-large inline-block px-3 py-1 rounded-full bg-schemesSurfaceVariant text-schemesOnSurface">
                  Mon–Fri, 9am–5pm
                </span>
              </div>
            </div>

            <div className="p-5 rounded-xl">
              <p className="Blueprint-title-large-emphasized text-schemesOnSurface mb-1">
                Report Antisemitism · CSG
              </p>
              <p className="Blueprint-body-large mb-2">Emergency team available 24/7</p>
              <div className="inline-flex items-center gap-2 flex-wrap">
                <span className="Blueprint-body-large-emphasized inline-block px-3 py-1 rounded-full bg-schemesSurfaceVariant text-schemesOnSurface">
                  1300 000 274
                </span>
                <a href="#" className="Blueprint-label-large inline-block px-3 py-1 rounded-full bg-schemesSurfaceVariant text-schemesOnSurface underline">
                  via the Jeap App
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
