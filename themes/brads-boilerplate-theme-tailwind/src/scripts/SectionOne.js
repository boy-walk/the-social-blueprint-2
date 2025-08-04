import React from 'react';
import { Button } from './Button';
import PillTag from './PillTag';
import { ExploreByTheme } from './ExploreByTheme';
import FeaturedPostLayout from './FeaturedPostLayout';
import { StarIcon } from '@phosphor-icons/react';
import { MessageBoardSlider } from './MessageBoardSlider';
import { ListingCallout } from './ListingCallout';
import { NewsletterBanner } from './NewsletterBanner';

export const SectionOne = ({ events, podcasts, messageBoardPosts }) => {
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
          <div className="max-w-7xl w-full px-4 lg:px-0">
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
        <div className="flex flex-col items-center gap-12 self-stretch rounded-3xl shadow-3x1 px-4 sm:px-6 md:px-8 lg:px-16 py-12">
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
        <div className="py-16 px-4 sm:px-8 lg:px-16">
          <ListingCallout />
        </div>
        <div className="py-16 px-4 sm:px-8 lg:px-16">
          <NewsletterBanner />
        </div>
      </div>
      <div className="py-16 px-4 sm:px-8 lg:px-16 bg-schemesPrimaryFixed flex flex-col gap-4">
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
