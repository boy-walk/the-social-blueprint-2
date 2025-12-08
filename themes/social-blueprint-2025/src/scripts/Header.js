import React, { useEffect, useRef, useState, useMemo } from "react";
import Logo from "../../assets/logo.svg";
import LogoDark from "../../assets/logo-dark.svg";
import { Button } from "./Button";
import { IconButton } from "./Icon";
import { useTranslation } from "react-i18next";
import {
  ListIcon,
  XIcon,
  PlusIcon,
  MinusIcon,
  SmileyIcon,
  CaretDownIcon,
  CaretUpIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import { Socials } from "./Socials";

function useAdminBarOffset() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const root = document.getElementById("header");
    if (!root) return;

    const getBar = () => document.getElementById("wpadminbar");
    const compute = () => {
      const bar = getBar();
      const h = bar ? Math.round(bar.getBoundingClientRect().height) : 0;
      setOffset(h);
      if (bar) {
        bar.style.position = "fixed";
        bar.style.top = "0";
        bar.style.left = "0";
        bar.style.right = "0";
        bar.style.zIndex = "99999";
      }
      root.style.position = "sticky";
      root.style.top = `${h}px`;
      root.style.zIndex = "1000";
    };

    compute();

    const ro = (window.ResizeObserver && getBar())
      ? new ResizeObserver(compute)
      : null;
    if (ro && getBar()) ro.observe(getBar());

    window.addEventListener("resize", compute);
    const id = setInterval(() => {
      if (!getBar()) return;
      compute();
      clearInterval(id);
    }, 200);

    return () => {
      window.removeEventListener("resize", compute);
      if (ro) ro.disconnect();
      clearInterval(id);
    };
  }, []);

  return offset;
}

const MENU_SECTIONS = {
  "whats-on": [
    {
      title: "Discover",
      items: [
        { label: "Discover Events", href: "/events" },
        { label: "View Calendar", href: "/events" },
        { label: "Featured Events", href: "/events?featured=1" },
        { label: "Submit an event", href: "/events-calendar/community/add" },
      ],
    },
    {
      title: "Browse by Audience",
      items: [
        { label: "For Families", href: "/events?audience=families" },
        { label: "For Adults", href: "/events?audience=adults" },
        { label: "Community Groups", href: "/events?audience=groups" },
        { label: "For Seniors", href: "/events?audience=seniors" },
      ],
    },
  ],
  directory: [
    {
      title: "Browse",
      items: [
        { label: "All Listings", href: "/directory" },
        { label: "Featured Listings", href: "/directory?featured=1" },
        { label: "Support Services", href: "/directory?type=service" },
      ],
    },
    {
      title: "Contribute",
      items: [
        { label: "Add a Listing", href: "/add-listing-hub" },
        { label: "Contact & Support", href: "/contact" },
      ],
    },
  ],
  "blueprint-stories": [
    {
      title: "Read & Listen",
      items: [
        { label: "Articles and blogs", href: "/articles" },
        { label: "Everybody has a story", href: "/podcasts/?series=everybody-has-a-story" },
        { label: "Candid conversations", href: "/podcasts/?series=candid-conversations" },
      ],
    },
    {
      title: "Categories",
      items: [
        { label: "Community & Connection", href: "/stories-and-interviews?theme=community-connection" },
        { label: "Culture & Identity", href: "/stories-and-interviews?theme=culture-and-identity" },
        { label: "Learning & Growth", href: "/stories-and-interviews?theme=learning-and-growth" },
      ],
    },
  ],
  "about-us": [
    {
      title: "About Us",
      items: [
        { label: "Our Mission", href: "/about-us" },
        { label: "Contact & Support", href: "/contact-us" },
        { label: "FAQs", href: "/faqs" },
        { label: "Terms and conditions", href: "/terms" },
      ],
    },
  ],
  "message-board": [
    {
      title: "Message Board",
      items: [
        { label: "Browse Message board", href: "/message-boards" },
        { label: "Post a notice", href: "/add-listing/message-boards/" },
      ],
    },
    {
      title: "Browse by category",
      items: [
        { label: "Activities | Program Alerts", href: "/message-boards?cat=activities" },
        { label: "Community Jobs", href: "/message-boards?cat=jobs" },
        { label: "Notice Board", href: "/message-boards?cat=noticeboard" },
        { label: "Volunteers | Donations", href: "/message-boards?cat=volunteers" },
      ],
    },
  ],
  "explore-by": [
    {
      title: "Explore by theme",
      items: [
        { label: "Community & Connection", href: "/community-connection" },
        { label: "Culture & Identity", href: "/culture-and-identity" },
        { label: "Learning & Growth", href: "/learning-and-growth" },
        { label: "Support & Services", href: "/support-and-services" },
        { label: "Events & Experiences", href: "/events-and-experiences" },
      ],
    },
    {
      title: "Explore by content type",
      items: [
        { label: "Events", href: "/events" },
        { label: "Podcasts", href: "/podcasts" },
        { label: "Articles", href: "/articles" },
        { label: "Message Board", href: "/message-boards" },
      ],
    },
    {
      title: "Explore by topic",
      items: [
        { label: "View all topics", href: "/topics" },
      ]
    }
  ],
};

