import React, { useState } from 'react';
import { TextField } from './TextField';
import { Button } from './Button';

export function AccountSettings({ profile }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const resetChanges = () => {
    setForm(profile);
    setEditing(false);
  };

  const saveChanges = async () => {
    await fetch('/wp-json/custom/v1/user-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': window.WPData?.nonce, },
      body: JSON.stringify(form)
    });
    setUser(form);
    setEditMode(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-0">
      <h2 className="Blueprint-headline-small-emphasized mb-1">Profile</h2>
      <p className="Blueprint-body-medium mb-6 text-schemesOnSurfaceVariant">View your profile details and make changes when needed.</p>

      <div className="flex items-center gap-4 mb-8">
        <img
          src={form.avatar || '/wp-content/plugins/userswp/assets/images/no_profile.png'}
          alt="Avatar"
          className="rounded-lg w-24 h-24 mb-2"
        />
        {editing && (
          <>
            <input
              type="file"
              accept="image/*"
              id="avatarUpload"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const formData = new FormData();
                formData.append('avatar', file);

                const res = await fetch('/wp-json/custom/v1/upload-avatar', {
                  method: 'POST',
                  headers: {
                    'X-WP-Nonce': window.WPData?.nonce,
                  },
                  body: formData,
                });

                const json = await res.json();
                if (res.ok) {
                  setForm(prev => ({ ...prev, avatar: json.url }));
                } else {
                  alert(json.message || 'Upload failed');
                }
              }}
            />
            <Button
              label="Change photo"
              variant="tonal"
              size="sm"
              onClick={() => document.getElementById('avatarUpload').click()}
            />
          </>
        )}

      </div>

      <form className="flex flex-col gap-6">
        <div className="flex gap-6">
          <TextField
            label="First name"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            disabled={!editing}
          />
          <TextField
            label="Last name"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>
        <div className="flex gap-6">
          <TextField
            label="Account name"
            name="username"
            value={form.username}
            onChange={handleChange}
            disabled={!editing}
          />
          <TextField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          disabled={!editing}
        />
        <TextField
          label="Bio"
          name="bio"
          value={form.bio}
          onChange={handleChange}
          disabled={!editing}
          multiline
        />
      </form>

      <div className="flex gap-4 mt-6">
        {editing ? (
          <>
            <Button label="Reset Changes" variant="tonal" onClick={resetChanges} />
            <Button label="Save Changes" onClick={saveChanges} />
          </>
        ) : (
          <Button label="Edit Profile" onClick={() => setEditing(true)} />
        )}
      </div>
    </div>
  );
}
