<?php
/**
 * Template Name: Health Listing Hub
 */

get_header();

$breadcrumbs = sbp_build_breadcrumbs();

$post_id = get_the_ID();

$categories = [];

$gd_tax = 'gd_health_listingcategory';
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

$props = ['breadcrumbs' => $breadcrumbs, 'categories' => $categories];
?>

<div
    id="health-listing-hub-root"
    data-props='<?php echo esc_attr( wp_json_encode( $props)); ?>'
  >
</div>

<?php get_footer(); ?>
