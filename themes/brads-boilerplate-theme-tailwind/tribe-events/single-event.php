<?php
get_header();

$post_id = get_the_ID();

$event_data = [
  'title' => get_the_title(),
  'date' => get_the_date('j F Y'),
  'author' => get_the_author(),
  'authorAvatar' => get_avatar_url(get_the_author_meta('ID')),
  'excerpt' => get_the_excerpt(),
  'content' => apply_filters('the_content', get_the_content()),
  'tags' => array_map(function ($term) {
    return $term->name;
  }, get_the_terms($post_id, 'post_tag') ?: []),
  'imageUrl' => get_the_post_thumbnail_url($post_id, 'large'),
  'speakerBlock' => [
    'name' => 'Zoe Kanat',
    'description' => "POSTNATAL DEPRESSION\nMEDITATION & MINDFULNESS\nEDUCATOR, PSYCHOTHERAPIST\nCOUNSELLOR",
  ]
];
?>

<div
  id='single-event-page'
  data-event='<?php echo esc_attr(json_encode($event_data)); ?>'
></div>



<?php get_footer(); ?>
