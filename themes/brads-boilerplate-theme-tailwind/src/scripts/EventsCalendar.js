import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

export function EventsCalendar({types, topics, audiences, locations}) {
    const [keyword, setKeyword] = useState('');
    const [debouncedKeywordValue, setDebouncedKeywordValue] = useState('');
    const [dateRange, setDateRange] = useState({start: '', end: ''});
    const [requestParams, setRequestParams] = useState({per_page: 100});
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [selectedAudiences, setSelectedAudiences] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
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
    
    const clearEvents = () => {
        const calendarApi = calendarRef.current.getApi(); // Get the Calendar API
        calendarApi.removeAllEvents();
    };

    const handleKeywordChange = (event) => {
        console.log(event.target.value)
    }

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
            } catch (error) {
                console.error('Error fetching data:', error);
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
            {/* <h2 className="mb-6">This is a template</h2> */}

            <div className="flex flex-grow">
                <div className="calendar-sidebar pr-4 basis-[20%] shrink-0">
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

                    <div className='mb-4 filters-type'>
                        <h3 className='mb-2'>Type</h3>
                        {types.slice(0,5).map((option) => (
                            <p>
                                <input
                                    id={`filter-${option.id}`}
                                    className='form-checkbox'
                                    type="checkbox"
                                    value={option.id}
                                    onChange={handleTypeChange}
                                />
                                <label className='ml-2' for={`filter-${option.id}`} key={option.id}>
                                    {option.name}
                                </label>
                            </p>
                        ))}
                    </div>

                    <div className="mb-4 filters-topic">
                        <h3 className='mb-2'>Topic</h3>
                        {topics.slice(0,5).map((option) => (
                            <p>
                                <input
                                    id={`filter-${option.id}`}
                                    className='form-checkbox'
                                    type="checkbox"
                                    value={option.id}
                                    onChange={handleTopicChange}
                                />
                                <label className='ml-2' for={`filter-${option.id}`} key={option.id}>
                                    {option.name}
                                </label>
                            </p>
                        ))}
                    </div>

                    <div className="mb-4 filters-audience">
                        <h3 className='mb-2'>Audience</h3>
                        {audiences.slice(0,5).map((option) => (
                            <p>
                                <input
                                    id={`filter-${option.id}`}
                                    className='form-checkbox'
                                    type="checkbox"
                                    value={option.id}
                                    onChange={handleAudienceChange}
                                />
                                <label className='ml-2' for={`filter-${option.id}`} key={option.id}>
                                    {option.name}
                                </label>
                            </p>
                        ))}
                    </div>

                    <div className="mb-4 filters-location">
                        <h3 className='mb-2'>Location</h3>
                        {locations.slice(0,5).map((option) => (
                            <p>
                                <input
                                    id={`filter-${option.id}`}
                                    className='form-checkbox'
                                    type="checkbox"
                                    value={option.id}
                                    onChange={handleLocationChange}
                                    // checked={selectedLocations.includes(option.id)}
                                />
                                <label className='ml-2' for={`filter-${option.id}`} key={option.id}>
                                    {option.name}
                                </label>
                            </p>
                        ))}
                    </div>
                </div>
                <div className='flex-1 min-w-0 px-6'>
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[ dayGridPlugin ]}
                        initialView="dayGridMonth"
                        headerToolbar= {{
                            left: '',
                            right: ''
                        }}
                        footerToolbar={{
                            center: 'prev,next'
                        }}
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
                        loading={(isLoading) => {
                            console.log('loading', isLoading)
                        }}
                    />
                </div>
            </div>
        </>
    );
}