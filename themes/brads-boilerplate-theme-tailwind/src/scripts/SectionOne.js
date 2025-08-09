import React, { useRef, useEffect } from 'react';
import { Button } from './Button';
import PillTag from './PillTag';
import { ExploreByTheme } from './ExploreByTheme';
import FeaturedPostLayout from './FeaturedPostLayout';
import { StarIcon } from '@phosphor-icons/react';
import { MessageBoardSlider } from './MessageBoardSlider';
import { ListingCallout } from './ListingCallout';
import { NewsletterBanner } from './NewsletterBanner';
import { PdfFlipBook } from './PdfFlipBook';

export const SectionOne = ({ events, podcasts, messageBoardPosts, dynamicProps, historicalPhotos }) => {
  console.log(historicalPhotos)
  return (
    <div>
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col justify-center items-center gap-12 w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex gap-3 justify-center items-center">
            <div className="Blueprint-headline-large-emphasized italic text-center leading-snug">
              Explore by
            </div>
            <PillTag label="Theme" backgroundColor="schemesPrimaryContainer" />
          </div>
          <div className="w-full Blueprint-body-large text-center text-schemesOnSurface">
            From support services to creative culture, start where you're curious.
          </div>
        </div>
        <div className="w-full flex justify-center pb-8">
          <div className="max-w-[1400px] w-full px-12 lg:px-0">
            <ExploreByTheme />
          </div>
        </div>
        <div className="py-16 px-4 sm:px-8 lg:px-16">
          <div className="bg-schemesPrimaryFixed flex flex-col items-center gap-12 self-stretch rounded-3xl shadow-3x3 px-4 sm:px-6 md:px-8 lg:px-16 py-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 w-full">
              <div className="flex flex-col justify-center items-start gap-12">
                <div className="flex gap-3 items-center">
                  <div className="Blueprint-headline-large-emphasized italic leading-snug">Upcoming</div>
                  <PillTag label="Events" backgroundColor="schemesPrimaryContainer" />
                </div>
                <div className="w-full Blueprint-body-large text-schemesOnSurfaceVariant">
                  Workshops, holidays, classes and community gatherings, updated regularly.
                </div>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <Button
                  label="Browse the calendar"
                  onClick={() => (window.location.href = '/events')}
                  size="base"
                  variant="filled"
                  icon={<div className="bg-white rounded-full p-1"><StarIcon color="#1e6586" weight="fill" size={12} /></div>}
                />
                <Button
                  label="View all events"
                  onClick={() => (window.location.href = '/submit-event')}
                  size="base"
                  variant="filled"
                />
              </div>
            </div>
            <FeaturedPostLayout posts={events} />
          </div>
        </div>
        <div className="px-4 sm:px-8 lg:px-16">
          <div className="py-16 px-4 sm:px-8 lg:px-16 h-full w-full flex flex-col items-center gap-12 self-stretch rounded-3xl shadow-3x1 ">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 w-full">
              <div className="flex flex-col justify-center items-start gap-12">
                <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
                  <PillTag label="Real stories" backgroundColor="schemesPrimaryContainer" />
                  <div className="Blueprint-headline-large-emphasized italic leading-snug">from our community</div>
                </div>
                <div className="w-full Blueprint-body-large text-schemesOnSurfaceVariant">
                  Personal reflections, creative insights and thoughtful perspectives.
                </div>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <Button
                  label="View all"
                  onClick={() => (window.location.href = '/submit-event')}
                  size="base"
                  variant="filled"
                />
              </div>
            </div>
            <FeaturedPostLayout posts={podcasts} />
          </div>
        </div>
        <div className="py-16 px-4 sm:px-8 lg:px-16 flex flex-col">
          <div className="bg-schemesSecondaryFixed flex flex-col gap-12 self-stretch rounded-3xl shadow-3x3 px-4 sm:px-6 md:px-8 lg:px-16 py-8 lg:py-16">
            <div className="flex flex-col justify-center items-start gap-12">
              <div className="flex flex-col lg:flex-row sm:gap-1 lg:gap-3 justify-center items-start lg:items-center w-full">
                <div className="flex gap-3 items-center">
                  <div className="Blueprint-headline-large leading-snug">Ask, offer or </div>
                  <PillTag label="Connect" backgroundColor="schemesSecondary" />
                </div>
                <div className="Blueprint-headline-large leading-snug"> via the community message board</div>
              </div>
              <div className="w-full Blueprint-body-large text-center text-schemesOnSecondaryContainer">
                A living space for announcements, questions, and informal support.
              </div>
            </div>
            <MessageBoardSlider displaySlider={false} messageBoard={messageBoardPosts} />
          </div>
        </div>
        <div className="py-8 px-4 sm:px-8 lg:px-16">
          <ListingCallout />
        </div>
        <div className="py-16 px-4 sm:px-8 lg:px-16">
          <DynamicSection dynamicProps={dynamicProps} />
        </div>
        <div className="py-16 px-4 sm:px-8 lg:px-16">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 items-center justify-center mb-4">
              <h2 className="Blueprint-headline-large text-schemesOnSurface italic">
                Historical photos from the archive
              </h2>
              <p className="Blueprint-body-large text-schemesOnSurfaceVariant">
                A gallery showcasing the rich history of our community
              </p>
            </div>
            <HistoricalPhotosSection historicalPhotos={historicalPhotos} />
          </div>
        </div>
        <div className="pb-16 px-4 sm:px-8 lg:px-16">
          <ThankYouBanner />
        </div>
        <div className="py-16 px-4 sm:px-8 lg:px-16">
          <NewsletterBanner />
        </div>
      </div>
      <div className="bg-schemesPrimaryFixed">
        <div className="py-16 px-4 sm:px-8 lg:px-16 flex flex-col max-w-[1600px] mx-auto gap-4">
          <div className="flex gap-3 items-center">
            <div className="Blueprint-headline-medium italic">
              Explore more by
            </div>
            <PillTag label="Theme" backgroundColor="schemesPrimaryContainer" />
          </div>
          <div className="Blurprint-title-large mb-12 text-schemesOnSurface">
            From support services to creative culture, start where you're curious.
          </div>
          <ExploreByTheme />
        </div>
      </div>
    </div>
  );
};

