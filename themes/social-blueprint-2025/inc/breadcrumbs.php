<?php
// inc/breadcrumbs.php

// Current post type from context (archive/singular/tax with post_type queryvar)
function sbp_current_pt_for_context() {
  $pt = get_query_var('post_type');
  if (is_array($pt)) $pt = reset($pt);
  if (!$pt && is_singular()) $pt = get_post_type();
  return $pt ?: null;
}

// Build ancestor chain for a term, with links back to the CPT archive filtered by each term
function sbp_chain_for_term_on_cpt_archive($term, $post_type, $taxonomy) {
  $items = [];
  $base  = get_post_type_archive_link($post_type);
  if (!$base) return $items;

  $anc_ids = array_reverse(get_ancestors($term->term_id, $taxonomy, 'taxonomy'));
  foreach ($anc_ids as $id) {
    $t = get_term($id, $taxonomy);
    if ($t && !is_wp_error($t)) {
      $items[] = [
        'label' => $t->name,
        'url'   => add_query_arg([$taxonomy => $t->slug], $base),
      ];
    }
  }
  $items[] = [
    'label' => $term->name,
    'url'   => add_query_arg([$taxonomy => $term->slug], $base),
  ];
  return $items;
}

// Detect category-like taxonomies for a CPT
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

// Prefer a Yoast "primary" term when available, else first term.
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
      $chain[] = ['label' => $t->name, 'url' => get_term_link($t)];
    }
  }
  // Include the term itself as the last crumb (with link)
  $chain[] = ['label' => $term->name, 'url' => get_term_link($term)];
  return $chain;
}

/**
 * Get a human-readable label for a taxonomy
 */
function sbp_get_taxonomy_browse_label($taxonomy) {
  $labels = [
    'people_tag'   => 'People',
    'topic_tag'    => 'Topics',
    'theme'        => 'Themes',
    'audience_tag' => 'Audiences',
    'category'     => 'Categories',
    'post_tag'     => 'Tags',
  ];
  
  if (isset($labels[$taxonomy])) {
    return $labels[$taxonomy];
  }
  
  $tax_obj = get_taxonomy($taxonomy);
  return $tax_obj ? $tax_obj->labels->name : ucfirst($taxonomy);
}

/**
 * Get the browse page URL for a taxonomy if one exists
 */
function sbp_get_taxonomy_browse_url($taxonomy) {
  $pages = [
    'topic_tag'    => '/topics/',
    'people_tag'   => '/people/',
    'theme'        => '/themes/',
    'audience_tag' => '/audiences/',
  ];
  
  return isset($pages[$taxonomy]) ? home_url($pages[$taxonomy]) : '';
}

/**
 * Build breadcrumb items for most contexts.
 * Returns array of ['label'=>..., 'url'=>...]. Last item may have url = ''.
 */