const SECTION_ROUTES = {
  "whats-on": "/events",
  directory: "/directory",
  "blueprint-stories": "/stories-and-interviews",
  "about-us": "/about-us",
  "message-board": "/message-boards",
  "explore-by": "/topics",
};

function MegaPanel({ open, onClose, anchorRef, onPanelEnter, onPanelLeave }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      const p = panelRef.current;
      const a = anchorRef?.current;
      if (!p) return;
      if (p.contains(e.target) || a?.contains?.(e.target)) return;
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

  const groups = useMemo(() => MENU_SECTIONS[open] || [], [open]);

  if (!open) return null;

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
      "
    >
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-16 py-8">
        <div
          className={`
            grid gap-8 items-start
            ${groups.length >= 3 ? "grid-cols-3" : "grid-cols-2"}
          `}
        >
          {groups.map((section) => (
            <div key={section.title} className="min-w-0">
              <div className="Blueprint-title-small text-[var(--schemesOnSurface)] mb-2">
                {section.title}
              </div>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="Blueprint-body-medium block py-1.5 text-[var(--schemesOnSurface)] hover:text-[var(--schemesPrimary)]"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileMenu({
  open,
  onClose,
  isUserLoggedIn,
}) {
  const [expanded, setExpanded] = useState({});
  const [present, setPresent] = useState(open);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (open) {
      setPresent(true);
      setEntered(false);
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setEntered(true))
      );
      return () => cancelAnimationFrame(id);
    } else {
      setEntered(false);
      const t = setTimeout(() => setPresent(false), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!present) return;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [present]);

  if (!present) return null;

  const goto = (href) => {
    window.location.href = href;
  };

  return (
    <div
      className={`
        fixed inset-0 z-[999] lg:hidden
        bg-black/40
        transition-opacity duration-300
        ${entered ? "opacity-100" : "opacity-0"}
      `}
      aria-modal="true"
      role="dialog"
      id="mobile-menu"
      onClick={onClose}
    >
      <aside
        className={`
          absolute inset-y-0 left-0 w-full
          bg-[var(--schemesSurface)] text-[var(--schemesOnSurface)]
          shadow-[0_12px_28px_rgba(0,0,0,.25)]
          p-5 pt-6
          overflow-y-auto
          transform transition-transform duration-300 ease-out
          ${entered ? "translate-x-0" : "-translate-x-full"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <a href="/" className="flex items-center" onClick={onClose}>
            <img src={LogoDark} alt="The Social Blueprint" className="h-14" />
          </a>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--schemesSurfaceContainerHigh)]"
            aria-label="Close menu"
          >
            <XIcon size={28} weight="bold" />
          </button>
        </div>

        {/* Search bar in mobile */}
        <div className="mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const query = e.target.elements.search.value.trim();
              if (query) {
                window.location.href = `/?s=${encodeURIComponent(query)}`;
              }
            }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <div className="bg-schemesPrimaryFixed rounded-lg p-1.5">
                <MagnifyingGlassIcon size={22} />
              </div>
            </div>
            <input
              type="search"
              name="search"
              className="block w-full py-3 pl-13 pr-4 Blueprint-body-large text-schemesOnSurfaceVariant border border-border-light rounded-xl bg-schemesSurfaceContainerLowest focus:ring-2 focus:ring-[#1e6586] focus:border-[#1e6586] outline-none"
              placeholder="Search..."
            />
          </form>
        </div>

        {/* Socials button */}
        <div className="mb-6">
          <Button
            label="Find our socials"
            variant="filled"
            shape="square"
            size="lg"
            className="w-full"
            icon={<PlusIcon size={16} weight="bold" />}
            onClick={() => window.open("https://linktr.ee/socialblueprint", "_blank")}
          />
        </div>

        <nav>
          {Object.entries(MENU_SECTIONS).map(([key, groups], idx) => {
            const isOpen = !!expanded[key];
            const panelId = `mm-panel-${key}`;
            return (
              <div key={key} className={idx ? "border-t border-[var(--schemesOutlineVariant)]" : ""}>
                <div className="w-full flex items-center justify-between py-4">
                  <a
                    href={SECTION_ROUTES[key]}
                    className="Blueprint-title-medium hover:text-[var(--schemesPrimary)]"
                    onClick={onClose}
                  >
                    {{
                      "whats-on": "Whats on",
                      directory: "Directory",
                      "blueprint-stories": "Blueprint stories",
                      "about-us": "About us",
                      "message-board": "Message board",
                      "explore-by": "Explore by",
                    }[key]}
                  </a>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setExpanded((m) => ({ ...m, [key]: !m[key] }))}
                    className="p-2 rounded-md hover:bg-[var(--schemesSurfaceContainerHigh)]"
                  >
                    {isOpen ? (
                      <MinusIcon size={24} className="text-[var(--schemesPrimary)]" weight="bold" />
                    ) : (
                      <PlusIcon size={24} className="text-[var(--schemesPrimary)]" weight="bold" />
                    )}
                  </button>
                </div>

                <div
                  id={panelId}
                  className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    {groups.map((group, gi) => (
                      <div key={gi} className={gi ? "my-3 pt-3 border-t border-[var(--schemesOutlineVariant)]" : ""}>
                        <div className="Blueprint-title-small text-[var(--schemesOnSurfaceVariant)] mb-3">
                          {group.title}
                        </div>
                        <ul className="space-y-3">
                          {group.items.map((it) => (
                            <li key={it.href}>
                              <a
                                href={it.href}
                                className="block Blueprint-body-large hover:text-[var(--schemesPrimary)]"
                                onClick={onClose}
                              >
                                {it.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <Button
            label={isUserLoggedIn ? "Account" : "Log in"}
            variant="tonal"
            size="lg"
            icon={<SmileyIcon size={22} weight="bold" />}
            onClick={() => goto(isUserLoggedIn ? "/account-dashboard" : "/login")}
          />
          {!isUserLoggedIn && (
            <><Button
              label="Register as Individual"
              className="w-full px-4 py-2 Blueprint-body-medium text-schemesOnSurface hover:bg-schemesSurfaceContainerLow"
              variant="tonal"
              size="lg"
              role="menuitem"
              onClick={() => goto("/register-individual")}
            />
              <Button
                label="Register as Organisation"
                className="w-full px-4 py-2 Blueprint-body-medium text-schemesOnSurface hover:bg-schemesSurfaceContainerLow"
                variant="tonal"
                role="menuitem"
                size="lg"
                onClick={() => goto("/register-organisation")}
              />
            </>)}
        </div>
      </aside >
    </div >
  );
}

export default function Header({ isUserLoggedIn = false }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const hoverTimer = useRef(null);
  const headerRef = useRef(null);
  useAdminBarOffset();

  useEffect(() => {
    if (!showRegister) return;
    const onClick = (e) => {
      if (!headerRef.current) return;
      if (!headerRef.current.contains(e.target)) setShowRegister(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [showRegister]);

  useEffect(() => {
    if (!searchExpanded) return;
    const onClick = (e) => {
      if (!searchRef.current) return;
      if (!searchRef.current.contains(e.target)) {
        setSearchExpanded(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [searchExpanded]);

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
    evaluate();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openPanel = (key) => {
    if (!isDesktop) return;
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    setOpen(key);
  };
  const scheduleClose = () => {
    if (!isDesktop) return;
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpen(null), 80);
  };
  const cancelClose = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
  };
  const goto = (href) => (window.location.href = href);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      goto(`/?s=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const NavBtn = ({ id, label, href }) => (
    <div onMouseEnter={() => openPanel(id)} onFocus={() => setOpen(id)} className="inline-block">
      <Button label={label} className="text-white" size="lg" variant="text" onClick={() => goto(href)} />
    </div>
  );

  return (
    <>
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
        <a href="/" className="flex items-center flex-none">
          <img
            src={Logo}
            alt="The Social Blueprint"
            className={[
              "block w-auto flex-none object-contain",
              "min-h-[24px] md:min-h-[32px] lg:min-h-[36px]",
              scrolled ? "max-h-12 lg:max-h-16" : "max-h-16 lg:max-h-20",
              "transition-all duration-300",
            ].join(" ")}
          />
        </a>

        <div className={`hidden lg:flex flex-col items-end ${scrolled ? "gap-0" : "gap-4"} transition-all duration-300`}>
          <div
            className={`
              transition-all duration-300 origin-top
              ${scrolled ? "opacity-0 -translate-y-1 scale-95 pointer-events-none" : "opacity-100 translate-y-0 scale-100"}
            `}
          >
            <div className="flex gap-4 relative items-center">
              {/* Search bar / button */}
              <div ref={searchRef} className="relative">
                {searchExpanded ? (
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <div className="bg-schemesPrimaryFixed rounded-lg p-1.5">
                        <MagnifyingGlassIcon size={20} color="black" />
                      </div>
                    </div>
                    <input
                      type="search"
                      autoFocus
                      className="block w-120 py-2 pl-13 pr-4 Blueprint-body-large text-schemesOnSurfaceVariant border border-border-light rounded-xl bg-schemesSurfaceContainerLowest focus:ring-2 focus:ring-[#1e6586] focus:border-[#1e6586] outline-none"
                      placeholder="Search..."
                      onChange={(e) => setSearchQuery(e.target.value)}
                      value={searchQuery}
                    />
                  </form>
                ) : (
                  <Button
                    label="Search"
                    variant="ghost"
                    shape="square"
                    size="base"
                    icon={<MagnifyingGlassIcon size={22} weight="duotone" />}
                    onClick={() => setSearchExpanded(true)}
                  />
                )}
              </div>

              {/* Socials button */}
              <Button
                label="Find our socials"
                variant="filled"
                shape="square"
                size="base"
                icon={<PlusIcon size={16} weight="bold" />}
                onClick={() => window.open("https://linktr.ee/socialblueprint", "_blank")}
              />

              {/* Account/Login buttons */}
              {isUserLoggedIn ? (
                <Button
                  label={t("account_dasboard")}
                  variant="tonal"
                  shape="square"
                  size="base"
                  icon={<SmileyIcon size={22} weight="bold" />}
                  onClick={() => goto("/account-dashboard")}
                />
              ) : (
                <div className="relative">
                  <div className="flex items-center gap-1">
                    <Button
                      label={"Log in/Register"}
                      variant="tonal"
                      shape="pill"
                      size="sm"
                      icon={<SmileyIcon size={22} weight="bold" />}
                      onClick={() => goto("/login")}
                    />
                    <Button
                      label={showRegister ? <CaretUpIcon weight="bold" /> : <CaretDownIcon weight="bold" />}
                      variant="tonal"
                      shape="square"
                      className="h-full"
                      size="lg"
                      onClick={() => setShowRegister((v) => !v)}
                    />
                  </div>

                  {showRegister && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-md z-50"
                      role="menu"
                    >
                      <Button
                        label="Register as Individual"
                        className="w-full justify-start px-4 py-2 mb-1 Blueprint-body-medium text-schemesOnSurface hover:bg-schemesSurfaceContainerLow border-1 border-black"
                        variant="tonal"
                        role="menuitem"
                        onClick={() => goto("/register-individual")}
                      />
                      <Button
                        label="Register as Organisation"
                        className="w-full justify-start px-4 py-2 Blueprint-body-medium text-schemesOnSurface hover:bg-schemesSurfaceContainerLow border-1 border-black"
                        variant="tonal"
                        role="menuitem"
                        onClick={() => goto("/register-organisation")}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <nav className="hidden lg:flex items-center Blueprint-body-medium">
              <NavBtn id="whats-on" label={t("whats_on")} href="/events" />
              <NavBtn id="directory" label={t("directory")} href="/directory" />
              <NavBtn id="blueprint-stories" label={t("blueprint_stories")} href="/stories-and-interviews" />
              <NavBtn id="about-us" label={t("about_us")} href="/about-us" />
              <NavBtn id="message-board" label={t("message_board")} href="/message-boards" />
              <NavBtn id="explore-by" label={"Explore by"} href="/topics" />
            </nav>
          </div>
        </div>

        <div className="lg:hidden items-center">
          <IconButton
            icon={<ListIcon size={22} weight="bold" />}
            style="tonal"
            size="md"
            shape="pill"
            onClick={() => setMobileOpen(true)}
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

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} isUserLoggedIn={isUserLoggedIn} />
    </>
  );
}