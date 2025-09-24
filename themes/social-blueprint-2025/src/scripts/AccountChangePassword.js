import React, { useState, useEffect } from 'react';
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
  const [errors, setErrors] = useState({});
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Clear field-specific errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear status messages when user starts typing
    if (status) {
      setStatus(null);
    }

    // Check password strength for new password
    if (name === 'newPassword') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const checkPasswordStrength = (password) => {
    if (!password) return { score: 0, feedback: '' };

    let score = 0;
    const feedback = [];

    // Length check
    if (password.length >= 8) score++;
    else feedback.push('at least 8 characters');

    // Uppercase check
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('an uppercase letter');

    // Lowercase check
    if (/[a-z]/.test(password)) score++;
    else feedback.push('a lowercase letter');

    // Number check
    if (/\d/.test(password)) score++;
    else feedback.push('a number');

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    else feedback.push('a special character');

    const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthLevel = strengthLevels[Math.min(score, 4)];

    let feedbackText = '';
    if (score < 3) {
      feedbackText = `${strengthLevel} - Add ${feedback.slice(0, 2).join(' and ')}`;
    } else {
      feedbackText = strengthLevel;
    }

    return { score, feedback: feedbackText };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!form.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (form.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    } else if (form.newPassword === form.currentPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!validateForm()) {
      setStatus({ error: true, message: 'Please fix the errors below' });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/wp-json/custom/v1/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.WPData?.nonce || '',
        },
        credentials: 'include',
        body: JSON.stringify({
          current_password: form.currentPassword,
          new_password: form.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error cases from the backend
        if (result.code === 'incorrect_password') {
          setErrors({ currentPassword: result.message });
          setStatus({ error: true, message: 'Please check your current password' });
        } else if (result.code === 'weak_password') {
          setErrors({ newPassword: result.message });
          setStatus({ error: true, message: 'Please choose a stronger password' });
        } else if (result.code === 'same_password') {
          setErrors({ newPassword: result.message });
          setStatus({ error: true, message: 'Please choose a different password' });
        } else {
          throw new Error(result.message || 'Password change failed');
        }
        return;
      }

      // Success
      setStatus({
        success: true,
        message: result.message || 'Password updated successfully! You remain logged in.'
      });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStrength({ score: 0, feedback: '' });

    } catch (error) {
      console.error('Password change error:', error);
      setStatus({ error: true, message: error.message || 'An unexpected error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  const getPasswordStrengthColor = (score) => {
    const colors = [
      'bg-stateError', // Very Weak
      'bg-stateError', // Weak  
      'bg-yellow-500', // Fair
      'bg-blue-500',   // Good
      'bg-stateSuccess' // Strong
    ];
    return colors[Math.min(score, 4)];
  };

  const isFormValid = form.currentPassword && form.newPassword && form.confirmPassword &&
    form.newPassword === form.confirmPassword &&
    form.newPassword.length >= 8 &&
    form.newPassword !== form.currentPassword;

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-0">
      <h2 className="Blueprint-headline-small-emphasized mb-1">Change Password</h2>
      <p className="Blueprint-body-medium mb-6 text-schemesOnSurfaceVariant">
        Update your password to keep your account secure.
      </p>

      {/* Success/Error Messages */}
      {status && (
        <div
          className={`mb-6 p-4 rounded-lg border ${status.success
              ? 'bg-stateSuccess/10 border-stateSuccess text-stateSuccess'
              : 'bg-stateError/10 border-stateError text-stateError'
            }`}
          role="alert"
        >
          <div className="Blueprint-body-medium">{status.message}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <TextField
          type="password"
          name="currentPassword"
          label="Current Password"
          value={form.currentPassword}
          onChange={handleChange}
          disabled={submitting}
          required
          error={errors.currentPassword}
          autoComplete="current-password"
        />

        {/* New Password */}
        <div>
          <TextField
            type="password"
            name="newPassword"
            label="New Password"
            value={form.newPassword}
            onChange={handleChange}
            disabled={submitting}
            required
            error={errors.newPassword}
            autoComplete="new-password"
            onFocus={() => setShowPasswordRequirements(true)}
            onBlur={() => setShowPasswordRequirements(false)}
          />

          {/* Password Strength Indicator */}
          {form.newPassword && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 bg-schemesOutlineVariant rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                <span className="Blueprint-body-small text-schemesOnSurfaceVariant min-w-fit">
                  {passwordStrength.feedback}
                </span>
              </div>
            </div>
          )}

          {/* Password Requirements (shown on focus) */}
          {showPasswordRequirements && (
            <div className="mt-2 p-3 bg-surfaceContainerHigh rounded-lg border border-schemesOutlineVariant">
              <p className="Blueprint-body-small text-schemesOnSurfaceVariant mb-2 font-medium">
                Password Requirements:
              </p>
              <ul className="Blueprint-body-small text-schemesOnSurfaceVariant space-y-1">
                <li className={form.newPassword.length >= 8 ? 'text-stateSuccess' : ''}>
                  ✓ At least 8 characters
                </li>
                <li className={/[A-Z]/.test(form.newPassword) ? 'text-stateSuccess' : ''}>
                  ✓ One uppercase letter
                </li>
                <li className={/[a-z]/.test(form.newPassword) ? 'text-stateSuccess' : ''}>
                  ✓ One lowercase letter
                </li>
                <li className={/\d/.test(form.newPassword) ? 'text-stateSuccess' : ''}>
                  ✓ One number
                </li>
                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword) ? 'text-stateSuccess' : ''}>
                  ✓ One special character
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <TextField
          type="password"
          name="confirmPassword"
          label="Confirm New Password"
          value={form.confirmPassword}
          onChange={handleChange}
          disabled={submitting}
          required
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            label={submitting ? 'Updating Password...' : 'Update Password'}
            type="submit"
            disabled={submitting || !isFormValid}
            variant="filled"
            size="base"
          />

          {/* Reset Form Button */}
          {(form.currentPassword || form.newPassword || form.confirmPassword) && !submitting && (
            <Button
              label="Clear Form"
              type="button"
              variant="outlined"
              size="base"
              onClick={() => {
                setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setErrors({});
                setStatus(null);
                setPasswordStrength({ score: 0, feedback: '' });
              }}
            />
          )}
        </div>

        {/* Security Tips */}
        <div className="mt-8 p-4 bg-surfaceContainerLow rounded-lg border border-schemesOutlineVariant">
          <h3 className="Blueprint-body-medium font-medium text-schemesOnSurface mb-2">
            🔒 Password Security Tips
          </h3>
          <ul className="Blueprint-body-small text-schemesOnSurfaceVariant space-y-1">
            <li>• Use a unique password you don't use anywhere else</li>
            <li>• Consider using a password manager to generate and store strong passwords</li>
            <li>• Avoid using personal information like names, birthdays, or addresses</li>
            <li>• Change your password regularly, especially if you suspect it may be compromised</li>
          </ul>
        </div>
      </form>
    </div>
  );
};