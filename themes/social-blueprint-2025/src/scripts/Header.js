import React, { useEffect, useRef, useState } from "react";
import Logo from "../../assets/logo.svg";
import { Button } from "./Button";
import { IconButton } from "./Icon";
import { useTranslation } from "react-i18next";
import { ListIcon, SmileyIcon } from "@phosphor-icons/react";
import { Socials } from "./Socials";

function LinkItem({ href = "#", children }) {
  return (
    <a
      href={href}
      className="Blueprint-body-medium block py-1.5 text-[var(--schemesOnSurface)] hover:text-[var(--schemesPrimary)]"
    >
      {children}
    </a>
  );
}

function Section({ title, children }) {
  return (
    <div className="min-w-0">
      <div className="Blueprint-title-small text-[var(--schemesOnSurface)] mb-2">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

/* --- Mega panel --- */
function MegaPanel({ open, onClose, anchorRef }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      const p = panelRef.current;
      const a = anchorRef.current;
      if (!p || p.contains(e.target) || a?.contains(e.target)) return;
      onClose();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, onClose, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const content = {
    "whats-on": (
      <>
        <Section title="Discover">
          <LinkItem href="/events">Discover Events</LinkItem>
          <LinkItem href="/events/calendar">View Calendar</LinkItem>
          <LinkItem href="/events?featured=1">Featured Events</LinkItem>
          <LinkItem href="/submit-event">Submit an Event</LinkItem>
        </Section>
        <Section title="Browse by Audience">
          <LinkItem href="/events?audience=families">For Families</LinkItem>
          <LinkItem href="/events?audience=adults">For Adults</LinkItem>
          <LinkItem href="/events?audience=groups">Community Groups</LinkItem>
          <LinkItem href="/events?audience=seniors">For Seniors</LinkItem>
        </Section>
      </>
    ),
    directory: (
      <>
        <Section title="Browse">
          <LinkItem href="/directory">All Listings</LinkItem>
          <LinkItem href="/directory?featured=1">Featured Listings</LinkItem>
          <LinkItem href="/directory?type=service">Support Services</LinkItem>
        </Section>
        <Section title="Contribute">
          <LinkItem href="/add-listing">Add a Listing</LinkItem>
          <LinkItem href="/contact">Contact & Support</LinkItem>
        </Section>
      </>
    ),
    "blueprint-stories": (
      <>
        <Section title="Read & Listen">
          <LinkItem href="/articles">Articles and blogs</LinkItem>
          <LinkItem href="/podcasts">Podcasts</LinkItem>
          <LinkItem href="/podcasts/interviews">Blueprint interviews</LinkItem>
          <LinkItem href="/podcasts/candid-conversations">Candid conversations</LinkItem>
        </Section>
        <Section title="Categories">
          <LinkItem href="/stories?theme=community-and-connection">Community & Connection</LinkItem>
          <LinkItem href="/stories?theme=culture-and-identity">Culture & Identity</LinkItem>
          <LinkItem href="/stories?theme=learning-and-growth">Learning & Growth</LinkItem>
        </Section>
      </>
    ),
    "about-us": (
      <>
        <Section title="About Us">
          <LinkItem href="/about-us/our-mission">Our Mission</LinkItem>
          <LinkItem href="/contact">Contact & Support</LinkItem>
          <LinkItem href="/faqs">FAQs</LinkItem>
          <LinkItem href="/terms">Terms and conditions</LinkItem>
        </Section>
      </>
    ),
    "message-board": (
      <>
        <Section title="Message Board">
          <LinkItem href="/message-boards">Browse Message board</LinkItem>
          <LinkItem href="/message-boards?post=1">Post a notice</LinkItem>
        </Section>
        <Section title="Browse by category">
          <LinkItem href="/message-boards?cat=jobs">Jobs</LinkItem>
          <LinkItem href="/message-boards?cat=volunteering">Volunteering</LinkItem>
          <LinkItem href="/message-boards?cat=local-notices">Local notices</LinkItem>
          <LinkItem href="/message-boards?cat=support">Informal support</LinkItem>
        </Section>
      </>
    ),
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Site section"
      className="
        absolute left-0 right-0 top-full
        bg-[var(--schemesSurface)] text-[var(--schemesOnSurface)]
        border-t border-[var(--schemesOutlineVariant)]
        shadow-[0_12px_24px_rgba(0,0,0,0.18)]
        z-[60]
      "
    >
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-16 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {content[open]}
        </div>
      </div>
    </div>
  );
}

export default function Header({ isUserLoggedIn = false }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(null); // null | 'whats-on' | 'directory' | 'blueprint-stories' | 'about-us' | 'message-board'
  const headerRef = useRef(null);

  const toggle = (key) => setOpen((cur) => (cur === key ? null : key));
  const close = () => setOpen(null);

  useEffect(() => {
    const onHash = () => setOpen(null);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const NavBtn = ({ id, label, href }) => {
    const active = open === id;
    return (
      <button
        type="button"
        aria-expanded={active}
        className="relative inline-flex items-center gap-1 text-white hover:opacity-90"
        onClick={() => (id ? toggle(id) : (window.location.href = href))}
      >
        {label}
      </button>
    );
  };

  return (
    <header
      ref={headerRef}
      className={`
        relative w-full z-50
        bg-[var(--schemesPrimaryContainer)]
        text-[var(--schemesOnPrimaryContainer)]
        p-4 lg:px-16 lg:py-6
        flex items-center justify-between
        shadow-[7px_6px_1px_var(--schemesOutlineVariant,#C9C7BD)]
        ${open ? "mix-blend-normal" : "mix-blend-multiply"}
      `}
    >
      <a href="/" className="flex items-center">
        <img src={Logo} alt="The Social Blueprint" className="h-15 lg:h-20" />
      </a>

      {/* Desktop */}
      <div className="hidden lg:flex flex-col items-end gap-6">
        <Socials />
        <div className="hidden lg:flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-6 Blueprint-body-medium">
            <NavBtn id="whats-on" label={t("whats_on")} />
            <NavBtn id="directory" label={t("directory")} />
            <NavBtn id="blueprint-stories" label={t("blueprint_stories")} />
            <NavBtn id="about-us" label={t("about_us")} />
            <NavBtn id="message-board" label={t("message_board")} />
          </nav>
          <div className="flex gap-4">
            <Button
              label={t("Subscribe")}
              variant="filled"
              shape="square"
              size="lg"
              onClick={() => (window.location.href = "/subscribe")}
            />
            <Button
              label={isUserLoggedIn ? t("account_dasboard") : t("log_in")}
              variant="tonal"
              shape="square"
              size="lg"
              icon={<SmileyIcon size={22} weight="bold" />}
              onClick={() =>
                (window.location.href = isUserLoggedIn ? "/account-dashboard" : "/login")
              }
            />
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden items-center">
        <IconButton
          icon={<ListIcon size={22} weight="bold" />}
          style="tonal"
          size="sm"
          onClick={() => console.log("Menu clicked")}
          aria-label={t("menu")}
        />
      </div>

      {/* Panel */}
      <MegaPanel open={open} onClose={close} anchorRef={headerRef} />

      {/* Edge shadow sitting ABOVE the panel */}
      {open && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-full mt-[-8] z-[70]"
        >
          <div className="w-full h-2 bg-transparent shadow-[7px_6px_1px_var(--schemesOutlineVariant,#C9C7BD)]" />
        </div>
      )}
    </header>
  );
}
