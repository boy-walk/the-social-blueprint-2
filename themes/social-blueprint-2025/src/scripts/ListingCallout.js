import { ArrowUpRightIcon } from "@phosphor-icons/react";
import React from "react";
import { ArrowIcon } from "../../assets/icons/arrow";
import Megaphone from "../../assets/megaphone.svg";

export const ListingCallout = () => {
  return (
    <div className="flex flex-col md:flex-row items-end justify-between bg-schemesPrimaryFixed rounded-3xl px-6 pt-8 md:pt-12 md:px-16 gap-8 shadow-3x3">
      <div className="flex-1 pb-8 md:pb-12">
        <h2 className="Blueprint-headline-large-emphasized mb-4">
          Want to contribute<br />
          and have your listing on<br />
          The Social Blueprint?
        </h2>
        <a
          href="/add-listing-hub"
          className="font-body Blueprint-label-large inline-flex items-center gap-2 hover:opacity-80"
        >
          Add your listing. It's free!
          <ArrowIcon className="h-4" />
        </a>
      </div>
      <div className="mb-[-2]">
        <img
          src={Megaphone}
          alt="Megaphone Icon"
          className=""
        />
      </div>
    </div>
  );
};