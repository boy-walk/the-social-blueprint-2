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
header('Content-Disposition: attachment; filename="' . $post_type . '_export_"' . date("d-m-Y") . '".csv"');

$output = fopen('php://output', 'w');

// CSV headers
$csv_labels = [
    'Main Category',
    'Other Categories',
    'Organisation Name',
    'Organisation Phone',
    'Organisation Email',
    'Organisation Type',
    'Organisation ID',
    'Listing Title',
    'Description',
    'Website URL',
    'Featured Image',
    'Listing Images',
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
    'monetary_aid',
    'education_aid_type',
    'material_aid',
    '_food_aid',
    'medical_aid_offering',
    'housing_aid',
    'special_offers',

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
    $phone = geodir_get_post_meta($cur_id, 'phone', true);
    $facebook = geodir_get_post_meta($cur_id, 'facebook', true);
    $instagram = geodir_get_post_meta($cur_id, 'instagram', true);
    $twitter = geodir_get_post_meta($cur_id, 'twitter', true);
    $linkedin = geodir_get_post_meta($cur_id, 'linkedin', true);
    $contact_person = geodir_get_post_meta($cur_id, 'contact_person ', true);
    $special_offers = geodir_get_post_meta($cur_id, 'special_offers', true);
    $business_hours = geodir_get_post_meta($cur_id, 'business_hours', true);
    $monetary_aid = geodir_get_post_meta($cur_id, 'monetary_aid', true);
    $education_aid_type = geodir_get_post_meta($cur_id, 'education_aid_type', true);
    $material_aid = geodir_get_post_meta($cur_id, 'material_aid', true);
    $_food_aid = geodir_get_post_meta($cur_id, '_food_aid', true);
    $medical_aid_offering = geodir_get_post_meta($cur_id, 'medical_aid_offering', true);
    $housing_aid = geodir_get_post_meta($cur_id, 'housing_aid', true);
    $special_offers = geodir_get_post_meta($cur_id, 'special_offers', true);
    $default_category_id = geodir_get_post_meta($cur_id, 'default_category', true);
    $default_category_name = get_term($default_category_id)->name;






    // Get author data
    $author_id = get_the_author_meta('ID');
    $author_name = get_the_author_meta('display_name', $author_id);
    $author_mobile = uwp_get_usermeta($author_id, 'mobile', '');
    $author_email = get_the_author_meta('email', $author_id);

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
    $categories = wp_get_post_terms($cur_id, 'gd_aid_listingcategory');
    $categories_text = implode('|', wp_list_pluck($categories, 'name'));

    // Prepare CSV row
    $data_row = [
        $default_category_name,
        $categories_text,
        $author_name,
        $author_mobile,
        $author_email,
        $business_type,
        $author_id,
        get_the_title(),
        get_the_content(),
        $website,
        'https://thesocialblueprint.org.au/wp-content/uploads' . $featured_image,
        $post_images_text,
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
        $monetary_aid,
        $education_aid_type,
        $material_aid,
        $_food_aid,
        $medical_aid_offering,
        $housing_aid,
        $special_offers,
        get_the_permalink($cur_id),
        get_post_status($cur_id)
    ];

    fputcsv($output, $data_row);
}

// Close the file
fclose($output);
exit;

