import React, { useState } from 'react';
import { TextField } from './TextField';
import { Button } from './Button';

export function RegisterOrganisation() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState({});
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    organisation: '',
    businessType: 'For Profit',
    password: '',
    confirm: '',
    newsOptIn: false,
    agreed: false,
  });

  /* helpers ------------------------------------------------------------- */
  const handleChange = key => e => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
    setTouched(prev => ({ ...prev, [key]: true }));
  };

  const handleBlur = key => () =>
    setTouched(prev => ({ ...prev, [key]: true }));

  const handleToggle = key => () =>
    setForm(prev => ({ ...prev, [key]: !prev[key] }));

  const handleBusinessType = e =>
    setForm(prev => ({ ...prev, businessType: e.target.value }));

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatemobile = (mobile) => {
    const mobileRegex = /^[\d\s\+\-\(\)]+$/;
    return mobile.length >= 10 && mobileRegex.test(mobile);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  // Error messages
  const errors = {
    firstName: touched.firstName && !form.firstName ? 'First name is required' : '',
    lastName: touched.lastName && !form.lastName ? 'Last name is required' : '',
    email: touched.email && !form.email
      ? 'Email is required'
      : touched.email && !validateEmail(form.email)
        ? 'Please enter a valid email address'
        : '',
    mobile: touched.mobile && !form.mobile
      ? 'mobile number is required'
      : touched.mobile && !validatemobile(form.mobile)
        ? 'Please enter a valid mobile number'
        : '',
    organisation: touched.organisation && !form.organisation ? 'Organisation name is required' : '',
    password: touched.password && !form.password
      ? 'Password is required'
      : touched.password && !validatePassword(form.password)
        ? 'Password must be at least 8 characters'
        : '',
    confirm: touched.confirm && !form.confirm
      ? 'Please confirm your password'
      : touched.confirm && form.password && form.confirm && form.password !== form.confirm
        ? 'Passwords do not match'
        : '',
  };

  const hasErrors = Object.values(errors).some(error => error !== '');

  const passwordMismatch =
    form.password && form.confirm && form.password !== form.confirm;

  const canSubmit =
    form.firstName &&
    form.lastName &&
    form.email &&
    form.mobile &&
    form.organisation &&
    form.password &&
    form.confirm &&
    form.agreed &&
    !hasErrors;

  /* submit -------------------------------------------------------------- */
  const handleSubmit = async e => {
    e.preventDefault();

    // Mark all fields as touched to show validation errors
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      mobile: true,
      organisation: true,
      password: true,
      confirm: true,
    });

    if (!canSubmit) return;

    try {
      const res = await fetch('/wp-json/uwp-custom/v1/register-organisation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // ⭐ REMOVED: X-WP-Nonce header - not needed for registration
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          first_name: form.firstName,
          last_name: form.lastName,
          organisation: form.organisation,
          business_type: form.businessType,
          mobile: form.mobile,
          news_opt_in: form.newsOptIn ? 'yes' : 'no',
          agree: form.agreed ? 'yes' : 'no',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (success) {
    return (
      <main className="flex flex-col max-w-xl mx-auto px-4 py-16 gap-8">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-schemesSecondaryContainer flex items-center justify-center">
            <svg className="w-10 h-10 text-schemesOnSecondaryContainer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="Blueprint-headline-large-emphasized text-schemesOnSurface">
              Organisation Account Created!
            </h1>
            <p className="Blueprint-body-large text-schemesOnSurfaceVariant">
              Welcome to The Social Blueprint, {form.organisation}!
            </p>
          </div>

          <div className="bg-schemesSurfaceContainerHigh rounded-2xl p-6 space-y-4 text-left">
            <h2 className="Blueprint-title-medium text-schemesOnSurface">
              What's next?
            </h2>
            <ul className="space-y-3 Blueprint-body-medium text-schemesOnSurfaceVariant">
              <li className="flex items-start gap-3">
                <span className="text-schemesPrimary mt-1">✓</span>
                <span>Check your email at <strong className="text-schemesOnSurface">{form.email}</strong> to verify your account</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-schemesPrimary mt-1">✓</span>
                <span>Complete your organisation profile and add listings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-schemesPrimary mt-1">✓</span>
                <span>Connect with the community and promote your services</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            label="Go to Dashboard"
            style="filled"
            size="base"
            shape="square"
            className="w-full"
            onClick={() => window.location.href = '/account'}
          />
          <Button
            label="Browse Community"
            style="outlined"
            size="base"
            shape="square"
            className="w-full"
            onClick={() => window.location.href = '/'}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col max-w-xl mx-auto px-4 py-16 gap-16">
      <header className="text-center space-y-4">
        <h1 className="italic Blueprint-headline-large-emphasized">
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="First name"
            placeholder="Input"
            value={form.firstName}
            onChange={handleChange('firstName')}
            onBlur={handleBlur('firstName')}
            error={errors.firstName}
          />
          <TextField
            label="Last name"
            placeholder="Input"
            value={form.lastName}
            onChange={handleChange('lastName')}
            onBlur={handleBlur('lastName')}
            error={errors.lastName}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Email"
            placeholder="Input"
            value={form.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            type="email"
            error={errors.email}
          />
          <TextField
            label="Phone Number"
            placeholder="Input"
            value={form.mobile}
            onChange={handleChange('mobile')}
            onBlur={handleBlur('mobile')}
            type="tel"
            error={errors.mobile}
          />
        </div>

        <TextField
          label="Organisation Name"
          placeholder="This will be your display name"
          value={form.organisation}
          onChange={handleChange('organisation')}
          onBlur={handleBlur('organisation')}
          error={errors.organisation}
        />

        <fieldset className="flex flex-wrap gap-3">
          <legend className="Blueprint-title-medium mb-4">
            Business type
          </legend>

          <label className="flex items-center gap-2 Blueprint-body-medium">
            <input
              type="radio"
              name="businessType"
              value="For Profit"
              checked={form.businessType === 'For Profit'}
              onChange={handleBusinessType}
            />
            For Profit
          </label>

          <label className="flex items-center gap-2 Blueprint-body-medium">
            <input
              type="radio"
              name="businessType"
              value="Not for Profit"
              checked={form.businessType === 'Not for Profit'}
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
          onBlur={handleBlur('password')}
          type="password"
          error={errors.password}
          supportingText={!errors.password ? 'Must be at least 8 characters' : ''}
        />
        <TextField
          label="Confirm Password"
          placeholder="Input"
          value={form.confirm}
          onChange={handleChange('confirm')}
          onBlur={handleBlur('confirm')}
          type="password"
          error={errors.confirm}
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
            . <span className="text-schemesOnContainerPrimary">*</span>
          </div>
        </label>

        {error && (
          <div className="text-schemesError text-center">
            <p className="Blueprint-body-medium">{error}</p>
          </div>
        )}
      </form>

      <div className="flex w-full">
        <Button
          label="Create account"
          style="filled"
          size="base"
          shape="square"
          className="w-full mt-8"
          disabled={!canSubmit}
          onClick={handleSubmit}
        />
      </div>
    </main>
  );
}