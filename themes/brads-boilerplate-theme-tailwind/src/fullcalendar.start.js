document.addEventListener('DOMContentLoaded', async function () {

    async function fetchGet(url, params = {}) {
        try {
            // Build query string if params exist
            const queryString = new URLSearchParams(params).toString();
            const finalUrl = queryString ? `${url}?${queryString}` : url;

            const response = await fetch(finalUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }

            const data = await response.json().catch(() => null); // avoid crash on bad JSON

            return {
                success: response.ok,
                status: response.status,
                data
            };

            return await response.json();
        } catch (err) {
            console.error(`GET request failed: ${err.message}`);
            // throw err;
            return {
                success: false,
                status: null,
                data: null,
                error: err.message
            };
        }
    }

    var requestData = {per_page: 100};

    var calendarEl = document.getElementById('fullcalendar-main-wrap');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        views: {
            dayGridMonth: {
                eventTimeFormat: {
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: 'short',
                    hour12: true
                },
                showNonCurrentDates: false,
                displayEventTime: false,
            },
        },
        eventClick: function (info) {
            // console.log(info.event)
        },
        datesSet: async function( dateInfo ) {
            const startParts = dateInfo.startStr.split('T');
            const startDate = startParts[0]; // "2025-08-10"

            const endParts = dateInfo.endStr.split('T');
            const endDate = endParts[0]; // "2025-08-10"

            requestData.starts_after = startDate;
            requestData.starts_before = endDate;

            const request = await fetchGet('/wp-json/tribe/events/v1/events', requestData);

            calendar.removeAllEvents();

            if (request.success && request.data.events) {
                for (const event of request.data.events) {
                    calendar.addEvent({
                        id: event.id,
                        title: event.title || 'No title found',
                        start: event.start_date,
                        end: event.end_date,
                        url: event.url
                    });
                }
            }
        }
    });
    calendar.render();
});