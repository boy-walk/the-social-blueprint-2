<?php

$root_dir = trim(__DIR__, 'wp-content');
require_once($root_dir . 'wp-load.php');

$post_type = $_GET['post_type'];
// echo "qwfqfqwf-- " . $post_type;die;
// $post_type = 'gd_health_listing';

$args = array(
    'post_type' => $post_type,
    'posts_per_page' => -1,
    // 'post_status' => 'publish'
);
$query = new WP_Query($args);

// Open a file for output (download as CSV)
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="' . $post_type . '-export.csv"');

$output = fopen('php://output', 'w');

$csv_labels = array(
    'Organisation ID',
    'Organisation Name',
    'Business Type',
    'Business Title',
    'Description',
    'website',
    'featured_image',
    'post_images',
    'Categories',
    'street',
    'city',
    'region',
    'country',
    'phone',
    'facebook',
    'instagram',
    'twitter',
    'linkedin',
    'contact_person',
    'acn__abn',
    'URL',
    'Status'
);


fputcsv($output, $csv_labels);


while ($query->have_posts()) {
    $query->the_post();
    $cur_id = get_the_ID();

    // Get custom meta fields
    $meta_field_1 = get_post_meta($cur_id, '_thumbnail_id', true); // Replace with actual meta key
    $meta_field_2 = get_post_meta($cur_id, '_gd_switch_pkg', true); // Replace with actual meta key

    $business_type = geodir_get_post_meta($cur_id, 'business_type', true);

    $website = geodir_get_post_meta($cur_id, 'website', true);
    $featured_image = geodir_get_post_meta($cur_id, 'featured_image', true);
    $street = geodir_get_post_meta($cur_id, 'street', true);
    $city = geodir_get_post_meta($cur_id, 'city', true);
    $region = geodir_get_post_meta($cur_id, 'region', true);
    $country = geodir_get_post_meta($cur_id, 'country', true);
    $phone = geodir_get_post_meta($cur_id, 'contact_number', true);
    $facebook = geodir_get_post_meta($cur_id, 'facebook', true);
    $instagram = geodir_get_post_meta($cur_id, 'instagram', true);
    $twitter = geodir_get_post_meta($cur_id, 'twitter', true);
    $linkedin = geodir_get_post_meta($cur_id, 'linkedin', true);
    $contact_person = geodir_get_post_meta($cur_id, 'business_contact_person', true);
    $acn__abn = geodir_get_post_meta($cur_id, 'acn__abn', true);

    // Get author data
    $author_id = get_the_author_meta('ID');
    $author_name = get_the_author_meta('display_name', $author_id);

    // Post images
    global $wpdb;
    $post_images = $categories = [];

    $table_name = $wpdb->prefix . 'geodir_attachments';
    $post_id = $cur_id;

    $query_1 = $wpdb->prepare(
        "SELECT * FROM $table_name WHERE post_id = %d",
        $post_id
    );

    $results = $wpdb->get_results($query_1);

    $terms = wp_get_post_terms($post_id, 'gd_businesscategory');

    // Check if there are terms
    if (!empty($terms) && !is_wp_error($terms)) {
        // Loop through the terms and display more information
        foreach ($terms as $term) {
            $categories[] = $term->name;
        }
    }
    $categories_text = implode('|', $categories);


    // echo '<pre>';
    // print_r($results);
    // die;

    // Loop through the results
    foreach ($results as $row) {
        $post_images[] = "https://thesocialblueprint.org.au/wp-content/uploads" . $row->file;
    }
    $post_images_text = implode(',', $post_images);

    // echo '<pre>';
    // print_r($post_images_text);
    // die;

    $data_row = array(
        $author_id,
        $author_name,
        $business_type,
        get_the_title(),
        get_the_content(),
        $website,
        'https://thesocialblueprint.org.au/wp-content/uploads' . $featured_image,
        $post_images_text,
        $categories_text,
        $street,
        $city,
        $region,
        $country,
        $phone,
        $facebook,
        $instagram,
        $twitter,
        $linkedin,
        $contact_person,
        $acn__abn,
        get_the_permalink($cur_id),
        get_post_status($cur_id)

    );
    fputcsv($output, $data_row);
}

// Close the file
fclose($output);
exit;





// global $wpdb;

// $table_name = $wpdb->prefix . 'st21_geodir_gd_health_listing_detail';

// $results = $wpdb->get_results(

//     "SELECT * FROM $table_name WHERE post_id=$cur_id"

// );

// foreach ($results as $row) {

//     echo $row->id;

// }

?>