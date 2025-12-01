<?php
/**
 * Template Name: Cost of Living
 */

get_header();

$breadcrumbs = sbp_build_breadcrumbs();

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

$gd_tax = 'gd_cost_of_livingcategory';
$gd_terms = get_terms([
  'taxonomy'   => $gd_tax,
  'hide_empty' => false,
]);

if (!is_wp_error($gd_terms)) {
  foreach ($gd_terms as $term) {
    // Try using GeoDirectory's own tax meta function if available
    if (function_exists('geodir_get_tax_meta')) {
      // Get default image using GeoDirectory function
      $default_img = geodir_get_tax_meta($term->term_id, 'ct_cat_default_img', false, $gd_tax);
      $image_url = !empty($default_img['src']) ? $default_img['src'] : null;
      
      // Get category icon using GeoDirectory function
      $icon_data = geodir_get_tax_meta($term->term_id, 'ct_cat_icon', false, $gd_tax);
      $icon = !empty($icon_data['src']) ? $icon_data['src'] : null;
      
      // Get Font Awesome icon
      $fa_icon = geodir_get_tax_meta($term->term_id, 'ct_cat_font_icon', false, $gd_tax);
      
      // Get category color
      $color = geodir_get_tax_meta($term->term_id, 'ct_cat_color', false, $gd_tax);
    } else {
      // Fallback to standard WordPress term meta
      $default_img_meta = get_term_meta($term->term_id, 'ct_cat_default_img', true);
      $image_url = !empty($default_img_meta['src']) ? $default_img_meta['src'] : null;
      
      // If not found, try alternative meta keys
      if (!$image_url) {
        $image_id = get_term_meta($term->term_id, 'default_image', true);
        $image_url = $image_id ? wp_get_attachment_url($image_id) : null;
      }
      
      $icon_meta = get_term_meta($term->term_id, 'ct_cat_icon', true);
      $icon = !empty($icon_meta['src']) ? $icon_meta['src'] : null;
      
      $fa_icon = get_term_meta($term->term_id, 'ct_cat_font_icon', true);
      $color = get_term_meta($term->term_id, 'ct_cat_color', true);
    }
    
    $categories[] = [
      'id'         => $term->term_id,
      'name'       => $term->name,
      'slug'       => $term->slug,
      'image_url'  => $image_url ?: null,
      'icon'       => $icon ?: null,
      'fa_icon'    => $fa_icon ?: null,
      'color'      => $color ?: null,
    ];
  }
}

$is_enabled = get_field('display_banner');
$banner_image = get_field('banner_image');
$href = get_field('link');
$banner_data = [
  'imgSrc' => $banner_image ? $banner_image : null,
  'enabled' => $is_enabled,
  'href' => $href ? $href : null,
];

$props = ['sections' => $sections,
          'breadcrumbs' => $breadcrumbs,
          'categories' => $categories,
          'sponsorshipBanner' => get_field('sponsorship_banner', $post_id) ?: null,
];
?>

<div
    id="cost-of-living-root"
    data-props='<?php echo esc_attr( wp_json_encode( $props)); ?>'
  >
</div>

<?php get_footer(); ?>
