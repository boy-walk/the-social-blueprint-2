import React, { useState, useRef } from "react";
import { TextField } from "./TextField";
import { Button } from "./Button";

export function ForgotPassword({ restUrl, wpNonce, loginUrl }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const emailRef = useRef(null);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validate = () => {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Please enter your email address";
    } else if (!validateEmail(email)) {
      nextErrors.email = "Please enter a valid email address";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      emailRef.current?.querySelector('input')?.focus();
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
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to send reset email");
      }

      if (!data.success) {
        throw new Error(data?.message || "Failed to send reset email");
      }

      setSuccess(true);
    } catch (err) {
      console.error("Password reset error:", err);
      setErrors({
        email: err.message || "An error occurred. Please try again."
      });
    } finally {
      setBusy(false);
    }
  };

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
              Check your email
            </h1>
            <p className="Blueprint-body-medium text-schemesOnSurfaceVariant">
              We've sent password reset instructions to <strong className="text-schemesOnSurface">{email}</strong>
            </p>
            <p className="Blueprint-body-small text-schemesOnSurfaceVariant">
              Didn't receive the email? Check your spam folder or try again in a few minutes.
            </p>
          </div>

          <div className="pt-4">
            <a
              href={loginUrl}
              className="inline-flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer px-4 py-2.5 Blueprint-title-medium rounded-[16px] bg-schemesPrimary text-schemesOnPrimary hover:bg-palettesPrimary40"
            >
              Return to Login
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
              Reset your password
            </h1>
            <p className="Blueprint-body-medium text-schemesOnSurfaceVariant">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          <div ref={emailRef}>
            <TextField
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((e) => ({ ...e, email: "" }));
              }}
              style="outlined"
              error={errors.email || ""}
              disabled={busy}
              autoComplete="email"
            />
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              label={busy ? "Sending..." : "Send Reset Instructions"}
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

export default ForgotPassword;