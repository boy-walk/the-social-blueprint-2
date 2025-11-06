<?php
/**
 * Template for single GeoDirectory Cost of Living posts (gd_cost_of_living)
 */

get_header();

$post_id = get_the_ID();

/** Find “category-like” and “tag-like” taxonomies for this CPT */
function sbp_detect_tax_like($cpt, $type = 'category') {
  $out = [];
  $all = get_object_taxonomies($cpt, 'objects');
  $pattern = $type === 'category'
    ? '/(_category|_categories|category|categories|cat)$/'
    : '/(_tag|_tags|tag|tags)$/';
  foreach ($all as $tax) {
    if (preg_match($pattern, $tax->name)) $out[] = $tax->name;
  }
  return $out;
}

// Category chips with links
$category_taxes = sbp_detect_tax_like('gd_cost_of_living', 'category');
$category_terms = [];
foreach ($category_taxes as $tx) {
  $terms = wp_get_post_terms($post_id, $tx);
  if (!is_wp_error($terms)) {
    foreach ($terms as $t) {
      $category_terms[$t->term_id] = [
        'name' => $t->name,
        'link' => get_term_link($t),
      ];
    }
  }
}
$categories = array_values($category_terms);

// Author info
$author_id = (int) get_post_field('post_author', $post_id);
$author_name = get_the_author_meta('display_name', $author_id);
$uwp_avatar_id = get_user_meta($author_id, 'uwp_profile_photo', true);
$avatar_url = $uwp_avatar_id ? wp_get_attachment_url($uwp_avatar_id) : get_avatar_url($author_id, ['size' => 96]);
$author_obj = [
  'id'     => $author_id,
  'name'   => $author_name,
  'url'    => get_author_posts_url($author_id),
  'avatar' => $avatar_url,
];

// Featured image and content HTML
$featured_image = get_the_post_thumbnail_url($post_id, 'large');
$pdf_url = geodir_get_post_meta( get_the_ID(), 'pdf_file_url', true );
ob_start();
the_content(); // keep embeds/blocks/Gutenberg
$content_html = ob_get_clean();

// Related content (topic_tag/theme) if your helper exists; otherwise empty
$related_posts = function_exists('sb_get_related_by_topic_tags')
  ? sb_get_related_by_topic_tags($post_id, 3, false, ['gd_cost_of_living'], ['topic_tag', 'theme'])
  : [];
$related_content = array_map(function($p){
  return [
    'id'        => $p->ID,
    'title'     => get_the_title($p),
    'href'      => get_permalink($p),
    'thumbnail' => get_the_post_thumbnail_url($p, 'medium'),
  ];
}, $related_posts);

$pdf = get_field('pdf_file_url', $post_id);

// Recent items for slider
$recent_q = new WP_Query([
  'post_type'      => 'gd_cost_of_living',
  'posts_per_page' => 12,
  'post__not_in'   => [$post_id],
  'orderby'        => 'date',
  'order'          => 'DESC',
]);
$recent_posts = [];
if ($recent_q->have_posts()) {
  foreach ($recent_q->posts as $p) {
    $recent_posts[] = [
      'id'        => $p->ID,
      'title'     => get_the_title($p),
      'link'      => get_permalink($p),
      'thumbnail' => get_the_post_thumbnail_url($p, 'medium'),
      'date'      => get_the_date('', $p),
      'author'    => get_the_author_meta('display_name', $p->post_author),
      'post_type' => get_post_type($p),
    ];
  }
}

?>
<div id="gd-col-root"
     data-title="<?php echo esc_attr(get_the_title()); ?>"
     data-date="<?php echo esc_attr(get_the_date('c')); ?>"
     data-featured-image="<?php echo esc_url($featured_image); ?>"
     data-author-obj='<?php echo esc_attr(wp_json_encode($author_obj)); ?>'
     data-categories='<?php echo esc_attr(wp_json_encode($categories)); ?>'
     data-content-html='<?php echo esc_attr($content_html); ?>'
     data-related-content='<?php echo esc_attr(wp_json_encode($related_content)); ?>'
     data-recent-posts='<?php echo esc_attr(wp_json_encode($recent_posts)); ?>'
     data-pdf-file="<?php echo esc_url($pdf_url); ?>"
></div>
<?php get_footer(); ?>
