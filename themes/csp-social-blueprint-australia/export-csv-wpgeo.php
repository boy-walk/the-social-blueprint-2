<?php

if (isset($_GET['export_cpt_csv'])) {
    // Define the custom post type you want to export
    $post_type = 'gd_health_listing'; // Replace with your CPT name

    // Query posts of the custom post type
    $args = array(
        'post_type' => $post_type,
        'posts_per_page' => -1, // Get all posts
        'post_status' => 'publish'
    );
    $query = new WP_Query($args);

    // Open a file for output (download as CSV)
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="' . $post_type . '-export.csv"');

    $output = fopen('php://output', 'w');

    // Add headers for the CSV
    fputcsv($output, array(
        'Post ID',
        'Title',
        'Author',
        'Package_id',
        'Business Type',
        'URL',
        'featured_image'
    )); // Adjust columns as needed

    // Loop through posts and output data
    while ($query->have_posts()) {
        $query->the_post();
        $cur_id = get_the_ID();

        // Get custom meta fields
        $meta_field_1 = get_post_meta($cur_id, '_thumbnail_id', true); // Replace with actual meta key
        $meta_field_2 = get_post_meta($cur_id, '_gd_switch_pkg', true); // Replace with actual meta key

        $website = geodir_get_post_meta($cur_id, 'website', true);
        $featured_image = geodir_get_post_meta($cur_id, 'featured_image', true);
        $business_type = geodir_get_post_meta($cur_id, 'business_type', true);



        // Get author data
        $author_id = get_the_author_meta('ID');
        $author_name = get_the_author_meta('display_name', $author_id);

        global $wpdb;

        $table_name = $wpdb->prefix . 'st21_geodir_gd_health_listing_detail';

        $results = $wpdb->get_results(

            "SELECT * FROM $table_name WHERE post_id=$cur_id"

        );

        foreach ($results as $row) {

            echo $row->id;

        }



        // Write post data to CSV
        fputcsv($output, array(
            get_the_ID(), // Post ID
            get_the_title(), // Title
            $author_name, // Author
            $website, // Meta Field 1
            $business_type,
            get_the_permalink($cur_id),
            $featured_image
        ));
    }

    // Close the file
    fclose($output);
    exit;
}

?>