import { useState, useRef, useEffect } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { Card } from './Card';

export function QuickLinks({ categories, type = 'gd_place' }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // -10 for tolerance
  };

  useEffect(() => {
    checkScroll();
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [categories]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const containerWidth = scrollRef.current.clientWidth;
    const scrollAmount = containerWidth * 0.8; // Scroll 80% of container width
    const newPosition = direction === 'left'
      ? scrollRef.current.scrollLeft - scrollAmount
      : scrollRef.current.scrollLeft + scrollAmount;

    scrollRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div className="p-4 md:px-8 md:pb-8 lg:px-16">
      <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSurface mb-4 mt-4">
        Quick Links
      </h2>
      <div className="mt-6 relative">
        {/* Left Arrow - Desktop Only */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute -left-14 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-schemesSurface shadow-lg border border-schemesOutlineVariant hover:bg-schemesSurfaceContainerHighest transition-colors"
            aria-label="Scroll left"
          >
            <CaretLeft size={24} weight="bold" className="text-schemesOnSurface" />
          </button>
        )}

        {/* Scrollable Container with padding for arrows */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto overflow-y-visible snap-x snap-mandatory scrollbar-hidden pb-2 md:px-2"
        >
          {categories.map((category) => {
            const categoryLink = `/${type}/category/${category.slug}`;
            const bgColor = category.color || '#6ED4BE';
            const hasFaIcon = category.fa_icon && typeof category.fa_icon === 'string';

            // Build image URL if available
            const imageUrl = category.image_url
              ? (category.image_url.startsWith('http')
                ? category.image_url
                : `/wp-content/uploads/${category.image_url}`)
              : null;

            return (
              <div key={category.id} className="shrink-0 snap-start w-[45%] sm:w-[30%] md:w-[calc(25%-18px)] lg:w-[calc(20%-19.2px)]">
                <Card styles="shadow-3x3" href={categoryLink}>
                  <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                    {hasFaIcon ? (
                      <div
                        className="rounded-[12px] p-1 flex items-center justify-start"
                        style={{ backgroundColor: bgColor }}
                      >
                        <i
                          className={`${category.fa_icon} text-white`}
                          style={{ fontSize: '22px' }}
                          aria-hidden="true"
                        />
                      </div>
                    ) : imageUrl ? (
                      <div className="w-full h-full flex items-center justify-start">
                        <img
                          src={imageUrl}
                          alt={category.name}
                          className="max-w-full max-h-[4em] object-contain"
                        />
                      </div>
                    ) : null}
                    <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">
                      {category.name}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Right Arrow - Desktop Only */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute -right-14 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-schemesSurface shadow-lg border border-schemesOutlineVariant hover:bg-schemesSurfaceContainerHighest transition-colors"
            aria-label="Scroll right"
          >
            <CaretRight size={24} weight="bold" className="text-schemesOnSurface" />
          </button>
        )}
      </div>
    </div>
  );
}