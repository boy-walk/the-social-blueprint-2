import React, { useState } from 'react';
import { TextField } from './TextField';
import { Button } from './Button';

export function RegisterOrganisation() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organisation: '',
    businessType: 'for-profit',
    password: '',
    confirm: '',
    newsOptIn: false,
    agreed: false,
  });

  /* helpers ------------------------------------------------------------- */
  const handleChange = key => e =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleToggle = key => () =>
    setForm(prev => ({ ...prev, [key]: !prev[key] }));

  const handleBusinessType = e =>
    setForm(prev => ({ ...prev, businessType: e.target.value }));

  const passwordMismatch =
    form.password && form.confirm && form.password !== form.confirm;

  const canSubmit =
    Object.values({
      ...form,
      newsOptIn: true,
    }).every(Boolean) && !passwordMismatch;

  /* submit -------------------------------------------------------------- */
  const handleSubmit = async e => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      const res = await fetch('/wp-json/uwp-custom/v1/register-organisation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window?.wpApiSettings?.nonce || '',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          first_name: form.firstName,
          last_name: form.lastName,
          organisation: form.organisation,
          business_type: form.businessType,
          phone: form.phone,
          news_opt_in: form.newsOptIn ? 'yes' : 'no',
          agree: form.agreed ? 'yes' : 'no',
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Unknown error');
      alert('Account created! Please check your inbox to verify your email.');
      setForm(prev => ({ ...prev, password: '', confirm: '' }));
    } catch (err) {
      console.error(err);
      alert(`Registration failed: ${err.message}`);
    }
  };

  return (
    <main className="flex flex-col max-w-xl mx-auto px-4 py-16 gap-16">
      <header className="text-center space-y-4">
        <h1 className="italic Blueprint-headline-large">
          Registration for Organisations
        </h1>
        <p className="Blueprint-body-large text-schemesOnSurfaceVariant">
          For Individuals&nbsp;
          <a href="/register-individual" className="underline">
            Click here
          </a>{' '}
          to Register.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Email"
            placeholder="Input"
            value={form.email}
            onChange={handleChange('email')}
            type="email"
          />
          <TextField
            label="Phone number"
            placeholder="Input"
            value={form.phone}
            onChange={handleChange('phone')}
          />
        </div>

        <TextField
          label="Organisation Name"
          placeholder="This will be your display name"
          value={form.organisation}
          onChange={handleChange('organisation')}
        />

        <fieldset className="flex flex-wrap gap-3">
          <legend className="Blueprint-title-medium mb-4">
            Business type
          </legend>

          <label className="flex items-center gap-2 Blueprint-body-medium">
            <input
              type="radio"
              name="businessType"
              value="for-profit"
              checked={form.businessType === 'for-profit'}
              onChange={handleBusinessType}
            />
            For Profit
          </label>

          <label className="flex items-center gap-2 Blueprint-body-medium">
            <input
              type="radio"
              name="businessType"
              value="not-for-profit"
              checked={form.businessType === 'not-for-profit'}
              onChange={handleBusinessType}
            />
            Not for Profit
          </label>
        </fieldset>

        <TextField
          label="Password"
          placeholder="Input"
          value={form.password}
          onChange={handleChange('password')}
          type="password"
        />
        <TextField
          label="Confirm Password"
          placeholder="Input"
          value={form.confirm}
          onChange={handleChange('confirm')}
          type="password"
          supportingText={passwordMismatch ? 'Passwords do not match' : ''}
          error={passwordMismatch}
        />

        <label className="flex items-start gap-3 Blueprint-body-medium">
          <input
            type="checkbox"
            className="accent-schemesPrimary mt-1"
            checked={form.newsOptIn}
            onChange={handleToggle('newsOptIn')}
          />
          Yes please, sign me up for The Social Blueprint news and exclusive
          offers.
        </label>

        <label className="flex items-start gap-3 Blueprint-body-medium">
          <input
            type="checkbox"
            className="accent-schemesPrimary mt-1"
            checked={form.agreed}
            onChange={handleToggle('agreed')}
            required
          />
          <div>
            By subscribing and / or creating an account you agree to The Social
            Blueprint Inc's{' '}
            <a href="/terms" className="underline">
              Terms&nbsp;&amp;&nbsp;Conditions and Privacy Policy
            </a>
            .
          </div>
        </label>

        <Button
          label="Create account"
          style="filled"
          size="base"
          shape="square"
          className="w-full mt-8"
          disabled={!canSubmit}
          onClick={handleSubmit}
        />
      </form>
    </main>
  );
}
