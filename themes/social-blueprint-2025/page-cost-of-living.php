<?php
/**
 * Template Name: Cost of Living
 */

get_header();

$post_id = get_the_ID();
$rows    = get_field('post-sections', $post_id) ?: [];

$sections = [];

foreach ($rows as $row) {
  $label = (string) ($row['section-title'] ?? '');
  $posts = (array)  ($row['posts'] ?? []);

  if (empty($posts)) continue;

  $items = array_map(function ($p) {
    $pid = is_object($p) ? $p->ID : (int) $p;
    return [
      'id'        => $pid,
      'title'     => get_the_title($pid),
      'permalink' => get_permalink($pid),
      'thumbnail' => get_the_post_thumbnail_url($pid, 'medium_large'),
      'post_type' => get_post_type($pid),
      'date'      => get_the_date('', $pid),
    ];
  }, $posts);

  $sections[] = [
    'title' => $label,
    'items' => $items,
  ];
}

$props = ['sections' => $sections];
?>

<div
    id="cost-of-living-root"
    data-props='<?php echo esc_attr( wp_json_encode( $props)); ?>'
  >
</div>

<?php get_footer(); ?>
