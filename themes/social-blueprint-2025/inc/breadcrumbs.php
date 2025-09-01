<?php
// inc/breadcrumbs.php

// Reuse your “detect category-like taxonomies” helper.
if (!function_exists('sbp_detect_category_taxes_for_cpt')) {
  function sbp_detect_category_taxes_for_cpt($cpt) {
    $out = [];
    $all = get_object_taxonomies($cpt, 'objects');
    foreach ($all as $tax) {
      $name = $tax->name;
      if (preg_match('/(_category|_categories|category|categories|cat)$/', $name)) {
        $out[] = $name;
      }
    }
    if (empty($out) && isset($all['category'])) $out[] = 'category';
    return $out;
  }
}

// Prefer a Yoast “primary” term when available, else first term.
function sbp_primary_term($post_id, $taxes) {
  $taxes = (array) $taxes;
  foreach ($taxes as $tax) {
    // Yoast primary term support
    $meta_key = "_yoast_wpseo_primary_{$tax}";
    $primary  = (int) get_post_meta($post_id, $meta_key, true);
    if ($primary) {
      $term = get_term($primary, $tax);
      if ($term && !is_wp_error($term)) return $term;
    }
    // Fallback: first assigned term
    $terms = wp_get_post_terms($post_id, $tax);
    if (!is_wp_error($terms) && !empty($terms)) return $terms[0];
  }
  return null;
}

function sbp_term_ancestor_chain($term) {
  if (!$term) return [];
  $anc_ids = array_reverse(get_ancestors($term->term_id, $term->taxonomy, 'taxonomy'));
  $chain   = [];
  foreach ($anc_ids as $id) {
    $t = get_term($id, $term->taxonomy);
    if ($t && !is_wp_error($t)) {
      $chain[] = ['label'=>$t->name, 'url'=>get_term_link($t)];
    }
  }
  // Include the term itself as the last crumb (with link)
  $chain[] = ['label'=>$term->name, 'url'=>get_term_link($term)];
  return $chain;
}

/**
 * Build breadcrumb items for most contexts.
 * Returns array of ['label'=>..., 'url'=>...]. Last item may have url = ''.
 */
function sbp_build_breadcrumbs() {
  $home_url = home_url('/');
  $crumbs   = [
    ['label' => 'Home', 'url' => $home_url]
  ];

  // If you have a fixed section page you’d like in the trail, add it here:
  // Example: “Community connection” hub
  // $crumbs[] = ['label' => 'Community connection', 'url' => home_url('/community-connection/')];

  if (is_singular()) {
    $post_id = get_the_ID();
    $pt      = get_post_type($post_id);
    $pto     = get_post_type_object($pt);

    // Add post type archive (if it exists)
    $archive = get_post_type_archive_link($pt);
    if ($archive) {
      $crumbs[] = ['label' => $pto ? $pto->labels->name : ucfirst($pt), 'url' => $archive];
    } else {
      // Or use a fixed label for gd_discount
      if ($pt === 'gd_discount') {
        $crumbs[] = ['label' => 'Community message board', 'url' => home_url('/community-message-board/')];
      }
    }

    // Category chain for this post (using your category-like taxonomies)
    $cat_taxes = sbp_detect_category_taxes_for_cpt($pt);
    $primary   = sbp_primary_term($post_id, $cat_taxes);
    if ($primary) {
      $crumbs = array_merge($crumbs, sbp_term_ancestor_chain($primary));
    }

    // Current post (no link)
    $crumbs[] = ['label' => get_the_title($post_id), 'url' => ''];
    return $crumbs;
  }

  if (is_tax()) {
    $term = get_queried_object();
    $pt_from_tax = ''; // optional: infer a CPT label for the trail
    // If the taxonomy belongs to a single post type, you can add its archive
    $object_tax = get_taxonomy($term->taxonomy);
    if ($object_tax && !empty($object_tax->object_type)) {
      $first_pt = is_array($object_tax->object_type) ? reset($object_tax->object_type) : $object_tax->object_type;
      $pto      = get_post_type_object($first_pt);
      $archive  = get_post_type_archive_link($first_pt);
      if ($archive) {
        $crumbs[] = ['label' => $pto ? $pto->labels->name : ucfirst($first_pt), 'url' => $archive];
      }
    }
    // Ancestors + term
    $crumbs = array_merge($crumbs, sbp_term_ancestor_chain($term));
    return $crumbs;
  }

  if (is_post_type_archive()) {
    $pt  = get_query_var('post_type');
    $pto = get_post_type_object($pt);
    $crumbs[] = ['label' => $pto ? $pto->labels->name : ucfirst($pt), 'url' => ''];
    return $crumbs;
  }

  if (is_search()) {
    $crumbs[] = ['label' => 'Search results', 'url' => ''];
    return $crumbs;
  }

  // Generic fallback
  $crumbs[] = ['label' => wp_get_document_title(), 'url' => ''];
  return $crumbs;
}

/** Optional: output JSON-LD from an items array */
function sbp_breadcrumbs_jsonld(array $items) {
  $list = [];
  $pos = 1;
  foreach ($items as $it) {
    $list[] = [
      '@type'    => 'ListItem',
      'position' => $pos++,
      'name'     => wp_strip_all_tags($it['label']),
      'item'     => $it['url'] ?: null,
    ];
  }
  $data = [
    '@context' => 'https://schema.org',
    '@type'    => 'BreadcrumbList',
    'itemListElement' => $list,
  ];
  echo '<script type="application/ld+json">'.wp_json_encode($data).'</script>';
}
