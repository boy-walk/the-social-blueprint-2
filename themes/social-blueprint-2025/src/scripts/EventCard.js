// components/EventCard.jsx
import React from 'react';
import { Button } from './Button';
import { IconButton } from './Icon';

export const EventCard = ({
  title,
  date,
  location,
  imageUrl,
  isFeatured = false,
  readMoreUrl,
  styles,
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-400 p-4 flex flex-col bg-white shadow-3x2 justify-start ${styles}`}
    >
      <div className="flex justify-center relative mb-3">
        {isFeatured && (
          <span className="absolute top-2 left-2 bg-green-300 text-gray-900 text-xs px-2 py-1 rounded-md font-semibold">
            Featured Listing
          </span>
        )}
        <img src={imageUrl} alt={title} className="w-full h-40 object-cover rounded-xl" />
      </div>
      <div className="text-sm text-gray-800 mb-1">{date}</div>
      <div className="text-base font-bold text-gray-900 leading-tight mb-1">{title}</div>
      <div className="text-sm text-gray-600 mb-3">{location}</div>
      <div className="flex justify-between items-center mt-2">
        <Button
          label="Read more"
          onClick={() => (window.location.href = readMoreUrl)}
          size="base"
          variant="primary"
        />
        <IconButton
          variant="primary"
          size="sm"
          label="Save event"
        />
      </div>
    </div>
  );
};
