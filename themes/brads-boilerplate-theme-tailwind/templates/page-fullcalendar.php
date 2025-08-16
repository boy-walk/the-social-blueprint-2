<?php

/**
 * Template Name: Full calendar Events Page
 * Template Post Type: page
 */

get_header();
?>

<!-- 
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
-->

<?php

$terms = get_terms([
    'taxonomy' => ['category', 'topic_tag', 'audience_tag', 'location_tag'],
    'hide_empty' => false
]);

$types = [];
$topics = [];
$audiences = [];
$locations = [];

/** @var WP_Term $term */
foreach ($terms as $term) {
    switch ($term->taxonomy) {
        case 'category':
            $types[] = [
                'id' => $term->term_id,
                'name' => $term->name
            ];
            break;

        case 'topic_tag':
            $topics[] = [
                'id' => $term->term_id,
                'name' => $term->name
            ];
            break;

        case 'audience_tag':
            $audiences[] = [
                'id' => $term->term_id,
                'name' => $term->name
            ];
            break;

        case 'location_tag':
            $locations[] = [
                'id' => $term->term_id,
                'name' => $term->name
            ];
            break;
    }
}

?>

<div
    id="events-fullcalendar"
    class="mx-auto max-w-screen-xl px-4 py-16"
    data-types="<?= esc_attr(wp_json_encode($types)) ?>"
    data-topics="<?= esc_attr(wp_json_encode($topics)) ?>"
    data-audiences="<?= esc_attr(wp_json_encode($audiences)) ?>"
    data-locations="<?= esc_attr(wp_json_encode($locations)) ?>"
>
</div>

<?php get_footer(); ?>