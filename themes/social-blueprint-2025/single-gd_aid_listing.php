<?php
/* Single template for gd_aid_listing with React, using EXACT GD data */
get_header();

$post_id   = get_the_ID();
$title     = get_the_title($post_id);
$date_iso  = get_the_date('c', $post_id);

/* --- Author --- */
$author_id = (int) get_post_field('post_author', $post_id);
$author = [
  'id'     => $author_id,
  'name'   => get_the_author_meta('display_name', $author_id),
  'url'    => get_author_posts_url($author_id),
  'avatar' => get_avatar_url($author_id, ['size' => 96]),
];

/* Breadcrumbs */
$breadcrumbs = function_exists('sbp_build_breadcrumbs') ? sbp_build_breadcrumbs() : [];

/* --- Ask GD to render its native sections --- */
$gdHtml = [
  'notifications' => do_shortcode('[gd_notifications]'),
  'images'        => do_shortcode("[gd_post_images type='slider' slideshow='true' controlnav='1' show_title='false' show_caption='false' aspect='16-9' cover='true']"),
  'taxonomies'    => do_shortcode("[gd_single_taxonomies]"),
  'tabs'          => do_shortcode("[gd_single_tabs show_as_list='true' remove_separator_line='true']"),
  'nextPrev'      => do_shortcode('[gd_single_next_prev]'),
];

/* --- Contact fields from GD meta (common keys) --- */
function sbp_meta_first($id, $keys) {
  foreach ($keys as $k) {
    $v = get_post_meta($id, $k, true);
    if ($v !== '') return $v;
  }
  return '';
}
$contact = [
  'phone'   => sbp_meta_first($post_id, ['geodir_phone','_geodir_phone','phone','_phone']),
  'email'   => sbp_meta_first($post_id, ['geodir_email','_geodir_email','email','_email']),
  'website' => sbp_meta_first($post_id, ['geodir_website','_geodir_website','website','_website']),
  'address' => sbp_meta_first($post_id, ['geodir_address','_geodir_full_address','address']),
];
if ($contact['website'] && !preg_match('#^https?://#i', $contact['website'])) {
  $contact['website'] = 'https://' . $contact['website'];
}

/* --- Related content --- */
$related_content = [];
if (function_exists('sb_get_related_by_topic_tags')) {
  $rels = sb_get_related_by_topic_tags($post_id, 3, true, ['gd_aid_listing']);
  if ($rels) {
    foreach ($rels as $p) {
      $related_content[] = [
        'id'        => $p->ID,
        'title'     => get_the_title($p),
        'href'      => get_permalink($p),
        'thumbnail' => get_the_post_thumbnail_url($p, 'medium'),
      ];
    }
  }
}

/* --- Props for React --- */
$props = [
  'title'       => $title,
  'date'        => $date_iso,
  'author'      => $author,
  'breadcrumbs' => $breadcrumbs,
  'related'     => $related_content,
  'contact'     => $contact,
];
?>
<script id="aid-gd-html" type="application/json">
<?php echo wp_json_encode($gdHtml); ?>
</script>

<div id="aid-listing-root"
     data-props="<?php echo esc_attr( wp_json_encode($props) ); ?>"></div>

<?php get_footer(); ?>
