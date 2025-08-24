import React, { useState } from "react";
import { Button } from "./Button";

export const NewsletterBanner = () => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);

    await fetch("https://form.flodesk.com/forms/62a9dfb03e1f4ce38387eee4/submit", {
      method: "POST",
      mode: "no-cors", // required for Flodesk
      body: data,
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col justify-center bg-schemesPrimaryContainer text-schemesOnPrimaryContainer py-12 px-4 sm:px-8 lg:px-16 text-center rounded-3xl w-full">
        <h2 className="Blueprint-headline-medium mb-4 font-bold">
          Thanks for subscribing!
        </h2>
        <p className="Blueprint-body-large sm:Blueprint-body-medium">
          You're now on the list. Shabbat shalom 🕊️
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-schemesPrimaryContainer text-schemesOnPrimaryContainer py-12 px-4 sm:px-8 lg:px-16 text-center rounded-3xl w-full"
    >
      <h2 className="Blueprint-headline-medium mb-4 font-bold">
        Stay connected to the Melbourne Jewish community
      </h2>
      <p className="mb-6 Blueprint-body-large sm:Blueprint-body-medium">
        Receive our newsletter every Friday morning with the latest updates.
        It's like no other newsletter! No spam, just good stuff.
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center gap-2 max-w-2xl mx-auto mb-4">
        {/* Required by Flodesk */}
        <input
          type="hidden"
          name="csrf"
          value="1c00cae43d5b4b0a8401c6fa7565e6028a49818a90cb2c162db4762d36ec7c5881b4ee1fb81130217eb1b39fa47cb4898aa8773ccbee5b40fdaca53c46d36d4f"
        />
        {/* Honeypot fields */}
        <input type="text" name="jlROHAa" placeholder="jlROHAa" style={{ display: "none" }} />
        <input type="text" name="ajlROHA" placeholder="ajlROHA" style={{ display: "none" }} />
        <input type="text" name="lROHAaj" placeholder="lROHAaj" style={{ display: "none" }} />
        <input type="text" name="HROAajl" placeholder="HROAajl" style={{ display: "none" }} />

        {/* Email field */}
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          className="h-full Blueprint-label-large w-full sm:flex-1 px-4 py-3 rounded-xl border-none outline-none text-schemesOnSurfaceVariant bg-[color:var(--schemesSurface,#F8F2EF)]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* Phone number field */}
        <input
          type="tel"
          name="phone_number"
          placeholder="Phone Number"
          className="h-full Blueprint-label-large w-full sm:flex-1 px-4 py-3 rounded-xl border-none outline-none text-schemesOnSurfaceVariant bg-[color:var(--schemesSurface,#F8F2EF)]"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <Button label="Subscribe" type="submit" variant="tonal" size="lg" />
      </div>
      <p className="text-sm text-white opacity-80">
        We respect your inbox. Unsubscribe anytime.
      </p>
    </form>
  );
};
