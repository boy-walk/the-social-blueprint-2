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
        console.log('Contact form submitted:', form);
    };

    return (
        <div className="flex gap-25 px-32 py-16 justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col flex-2 gap-12 w-full max-w-3xl mx-auto"
            >
                <header className="space-y-2">
                    <h1 className="Blueprint-headline-large-emphasized italic">
                        Get quick access to community support.
                    </h1>
                </header>

                {/* Left: Form Fields */}
                <div className="flex-1 flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <TextField
                            label="First name"
                            placeholder="Input"
                            value={form.firstName}
                            onChange={handleChange('firstName')}
                        />
                        <TextField
                            label="Last name"
                            placeholder="Input"
                            value={form.lastName}
                            onChange={handleChange('lastName')}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <TextField
                            label="Email"
                            placeholder="Input"
                            value={form.email}
                            onChange={handleChange('email')}
                        />
                        <TextField
                            label="Phone number"
                            placeholder="Input"
                            value={form.phone}
                            onChange={handleChange('phone')}
                        />
                    </div>
                    <TextField
                        label="Topic"
                        placeholder="Input"
                        value={form.topic}
                        onChange={handleChange('topic')}
                        trailingIcon={<span className="text-lg">▾</span>}
                    />
                    <TextField
                        label="Message"
                        placeholder="Type your message"
                        value={form.message}
                        onChange={handleChange('message')}
                        multiline
                    />
                    <label className="flex items-start gap-3 Blueprint-body-medium">
                        <input
                            type="checkbox"
                            className="accent-schemesPrimary mt-1"
                            checked={form.agreed}
                            onChange={handleToggle('agreed')}
                        />
                        I accept the terms
                    </label>
                    <Button
                        label="Send a message"
                        size="base"
                        style="filled"
                        disabled={!form.agreed}
                    />
                </div>

                {/* Right: Static Contact Info */}
            </form>
            <div className="w-auto max-w-lg flex flex-col flex-1 gap-8 Blueprint-body-medium text-schemesOnSurfaceVariant">
                    <div>
                        <p className="Blueprint-title-large-emphasized text-schemesOnSurface mb-1">Medical Emergency - Hatzolah</p>
                        <p className="Blueprint-body-large mb-1">24/7 volunteer-run Jewish medical response</p>
                        <p className="Blueprint-body-large-emphasized">(03) 9527 5111</p>
                    </div>
                    <div>
                        <p className="Blueprint-title-large-emphasized text-schemesOnSurface mb-1">Mental Health Support - Jewish Care</p>
                        <p className="Blueprint-body-large mb-1">Free sessions for community members 16+</p>
                        <p className="Blueprint-body-large-emphasized">(03) 8517 5999  Mon to Fri, 9am–5pm</p>
                    </div>
                    <div>
                        <p className="Blueprint-title-large-emphasized text-schemesOnSurface mb-1">Report Antisemitism - CSG</p>
                        <p className="Blueprint-body-large mb-1">Emergency team available 24/7</p>
                        <p className="Blueprint-body-large-emphasized">1300 000 274
                            or via the{' '}
                            <a href="#" className="underline">
                                Jeap App
                            </a>
                        </p>
                    </div>
                </div>
        </div>
    );
}