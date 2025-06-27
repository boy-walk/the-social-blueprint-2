import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { EventCard } from './EventCard';
import PillTag from './PillTag';
import ExploreThemeOne from '../../assets/explore-theme-1.svg';
import ExploreThemeTwo from '../../assets/explore-theme-2.svg';

export const SectionOne = ({ events }) => {
  return (
    <div className="flex px-32 py-12 bg-white flex-col items-center justify-center gap-12">
      <div className="flex flex-col justify-center items-center gap-4 self-stretch">
        <div className="flex gap-2 justify-center items-center">
          <div className="ibm-plex-sans-condensed-regular-italic text-xl font-bold text-center text-gray-800 leading-snug">
            Explore by
          </div>
          <PillTag label="Theme" backgroundColor="#007ea8" />
        </div>
        <div className="w-full text-xl text-center">
          From support services to creative culture, start where you're curious.
        </div>
      </div>
      <div className="flex items-center justify-center self-stretch gap-4">
        <Card styles="flex-1 h-64 max-w-59 border-1 border-background-light px-4 pt-4">
          <div className="flex flex-col items-end justify-end gap-2">
            <ArrowIcon />
            <div className="w-full text-xl text-right ">
              Community
              <br />
              Connection
            </div>
            <img src={ExploreThemeOne} alt="Community Connection" className="object-cover flex-2" />
          </div>
        </Card>
        <Card styles=" h-64 max-w-59 border-1 border-background-light px-4 pt-4">
          <div className="flex flex-col items-end justify-end gap-2">
            <ArrowIcon />
            <div className="w-full text-xl text-right ">
              Events and
              <br />
              Experiences
            </div>
            <img
              src={ExploreThemeTwo}
              alt="Events and Experiences"
              className="object-cover flex-2"
            />
          </div>
        </Card>
        <Card styles=" h-64 max-w-59 border-1 border-background-light px-4 pt-4">
          <div className="flex flex-col items-end justify-end gap-2">
            <ArrowIcon />
            <div className="w-full text-xl text-right">
              Learning and
              <br />
              Growth
            </div>
            <img src={ExploreThemeOne} alt="Learning and Growth" className="object-cover flex-2" />
          </div>
        </Card>
        <Card styles=" h-64 max-w-59 border-1 border-background-light px-4 pt-4">
          <div className="flex flex-col items-end justify-end gap-2">
            <ArrowIcon />
            <div className="w-full text-xl text-right ">
              Support and
              <br />
              Services
            </div>
            <img src={ExploreThemeOne} alt="Support and Services" className="object-cover flex-2" />
          </div>
        </Card>
        <Card styles=" h-64 max-w-59 border-1 border-background-light px-4 pt-4">
          <div className="flex flex-col items-end justify-end gap-2">
            <ArrowIcon />
            <div className="w-full text-xl text-right">
              Culture and
              <br />
              Identity
            </div>
            <img src={ExploreThemeOne} alt="Culture and Identity" className="object-cover flex-2" />
          </div>
        </Card>
      </div>
      <div className="bg-container-light flex p-16 flex-col items-center gap-12 self-stretch rounded-xl shadow-3x1">
        <div className="flex justify-between items-end self-stretch">
          <div className="flex flex-col justify-center items-start gap-4">
            <div className="flex gap-2 items-center">
              <div className="text-xl font-bold text-gray-800 leading-snug">Upcoming</div>
              <PillTag label="Events" backgroundColor="#007ea8" />
            </div>
            <div className="w-full text-xl">
              Workshops, holidays, classes and community gatherings, updated regularly.
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <Button
              label="Browse the calendar"
              onClick={() => (window.location.href = '/events')}
              size="base"
              variant="secondary"
            />
            <Button
              label="View all events"
              onClick={() => (window.location.href = '/submit-event')}
              size="base"
              variant="primary"
            />
          </div>
        </div>
        <div className="grid gap-4 grid-rows-1 grid-cols-5 items-start w-full">
          <EventCard styles="col-span-1 row-span-3" {...events[0]} isFeatured={true}>
            <div className="bg-green-100 rounded-md w-full"></div>
          </EventCard>
          <EventCard styles="col-span-1 row-span-3" {...events[1]} isFeatured={true}>
            <div className="bg-blue-100 rounded-md w-full"></div>
          </EventCard>
          <EventCard styles="col-span-1 row-span-3" {...events[2]} isFeatured={true}>
            <div className="bg-indigo-200 rounded-md w-full"></div>
          </EventCard>
          <div className="col-span-2 row-span-1 flex flex-col gap-4">
            <EventListCard {...events[3]}>
              <div className="bg-pink-200 rounded-md w-full"></div>
            </EventListCard>
            <EventListCard {...events[4]}>
              <div className="bg-pink-200 rounded-md w-full"></div>
            </EventListCard>
            <EventListCard {...events[5]}>
              <div className="bg-pink-200 rounded-md w-full"></div>
            </EventListCard>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventListCard = ({ title, date, location, imageUrl }) => {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-neutral-50 shadow-3x2 border border-gray-300">
      <div className="flex-shrink-0">
        <div className="relative w-20 h-20 rounded-xl bg-gray-200 overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}
        </div>
      </div>

      {/* Event content */}
      <div className="flex flex-col justify-center text-sm text-gray-800">
        <div className="text-gray-500 text-[13px] mb-1">{date}</div>
        <div className="font-bold text-[15px] leading-tight mb-1">{title}</div>
        <div className="text-gray-600 text-[13px]">{location}</div>
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
