<?php
// Add to your theme's functions.php

function add_dynamic_og_tags() {
    // Only add on frontend
    if (is_admin()) return;
    
    // Get current page data
    global $post;
    
    // Default values
    $site_name = get_bloginfo('name');
    $site_description = get_bloginfo('description');
    $site_url = home_url();
    $default_image = get_template_directory_uri() . '/assets/default-og-image.jpg'; // Add your default image
    
    // Page-specific values
    $og_title = '';
    $og_description = '';
    $og_image = $default_image;
    $og_url = '';
    $og_type = 'website';
    
    if (is_single() || is_page()) {
        // Single post or page
        $og_title = get_the_title($post->ID);
        $og_url = get_permalink($post->ID);
        $og_type = is_single() ? 'article' : 'website';
        
        // Get excerpt or post content preview
        if (has_excerpt($post->ID)) {
            $og_description = wp_strip_all_tags(get_the_excerpt($post->ID));
        } else {
            $og_description = wp_trim_words(wp_strip_all_tags($post->post_content), 30, '...');
        }
        
        // Get featured image
        if (has_post_thumbnail($post->ID)) {
            $thumbnail_id = get_post_thumbnail_id($post->ID);
            $thumbnail_url = wp_get_attachment_image_src($thumbnail_id, 'large');
            if ($thumbnail_url) {
                $og_image = $thumbnail_url[0];
            }
        }
        
    } elseif (is_home() || is_front_page()) {
        // Homepage
        $og_title = $site_name;
        $og_description = $site_description;
        $og_url = $site_url;
        
    } elseif (is_category()) {
        // Category page
        $category = get_queried_object();
        $og_title = $category->name . ' - ' . $site_name;
        $og_description = $category->description ?: 'Posts in ' . $category->name;
        $og_url = get_category_link($category->term_id);
        
    } elseif (is_tag()) {
        // Tag page
        $tag = get_queried_object();
        $og_title = $tag->name . ' - ' . $site_name;
        $og_description = $tag->description ?: 'Posts tagged with ' . $tag->name;
        $og_url = get_tag_link($tag->term_id);
        
    } else {
        // Fallback
        $og_title = wp_get_document_title();
        $og_description = $site_description;
        $og_url = get_permalink();
    }
    
    // Clean up description
    $og_description = wp_strip_all_tags($og_description);
    $og_description = str_replace(array("\r", "\n", "\t"), ' ', $og_description);
    $og_description = trim(preg_replace('/\s+/', ' ', $og_description));
    
    // Truncate if too long
    if (strlen($og_description) > 160) {
        $og_description = substr($og_description, 0, 157) . '...';
    }
    
    // Output the meta tags
    echo "\n<!-- Dynamic Open Graph Tags -->\n";
    echo '<meta property="og:type" content="' . esc_attr($og_type) . '" />' . "\n";
    echo '<meta property="og:title" content="' . esc_attr($og_title) . '" />' . "\n";
    echo '<meta property="og:description" content="' . esc_attr($og_description) . '" />' . "\n";
    echo '<meta property="og:url" content="' . esc_url($og_url) . '" />' . "\n";
    echo '<meta property="og:site_name" content="' . esc_attr($site_name) . '" />' . "\n";
    echo '<meta property="og:image" content="' . esc_url($og_image) . '" />' . "\n";
    echo '<meta property="og:image:width" content="1200" />' . "\n";
    echo '<meta property="og:image:height" content="630" />' . "\n";
    
    // Twitter Cards
    echo '<meta name="twitter:card" content="summary_large_image" />' . "\n";
    echo '<meta name="twitter:title" content="' . esc_attr($og_title) . '" />' . "\n";
    echo '<meta name="twitter:description" content="' . esc_attr($og_description) . '" />' . "\n";
    echo '<meta name="twitter:image" content="' . esc_url($og_image) . '" />' . "\n";
    echo '<meta name="twitter:url" content="' . esc_url($og_url) . '" />' . "\n";
    
    // Article-specific tags for blog posts
    if (is_single() && get_post_type() === 'post') {
        $author_id = $post->post_author;
        $author_name = get_the_author_meta('display_name', $author_id);
        $published_time = get_the_date('c', $post->ID);
        $modified_time = get_the_modified_date('c', $post->ID);
        
        echo '<meta property="article:author" content="' . esc_attr($author_name) . '" />' . "\n";
        echo '<meta property="article:published_time" content="' . esc_attr($published_time) . '" />' . "\n";
        echo '<meta property="article:modified_time" content="' . esc_attr($modified_time) . '" />' . "\n";
        
        // Categories and tags
        $categories = get_the_category($post->ID);
        foreach ($categories as $category) {
            echo '<meta property="article:section" content="' . esc_attr($category->name) . '" />' . "\n";
        }
        
        $tags = get_the_tags($post->ID);
        if ($tags) {
            foreach ($tags as $tag) {
                echo '<meta property="article:tag" content="' . esc_attr($tag->name) . '" />' . "\n";
            }
        }
    }
    
    echo "<!-- End Dynamic Open Graph Tags -->\n\n";
}

// Hook into wp_head
add_action('wp_head', 'add_dynamic_og_tags', 1);

// Optional: Add custom meta box for manual OG overrides
function add_og_meta_box() {
    add_meta_box(
        'og_override',
        'Social Media Sharing Override',
        'og_meta_box_callback',
        array('post', 'page'),
        'normal',
        'default'
    );
}
add_action('add_meta_boxes', 'add_og_meta_box');

function og_meta_box_callback($post) {
    wp_nonce_field('og_override_nonce', 'og_override_nonce');
    
    $og_title = get_post_meta($post->ID, '_og_title', true);
    $og_description = get_post_meta($post->ID, '_og_description', true);
    $og_image = get_post_meta($post->ID, '_og_image', true);
    
    echo '<table class="form-table">';
    echo '<tr><th><label for="og_title">Custom OG Title:</label></th>';
    echo '<td><input type="text" id="og_title" name="og_title" value="' . esc_attr($og_title) . '" style="width: 100%;" /></td></tr>';
    
    echo '<tr><th><label for="og_description">Custom OG Description:</label></th>';
    echo '<td><textarea id="og_description" name="og_description" rows="3" style="width: 100%;">' . esc_textarea($og_description) . '</textarea></td></tr>';
    
    echo '<tr><th><label for="og_image">Custom OG Image URL:</label></th>';
    echo '<td><input type="url" id="og_image" name="og_image" value="' . esc_url($og_image) . '" style="width: 100%;" /></td></tr>';
    echo '</table>';
    
    echo '<p><em>Leave blank to use automatic values (post title, excerpt, featured image).</em></p>';
}

function save_og_meta_box($post_id) {
    if (!isset($_POST['og_override_nonce']) || !wp_verify_nonce($_POST['og_override_nonce'], 'og_override_nonce')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    $fields = array('og_title', 'og_description', 'og_image');
    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            update_post_meta($post_id, '_' . $field, sanitize_text_field($_POST[$field]));
        }
    }
}
add_action('save_post', 'save_og_meta_box');