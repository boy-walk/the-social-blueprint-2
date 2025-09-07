<?php
// Register "Category" taxonomy for Articles
add_action('init', function() {
  $labels = [
    'name'              => _x('Categories', 'taxonomy general name', 'textdomain'),
    'singular_name'     => _x('Category', 'taxonomy singular name', 'textdomain'),
    'search_items'      => __('Search Categories', 'textdomain'),
    'all_items'         => __('All Categories', 'textdomain'),
    'parent_item'       => __('Parent Category', 'textdomain'),
    'parent_item_colon' => __('Parent Category:', 'textdomain'),
    'edit_item'         => __('Edit Category', 'textdomain'),
    'update_item'       => __('Update Category', 'textdomain'),
    'add_new_item'      => __('Add New Category', 'textdomain'),
    'new_item_name'     => __('New Category Name', 'textdomain'),
    'menu_name'         => __('Categories', 'textdomain'),
  ];

  register_taxonomy('article_category', ['article'], [
    'hierarchical'      => true, // behaves like normal categories
    'labels'            => $labels,
    'show_ui'           => true,
    'show_in_menu'      => true,
    'show_in_rest'      => true, // Gutenberg + REST API support
    'show_admin_column' => true,
    'query_var'         => true,
    'rewrite'           => [ 'slug' => 'article-category' ],
  ]);
});
