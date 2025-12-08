import React from "react";
import { Button } from "./Button";

export const SponsorshipBanner = ({ imgSrc, enabled, href }) => {
  if (!enabled) return null;

  return (
    <div className="w-full bg-schemesInverseSurface rounded-2xl p-6 md:p-8 lg:p-10">
      <div
        className="
          flex flex-col items-start text-left
          md:flex-row md:justify-between lg:items-center
          gap-6 md:gap-8 lg:gap-10
        "
      >
        {/* LEFT SECTION */}
        <div
          className="
            flex flex-col lg:items-start justify-start gap-4
            lg:w-auto
          "
        >
          <h2
            className="
              Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized
              text-schemesPrimaryFixed
            "
          >
            Proudly sponsored by
          </h2>

          {imgSrc && (
            <img
              src={imgSrc}
              alt="Sponsor Logo"
              className="
                w-auto
                max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[420px]
                object-contain
              "
            />
          )}
        </div>

        {/* RIGHT SECTION - BUTTONS */}
        <div
          className="
            flex flex-row justify-center items-end gap-4
            md:flex-row
            lg:flex-col lg:justify-end
          "
        >
          {href && (<a
            href={href || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              label="Link to sponsor"
              variant="filled"
              size="base"
              className="
                bg-[#2b6b8a] hover:bg-[#3a7fa3]
                px-6 md:px-8
                w-full sm:w-auto
              "
            />
          </a>)}

          <Button
            label="More about us"
            variant="tonal"
            size="base"
            className="
              bg-[#c5e3f5] text-[#1a4a5e] hover:bg-[#b0d6ec]
              px-6 md:px-8
              w-full sm:w-auto
            "
            onClick={() => window.location.href = "/about-us"}
          />
        </div>
      </div>
    </div>
  );
};
