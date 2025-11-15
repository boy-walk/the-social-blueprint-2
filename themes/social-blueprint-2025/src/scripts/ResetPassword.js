import React, { useState, useRef, useEffect } from "react";
import { TextField } from "./TextField";
import { Button } from "./Button";

export function ResetPassword({ restUrl, wpNonce, loginUrl, resetKey, userLogin, action }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const passwordRef = useRef(null);

  useEffect(() => {
    // Validate that we have the required parameters
    if (!resetKey || !userLogin || action !== 'rp') {
      setInvalidLink(true);
    }
  }, [resetKey, userLogin, action]);

  const validate = () => {
    const nextErrors = {};

    if (!password) {
      nextErrors.password = "Please enter a new password";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      passwordRef.current?.querySelector('input')?.focus();
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setBusy(true);
    setErrors({});

    try {
      const response = await fetch(restUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": wpNonce,
        },
        body: JSON.stringify({
          password,
          reset_key: resetKey,
          user_login: userLogin,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to reset password");
      }

      if (!data.success) {
        throw new Error(data?.message || "Failed to reset password");
      }

      setSuccess(true);
    } catch (err) {
      console.error("Password reset error:", err);
      setErrors({
        password: err.message || "An error occurred. Please try again."
      });
    } finally {
      setBusy(false);
    }
  };

  if (invalidLink) {
    return (
      <div className="bg-schemesSurface min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="w-16 h-16 mx-auto bg-stateError/10 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-stateError"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <div className="space-y-3">
            <h1 className="Blueprint-headline-small md:Blueprint-headline-medium text-schemesOnSurface">
              Invalid Reset Link
            </h1>
            <p className="Blueprint-body-medium text-schemesOnSurfaceVariant">
              This password reset link is invalid or has expired. Please request a new password reset.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <a
              href="/forgot-password"
              className="inline-flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer px-4 py-2.5 Blueprint-title-medium rounded-[16px] bg-schemesPrimary text-schemesOnPrimary hover:bg-palettesPrimary40"
            >
              Request New Reset Link
            </a>
            <div>
              <a
                href={loginUrl}
                className="Blueprint-body-medium text-schemesPrimary hover:text-schemesPrimary/80 transition-colors"
              >
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-schemesSurface min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="w-16 h-16 mx-auto bg-stateSuccess/10 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-stateSuccess"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div className="space-y-3">
            <h1 className="Blueprint-headline-small md:Blueprint-headline-medium text-schemesOnSurface">
              Password Reset Successful
            </h1>
            <p className="Blueprint-body-medium text-schemesOnSurfaceVariant">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
          </div>

          <div className="pt-4">
            <a
              href={loginUrl}
              className="inline-flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer px-4 py-2.5 Blueprint-title-medium rounded-[16px] bg-schemesPrimary text-schemesOnPrimary hover:bg-palettesPrimary40"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-schemesSurface min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-3 text-center">
            <h1 className="Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large text-schemesOnSurface">
              Create New Password
            </h1>
            <p className="Blueprint-body-medium text-schemesOnSurfaceVariant">
              Enter your new password below. Make sure it's at least 8 characters long.
            </p>
          </div>

          <div ref={passwordRef}>
            <TextField
              label="New Password"
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((e) => ({ ...e, password: "" }));
              }}
              style="outlined"
              error={errors.password || ""}
              disabled={busy}
              autoComplete="new-password"
            />
          </div>

          <div>
            <TextField
              label="Confirm New Password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((e) => ({ ...e, confirmPassword: "" }));
              }}
              style="outlined"
              error={errors.confirmPassword || ""}
              disabled={busy}
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              label={busy ? "Resetting Password..." : "Reset Password"}
              variant="filled"
              size="base"
              disabled={busy}
              className="w-full"
            />

            <div className="text-center">
              <a
                href={loginUrl}
                className="Blueprint-body-medium text-schemesPrimary hover:text-schemesPrimary/80 transition-colors"
              >
                Back to Login
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;