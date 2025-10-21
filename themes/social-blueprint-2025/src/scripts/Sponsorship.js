import React from "react";
import { Button } from "./Button"; // Adjust the import path as needed

export const SponsorshipBanner = ({ imgSrc, enabled, href }) => {
  if (!enabled) {
    return null;
  }

  return (
    <div className="w-full bg-schemesInverseSurface rounded-xl p-4 md:p-8 lg:p-10">
      <div className="flex flex-col items-center justify-center lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left section - Text and Logo */}
        <div className="flex flex-col items-start justify-center gap-4">
          <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesPrimaryFixed">
            Proudly sponsored by
          </h2>
          {imgSrc && (
            <img
              src={imgSrc}
              alt="Sponsor Logo"
              className="w-auto object-contain"
            />
          )}
        </div>

        {/* Right section - Buttons */}
        <div className="flex flex-row md:flex-col gap-3 sm:gap-4">
          <a
            href={href || "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              label="Link to sponsor"
              variant="filled"
              shape="square"
              size="base"
              className="w-full sm:w-auto bg-[#2b6b8a] hover:bg-[#3a7fa3]"
            />
          </a>
          <div>
            <Button
              label="More about us"
              variant="tonal"
              shape="square"
              size="base"
              onClick={() => { }}
              className="w-full sm:w-auto bg-[#c5e3f5] text-[#1a4a5e] hover:bg-[#b0d6ec]"
            />
          </div>
        </div>
      </div>
    </div >
  );
};