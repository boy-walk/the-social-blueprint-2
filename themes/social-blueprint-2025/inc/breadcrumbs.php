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

  $anc_ids = array_reverse( get_ancestors($term->term_id, $taxonomy, 'taxonomy') );
  foreach ($anc_ids as $id) {
    $t = get_term($id, $taxonomy);
    if ($t && !is_wp_error($t)) {
      $items[] = [
        'label' => $t->name,
        'url'   => add_query_arg( [$taxonomy => $t->slug], $base ),
      ];
    }
  }
  $items[] = [
    'label' => $term->name,
    'url'   => add_query_arg( [$taxonomy => $term->slug], $base ),
  ];
  return $items;
}

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
  $crumbs   = [ ['label' => 'Home', 'url' => $home_url] ];

  // Singular
  if (is_singular()) {
    $post_id = get_the_ID();
    $pt      = get_post_type($post_id);
    $pto     = get_post_type_object($pt);

    if ($archive = get_post_type_archive_link($pt)) {
      $crumbs[] = ['label' => $pto ? $pto->labels->name : ucfirst($pt), 'url' => $archive];
    } elseif ($pt === 'gd_discount') {
      $crumbs[] = ['label' => 'Community message board', 'url' => home_url('/community-message-board/')];
    }

    // Category-like chain
    $cat_taxes = sbp_detect_category_taxes_for_cpt($pt);
    $primary   = sbp_primary_term($post_id, $cat_taxes);
    if ($primary) {
      // Link to CPT-filtered archive for each term in the chain
      $crumbs = array_merge($crumbs, sbp_chain_for_term_on_cpt_archive($primary, $pt, $primary->taxonomy));
      // Make the last term (the primary) non-clickable
      $crumbs[count($crumbs)-1]['url'] = '';
    }

    $crumbs[] = ['label' => get_the_title($post_id), 'url' => ''];
    return $crumbs;
  }

  // Taxonomy archive (e.g. /theme/term/ or CPT-scoped tax route that sets post_type)
  if (is_tax()) {
    $term = get_queried_object();
    $pt   = sbp_current_pt_for_context(); // <- prefer the actual CPT in context, not the first attached one

    if ($pt && ($archive = get_post_type_archive_link($pt))) {
      $pto = get_post_type_object($pt);
      $crumbs[] = ['label' => $pto ? $pto->labels->name : ucfirst($pt), 'url' => $archive];
      // Use CPT-filtered links for the term chain
      $crumbs = array_merge($crumbs, sbp_chain_for_term_on_cpt_archive($term, $pt, $term->taxonomy));
    } else {
      // Fallback: original behavior (global taxonomy path)
      $object_tax = get_taxonomy($term->taxonomy);
      if ($object_tax && !empty($object_tax->object_type)) {
        $first_pt = is_array($object_tax->object_type) ? reset($object_tax->object_type) : $object_tax->object_type;
        if ($first_pt && ($archive = get_post_type_archive_link($first_pt))) {
          $pto = get_post_type_object($first_pt);
          $crumbs[] = ['label' => $pto ? $pto->labels->name : ucfirst($first_pt), 'url' => $archive];
        }
      }
      $crumbs = array_merge($crumbs, sbp_term_ancestor_chain($term));
    }

    // Make the current term non-clickable
    $crumbs[count($crumbs)-1]['url'] = '';
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
      $qv   = $tx->query_var ? $tx->query_var : $tx->name; // 'theme' by default
      $slug = get_query_var($qv);
      if (!$slug) continue;

      $term = get_term_by('slug', $slug, $tx->name);
      if ($term && !is_wp_error($term)) {
        $chain = sbp_chain_for_term_on_cpt_archive($term, $pt, $tx->name);
        if ($chain) {
          $crumbs = array_merge($crumbs, $chain);
          // Make the current term non-clickable
          $crumbs[count($crumbs)-1]['url'] = '';
        }
        break; // only one taxonomy filter is shown in crumbs
      }
    }

    return $crumbs;
  }

  // Search, etc.
  if (is_search()) {
    $crumbs[] = ['label' => 'Search results', 'url' => ''];
    return $crumbs;
  }

  // Fallback
  $crumbs[] = ['label' => wp_get_document_title(), 'url' => ''];
  return $crumbs;
}