function sbp_build_breadcrumbs() {
  $home_url = home_url('/');
  $crumbs   = [['label' => 'Home', 'url' => $home_url]];

  // Singular posts/pages
  if (is_singular()) {
    $post_id = get_the_ID();
    $pt      = get_post_type($post_id);
    $pto     = get_post_type_object($pt);

    // Add post type archive link
    if ($archive = get_post_type_archive_link($pt)) {
      $crumbs[] = ['label' => $pto ? $pto->labels->name : ucfirst($pt), 'url' => $archive];
    } elseif ($pt === 'gd_discount') {
      $crumbs[] = ['label' => 'Community Message Board', 'url' => home_url('/community-message-board/')];
    }

    // Category-like chain
    $cat_taxes = sbp_detect_category_taxes_for_cpt($pt);
    $primary   = sbp_primary_term($post_id, $cat_taxes);

    if ($primary) {
      $crumbs = array_merge($crumbs, sbp_chain_for_term_on_cpt_archive($primary, $pt, $primary->taxonomy));
    }

    // Current page (no link)
    $crumbs[] = ['label' => get_the_title($post_id), 'url' => ''];

    return $crumbs;
  }

  // Taxonomy archive (e.g. /people_tag/sharon-lowe/ or /theme/term/)
  if (is_tax() || is_category() || is_tag()) {
    $term = get_queried_object();
    
    if (!$term || !($term instanceof WP_Term)) {
      $crumbs[] = ['label' => wp_get_document_title(), 'url' => ''];
      return $crumbs;
    }
    
    $taxonomy = $term->taxonomy;
    $tax_obj  = get_taxonomy($taxonomy);
    
    // Check if there's a post_type in context (e.g., CPT-scoped taxonomy route)
    $pt = sbp_current_pt_for_context();
    
    if ($pt && ($archive = get_post_type_archive_link($pt))) {
      // We're on a CPT-scoped taxonomy archive
      $pto = get_post_type_object($pt);
      $crumbs[] = ['label' => $pto ? $pto->labels->name : ucfirst($pt), 'url' => $archive];
      
      // Use CPT-filtered links for the term chain
      $crumbs = array_merge($crumbs, sbp_chain_for_term_on_cpt_archive($term, $pt, $taxonomy));
      
      // Make the current term non-clickable
      $crumbs[count($crumbs) - 1]['url'] = '';
    } else {
      // Pure taxonomy archive (not CPT-scoped)
      
      // Add taxonomy browse page if it exists
      $tax_label = sbp_get_taxonomy_browse_label($taxonomy);
      $tax_url   = sbp_get_taxonomy_browse_url($taxonomy);
      
      if ($tax_url) {
        $crumbs[] = ['label' => $tax_label, 'url' => $tax_url];
      }
      
      // Add term ancestor chain
      $anc_ids = array_reverse(get_ancestors($term->term_id, $taxonomy, 'taxonomy'));
      foreach ($anc_ids as $id) {
        $t = get_term($id, $taxonomy);
        if ($t && !is_wp_error($t)) {
          $crumbs[] = ['label' => $t->name, 'url' => get_term_link($t)];
        }
      }
      
      // Add current term (no link - it's the current page)
      $crumbs[] = ['label' => $term->name, 'url' => ''];
    }

    return $crumbs;
  }

  // CPT archive (including filtered by taxonomy like ?theme=slug)
  if (is_post_type_archive()) {
    $pt  = sbp_current_pt_for_context();
    $pto = get_post_type_object($pt);

    // CPT archive crumb (clickable—lets user clear filters)
    $archive = get_post_type_archive_link($pt);
    $crumbs[] = ['label' => $pto ? $pto->labels->name : ucfirst($pt), 'url' => $archive];

    // If filtered by a taxonomy term, add the term chain after the CPT
    $taxes = get_object_taxonomies($pt, 'objects');
    foreach ($taxes as $tx) {
      $qv   = $tx->query_var ? $tx->query_var : $tx->name;
      $slug = get_query_var($qv);
      if (!$slug) continue;

      $term = get_term_by('slug', $slug, $tx->name);
      if ($term && !is_wp_error($term)) {
        $chain = sbp_chain_for_term_on_cpt_archive($term, $pt, $tx->name);
        if ($chain) {
          $crumbs = array_merge($crumbs, $chain);
          // Make the current term non-clickable
          $crumbs[count($crumbs) - 1]['url'] = '';
        }
        break; // only one taxonomy filter is shown in crumbs
      }
    }

    return $crumbs;
  }

  // Author archive
  if (is_author()) {
    $crumbs[] = ['label' => 'Authors', 'url' => ''];
    $crumbs[] = ['label' => get_the_author(), 'url' => ''];
    return $crumbs;
  }

  // Date archives
  if (is_year()) {
    $crumbs[] = ['label' => get_the_date('Y'), 'url' => ''];
    return $crumbs;
  }
  if (is_month()) {
    $crumbs[] = ['label' => get_the_date('Y'), 'url' => get_year_link(get_the_date('Y'))];
    $crumbs[] = ['label' => get_the_date('F'), 'url' => ''];
    return $crumbs;
  }
  if (is_day()) {
    $crumbs[] = ['label' => get_the_date('Y'), 'url' => get_year_link(get_the_date('Y'))];
    $crumbs[] = ['label' => get_the_date('F'), 'url' => get_month_link(get_the_date('Y'), get_the_date('m'))];
    $crumbs[] = ['label' => get_the_date('j'), 'url' => ''];
    return $crumbs;
  }

  // Search
  if (is_search()) {
    $crumbs[] = ['label' => 'Search results for: ' . get_search_query(), 'url' => ''];
    return $crumbs;
  }

  // 404
  if (is_404()) {
    $crumbs[] = ['label' => 'Page not found', 'url' => ''];
    return $crumbs;
  }

  // Fallback
  $crumbs[] = ['label' => wp_get_document_title(), 'url' => ''];
  return $crumbs;
}