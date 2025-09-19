import React, { useRef, useState, useEffect, useMemo } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Card } from "./Card";

/**
 * messageBoard: Array<{
 *   id: string|number,
 *   permalink: string,
 *   title: string,
 *   excerpt?: string,
 *   categories?: string[],       // <-- used for the chips
 *   iconUrl?: string             // optional square art for the left tile
 * }>
 */
export function MessageBoardSlider({ messageBoard = [], displaySlider = true }) {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [itemWidthPx, setItemWidthPx] = useState(null); // measured pixel width per visible item
  const GAP_FALLBACK_PX = 8; // matches gap-2 (Tailwind) = 0.5rem = 8px usually

  if (!Array.isArray(messageBoard) || messageBoard.length === 0) return null;

  // update itemsPerView on resize
  useEffect(() => {
    const updateItems = () => setItemsPerView(window.innerWidth < 1028 ? 1 : 3);
    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  // measure container and compute pixel width per item accounting for gap and container paddings
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const computeSizes = () => {
      const style = window.getComputedStyle(el);
      // prefer 'gap' then 'column-gap' then fallback
      const gapValue = style.getPropertyValue("gap") || style.getPropertyValue("column-gap") || `${GAP_FALLBACK_PX}px`;
      const gapPx = parseFloat(gapValue) || GAP_FALLBACK_PX;

      // get container width and paddings
      const containerRect = el.getBoundingClientRect();
      const containerWidth = containerRect.width;

      const paddingLeft = parseFloat(style.getPropertyValue("padding-left")) || 0;
      const paddingRight = parseFloat(style.getPropertyValue("padding-right")) || 0;

      // total gaps per "viewport" is (itemsPerView - 1) gaps
      const totalGaps = Math.max(0, itemsPerView - 1) * gapPx;

      // available width for items (subtract paddings and total gaps)
      const availableForItems = Math.max(0, containerWidth - paddingLeft - paddingRight - totalGaps);

      // width per item in px
      const perItem = availableForItems / itemsPerView;

      setItemWidthPx(perItem);

      // ensure there's some right padding so last card isn't visually clipped when scaled/shadowed
      // we set inline padding-right to at least gapPx (if existing paddingRight is smaller)
      const desiredRightPad = Math.max(paddingRight, gapPx);
      if (parseFloat(style.getPropertyValue("padding-right")) !== desiredRightPad) {
        el.style.paddingRight = `${desiredRightPad}px`;
      }
      // also ensure small left padding to mirror right (keeps visual balance)
      const desiredLeftPad = Math.max(paddingLeft, gapPx / 2);
      if (parseFloat(style.getPropertyValue("padding-left")) !== desiredLeftPad) {
        el.style.paddingLeft = `${desiredLeftPad}px`;
      }
    };

    // initial compute
    computeSizes();

    // observe resizes
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(computeSizes);
      ro.observe(el);
    } else {
      window.addEventListener("resize", computeSizes);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", computeSizes);
    };
  }, [itemsPerView, messageBoard.length]);

  const totalSlides = useMemo(
    () => Math.ceil(messageBoard.length / itemsPerView),
    [messageBoard.length, itemsPerView]
  );

  const scrollToIndex = (index) => {
    const el = scrollRef.current;
    if (!el) return;

    // get gap in px (same logic as measurement)
    const style = window.getComputedStyle(el);
    const gapValue = style.getPropertyValue("gap") || style.getPropertyValue("column-gap") || `${GAP_FALLBACK_PX}px`;
    const gapPx = parseFloat(gapValue) || GAP_FALLBACK_PX;

    // width per item
    const childWidth = itemWidthPx != null
      ? itemWidthPx
      : (el.getBoundingClientRect().width / itemsPerView);

    const fullItemWidth = childWidth + gapPx;

    // calculate target left; ensure we account for the left padding we may have set on the scroller
    const paddingLeft = parseFloat(style.getPropertyValue("padding-left")) || 0;
    const targetLeft = fullItemWidth * itemsPerView * index - paddingLeft;

    el.scrollTo({ left: targetLeft, behavior: "smooth" });
    setCurrentIndex(index);
  };

  const next = () => { if (currentIndex < totalSlides - 1) scrollToIndex(currentIndex + 1); };
  const prev = () => { if (currentIndex > 0) scrollToIndex(currentIndex - 1); };

  return (
    <div>
      {/* Allow overflow to be visible so hover scale + shadow aren't clipped */}
      <div className="overflow-visible">
        <div
          ref={scrollRef}
          // keep horizontal scrolling but allow vertical overflow; remove hard px padding here because we set it dynamically above
          className="flex items-stretch gap-2 transition-transform duration-300 ease-in-out overflow-x-auto overflow-y-visible py-2 scrollbar-hidden"
        >
          {messageBoard.map((post) => {
            const cats = Array.isArray(post.categories) ? post.categories.slice(0, 2) : [];
            const extra = Array.isArray(post.categories) && post.categories.length > 2
              ? post.categories.length - 2
              : 0;

            // prefer pixel width when available — this ensures the gap is accounted for exactly
            const itemStyle = itemWidthPx != null
              ? { width: `${itemWidthPx}px` }
              : { width: `${100 / itemsPerView}%` };

            return (
              <div
                key={post.id}
                // keep the hover transform but avoid clipping by letting the parent be overflow-visible
                className="flex-shrink-0 transform transition-transform duration-200 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg will-change-transform"
                style={itemStyle}
              >
                <Card href={post.permalink} styles="h-full">
                  <div className="flex gap-2">
                    {/* Left tile */}
                    <div className="flex-none w-27 h-36 overflow-hidden grid place-items-center p-2">
                      {post.thumbnail ? (
                        <img
                          src={post.thumbnail}
                          alt=""
                          className="aspect-[3/4] w-full h-full object-cover rounded-lg"
                          loading="lazy"
                        />
                      ) : (
                        <svg viewBox="0 0 24 24" className="w-10 h-10 text-schemesOnSecondaryContainer">
                          <path fill="currentColor" d="M3 20h18v-2H3v2Zm9-4q-2.075 0-3.537-1.463T7 11q0-2.075 1.463-3.538T12 6q2.075 0 3.538 1.462T17 11q0 2.075-1.462 3.537T12 16Z" />
                        </svg>
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 p-4">
                      {/* Chips */}
                      {cats.length > 0 && (<div className="flex flex-wrap gap-2 mb-2">
                        <span
                          key={`${cats[0].id}-cat`}
                          className="rounded-md px-3 py-1.5 bg-schemesSurfaceContainer text-schemesOnSurface Blueprint-label-small"
                        >
                          {cats[0]}
                        </span>
                      </div>)}

                      <h3 className="Blueprint-body-small-emphasized md:Blueprint-body-medium-emphasized lg:Blueprint-body-large-emphasized text-schemesOnSurface mb-1 md:mb-2 line-clamp-2">
                        {post.title}
                      </h3>

                      {post.subtitle && (
                        <p className="text-schemesOnSurfaceVariant Blueprint-body-small md:Blueprint-body-medium line-clamp-3">
                          {post.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div >

      {displaySlider && (
        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={prev}
            aria-label="Previous"
            className={`bg-schemesSurface rounded-xl py-1.5 px-3 flex items-center justify-center ${currentIndex === 0 ? "opacity-30 cursor-not-allowed" : ""}`}
            disabled={currentIndex === 0}
          >
            <ArrowLeftIcon size={20} weight="bold" />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className={`bg-schemesSurface rounded-xl py-1.5 px-3 flex items-center justify-center ${currentIndex >= totalSlides - 1 ? "opacity-30 cursor-not-allowed" : ""}`}
            disabled={currentIndex >= totalSlides - 1}
          >
            <ArrowRightIcon size={20} weight="bold" />
          </button>
        </div>
      )
      }
    </div >
  );
}
