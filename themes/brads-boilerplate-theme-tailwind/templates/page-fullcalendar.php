<?php

/**
 * Template Name: Full calendar Events Page
 * Template Post Type: page
 */

get_header();
?>

<div class="mx-auto max-w-screen-xl px-4 py-16">
    <h2 class="mb-6">This is a template</h2>

    <style>
        #fullcalendar-main-wrap .fc-daygrid-dot-event .fc-event-title {
            font-weight: normal;
        }
    </style>

    <div class="flex">
        <div class="calendar-sidebar pr-4 basis-[30%] shrink-0">
            Sidebar goes here
        </div>

        <div id="fullcalendar-main-wrap" class="flex-1 min-w-0 px-6"></div>
    </div>
</div>

<?php get_footer(); ?>