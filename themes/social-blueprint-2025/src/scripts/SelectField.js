import React, { useId } from "react";
import clsx from "clsx";

export default function SelectField({ label = "Select", value = "", onChange, options = [], required = false }) {
  const id = useId();
  return (
    <div className="relative w-full rounded-lg border border-schemesOutline bg-transparent focus-within:border-schemesPrimaryContainer">
      <label htmlFor={id} className="absolute left-4 -translate-y-1/2 px-1 Blueprint-label-medium bg-schemesPrimaryFixed rounded-sm">
        {label}{required ? " *" : ""}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={clsx("w-full py-3 pr-4 pl-3 bg-schemesSurfaceContainerLow rounded-lg outline-none Blueprint-body-medium text-schemesOnSurface")}
      >
        <option value="">Choose one</option>
        {options.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
      </select>
    </div>
  );
}
