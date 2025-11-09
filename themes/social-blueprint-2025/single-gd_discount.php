<?php
/**
 * Template for single GeoDirectory Message Board posts (gd_discount)
 */
get_header();

$post_id = get_the_ID();
$breadcrumbs = sbp_build_breadcrumbs();

/** Detect “category-like” taxonomies for this CPT (robust to naming). */
if ( ! function_exists('sbp_detect_category_taxes_for_cpt') ) {
  function sbp_detect_category_taxes_for_cpt($cpt) {
    $out = [];
    $all = get_object_taxonomies($cpt, 'objects'); // keyed by taxonomy name
    foreach ($all as $tx) {
      $name = $tx->name;
      if (preg_match('/(_category|_categories|category|categories|cat)$/', $name)) {
        $out[] = $name;
      }
    }
    if (empty($out) && isset($all['category'])) $out[] = 'category';
    return $out;
  }
}

$category_taxes  = sbp_detect_category_taxes_for_cpt('gd_discount');
$category_labels = [];
foreach ($category_taxes as $tx) {
  $terms = wp_get_post_terms($post_id, $tx, ['fields' => 'names']);
  if (!is_wp_error($terms) && $terms) {
    $category_labels = array_values(array_unique(array_merge($category_labels, $terms)));
  }
}

/** Author (same pattern as your podcast template). */
$author_id   = (int) get_post_field('post_author', $post_id);
$author_name = get_the_author_meta('display_name', $author_id);
$uwp_avatar_id = get_user_meta($author_id, 'uwp_profile_photo', true);
$avatar_url    = $uwp_avatar_id ? wp_get_attachment_url($uwp_avatar_id) : get_avatar_url($author_id, ['size' => 96]);

$author_obj = [
  'id'     => $author_id,
  'name'   => $author_name,
  'url'    => get_author_posts_url($author_id),
  'avatar' => $avatar_url,
];

$featured_image = get_the_post_thumbnail_url($post_id, 'large');

/** Safer content capture. */
$content_html = apply_filters('the_content', get_post_field('post_content', $post_id));

/** Related content. */
if (function_exists('sb_get_related_by_topic_tags')) {
  $related_posts = sb_get_related_by_topic_tags($post_id, 4, false, 'gd_discount', ['topic_tag', 'theme']);
} else {
  // Group term IDs by taxonomy and query each group (avoids cross-tax mismatch)
  $tax_groups = [];
  foreach ($category_taxes as $tx) {
    $ids = wp_get_post_terms($post_id, $tx, ['fields' => 'ids']);
    if (!is_wp_error($ids) && $ids) {
      $tax_groups[$tx] = array_map('intval', $ids);
    }
  }
  $related_posts = [];
  foreach ($tax_groups as $tx => $ids) {
    $q = new WP_Query([
      'post_type'      => 'gd_discount',
      'posts_per_page' => max(0, 4 - count($related_posts)),
      'post__not_in'   => [$post_id],
      'tax_query'      => [[ 'taxonomy' => $tx, 'field' => 'term_id', 'terms' => $ids ]],
      'no_found_rows'  => true,
      'ignore_sticky_posts' => true,
    ]);
    if ($q->have_posts()) {
      foreach ($q->posts as $p) $related_posts[] = $p;
      wp_reset_postdata();
    }
    if (count($related_posts) >= 4) break;
  }
}

$related_content = array_map(function($p){
  return [
    'id'        => $p->ID,
    'title'     => get_the_title($p),
    'link'      => get_permalink($p),    
    'href'      => get_permalink($p),         
    'thumbnail' => get_the_post_thumbnail_url($p, 'medium'),
    'description' => get_the_excerpt($p),
  ];
}, $related_posts);

/** Recent message-board posts (slider). */
$recent_q = new WP_Query([
  'post_type'      => 'gd_discount',
  'posts_per_page' => 12,
  'post__not_in'   => [$post_id],
  'orderby'        => 'date',
  'order'          => 'DESC',
  'no_found_rows'  => true,
  'ignore_sticky_posts' => true,
]);

$recent_posts = [];
if ($recent_q->have_posts()) {
  foreach ($recent_q->posts as $p) {
    // Collect category-like terms for this post (names and slugs)
    $cats = []; $cat_slugs = [];
    foreach ($category_taxes as $tx) {
      $names = wp_get_post_terms($p->ID, $tx, ['fields' => 'names']);
      $slugs = wp_get_post_terms($p->ID, $tx, ['fields' => 'slugs']);
      if (!is_wp_error($names) && $names) $cats = array_merge($cats, $names);
      if (!is_wp_error($slugs) && $slugs) $cat_slugs = array_merge($cat_slugs, $slugs);
    }
    $cats = array_values(array_unique($cats));
    $cat_slugs = array_values(array_unique($cat_slugs));

    $recent_posts[] = [
      'id'         => $p->ID,
      'title'      => get_the_title($p),
      'permalink'  => get_permalink($p),
      'thumbnail'  => get_the_post_thumbnail_url($p, 'medium'),
      'date'       => get_the_date('', $p),
      'author'     => get_the_author_meta('display_name', $p->post_author),
      'post_type'  => get_post_type($p),
      'categories' => $cats,        // human-readable category labels
      'cat_slugs'  => $cat_slugs,   // optional: slugs if you need URLs/filters
    ];
  }
  wp_reset_postdata();
}

$terms = wp_get_object_terms(
  $post_id,
  ['topic_tag', 'people_tag', 'audience_tag', 'theme']
);

$mapped_terms = array_map(function($term) {
  return [
    'name' => $term->name,
    'url' => get_term_link($term),
  ];
}, $terms);

/** Trending topics (topic_tag) */
$trending = [];
if (taxonomy_exists('topic_tag')) {
  $tags = get_terms([
    'taxonomy'   => 'topic_tag',
    'hide_empty' => true,
    'number'     => 8,
    'orderby'    => 'count',
    'order'      => 'DESC',
  ]);
  if (!is_wp_error($tags)) {
    foreach ($tags as $t) {
      $link = get_term_link($t);
      if (!is_wp_error($link)) $trending[] = ['name' => $t->name, 'link' => $link];
    }
  }
}
?>
<div id="gd-discount-root"
     data-title="<?php echo esc_attr(get_the_title()); ?>"
     data-date="<?php echo esc_attr(get_the_date('c')); ?>"
     data-author-obj='<?php echo esc_attr( wp_json_encode($author_obj) ); ?>'
     data-tags='<?php echo esc_attr( wp_json_encode($mapped_terms) ); ?>'
     data-featured-image="<?php echo esc_url($featured_image); ?>"
     data-content-html='<?php echo esc_attr( $content_html ); ?>'
     data-related-content='<?php echo esc_attr( wp_json_encode($related_content) ); ?>'
     data-recent-posts='<?php echo esc_attr( wp_json_encode($recent_posts) ); ?>'
     data-trending-topics='<?php echo esc_attr( wp_json_encode($trending) ); ?>'
     data-breadcrumbs='<?php echo esc_attr( wp_json_encode($breadcrumbs) ); ?>'
></div>
<?php get_footer(); ?>
