import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import { EventsCalendarFilterGroup } from './EventsCalendarFilterGroup';
import { DateDropdown } from './DateDropdown';

export function EventsCalendar({ types, topics, audiences, locations }) {
  const [keyword, setKeyword] = useState('');
  const [debouncedKeywordValue, setDebouncedKeywordValue] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [requestParams, setRequestParams] = useState({ per_page: 100 });
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedAudiences, setSelectedAudiences] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isFirstDatesSet = useRef(true);

  const calendarRef = useRef(null);

  useEffect(() => {
    // console.log(types, topics, audiences, locations)
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeywordValue(keyword);
    }, 1000); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);

  const handlePrevClick = () => {
    const calendarAPI = calendarRef.current.getApi();
    calendarAPI.prev();
  };

  const handleNextClick = () => {
    const calendarAPI = calendarRef.current.getApi();
    calendarAPI.next();
  };

  const clearEvents = () => {
    const calendarApi = calendarRef.current.getApi(); // Get the Calendar API
    calendarApi.removeAllEvents();
  };

  const handleTypeChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedTypes([...selectedTypes, value]);
    } else {
      setSelectedTypes(selectedTypes.filter((option) => option !== value));
    }
  };

  const handleTopicChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedTopics([...selectedTopics, value]);
    } else {
      setSelectedTopics(selectedTopics.filter((option) => option !== value));
    }
  };

  const handleAudienceChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedAudiences([...selectedAudiences, value]);
    } else {
      setSelectedAudiences(selectedAudiences.filter((option) => option !== value));
    }
  };

  const handleLocationChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedLocations([...selectedLocations, value]);
    } else {
      setSelectedLocations(selectedLocations.filter((option) => option !== value));
    }
  };

  const dateChanged = (dateInfo) => {
    const startParts = dateInfo.startStr.split('T');
    const startDate = startParts[0]; // "2025-08-10"

    const endParts = dateInfo.endStr.split('T');
    const endDate = endParts[0]; // "2025-08-10"

    setDateRange({
      start: startDate,
      end: endDate
    });
  }

  useEffect(() => {
    if (isFirstDatesSet.current) {
      isFirstDatesSet.current = false;
      return; // skip first call
    }

    setIsLoading(true);

    const fetchData = async () => {
      try {
        const url = '/wp-json/sbp/v1/events';
        const queryString = new URLSearchParams(requestParams).toString();
        const finalUrl = queryString ? `${url}?${queryString}` : url;

        const response = await fetch(finalUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        const result = await response.json();

        clearEvents();

        const calendarApi = calendarRef.current.getApi();
        if (result.events) {
          for (const event of result.events) {
            calendarApi.addEvent({
              id: event.id,
              title: event.title || 'No title found',
              start: event.start,
              end: event.end,
              url: event.url
            });
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();

  }, [requestParams])

  useEffect(() => {

  }, [debouncedKeywordValue])

  useEffect(() => {
    // Update request params
    setRequestParams(prev => ({
      ...prev,          // keep existing properties
      start_date: dateRange.start,
      end_date: dateRange.end,
      types: selectedTypes.toString(),
      topics: selectedTopics.toString(),
      audience: selectedAudiences.toString(),
      locations: selectedLocations.toString(),
      s: debouncedKeywordValue
    }));
  }, [dateRange, selectedTypes, selectedTopics, selectedAudiences, selectedLocations, debouncedKeywordValue])

  return (
    <>
      <div className={`flex flex-grow ${isLoading ? 'cursor-wait' : ''}`}>
        <div className={`calendar-sidebar pr-4 basis-[20%] shrink-0 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="relative flex items-center mb-6 filters-search">
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute right-3 text-gray-400 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <h2 className='text-lg mb-4'>Filters</h2>

          <EventsCalendarFilterGroup
            key={'filter-group-types'}
            title={'Type'}
            options={types}
            selected={selectedTypes}
            onChangeHandler={handleTypeChange}
          />

          <EventsCalendarFilterGroup
            key={'filter-group-topics'}
            title={'Topic'}
            options={topics}
            selected={selectedTopics}
            onChangeHandler={handleTopicChange}
          />

          <EventsCalendarFilterGroup
            key={'filter-group-audience'}
            title={'Audience'}
            options={audiences}
            selected={selectedAudiences}
            onChangeHandler={handleAudienceChange}
          />

          <EventsCalendarFilterGroup
            key={'filter-group-audience'}
            title={'Location'}
            options={locations}
            selected={selectedLocations}
            onChangeHandler={handleLocationChange}
          />
        </div>
        <div className={`flex-1 min-w-0 transition duration-100 px-6 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex justify-between flex-row gap-2 mb-4">
            <div className="flex items-center month-selector">
              <DateDropdown
                onMonthChange={(first, last) => {
                  const calendarAPI = calendarRef.current.getApi();
                  calendarAPI.gotoDate(first); // This will trigger month change, which will trigger datesSet, which will then trigger dateChanged, which will then trigger useEffect catching change in dateRange
                }}
              />
            </div>
            <div className="flex items-center justify-between month-navigator">
              <button onClick={handlePrevClick} className="flex items-center px-2 py-0.5 mr-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Previous
              </button>

              {/* <!-- Next Button --> */}
              <button onClick={handleNextClick} className="flex items-center px-2 py-0.5 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75">
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={false}
            datesSet={dateChanged}
            views={{
              dayGridMonth: {
                eventTimeFormat: {
                  hour: '2-digit',
                  minute: '2-digit',
                  meridiem: 'short',
                  hour12: true
                },
                showNonCurrentDates: false,
                displayEventTime: false
              }
            }}
          />
        </div>
      </div>
    </>
  );
}