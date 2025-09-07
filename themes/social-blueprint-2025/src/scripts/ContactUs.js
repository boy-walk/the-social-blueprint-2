import React, { useState } from 'react';
import { TextField } from './TextField';
import { Button } from './Button';

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

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleToggle = (key) => () =>
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full">
      <div className="bg-schemesSurfaceVariant hidden md:block">
        <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-16 py-12 flex items-end justify-between">
          <div className="Blueprint-display-large text-schemesOnSurface">Contact us</div>
          <div className="h-16 w-16 rounded-full bg-schemesPrimaryFixed opacity-20" />
        </div>
      </div>

      <section className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <form
            onSubmit={handleSubmit}
            className="md:col-span-2 w-full flex flex-col gap-8"
          >
            <header className="space-y-2">
              <h1 className="Blueprint-headline-large-emphasized text-schemesOnSurface">
                Send us a message
              </h1>
              <p className="Blueprint-body-large text-schemesOnSurfaceVariant">
                Use the form below and we'll get back to you as soon as we can.
              </p>
            </header>

            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="First name"
                  placeholder="Input"
                  value={form.firstName}
                  onChange={handleChange('firstName')}
                  style="outlined"
                />
                <TextField
                  label="Last name"
                  placeholder="Input"
                  value={form.lastName}
                  onChange={handleChange('lastName')}
                  style="outlined"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Email"
                  placeholder="Input"
                  value={form.email}
                  onChange={handleChange('email')}
                  style="outlined"
                />
                <TextField
                  label="Phone number"
                  placeholder="Input"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  style="outlined"
                />
              </div>

              <TextField
                label="Topic"
                placeholder="Input"
                value={form.topic}
                onChange={handleChange('topic')}
                trailingIcon={<span className="text-base">▾</span>}
                style="outlined"
              />

              <TextField
                label="Message"
                placeholder="Type your message"
                value={form.message}
                onChange={handleChange('message')}
                multiline
                style="outlined"
              />

              <div className="flex flex-col gap-3">
                <label className="flex items-start gap-3 Blueprint-body-medium text-schemesOnSurface">
                  <input
                    type="checkbox"
                    className="accent-schemesPrimary mt-1"
                    checked={form.agreed}
                    onChange={handleToggle('agreed')}
                  />
                  By submitting this form, you agree to provide accurate information and communicate respectfully. The Social
                  Blueprint does not provide medical or crisis services; please contact the appropriate services for emergencies.
                  Your message may be shared with relevant organisations to assist you.
                </label>
              </div>

              <div className="flex">
                <Button
                  label="Send a message"
                  size="base"
                  style="filled"
                  disabled={!form.agreed}
                />
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
