import React, { useEffect, useState } from 'react';
import { TextField } from './TextField';
import { Button } from './Button';

export function RegisterIndividual() {
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileWidgetId, setTurnstileWidgetId] = useState(null);

  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    newsOptIn: false,
    agreed: false,
  });

  useEffect(() => {
    if (turnstile !== undefined) {
      const siteKey = document.getElementById('turnstile_site_key');
      if (siteKey === null) return;
      const widgetId = turnstile.render("#turnstile-container", {
        sitekey: siteKey.value,
        callback: function (token) {
          setTurnstileToken(token);
        },
        'expired-callback': function () {
          setTurnstileToken('');
        },
        'timeout-callback': function () {
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

  const passwordMismatch =
    form.password && form.confirm && form.password !== form.confirm;

  const canSubmit =
    Object.values(form).every(Boolean) && !passwordMismatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      const res = await fetch('/wp-json/uwp-custom/v1/register', {
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
          agree: form.agreed ? 'yes' : 'no',
          'cf-turnstile-response': turnstileToken
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message)
        return;
      }

      alert('Account created! 🎉');
    } catch (err) {
      setError(err.message)
    }
  };

  return (
    <main className="flex flex-col max-w-xl mx-auto px-4 py-16 gap-16">
      <header className="text-center space-y-4">
        <h1 className="italic Blueprint-headline-large-emphasized">
          Registration for Individuals
        </h1>
        <p className="Blueprint-body-large text-schemesOnSurfaceVariant">
          For Business or Organisation{' '}
          <a href="/register-organisation" className="underline">
            Click&nbsp;Here
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

        <TextField
          label="Password"
          placeholder="Input"
          value={form.password}
          onChange={handleChange('password')}
          type="password"
          supportingText={passwordMismatch ? 'Passwords do not match' : ''}
          error={passwordMismatch}
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
          Yes please, sign me up for The Social Blueprint's news and exclusive
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
            . <span className="text-schemesOnContainerPrimary">*</span>
          </div>
        </label>
        {error && (
          <div className="text-schemesError text-center">
            <p className="Blueprint-body-medium">{error}</p>
          </div>
        )}
      <div id="turnstile-container"></div>
      {/* A hidden element with name 'cf-turnstile-response' will be added automatically */}
      </form>
      <div className="flex w-full">
        <Button
          label="Create account"
          style="filled"
          size="base"
          shape="square"
          className="w-full mt-8"
          disabled={!canSubmit || turnstileToken === ''}
          onClick={handleSubmit}
        />
      </div>
    </main>
  );
}