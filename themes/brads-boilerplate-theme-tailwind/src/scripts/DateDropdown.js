import React, { useState, useEffect } from "react";

export function DateDropdown({ onMonthChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [months, setMonths] = useState([]);
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now);

  // Helper: format YYYY-MM-DD
  // const formatDate = (date) => {
  //     return date.toISOString().split("T")[0];
  // };
  // Format YYYY-MM-DD
  const formatDate = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  // Generate months: current + next 11
  useEffect(() => {
    const now = new Date();
    const list = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      list.push(d);
    }

    setMonths(list);
    setSelectedMonth(list[0]); // default: current month

    // Fire callback for current month
    const first = new Date(list[0].getFullYear(), list[0].getMonth(), 1);
    const last = new Date(list[0].getFullYear(), list[0].getMonth() + 1, 0);

    // onMonthChange(formatDate(first), formatDate(last));
  }, []);

  const handleSelect = (date) => {
    setSelectedMonth(date);
    setIsOpen(false);

    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    onMonthChange(formatDate(first), formatDate(last));
  };

  return (
    <div className="relative flex justify-between gap-0.5">
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-blue-700 text-white rounded-l-full rounded-r-none"
      >
        {/* Calendar icon (SVG inline) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {selectedMonth?.toLocaleString("default", { month: "short", year: "numeric" })}
      </button>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 bg-blue-700 text-white rounded-r-full"
      >
        ▼
      </button>

      {/* Dropdown */}
      {isOpen && (
        <ul className="absolute mt-2 w-full bg-white border rounded shadow-lg z-10">
          {months.map((m, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(m)}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100"
            >
              {m.toLocaleString("default", { month: "short", year: "numeric" })}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
