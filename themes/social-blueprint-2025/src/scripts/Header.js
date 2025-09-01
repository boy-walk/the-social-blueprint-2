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

function MegaPanel({ open, onClose, anchorRef, onPanelEnter, onPanelLeave }) {
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
          <LinkItem href="/stories-and-interviews?type=article">Articles and blogs</LinkItem>
          <LinkItem href="/stories-and-interviews?type=podcast">Podcasts</LinkItem>
          <LinkItem href="/stories-and-interviews/interviews">Blueprint interviews</LinkItem>
          <LinkItem href="/stories-and-interviews/candid-conversations">Candid conversations</LinkItem>
        </Section>
        <Section title="Categories">
          <LinkItem href="/stories-and-interviews?theme=community-and-connection">Community & Connection</LinkItem>
          <LinkItem href="/stories-and-interviews?theme=culture-and-identity">Culture & Identity</LinkItem>
          <LinkItem href="/stories-and-interviews?theme=learning-and-growth">Learning & Growth</LinkItem>
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
      onMouseEnter={onPanelEnter}
      onMouseLeave={onPanelLeave}
      className="
        absolute left-0 right-0 top-full
        bg-[var(--schemesSurface)] text-[var(--schemesOnSurface)]
        border-t border-[var(--schemesOutlineVariant)]
        shadow-[7px_6px_1px_rgba(28,27,26,0.15)]
        z-[60]
        h-60
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
  const [open, setOpen] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [scrolled, setScrolled] = useState(false); // << NEW
  const hoverTimer = useRef(null);
  const headerRef = useRef(null);

  // Detect desktop for mega menu hover
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mql.matches);
    update();
    if (mql.addEventListener) mql.addEventListener("change", update);
    else mql.addListener(update);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", update);
      else mql.removeListener(update);
    };
  }, []);

  // Scroll-aware UI tweaks (fade socials, reduce padding, shrink logo)
  useEffect(() => {
    const threshold = 6;
    let ticking = false;

    const evaluate = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const atTop = y <= threshold;
      setScrolled((prev) => (prev === !atTop ? prev : !atTop));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        evaluate();
        ticking = false;
      });
    };

    // Run once on mount to set initial state
    evaluate();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openPanel = (key) => {
    if (!isDesktop) return;
    clearTimeout(hoverTimer.current);
    setOpen(key);
  };
  const scheduleClose = () => {
    if (!isDesktop) return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(null), 80);
  };
  const cancelClose = () => {
    clearTimeout(hoverTimer.current);
  };

  const goto = (href) => {
    window.location.href = href;
  };

  const NavBtn = ({ id, label, href }) => (
    <div onMouseEnter={() => openPanel(id)} onFocus={() => setOpen(id)} className="inline-block">
      <Button label={label} className="text-white" size="lg" variant="text" onClick={() => goto(href)} />
    </div>
  );

  return (
    <header
      ref={headerRef}
      onMouseLeave={scheduleClose}
      onMouseEnter={cancelClose}
      className={`
        relative w-full z-50
        bg-[var(--schemesPrimaryContainer)]
        text-[var(--schemesOnPrimaryContainer)]
        flex items-center justify-between
        shadow-[7px_6px_1px_rgba(28,27,26,0.15)]
        ${open ? "mix-blend-normal" : "mix-blend-multiply"}
        px-4 lg:px-16
        ${scrolled ? "py-2 lg:py-3" : "py-4 lg:py-6"}
        transition-all duration-300
      `}
    >
      <a href="/" className="flex items-center">
        <img
          src={Logo}
          alt="The Social Blueprint"
          className={`
            ${scrolled ? "h-12 lg:h-16" : "h-15 lg:h-20"}
            transition-all duration-300
          `}
        />
      </a>

      <div className={`hidden lg:flex flex-col items-end ${scrolled ? "gap-0" : "gap-6"} transition-all duration-300`}>
        {/* Socials fade out on scroll */}
        <div
          className={`
            transition-all duration-300 origin-top
            ${scrolled ? "opacity-0 -translate-y-1 scale-95 pointer-events-none" : "opacity-100 translate-y-0 scale-100"}
          `}
        >
          <Socials />
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-6 Blueprint-body-medium">
            <NavBtn id="whats-on" label={t("whats_on")} href="/events" />
            <NavBtn id="directory" label={t("directory")} href="/directory" />
            <NavBtn id="blueprint-stories" label={t("blueprint_stories")} href="/stories-and-interviews" />
            <NavBtn id="about-us" label={t("about_us")} href="/about-us" />
            <NavBtn id="message-board" label={t("message_board")} href="/message-boards" />
          </nav>
          <div className="flex gap-4">
            <Button
              label={t("Subscribe")}
              variant="filled"
              shape="square"
              size="lg"
              onClick={() => goto("/subscribe")}
            />
            <Button
              label={isUserLoggedIn ? t("account_dasboard") : t("log_in")}
              variant="tonal"
              shape="square"
              size="lg"
              icon={<SmileyIcon size={22} weight="bold" />}
              onClick={() => goto(isUserLoggedIn ? "/account-dashboard" : "/login")}
            />
          </div>
        </div>
      </div>

      <div className="lg:hidden items-center">
        <IconButton
          icon={<ListIcon size={22} weight="bold" />}
          style="tonal"
          size="sm"
          onClick={() => console.log("Menu clicked")}
          aria-label={t("menu")}
        />
      </div>

      <MegaPanel
        open={open}
        onClose={() => setOpen(null)}
        anchorRef={headerRef}
        onPanelEnter={cancelClose}
        onPanelLeave={scheduleClose}
      />

      {open && (
        <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 top-full z-[70]">
          <div className="w-full h-2 mt-[-8px] bg-transparent shadow-[7px_6px_1px_rgba(28,27,26,0.15)]" />
        </div>
      )}
    </header>
  );
}
