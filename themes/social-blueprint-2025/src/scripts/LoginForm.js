import React, { useState } from 'react';
import { TextField } from './TextField'
import { Button } from './Button';

export function LoginForm() {
  const [form, setForm] = useState({
    user: '',
    pass: '',
    remember: false,
  });

  const handle = key => e =>
    setForm(prev => ({
      ...prev, [key]: e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.value
    }));

  const canSubmit = form.user && form.pass;

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      window.alert(`Login failed: ${data.message}`);
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <TextField
          label="Username or Email"
          placeholder="Input"
          value={form.user}
          onChange={handle('user')}
        />

        <TextField
          label="Password"
          type="password"
          placeholder="Input"
          value={form.pass}
          onChange={handle('pass')}
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
          label="Log in"
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
