<?php
/* Template Name: About Us */

get_header();

$timeline = get_field('timeline') ?: [];
$testimonials = get_field('testimonials') ?: [];
$feature_video = get_field('featured_video_url') ?: null; // oEmbed or URL
$feature_title = get_field('featured_video_title') ?: '';
$feature_description = get_field('featured_video_description') ?: '';

$props = [
  'timeline' => array_map(function ($row) {
    return [
      'date' => isset($row['date']) ? $row['date'] : '',
      'title' => isset($row['title']) ? $row['title'] : '',
      'description' => isset($row['description']) ? $row['description'] : '',
      'icon' => isset($row['icon']) ? $row['icon'] : 'PlanetIcon', // Default icon
    ];
  }, $timeline),
  'testimonials' => array_map(function ($row) {
    return [
      'quote' => isset($row['quote']) ? $row['quote'] : '',
      'author' => isset($row['author']) ? $row['author'] : '',
    ];
  }, $testimonials),
  'featuredVideo' => [
    'url' => $feature_video ?: '',
    'title' => $feature_title ?: '',
    'description' => $feature_description ?: '',
  ],
];

?>
<main class="w-full">
  <div id="OurMissionPage" data-props='<?= esc_attr(wp_json_encode($props)); ?>'></div>
</main>
<?php get_footer(); ?>
