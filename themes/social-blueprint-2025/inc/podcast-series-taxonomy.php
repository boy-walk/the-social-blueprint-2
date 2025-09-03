<?php
// Register "Series" taxonomy for "podcast" CPT
function sb_register_series_taxonomy() {
    $labels = array(
        'name'              => _x( 'Series', 'taxonomy general name', 'textdomain' ),
        'singular_name'     => _x( 'Series', 'taxonomy singular name', 'textdomain' ),
        'search_items'      => __( 'Search Series', 'textdomain' ),
        'all_items'         => __( 'All Series', 'textdomain' ),
        'parent_item'       => __( 'Parent Series', 'textdomain' ),
        'parent_item_colon' => __( 'Parent Series:', 'textdomain' ),
        'edit_item'         => __( 'Edit Series', 'textdomain' ),
        'update_item'       => __( 'Update Series', 'textdomain' ),
        'add_new_item'      => __( 'Add New Series', 'textdomain' ),
        'new_item_name'     => __( 'New Series Name', 'textdomain' ),
        'menu_name'         => __( 'Series', 'textdomain' ),
    );

    $args = array(
        'hierarchical'      => true, // behaves like categories
        'labels'            => $labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'public'            => true,
        'show_in_rest'      => true, // enable Gutenberg / API
        'rewrite'           => array( 'slug' => 'series' ),
    );

    register_taxonomy( 'series', array( 'podcast' ), $args );
}
add_action( 'init', 'sb_register_series_taxonomy' );
