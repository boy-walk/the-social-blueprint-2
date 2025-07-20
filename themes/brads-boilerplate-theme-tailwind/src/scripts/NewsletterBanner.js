import React from "react";
import { Button } from "./Button";

export const NewsletterBanner = () => {
  return (
    <div className="bg-schemesPrimaryContainer text-schemesOnPrimaryContainer py-12 px-4 sm:px-8 lg:px-16 text-center rounded-3xl w-full">
      <h2 className="Blueprint-headline-medium mb-4 font-bold">
        Stay connected to the Melbourne Jewish community
      </h2>
      <p className="mb-6 Blueprint-body-large sm:Blueprint-body-medium">
        Receive our newsletter every Friday morning with the latest updates.
        It's like no other newsletter! No spam, just good stuff.
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-2xl mx-auto mb-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full sm:flex-1 px-4 py-3 rounded-xl border-none outline-none text-black bg-[color:var(--schemesSurface,#F8F2EF)]"
        />
        <Button
          variant="tonal"
          shape="square"
          className="rounded-lg"
          label="Subscribe"
          size="lg"
          onClick={() => {}}
         />
      </div>
      <p className="text-sm text-white opacity-80">
        We respect your inbox. Unsubscribe anytime.
      </p>
    </div>
  );
};
