<?php
/**
 * Add to functions.php
 * 
 * Prevent WordPress search from indexing HTML output - only search database content
 * This fixes the issue where related posts in data attributes pollute search results
 */

add_filter('posts_search', 'sbp_search_only_database_content', 10, 2);
function sbp_search_only_database_content($search, $query) {
    global $wpdb;
    
    // Only modify search queries
    if (!$query->is_search() || empty($search)) {
        return $search;
    }
    
    // Get search terms
    $search_terms = $query->get('search_terms');
    if (empty($search_terms)) {
        return $search;
    }
    
    // Build our own search query that ONLY searches the database fields
    // This prevents WordPress from searching the rendered HTML output
    $search = '';
    $searchand = '';
    
    foreach ((array) $search_terms as $term) {
        $term = $wpdb->esc_like($term);
        $like = '%' . $term . '%';
        
        $search .= "{$searchand}(";
        $search .= "({$wpdb->posts}.post_title LIKE '{$like}')";
        $search .= " OR ({$wpdb->posts}.post_content LIKE '{$like}')";
        $search .= " OR ({$wpdb->posts}.post_excerpt LIKE '{$like}')";
        $search .= ")";
        
        $searchand = ' AND ';
    }
    
    if (!empty($search)) {
        $search = " AND ({$search}) ";
    }
    
    return $search;
}