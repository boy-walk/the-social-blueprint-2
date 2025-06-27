<?php

$root_dir = trim(__DIR__, 'wp-content');
require_once($root_dir . 'wp-load.php');

$post_type = $_GET['post_type'] ?? ''; // Sanitize input
if (empty($post_type)) {
    die('Post type not specified');
}

$args = array(
    'post_type' => $post_type,
    'posts_per_page' => -1,
);

$query = new WP_Query($args);

// Check if query returns any posts
if (!$query->have_posts()) {
    die('No posts found for the given post type');
}

// Open a file for output (download as CSV)
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="' . $post_type . '-export.csv"');

$output = fopen('php://output', 'w');

// CSV headers
$csv_labels = [
    'Organisation ID',
    'Organisation Name',
    'Business Type',
    'Listing Title',
    'Description',
    'Website',
    'Featured Image',
    'Post Images',
    'Categories',
    'Street',
    'City',
    'Region',
    'Country',
    'Phone',
    'Facebook',
    'Instagram',
    'Twitter',
    'LinkedIn',
    'Contact Person',
    'Special Offers',
    'business_hours',
    'listing_age_group',
    'offerings',
    'sporting_offering',
    'aged_care_offering',
    'synagogue_offering',
    'crisis__governmet_mgt_offering',
    'URL',
    'Status'
];

fputcsv($output, $csv_labels);

global $wpdb;

while ($query->have_posts()) {
    $query->the_post();
    $cur_id = get_the_ID();

    // Efficiently retrieve post meta and custom fields in one go
    $meta = get_post_meta($cur_id);
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
    $contact_person = geodir_get_post_meta($cur_id, 'listing_contact_peron ', true);
    $special_offers = geodir_get_post_meta($cur_id, 'special_offers', true);
    $business_hours = geodir_get_post_meta($cur_id, 'business_hours', true);
    $listing_age_group = geodir_get_post_meta($cur_id, 'listing_age_group', true);
    $offerings = geodir_get_post_meta($cur_id, 'offerings', true);
    $sporting_offering = geodir_get_post_meta($cur_id, 'sporting_offering', true);
    $aged_care_offering = geodir_get_post_meta($cur_id, 'aged_care_offering', true);
    $synagogue_offering = geodir_get_post_meta($cur_id, 'synagogue_offering', true);
    $crisis__governmet_mgt_offering = geodir_get_post_meta($cur_id, 'crisis__governmet_mgt_offering', true);


    // Get author data
    $author_id = get_the_author_meta('ID');
    $author_name = get_the_author_meta('display_name', $author_id);

    // Fetch post images in a single query
    $post_images = [];
    $table_name = $wpdb->prefix . 'geodir_attachments';
    $results = $wpdb->get_results(
        $wpdb->prepare("SELECT file FROM $table_name WHERE post_id = %d", $cur_id)
    );

    foreach ($results as $row) {
        $post_images[] = "https://thesocialblueprint.org.au/wp-content/uploads" . $row->file;
    }
    $post_images_text = implode(',', $post_images);

    // Categories
    $categories = wp_get_post_terms($cur_id, 'gd_businesscategory');
    $categories_text = implode('|', wp_list_pluck($categories, 'name'));

    // Prepare CSV row
    $data_row = [
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
        $special_offers,
        $business_hours,
        $listing_age_group,
        $offerings,
        $sporting_offering,
        $aged_care_offering,
        $synagogue_offering,
        $crisis__governmet_mgt_offering,
        get_the_permalink($cur_id),
        get_post_status($cur_id)
    ];

    fputcsv($output, $data_row);
}

// Close the file
fclose($output);
exit;

