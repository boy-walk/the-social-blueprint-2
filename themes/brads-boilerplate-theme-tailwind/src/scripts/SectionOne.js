import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { EventCard } from './EventCard';
import PillTag from './PillTag';
import ExploreThemeOne from '../../assets/explore-theme-1.svg';
import ExploreThemeTwo from '../../assets/explore-theme-2.svg';

export const SectionOne = ({ events }) => {
  return (
    <div className="flex flex-col px-4 sm:px-8 md:px-16 lg:px-32 py-12 bg-white items-center justify-center gap-12">
      <div className="flex flex-col justify-center items-center gap-4 w-full">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
        {[0, 1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            href={i === 0 ? '/community-connect' : `/explore/${i + 1}`}
            styles="h-64 max-w-full border-1 border-background-light px-4 pt-4"
          >
            <div className="flex flex-col items-end justify-end gap-2 h-full">
              <ArrowIcon />
              <div className="w-full text-xl text-right">
                {i === 0 && (
                  <>
                    Community
                    <br />
                    Connection
                  </>
                )}
                {i === 1 && (
                  <>
                    Events and
                    <br />
                    Experiences
                  </>
                )}
                {i === 2 && (
                  <>
                    Learning and
                    <br />
                    Growth
                  </>
                )}
                {i === 3 && (
                  <>
                    Support and
                    <br />
                    Services
                  </>
                )}
                {i === 4 && (
                  <>
                    Culture and
                    <br />
                    Identity
                  </>
                )}
              </div>
              <img
                src={i === 1 ? ExploreThemeTwo : ExploreThemeOne}
                alt="Theme Icon"
                className="object-cover w-full"
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-container-light flex flex-col items-center gap-12 self-stretch rounded-xl shadow-3x1 px-4 sm:px-6 md:px-8 lg:px-16 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 w-full">
          <div className="flex flex-col justify-center items-start gap-4">
            <div className="flex gap-2 items-center">
              <div className="text-xl font-bold text-gray-800 leading-snug">Upcoming</div>
              <PillTag label="Events" backgroundColor="#007ea8" />
            </div>
            <div className="w-full text-xl">
              Workshops, holidays, classes and community gatherings, updated regularly.
            </div>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
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

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-start w-full">
          {events.slice(0, 3).map((event, i) => (
            <EventCard key={i} styles="w-full" {...event} isFeatured={true}>
              <div className="bg-green-100 rounded-md w-full"></div>
            </EventCard>
          ))}

          <div className="col-span-1 sm:col-span-2 flex flex-col gap-4">
            {events.slice(3, 6).map((event, i) => (
              <EventListCard key={i} {...event}>
                <div className="bg-pink-200 rounded-md w-full"></div>
              </EventListCard>
            ))}
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
