import React, { useState } from "react";
import { IconButton } from "./Icon";
import { ListIcon, X as CloseIcon, CaretDown } from "@phosphor-icons/react";

// Reuse your existing content sections from MegaPanel
const content = {
  "whats-on": [
    { title: "Discover Events", href: "/events" },
    { title: "View Calendar", href: "/events/calendar" },
    { title: "Featured Events", href: "/events?featured=1" },
    { title: "Submit an Event", href: "/submit-event" },
  ],
  directory: [
    { title: "All Listings", href: "/directory" },
    { title: "Featured Listings", href: "/directory?featured=1" },
    { title: "Support Services", href: "/directory?type=service" },
    { title: "Add a Listing", href: "/add-listing" },
  ],
  "blueprint-stories": [
    { title: "Articles and blogs", href: "/stories-and-interviews?type=article" },
    { title: "Interviews", href: "/stories-and-interviews?type=podcast" },
    { title: "Blueprint interviews", href: "/stories-and-interviews/interviews" },
  ],
  "about-us": [
    { title: "Our Mission", href: "/about-us/our-mission" },
    { title: "Contact & Support", href: "/contact" },
    { title: "FAQs", href: "/faqs" },
  ],
  "message-board": [
    { title: "Browse Message Board", href: "/message-boards" },
    { title: "Post a Notice", href: "/message-boards?post=1" },
    { title: "Jobs", href: "/message-boards?cat=jobs" },
    { title: "Volunteering", href: "/message-boards?cat=volunteering" },
  ],
};

export function MobileMenu({ open, onClose }) {
  const [expanded, setExpanded] = useState(null);

  const toggleSection = (key) => {
    setExpanded(expanded === key ? null : key);
  };

  return (
    <div
      className={`fixed inset-0 z-[999] bg-schemesSurface text-schemesOnSurface transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
        }`}
    >
      {/* Header with close button */}
      <div className="flex items-center justify-between p-4 border-b border-schemesOutlineVariant">
        <span className="Blueprint-title-medium">Menu</span>
        <IconButton
          icon={<CloseIcon size={24} />}
          onClick={onClose}
          aria-label="Close menu"
        />
      </div>

      {/* Sections */}
      <div className="overflow-y-auto h-[calc(100%-4rem)]">
        {Object.keys(content).map((key) => (
          <div key={key} className="border-b border-schemesOutlineVariant">
            <button
              onClick={() => toggleSection(key)}
              className="w-full flex items-center justify-between p-4 Blueprint-title-small"
            >
              <span className="capitalize">{key.replace("-", " ")}</span>
              <CaretDown
                size={20}
                className={`transform transition-transform ${expanded === key ? "rotate-180" : "rotate-0"
                  }`}
              />
            </button>

            {expanded === key && (
              <div className="pl-6 pb-3 space-y-2">
                {content[key].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    className="block py-1 Blueprint-body-medium hover:text-schemesPrimary"
                    onClick={onClose}
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
