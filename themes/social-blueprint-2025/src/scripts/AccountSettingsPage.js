import React, { useState, useEffect, useRef } from 'react';
import { TextField } from './TextField';
import { Button } from './Button';

export function AccountSettings() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [originalForm, setOriginalForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  // Track changes
  useEffect(() => {
    const changed = Object.keys(form).some(key => form[key] !== originalForm[key]);
    setHasChanges(changed);
  }, [form, originalForm]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/wp-json/custom/v1/user-profile', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'X-WP-Nonce': window.WPData?.nonce || '',
        },
      });

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response not ok:', response.status, errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      // Try to parse JSON
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let profileData;
      try {
        profileData = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError);
        console.error('Response text:', responseText);
        throw new Error('Server returned invalid response format');
      }

      console.log('Parsed profile data:', profileData);
      setForm(profileData);
      setOriginalForm(profileData);

    } catch (error) {
      console.error('Load profile error:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear general messages
    if (message) {
      setMessage(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.first_name?.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!form.last_name?.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!form.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (form.phone && form.phone.length > 0) {
      // Australian phone number validation (mobile and landline)
      const cleanPhone = form.phone.replace(/[\s\-\(\)\+]/g, '');
      const phoneRegex = /^(0[2-9]\d{8}|61[2-9]\d{8}|\+61[2-9]\d{8})$/;

      // Allow various Australian formats:
      // Mobile: 04XX XXX XXX, 61XXX XXX XXX, +61XXX XXX XXX
      // Landline: 0X XXXX XXXX, 61X XXXX XXXX, +61X XXXX XXXX
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = 'Please enter a valid Australian phone number (e.g., 0426 101 998)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetChanges = () => {
    setForm(originalForm);
    setEditing(false);
    setErrors({});
    setMessage(null);
  };

  const saveChanges = async () => {
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors below' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/wp-json/custom/v1/user-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.WPData?.nonce || '',
        },
        credentials: 'include',
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (data.code === 'email_exists') {
          setErrors({ email: data.message });
          setMessage({ type: 'error', text: 'Please fix the errors below' });
        } else {
          throw new Error(data.message || 'Failed to save changes');
        }
        return;
      }

      // Update local state with server response
      setForm(data);
      setOriginalForm(data);
      setEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });

      // Notify parent component if callback provided
      if (onProfileUpdate) {
        onProfileUpdate(data);
      }

    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setMessage({ type: 'error', text: 'Image must be less than 2MB' });
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Please upload a JPEG, PNG, or GIF image' });
      return;
    }

    setAvatarUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('avatar_url', file);

      const response = await fetch('/wp-json/custom/v1/upload-avatar', {
        method: 'POST',
        headers: {
          'X-WP-Nonce': window.WPData?.nonce || '',
        },
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      // Update avatar in form
      const newForm = { ...form, avatar_url: data.url };
      setForm(newForm);
      setOriginalForm(newForm);
      setMessage({ type: 'success', text: 'Avatar updated successfully!' });

    } catch (error) {
      console.error('Avatar upload error:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setAvatarUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const startEditing = () => {
    setEditing(true);
    setMessage(null);
    setErrors({});
  };

  // Debug function to refresh profile data
  const refreshProfile = async () => {
    setMessage(null);
    await loadProfile();
  };

  if (loading && !form.ID) {
    return (
      <div className="max-w-2xl mx-auto px-4 lg:px-0 py-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-schemesPrimary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 Blueprint-body-medium text-schemesOnSurfaceVariant">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="Blueprint-headline-small-emphasized mb-1">Profile</h2>
          <p className="Blueprint-body-medium text-schemesOnSurfaceVariant">
            View and edit your profile details.
          </p>
        </div>
        {!editing && (
          <Button
            label="Refresh"
            variant="outlined"
            size="sm"
            onClick={refreshProfile}
            disabled={loading}
          />
        )}
      </div>

      {/* Success/Error Messages */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border ${message.type === 'success'
            ? 'bg-stateSuccess/10 border-stateSuccess text-stateSuccess'
            : 'bg-stateError/10 border-stateError text-stateError'
            }`}
          role="alert"
        >
          <div className="Blueprint-body-medium">{message.text}</div>
        </div>
      )}

      {/* Avatar Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <img
            src={form.avatar_url || '/wp-content/plugins/userswp/assets/images/no_profile.png'}
            alt="Profile avatar"
            className="rounded-lg w-24 h-24 object-cover border-2 border-schemesOutlineVariant"
          />
          {avatarUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {editing && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              id="avatarUpload"
              className="sr-only"
              onChange={handleAvatarUpload}
              disabled={avatarUploading}
            />
            <Button
              label={avatarUploading ? "Uploading..." : "Change photo"}
              variant="tonal"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
            />
            <p className="Blueprint-body-small text-schemesOnSurfaceVariant">
              JPEG, PNG, or GIF. Max 2MB.
            </p>
          </>
        )}
      </div>

      {/* Profile Form */}
      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="First name"
            name="first_name"
            value={form.first_name || ''}
            onChange={handleChange}
            disabled={!editing}
            required
            error={errors.first_name}
          />
          <TextField
            label="Last name"
            name="last_name"
            value={form.last_name || ''}
            onChange={handleChange}
            disabled={!editing}
            required
            error={errors.last_name}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="Username"
            name="username"
            value={form.username || ''}
            disabled={true}
            helpText="Username cannot be changed"
          />
          <TextField
            label="Phone"
            name="phone"
            value={form.phone || ''}
            onChange={handleChange}
            disabled={!editing}
            error={errors.phone}
          />
        </div>

        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email || ''}
          onChange={handleChange}
          disabled={!editing}
          required
          error={errors.email}
        />

        <TextField
          label="Bio"
          name="bio"
          value={form.bio || ''}
          onChange={handleChange}
          disabled={!editing}
          multiline
          rows={4}
          helpText="Tell others a bit about yourself"
        />

        {form.registration_date && (
          <div className="text-schemesOnSurfaceVariant Blueprint-body-small">
            Member since: {new Date(form.registration_date).toLocaleDateString('en-AU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        )}
      </form>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        {editing ? (
          <>
            <Button
              label="Cancel"
              variant="outlined"
              onClick={resetChanges}
              disabled={loading}
            />
            <Button
              label={loading ? "Saving..." : "Save Changes"}
              onClick={saveChanges}
              disabled={loading || !hasChanges}
            />
            {hasChanges && (
              <p className="Blueprint-body-small text-schemesOnSurfaceVariant self-center">
                You have unsaved changes
              </p>
            )}
          </>
        ) : (
          <Button
            label="Edit Profile"
            onClick={startEditing}
            disabled={loading}
          />
        )}
      </div>
    </div>
  );
}