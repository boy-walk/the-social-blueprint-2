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
$taxonomies = [
  'theme' => 'types',
  'topic_tag' => 'topics',
  'audience_tag' => 'audiences',
];

$types = [];
$topics = [];
$audiences = [];
$locations = [];

foreach ($taxonomies as $taxonomy => $var_name) {
  $response = wp_remote_get(
      rest_url('tsb/v1/terms') . '?' . http_build_query([
          'taxonomy' => $taxonomy,
          'post_type' => 'tribe_events',
          'per_page' => 200,
      ])
  );
  
  if (is_wp_error($response)) {
      continue;
  }
  
  $body = wp_remote_retrieve_body($response);
  $terms = json_decode($body, true);
  
  if (!empty($terms)) {
      $formatted_terms = array_map(function($term) {
          return [
              'id' => $term['id'],
              'name' => $term['name']
          ];
      }, $terms);
      
      switch ($var_name) {
          case 'types':
              $types = $formatted_terms;
              break;
          case 'topics':
              $topics = $formatted_terms;
              break;
          case 'audiences':
              $audiences = $formatted_terms;
              break;
          case 'locations':
              $locations = $formatted_terms;
              break;
      }
  }
}

$event_categories = get_terms([
  'taxonomy'   => 'tribe_events_cat',
  'hide_empty' => true,
  'orderby'    => 'name',
]);

$categories = [];
if (!is_wp_error($event_categories)) {
  foreach ($event_categories as $cat) {
    $categories[] = [
      'id'   => (int) $cat->term_id,
      'name' => $cat->name,
      'slug' => $cat->slug,
    ];
  }
}
?>

<div
    id="events-fullcalendar"
    data-types="<?= esc_attr(wp_json_encode($types)) ?>"
    data-topics="<?= esc_attr(wp_json_encode($topics)) ?>"
    data-audiences="<?= esc_attr(wp_json_encode($audiences)) ?>"
    data-locations="<?= esc_attr(wp_json_encode($locations)) ?>"
    data-categories="<?= esc_attr(wp_json_encode($categories)) ?>"
>
</div>

<?php get_footer(); ?>