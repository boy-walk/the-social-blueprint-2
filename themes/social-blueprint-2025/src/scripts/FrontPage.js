import React, { useMemo, useRef, useEffect, useState } from "react";
import { SearchBar } from "./SearchBar";
import { ContentCard } from "./ContentCard";
import { getBadge } from "./getBadge";
import { HeroCard } from "./HeroCard";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import CostOfLiving from "../../assets/cost-of-living.svg"
import MessageBoard from "../../assets/message-board.svg"
import { PostsSlider } from "./PostsSlider";

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
        className="inline-flex px-1 py-0.5 rounded-md bg-schemesSecondaryContainer text-schemesOnSecondaryContainer Blueprint-title-large-emphasized"
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

export default function FrontPage({ candleLightingTimes, recentArticle, recentEvent, recentEverybodyHasAStory, recentCandidConversations }) {
  const words = ["creative", "resilient", "curious", "connected"];

  console.log({ recentArticle, recentEvent, recentEverybodyHasAStory, recentCandidConversations });

  return (
    <div className="bg-schemesSurface">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-16 lg:px-16 pt-10 md:pt-14 lg:pt-16">
        <div className="flex w-full flex-col lg:flex-row gap-8 md:gap-10 items-stretch">
          {/* Left column (text, search, etc.) stays the same */}
          <div className="flex flex-col items-stretch md:items-start justify-end gap-4 md:gap-5 w-full md:w-[100%] lg:w-[35%] mb-0 lg:mb-8">
            <div className="Blueprint-display-large-emphasized text-schemesOnSurface max-w-none md:max-w-xl text-center md:text-left leading-tight">
              Proudly celebrating our Melbourne Jewish community
            </div>

            <div className="Blueprint-title-large text-schemesOnSurface max-w-none md:max-w-xl text-center md:text-left">
              Helpful, friendly, and <WordRotate words={words} />.
              <br />
              Find events, stories, podcasts, and support.
            </div>

            <div className="w-full md:max-w-xl">
              <SearchBar placeholder="Search events, articles, podcasts..." />
            </div>

            <QuickLinks
              links={[
                { title: "Events", href: "/events" },
                { title: "Interviews", href: "/podcasts" },
                { title: "Stories", href: "/articles" },
                { title: "Aid", href: "/aid_listing" },
                { title: "Directory", href: "/directory" },
              ]}
            />
          </div>

          {/* Bento stack (right column) */}
          <div className="block md:hidden lg:hidden">
            <PostsSlider events={[recentArticle, recentCandidConversations, recentEverybodyHasAStory, recentEvent]} itemsToDisplay={1} />
          </div>
          <div className="flex-1 hidden md:block">
            <div
              className="
                    grid
                    md:[grid-template-columns:%50_%50]
                    grid-cols-2
                    lg:grid-cols-3
                    lg:[grid-template-columns:30%_40%_30%]
                    grid-rows-6
                    lg:grid-rows-10
                    gap-4
                    h-full
                    w-full
                    sm:w-auto
                    md:w-full
                  "
            >
              {/* COST OF LIVING */}
              <a className="relative row-span-1 lg:row-span-3 bg-schemesSecondary rounded-xl shadow-3x2 transition-transform hover:-translate-y-1" href="/cost-of-living">
                <div className="flex flex-row p-4">
                  <div className="flex flex-col items-start justify-start h-full p-2">
                    <div className="Blueprint-body-large-emphasized text-schemesOnSecondary">
                      Cost of living
                    </div>
                    <div className="Blueprint-body-large text-schemesOnSecondary mt-2">
                      Get tips and support during challenging times.
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="p-2 bg-schemesPrimaryFixed rounded-2xl">
                      <ArrowUpRightIcon
                        size={24}
                        className="text-schemesOnSecondary"
                        color="black"
                        weight="bold"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0">
                    <img src={CostOfLiving} alt="Cost of Living" className="w-24 h-20" />
                  </div>
                </div>
              </a>

              {/* MESSAGE BOARD */}
              <div className="row-span-2 lg:row-span-5">
                {recentArticle ? <HeroCard badge={getBadge(recentArticle.post_type)}
                  image={recentArticle.thumbnail}
                  href={recentArticle.permalink}
                  title={recentArticle.title}
                  subtitle={recentArticle.subtitle || recentArticle.excerpt}
                  date={recentArticle.date}
                  fullHeight
                  shadow
                /> : <div />}
              </div>

              <div className="row-span-3 lg:row-span-7">
                {recentCandidConversations ? <HeroCard badge={getBadge(recentCandidConversations.post_type)}
                  image={recentCandidConversations.thumbnail}
                  href={recentCandidConversations.permalink}
                  title={recentCandidConversations.title}
                  subtitle={recentCandidConversations.subtitle || recentCandidConversations.excerpt}
                  date={recentCandidConversations.date}
                  fullHeight
                  shadow
                /> : <div />}
              </div>

              <div className="row-span-3 lg:row-span-7">
                {recentEverybodyHasAStory ? <HeroCard badge={"Everybody has a story"}
                  image={recentEverybodyHasAStory.thumbnail}
                  href={recentEverybodyHasAStory.permalink}
                  title={recentEverybodyHasAStory.title}
                  subtitle={recentEverybodyHasAStory.subtitle || recentEverybodyHasAStory.excerpt}
                  date={recentEverybodyHasAStory.date}
                  fullHeight
                  shadow
                /> : <div />}
              </div>

              <div className="row-span-2 lg:row-span-5">
                {recentEvent ? <HeroCard badge={getBadge(recentEvent.post_type)}
                  image={recentEvent.thumbnail}
                  href={recentEvent.permalink}
                  title={recentEvent.title}
                  subtitle={recentEvent.subtitle || recentEvent.excerpt}
                  date={recentEvent.date}
                  fullHeight
                  shadow
                /> : <div />}
              </div>

              {/* MESSAGEBOARD CTA */}
              <a className="relative row-span-1 lg:row-span-3 bg-schemesPrimaryContainer rounded-xl shadow-3x2 transition-transform hover:-translate-y-1" href="/message-boards">
                <div className=" flex flex-row p-4">
                  <div className="flex flex-col items-start justify-start h-full p-2">
                    <div className="Blueprint-body-large-emphasized text-schemesOnSecondary">
                      Messageboard
                    </div>
                    <div className="Blueprint-body-large text-schemesOnSecondary mt-2">
                      Find ways to <br />volunteer, donate, or get involved today.
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="p-2 bg-schemesPrimaryFixed rounded-2xl">
                      <ArrowUpRightIcon
                        size={24}
                        className="text-schemesOnSecondary"
                        color="black"
                        weight="bold"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0">
                    <img src={MessageBoard} alt="Message Board" className="w-24 h-24" />
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-[1600px] mx-auto p-4 md:p-6 lg:px-16 lg:py-8">
        <ShabbatTicker times={candleLightingTimes} />
      </div>
    </div >
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

function ShabbatTicker({ times, speed = 100 }) {
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
    out.push('Shabbat Candle-lighting Times')
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
      className="mt-6 md:mt-8 rounded-xl bg-schemesSecondaryContainer text-schemesOnSecondaryContainer overflow-hidden shadow-3x2"
      role="region"
      aria-label="Shabbat times"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <div
        className="Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large whitespace-nowrap"
        style={{ padding: "14px 0", position: "relative" }}
      >
        <div
          className="flex gap-8 sm:gap-10 md:gap-12"
          style={{
            width: "800%",
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
          <div className="flex gap-8 sm:gap-10 md:gap-12 flex-none px-4 sm:px-6" aria-hidden="true">
            {items.map((t, i) => (
              <span key={`b-${i}`}>{t}</span>
            ))}
          </div>
          <div className="flex gap-8 sm:gap-10 md:gap-12 flex-none px-4 sm:px-6" aria-hidden="true">
            {items.map((t, i) => (
              <span key={`b-${i}`}>{t}</span>
            ))}
          </div>
          <div className="flex gap-8 sm:gap-10 md:gap-12 flex-none px-4 sm:px-6" aria-hidden="true">
            {items.map((t, i) => (
              <span key={`b-${i}`}>{t}</span>
            ))}
          </div>
          <div className="flex gap-8 sm:gap-10 md:gap-12 flex-none px-4 sm:px-6" aria-hidden="true">
            {items.map((t, i) => (
              <span key={`b-${i}`}>{t}</span>
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