export const ArrowIcon = () => (
  <div className="bg-container-light rounded-xl p-1">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 color-black"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  </div>
);

const DynamicSection = ({ dynamicProps }) => {
  console.log(dynamicProps)
  return (
    <div className="flex w-full gap-8 flex-col lg:flex-row h-150">
      <div className="flex flex-col flex-2 gap-8 justify-between">
        <div className="rounded-xl flex-1 overflow-hidden shadow-3x3">
          {dynamicProps.image1 && (
            <img
              src={dynamicProps.image1}
              alt="Dynamic Image 1"
              className="w-full h-full object-fit"
            />
          )}
        </div>
        <div className="rounded-xl overflow-hidden flex-1 shadow-3x3">
          {dynamicProps.image2 && (
            <img
              src={dynamicProps.image2}
              alt="Dynamic Image 2"
              className="w-full h-full object-fit"
            />
          )}
        </div>
      </div>
      <div className="flex-1">
        <div className="rounded-xl h-full w-full min-h-[200px] shadow-3x3">
          <PdfFlipBook pdfUrl={dynamicProps.pdfUrl} />
        </div>
      </div>
    </div>
  )
};

const HistoricalPhotosSection = ({ historicalPhotos }) => {
  const scrollRef = useRef(null)
  const scrollSpeed = 0.65 // px per frame (~30px/sec)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let frame

    const autoScroll = () => {
      el.scrollLeft += scrollSpeed
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
        el.scrollLeft = 0 // loop back
      }
      frame = requestAnimationFrame(autoScroll)
    }

    frame = requestAnimationFrame(autoScroll)

    return () => cancelAnimationFrame(frame)
  }, [])

  const historicalPhotosTimesTwo = historicalPhotos.concat(historicalPhotos)

  return (
    <div className="overflow-hidden">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hidden"
      >
        {historicalPhotosTimesTwo.map((photo) => (
          <div key={photo.id} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/2">
            <div className="rounded-lg aspect-[5/3] overflow-hidden shadow-lg">
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="Blueprint-title-medium">{photo.title}</h3>
              <p className="text-sm text-schemesOnSurfaceVariant">{photo.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ThankYouBanner = () => (
  <div className="bg-schemesInverseSurface rounded-xl shadow-3x2">
    <div className="flex flex-col justify-center items-center w-full p-6">
      <h2 className="Blueprint-headline-medium-emphasized text-schemesOnSecondary">
        Thank you to the Jack and
      </h2>
      <h2 className="Blueprint-headline-medium-emphasized text-schemesOnSecondary mb-4">
        Robert Smorgon Families Foundation
      </h2>
      <p className="Blueprint-body-large text-schemesOnSecondary">
        For their continued support and sponsorship of The Social Blueprint mission.
      </p>
    </div>
  </div>
)