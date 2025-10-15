import React, { useMemo, useRef, useEffect, useState } from "react";
import { SearchBar } from "./SearchBar";
import { ContentCard } from "./ContentCard";
import { getBadge } from "./getBadge";

/* WordRotate: unchanged behavior, with responsive-safe inline styles */
function WordRotate({ words = [], stepMs = 220, pauseMs = 900 }) {
  const i = useRef(0);
  const [angle, setAngle] = useState(-6);
  const [stage, setStage] = useState("pauseTop");
  const t = useRef(null);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) return;
    if (stage === "pauseTop" || stage === "pauseBottom") {
      clearTimeout(t.current);
      t.current = setTimeout(
        () => setStage(stage === "pauseTop" ? "toBottom" : "toTop"),
        pauseMs
      );
    }
    return () => clearTimeout(t.current);
  }, [stage, pauseMs, reduced]);

  useEffect(() => {
    if (reduced) return;
    if (stage === "toBottom") setAngle(6);
    if (stage === "bounceBottom1") setAngle(2);
    if (stage === "bounceBottom2") setAngle(4);
    if (stage === "toTop") setAngle(-6);
    if (stage === "bounceTop1") setAngle(-2);
    if (stage === "bounceTop2") setAngle(-4);
  }, [stage, reduced]);

  const onEnd = () => {
    if (reduced) return;
    if (stage === "toBottom") {
      i.current = (i.current + 1) % words.length;
      return setStage("bounceBottom1");
    }
    if (stage === "bounceBottom1") return setStage("bounceBottom2");
    if (stage === "bounceBottom2") return setStage("pauseBottom");
    if (stage === "toTop") {
      i.current = (i.current + 1) % words.length;
      return setStage("bounceTop1");
    }
    if (stage === "bounceTop1") return setStage("bounceTop2");
    if (stage === "bounceTop2") return setStage("pauseTop");
  };

  const transition =
    stage === "toBottom" || stage === "toTop"
      ? `transform ${stepMs}ms cubic-bezier(.2,.8,0,1.1)`
      : stage.includes("bounce")
        ? `transform ${stepMs}ms cubic-bezier(.2,.7,0,1)`
        : "none";

  return (
    <span className="inline-flex align-middle items-center">
      <span
        onTransitionEnd={onEnd}
        className="inline-flex px-1 py-0.5 rounded-md bg-schemesSecondaryFixedDim text-schemesOnSecondaryFixed Blueprint-body-large-emphasized"
        style={{
          transform: `rotate(${reduced ? 0 : angle}deg)`,
          transformOrigin: "50% 60%",
          transition,
          willChange: "transform",
          backfaceVisibility: "hidden",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-live="polite"
      >
        {words[i.current]}
      </span>
    </span>
  );
}

export default function FrontPage({ candleLightingTimes, recentMessageBoard, recentEvent, recentArticle, recentPodcast }) {
  const words = ["creative", "resilient", "curious", "connected"];

  return (
    <div className="bg-schemesSecondaryFixed">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-10 md:py-14 lg:py-16">
        <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-10 w-full">
          <div className="flex flex-col items-stretch md:items-start justify-start gap-4 md:gap-5 w-full">
            <div className="Blueprint-display-large-emphasized text-schemesOnPrimaryFixed max-w-none md:max-w-2xl text-center md:text-left leading-tight">
              Proudly celebrating our Melbourne Jewish community
            </div>

            <div className="Blueprint-body-large text-schemesOnPrimaryFixedVariant max-w-none md:max-w-xl text-center md:text-left">
              Helpful, friendly, and <WordRotate words={words} />. Find events, stories, podcasts,
              and <br className="hidden md:block" />
              support.
            </div>

            {/* Search: full-width on mobile, constrained on larger screens */}
            <div className="w-full md:max-w-xl">
              <SearchBar placeholder="Search events, articles, podcasts..." />
            </div>

            {/* Quick links: grid on mobile, row on md+; full-width tappable targets */}
            <QuickLinks
              links={[
                { title: "Events", href: "/events" },
                { title: "Podcasts", href: "/podcasts" },
                { title: "Stories", href: "/articles" },
                { title: "Aid", href: "/aid_listing" },
                { title: "Directory", href: "/directory" },
              ]}
            />

            {/* Shabbat ticker: full width on mobile; constrained on md+ */}
            <div className="w-full md:max-w-3xl">
              <ShabbatTicker times={candleLightingTimes} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 h-full w-full max-w-xl">
            {recentMessageBoard ? <ContentCard
              badge={getBadge(recentMessageBoard.post_type)}
              image={recentMessageBoard.thumbnail}
              href={recentMessageBoard.permalink}
              fullHeight
            /> : <div></div>}
            {recentEvent ? <ContentCard
              badge={getBadge(recentEvent.post_type)}
              image={recentEvent.thumbnail}
              href={recentEvent.permalink}
              fullHeight
            /> : <div></div>}
            {recentArticle ? <ContentCard
              badge={getBadge(recentArticle.post_type)}
              image={recentArticle.thumbnail}
              href={recentArticle.permalink}
              fullHeight
            /> : <div></div>}
            {recentPodcast ? <ContentCard
              badge={getBadge(recentPodcast.post_type)}
              image={recentPodcast.thumbnail}
              href={recentPodcast.permalink}
              fullHeight
            /> : <div></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* QuickLinks: responsive grid → row */
const QuickLinks = ({ links = [] }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-row gap-3 md:gap-4">
      {links.map((link, i) => (
        <a key={i} href={link.href || "#"} className="no-underline md:flex-1">
          <div className="w-full text-center Blueprint-label-large px-4 py-2 md:py-1.5 rounded-lg bg-schemesOnPrimaryContainer text-schemesOnPrimaryFixed">
            {link.title}
          </div>
        </a>
      ))}
    </div>
  );
};

function ShabbatTicker({ times, speed = 35 }) {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const items = useMemo(() => {
    if (!times) return [];
    const src = times.shabbat ?? times;
    const c = src.candle_lighting ?? src.candleLighting;
    const h = src.havdalah ?? src.Havdalah;

    const fmtTs = (ts) =>
      new Date(ts * 1000).toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });

    const line = (ev, fallbackLabel) => {
      if (!ev) return null;
      const label = ev.title || fallbackLabel;
      if (ev.date && ev.time) return `${label}: ${ev.date}`;
      if (ev.timestamp) return `${label}: ${fmtTs(ev.timestamp)}`;
      return null;
    };

    const out = [];
    const cLine = line(c, "Candle lighting");
    const hLine = line(h, "Havdalah");
    if (cLine) out.push(cLine);
    if (hLine) out.push(hLine);
    return out;
  }, [times]);

  if (!items.length) return null;

  const [paused, setPaused] = useState(false);
  const onEnter = () => setPaused(true);
  const onLeave = () => setPaused(false);

  return (
    <div
      className="mt-6 md:mt-8 rounded-xl bg-schemesOnSecondary opacity-80 text-schemesOnSurface overflow-hidden"
      role="region"
      aria-label="Shabbat times"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <div
        className="Blueprint-title-medium whitespace-nowrap"
        style={{ padding: "14px 0", position: "relative" }}
      >
        <div
          className="flex gap-8 sm:gap-10 md:gap-12"
          style={{
            width: "200%",
            animation: prefersReduced ? "none" : "tsb-marquee linear infinite",
            animationDuration: `${speed}s`,
            animationPlayState: paused ? "paused" : "running",
            willChange: "transform",
            opacity: 1,
          }}
        >
          <div className="flex gap-8 sm:gap-10 md:gap-12 flex-none px-4 sm:px-6">
            {items.map((t, i) => (
              <span key={`a-${i}`}>{t}</span>
            ))}
          </div>
          <div className="flex gap-8 sm:gap-10 md:gap-12 flex-none px-4 sm:px-6" aria-hidden="true">
            {items.map((t, i) => (
              <span key={`b-${i}`}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes tsb-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
