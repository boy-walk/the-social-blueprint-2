import React, { useState } from 'react';
import { TextField } from './TextField'
import { Button } from './Button';

export function LoginForm() {
  const [form, setForm] = useState({
    user: '',
    pass: '',
    remember: false,
  });

  const [errors, setErrors] = useState({
    user: '',
    pass: '',
    general: '',
  });

  const [touched, setTouched] = useState({
    user: false,
    pass: false,
  });

  const [loading, setLoading] = useState(false);

  const handle = key => e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    setForm(prev => ({ ...prev, [key]: value }));

    // Clear field error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '', general: '' }));
    }
  };

  const handleBlur = key => () => {
    setTouched(prev => ({ ...prev, [key]: true }));
    validateField(key, form[key]);
  };

  const validateField = (key, value) => {
    let error = '';

    if (key === 'user') {
      if (!value.trim()) {
        error = 'Username or email is required';
      } else if (value.includes('@')) {
        // If it looks like an email, validate it
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          error = 'Please enter a valid email address';
        }
      }
    }

    if (key === 'pass') {
      if (!value) {
        error = 'Password is required';
      }
    }

    setErrors(prev => ({ ...prev, [key]: error }));
    return error;
  };

  const validateForm = () => {
    const userError = validateField('user', form.user);
    const passError = validateField('pass', form.pass);

    setTouched({ user: true, pass: true });

    return !userError && !passError;
  };

  // Helper to strip HTML tags from error messages
  const stripHtml = (html) => {
    if (typeof html !== 'string') return html;
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const canSubmit = form.user && form.pass && !errors.user && !errors.pass && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors(prev => ({ ...prev, general: '' }));

    try {
      const res = await fetch('/wp-json/uwp-custom/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window?.wpApiSettings?.nonce || '',
        },
        body: JSON.stringify({
          email: form.user,
          password: form.pass,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Login successful:', data);
        window.location.href = '/';
      } else {
        // Handle specific error cases and strip HTML tags
        const rawMessage = data.message || 'Login failed. Please check your credentials.';
        const errorMessage = stripHtml(rawMessage);

        if (errorMessage.toLowerCase().includes('username') || errorMessage.toLowerCase().includes('email')) {
          setErrors(prev => ({ ...prev, user: errorMessage, general: '' }));
        } else if (errorMessage.toLowerCase().includes('password')) {
          setErrors(prev => ({ ...prev, pass: errorMessage, general: '' }));
        } else {
          setErrors(prev => ({ ...prev, general: errorMessage }));
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors(prev => ({
        ...prev,
        general: 'Network error. Please check your connection and try again.'
      }));
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="flex flex-col max-w-xl mx-auto px-4 py-20 gap-14">
      <header className="text-center space-y-4">
        <h1 className="italic Blueprint-headline-large-emphasized">
          {/* {t('log_in')} */} Log&nbsp;in
        </h1>
        <p className="Blueprint-body-large text-schemesOnSurfaceVariant">
          Access your account to post, connect, and explore everything happening in the Melbourne Jewish community.
        </p>
      </header>

      {/* General error message */}
      {errors.general && (
        <div className="rounded-xl bg-schemesErrorContainer border border-schemesError p-4">
          <p className="Blueprint-body-medium text-schemesOnErrorContainer">
            {errors.general}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <TextField
          label="Username or Email"
          placeholder="Input"
          value={form.user}
          onChange={handle('user')}
          onBlur={handleBlur('user')}
          error={touched.user && errors.user}
          helperText={touched.user && errors.user ? errors.user : ''}
        />

        <TextField
          label="Password"
          type="password"
          placeholder="Input"
          value={form.pass}
          onChange={handle('pass')}
          onBlur={handleBlur('pass')}
          error={touched.pass && errors.pass}
          helperText={touched.pass && errors.pass ? errors.pass : ''}
        />

        <label className="flex items-center gap-2 Blueprint-body-medium select-none">
          <input
            type="checkbox"
            className="accent-schemesPrimary"
            checked={form.remember}
            onChange={handle('remember')}
          />
          {/* {t('remember_me')} */} Remember Me
        </label>

        <Button
          label={loading ? "Logging in..." : "Log in"}
          style="filled"
          size="base"
          shape="square"
          className="w-full mt-4"
          disabled={!canSubmit}
          onClick={handleSubmit}
        />

        <div className="flex justify-between text-schemesPrimary Blueprint-body-medium pt-2">
          <a href="/register-individual" className="hover:underline">
            {/* {t('create_account')} */} Create account
          </a>
          <a href="/forgot-password" className="hover:underline">
            {/* {t('forgot_password')} */} Forgot password?
          </a>
        </div>
      </form>
    </main>
  );
}