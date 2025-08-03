import React, { useState } from 'react';
import { TextField } from './TextField';
import { Button } from './Button';

export const AccountChangePassword = ({ user }) => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (form.newPassword !== form.confirmPassword) {
      setStatus({ error: true, message: 'Passwords do not match' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/wp-json/custom/v1/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.WPData?.nonce,
        },
        credentials: 'include',
        body: JSON.stringify({
          current_password: form.currentPassword,
          new_password: form.newPassword,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || 'Password change failed');
      }

      setStatus({ success: true, message: 'Password updated successfully' });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatus({ error: true, message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto py-10">
      <h2 className="Blueprint-headline-small-emphasized mb-6">Change Password</h2>
      <div className="space-y-4">
        <TextField
          type="password"
          name="currentPassword"
          label="Current Password"
          value={form.currentPassword}
          onChange={handleChange}
          required
        />
        <TextField
          type="password"
          name="newPassword"
          label="New Password"
          value={form.newPassword}
          onChange={handleChange}
          required
        />
        <TextField
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mt-6">
        <Button
          label={submitting ? 'Updating...' : 'Save Changes'}
          type="submit"
          disabled={submitting}
          variant="filled"
          size="base"
          shape="square"
          className="w-full"
        />
      </div>
    </form>
  );
};
