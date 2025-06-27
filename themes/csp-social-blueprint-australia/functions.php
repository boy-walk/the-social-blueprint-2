<?php
add_filter('tec_events_community_image_mime_types', 'update_events_mime_types');

function update_events_mime_types($data)
{

    return [
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/webp',
    ];

}

function admin_custom_script()
{
    ?>
    <script type="text/javascript">
        jQuery(document).ready(function ($) {
            // Add a click event to toggle child categories
            $('.categorychecklist li:has(ul.children)').each(function () {
                var $this = $(this);
                $this.children('ul.children').hide(); // Hide child categories by default

                // Add a toggle button
                $this.children('label').prepend('<span class="toggle-children">[+]</span> ');

                // Click event to toggle child categories
                $this.children('label').find('.toggle-children').click(function (e) {
                    e.preventDefault();
                    var $children = $this.children('ul.children');
                    if ($children.is(':visible')) {
                        $children.slideUp();
                        $(this).text('[+]');
                    } else {
                        $children.slideDown();
                        $(this).text('[-]');
                    }
                });
            });
        });

    </script>



    <style>
        .categorychecklist .toggle-children {
            cursor: pointer;
            margin-right: 0px;
            font-size: 16px;
        }

        body .categorydiv div.tabs-panel {
            max-height: 400px;
        }

        .categorydiv ul.categorychecklist ul {
            margin-left: 35px;
        }
    </style>
    <?php
}
add_action('admin_head', 'admin_custom_script');


function csp_order_toolkit_by_menu_order($query)
{

    if (!is_admin() && is_post_type_archive('gd_cost_of_living') && $query->is_main_query()) {
        //echo '<pre>'; print_r($query);die;
        $query->set('orderby', 'menu_order');
        $query->set('order', 'DESC');
    }
    return $query;
}
//add_action( 'pre_get_posts', 'csp_order_toolkit_by_menu_order', 999999);

function gd_snippet_190814_posts_order_by_sort($orderby, $sort_by, $table, $query)
{
    global $wpdb;

    if (!empty($orderby)) {
        $orderby = "menu_order ASC";
    }

    return $orderby;
}
add_filter('geodir_posts_order_by_sort', 'gd_snippet_190814_posts_order_by_sort', 99, 4);

// add_filter( 'the_content', 'tsb_add_pdf_to_content',9999 );

function tsb_add_pdf_to_content($content)
{
    if (is_singular('gd_cost_of_living')) {
        global $wp_query;
        $postid = $wp_query->post->ID;
        $pdf = geodir_get_post_meta($postid, 'pdf_file_url', true);
        if (!empty($pdf)) {
            $dflip = '<div class="tsb-pdf-viewer"><h2 class="gd-tab-list-title h3 ">View PDF</h2><hr>[dflip id="25139" source="' . $pdf . '" viewertype1="vertical" type1="thumb"][/dflip]</div>';
            $content .= $dflip;
        }
    }


    return $content;
}
function tsb_add_pdf_to_content_shortcode_func()
{

    global $wp_query;
    $postid = $wp_query->post->ID;
    $pdf = geodir_get_post_meta($postid, 'pdf_file_url', true);

    if (is_singular('gd_cost_of_living') && !empty($pdf)) {
        if (!empty($pdf)) {
            $dflip = '<div class="tsb-pdf-viewer">[dflip id="25139" source="' . $pdf . '" viewertype1="vertical" type1="thumb"][/dflip]</div>';
            echo $dflip;
        }
    } else {
        echo '[gd_post_images types="post_images" type="image" image_size="scaled" ajax_load="true" slideshow="true" show_title="true" animation="slide" controlnav="0" ]';

    }
}
add_shortcode('tsb_pdf_viewer', 'tsb_add_pdf_to_content_shortcode_func');


add_action('admin_head', 'csp_my_custom_admin_css');

function csp_my_custom_admin_css()
{
    echo '<style>
    body.wp-admin.admin_not_me #adminmenu li#toplevel_page_ayecode-connect,
body.wp-admin.admin_not_me #adminmenu li#toplevel_page_image-sizes,
body.wp-admin.admin_not_me #adminmenu li#toplevel_page_geodirectory,
body.wp-admin.admin_not_me #adminmenu li#toplevel_page_smush
{
	display: none !important;
}
  </style>';
}
function wpdocs_admin_classes($classes)
{
    global $pagenow;

    if (is_admin() && get_current_user_id() != 1) {
        $classes .= ' admin_not_me user_id_' . get_current_user_id();
    }

    return $classes;
}

add_filter('admin_body_class', 'wpdocs_admin_classes');

function cap_wpdocs_dequeue_script()
{
    wp_dequeue_script('__disptype__');
    wp_deregister_script('__disptype__');
    wp_dequeue_style('__dispload__');
    wp_deregister_script('__dispload__');
}
add_action('wp_print_styles', 'cap_wpdocs_dequeue_script', 999);

add_action('wp_print_scripts', 'csp_mywptheme_child_deregister_styles', 999);
function csp_mywptheme_child_deregister_styles()
{
    wp_dequeue_style('__dispload__');
    wp_deregister_script('__dispload__');
    wp_dequeue_script('__disptype__');
    wp_deregister_script('__disptype__');
}

function casp_add_plugin_body_class($classes)
{
    if (is_user_logged_in() && is_admin() && is_front_page()) {
        $classes[] = 'front-logged-admin';
    }
    return $classes;
}

add_filter('body_class', 'casp_add_plugin_body_class', 40, 1);

function nd_recent_posts_by_category_id($atts)
{
    extract(shortcode_atts(array(
        'id' => 576      // Add the *default category id
    ), $atts));

    $posts = get_posts(array(
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'cat' => $id,
    ));

    $return = '';
    $return .= '<div class="homepage_info_box"><ul class="list list-icons list-icons-sm"> ';

    foreach ($posts as $post) {
        $permalink = get_permalink($post->ID);
        $return .= '<li><i class="fa fa-caret-right"></i> <a class="item" href="' . $permalink . '">' . apply_filters('the_title', $post->post_title) . '</a> </li>';
    }

    $return .= '</ul></div>';
    return $return;
}
add_shortcode('nd_recent_posts_by_category_id', 'nd_recent_posts_by_category_id');

add_action('tribe_events_community_event_submission_login_form', function () {
    wp_safe_redirect(site_url('register/'));
    exit;
});

add_filter('porto_meta_layout', 'csp_change_sidebar_menu');
function csp_change_sidebar_menu($porto_layout_array)
{

    if (is_singular('post') && has_category(array(587), get_the_ID())) {
        $porto_layout_array[1] = "porto-custom-sidebar-blueprintvideossidebar";
    }
    // $term = get_queried_object();
// $parent = ( isset( $term->parent ) ) ? get_term_by( 'id', $term->parent, 'types' ) : false;


    // echo '<pre>';
    // print_r($parent);die;
    // porto-custom-sidebar-blueprintvideossidebar
    return $porto_layout_array;
}
function csp__remove_wp_admin_bar_button()
{
    remove_action('admin_bar_menu', array(vc_frontend_editor(), 'adminBarEditLink'), 1000);
}
add_action('vc_after_init', 'csp__remove_wp_admin_bar_button');

add_filter('tec_events_custom_tables_v1_db_transactions_supported', function () {
    return false;
});

add_filter('pre_get_posts', 'csp_exclude_home_page_on_search_result');
function csp_exclude_home_page_on_search_result($query)
{
    if (!is_admin() && $query->is_search && $query->is_main_query())
        $query->set('post__not_in', array(8197));
    return $query;
}
// add_action( 'pre_get_posts', 'csp_exclude_home_page_on_search_result' );

// add_filter( 'gettext', 'csp_my_string_changes', 10, 3);
function csp_my_string_changes($translation, $text, $domain)
{
    if ($domain == 'geodirectory' && $text == 'Please check your email.') {
        $translation = 'Please check your email. Please do not forget to check your junk / spam folders as well';
    }
    return $translation;
}

add_filter('uwp_change_password_success_message', 'csp_change_text_uwp');
function csp_change_text_uwp()
{
    return "Please check your email. Please do not forget to check your junk / spam folders as well!";
}

add_action('in_admin_header', function () {
    if (!$is_my_admin_page)
        return;
    remove_all_actions('admin_notices');
    remove_all_actions('all_admin_notices');
    add_action('admin_notices', function () {
        echo 'My notice';
    });
}, 1000);

//Dequeue Styles
// function project_dequeue_unnecessary_styles() {
//     wp_dequeue_style( 'porto_admin_bar' );
//         wp_deregister_style( 'porto_admin_bar' );
// }
// add_action( 'wp_print_styles', 'project_dequeue_unnecessary_styles' );

//Dequeue JavaScripts
function csp_project_dequeue_unnecessary_scripts()
{

    if (!is_page('contact-us')) {

        wp_dequeue_script('wpcf7-recaptcha');
        wp_deregister_script('wpcf7-recaptcha');
    }
}
add_action('wp_print_scripts', 'csp_project_dequeue_unnecessary_scripts');

function csp_remove_contact_form()
{

    if (!is_page('contact-us')) {
        add_filter('wpcf7_load_js', '__return_false');
        add_filter('wpcf7_load_css', '__return_false');
    }
}
add_action('init', 'csp_remove_contact_form');


function csp_discount_page_login_check()
{
    // Do stuff. Say we will echo "Fired on the WordPress initialization".
    if (!is_user_logged_in() && get_post_type(get_the_ID()) == 'gd_discount') {
        echo 'Please LogIn';
        die;
    }

}
// add_action( 'init', 'csp_discount_page_login_check' );


function csp_uwp_account_available_tabs_cb($tabs)
{
    unset($tabs['notifications']);
    // 		unset($tabs['privacy']);    
    return $tabs;
}
add_filter('uwp_account_available_tabs', 'csp_uwp_account_available_tabs_cb');

function csp_b5f_increase_upload($bytes)
{
    if (is_admin() && 1 == get_current_user_id()) {
        return 24544320;
    } elseif (is_admin()) {
        return 4544320;
    }
    return 2544320; // 2 megabytes
}

add_filter('upload_size_limit', 'csp_b5f_increase_upload');
add_filter('tribe_community_events_max_file_size_allowed', 'csp_b5f_increase_upload');

function nd_list_categories()
{
    $args = array(
        'taxonomy' => 'tribe_events_cat',
        'orderby' => 'menu_order',
        'order' => 'ASC',
        'hide_empty' => true,
        'depth' => 10,
        'hierarchical' => true,
        'posts_per_page' => -1
    );
    $categories = get_categories($args);
    // $data = '';
// foreach($categories as $category) { 
//     $data .=  '<p class="mb-2"><a href="' . get_category_link( $category->term_id ) . '" title="' . sprintf( __( "View all posts in %s" ), $category->name ) . '" ' . '>' . $category->name.'</a> </p> ';
// }

    // return $data;
    ?>
    <!-- <ul> -->
    <?php wp_list_categories(array(
        'title_li' => '',
        'style' => '',
        'taxonomy' => 'tribe_events_cat',
        'orderby' => 'menu_order',
        'order' => 'ASC',
        'hide_empty' => true,
        'show_count' => false
    )); ?>
    <!-- </ul> -->
    <?php
}

add_shortcode('nd_portfolio_category', 'nd_list_categories');

function nd_welcome_user_func()
{
    if (is_user_logged_in()): ?>
        <div class="d-none d-md-block small" style="position:absolute; right:0; bottom:-55px;">
            <?php _e('Welcome, ', 'theme');
            echo wp_get_current_user()->display_name; ?>
            <!-- <a href="<?php //echo wp_logout_url( home_url()); ?>" title="Logout">Logout</a> -->
        </div>
    <?php endif;
}
add_shortcode('nd_welcome_user', 'nd_welcome_user_func');



function nd_video_post_categories($atts, $content = null)
{

    // 	echo '<pre>';
// 	var_dump($atts);
// 	echo '</pre>';
    $title = $atts['title'] ? $atts['title'] : "Select person or story type";
    $parent_id = $atts['parent_id'] ? $atts['parent_id'] : 587;

    // 	 echo wp_list_categories( array(
// 	'title_li' => '',
// 	'style' => 'mb-2',
// 'taxonomy' => 'category',
//     'orderby' => 'menu_order', 
//     'order' => 'ASC', 
// 		 'parent' => $parent_id,
//     'hide_empty' => true,
//         'show_count' => false,
// 	'depth' => 5,
// 	'hierarchical'     => true,
//     ) ); 

    $args = array(
        'taxonomy' => 'category',
        'hide_empty' => 0,
        'orderby' => 'name',
        'order' => 'ASC',
        'parent' => $parent_id,
        'orderby' => 'menu_order',
        'hierarchical' => true,
        'order' => 'ASC',
    );
    $cats = get_categories($args);

    if ($cats) {
        echo '<select onchange="this.options[this.selectedIndex].value && (window.location = this.options[this.selectedIndex].value);">'; //echo the select

        echo '<option value=""> ' . $title . '</option>';

        //loop through each category and echo as option for the select
        foreach ($cats as $cat) {
            echo '<option value="' . get_category_link($cat->term_id) . '">' . $cat->cat_name . '</option>';
        }

        echo '</select>'; //close the select
    }
}
add_shortcode('nd_video_post_categories', 'wpdocs_list_categories');



function wpdocs_get_child_categories($parent_category_id)
{
    $html = '';
    $taxonomy = 'category';
    $queried_object = get_queried_object();
    $term_id = $queried_object->term_id;
    $child_categories = get_categories(array(
        'parent' => $parent_category_id,
        'hide_empty' => true,
        'taxonomy' => $taxonomy,
        'orderby' => 'menu_order',
        'order' => 'ASC',
    ));
    if (!empty($child_categories)) {
        //$html .= '<ul class="ml-2 ml-lg-4">';
        foreach ($child_categories as $child_category) {
            // $html .= '<li>'.$child_category->name;
            //$html .= get_child_categories( $child_category->term_id );
            //$html .= '</li>';
            //$html .= '<option value=""> -- '.$child_category->name.'</option>';
            $html .= '<option ' . ($term_id == $child_category->term_id ? 'selected="selected"' : '') .
                ' class="pl-3" value="' . get_category_link($child_category->term_id) . '"> --- ' . $child_category->name . '</option>';
        }
        //$html .= '</ul>';
    }
    return $html;
}

function wpdocs_list_categories($atts, $content = null)
{
    $queried_object = get_queried_object();
    $term_id = $queried_object->term_id;
    $taxonomy = 'category';
    $parent_id = $atts['parent_id'] ? $atts['parent_id'] : $term_id;
    $title = $atts['title'] ? $atts['title'] : "Select Category";
    $html = '';
    $parent_categories = get_categories(array(
        'parent' => $parent_id,
        'hide_empty' => true,
        'taxonomy' => $taxonomy,
        'orderby' => 'menu_order',
        'order' => 'ASC',
    ));

    // 		echo '<pre>';
// 	var_dump($parent_categories);
// 	echo '</pre>';

    if (empty($parent_categories)) {
        $parent_id = wp_get_term_taxonomy_parent_id($term_id, $taxonomy);
        if (empty($parent_id)) {
            $parent_id = 0;
        }
        $parent_categories = get_categories(array('parent' => $parent_id, 'hide_empty' => true, 'taxonomy' => $taxonomy, 'orderby' => 'menu_order', 'order' => 'ASC', ));

    }
    //$html .= '<ul >';
    $html .= '<select onchange="this.options[this.selectedIndex].value && (window.location = this.options[this.selectedIndex].value);">';
    $html .= '<option value=""> ' . $title . '</option>';
    foreach ($parent_categories as $parent_category) {

        //$html .= '<option  value=""> '.$parent_category->name.'</option>';
        $html .= '<option ' . ($term_id == $parent_category->term_id ? 'selected="selected"' : '') .
            'value="' . get_category_link($parent_category->term_id) . '">' . $parent_category->name . '</option>';
        //$html .= '<li>';
        // $html .= $parent_category->name;
        $html .= wpdocs_get_child_categories($parent_category->term_id);
        //$html .= '</li>';
    }
    //$html.= '</ul>';
    $html .= '</select>';
    return $html;
}


// Load CSS
function porto_child_css()
{
    // porto child theme styles
    wp_deregister_style('styles-child');
    wp_register_style('styles-child', esc_url(get_stylesheet_directory_uri()) . '/style.css');
    wp_enqueue_style('styles-child');

    if (is_rtl()) {
        wp_deregister_style('styles-child-rtl');
        wp_register_style('styles-child-rtl', esc_url(get_stylesheet_directory_uri()) . '/style_rtl.css');
        wp_enqueue_style('styles-child-rtl');
    }
}
add_action('wp_enqueue_scripts', 'porto_child_css', 1001);

function my_dequeue_select2()
{
    // dequeue scripts
    wp_deregister_script('select2');
    wp_dequeue_script('select2');
    // dequeue styles
    wp_deregister_style('ayecode-ui');
    wp_dequeue_style('ayecode-ui');
}

// remove select2 from events admin pages
add_action('admin_enqueue_scripts', function () {

    // Global object containing current admin page
    global $pagenow;

    // If admin new or existing post edit page
    if ('post.php' === $pagenow || 'post-new.php' === $pagenow) {

        // If tribe_events post type
        if (isset($_GET['post_type']) && 'tribe_events' === $_GET['post_type']) {
            my_dequeue_select2();
        }
    }

}, 100);

// remove select2 from Community events "new event" page.
add_action('wp_enqueue_scripts', function () {

    $post = get_post();

    if ($post->ID === 2596 || tribe_is_community_edit_event_page()) {
        my_dequeue_select2();
    }
});


/*Change listing columns*/
function csp_geodir_custom_column_class($class, $template)
{
    // 	if(is_post_type_archive('gd_business')){
// 		$class = str_replace( "row-cols-md-3", "row-cols-md-2", $class );
// 		$class .= ' row-cols-lg-2 row-cols-xl-2';

    // 	}
// 	else{
    $class = str_replace("row-cols-md-4", "row-cols-md-2", $class);
    $class .= ' row-cols-lg-4';
    // 	}

    return $class;
}
add_filter('geodir_listing_listview_ul_extra_class', 'csp_geodir_custom_column_class', 10, 2);



/*Change Admin Email*/
add_filter('geodir_admin_email', 'csp_my_new_gd_admin_email', 10, 2);
function csp_my_new_gd_admin_email($admin_email)
{
    return "sharon.lowe@icloud.com";
    //     return "chandra10207@gmail.com";
}


/*Add Google Anlytics code*/
function nd_google_tagmanager_script()
{
    ?>
    <!-- <meta property="fb:app_id" content="350480587002678" /> -->
    <meta property="fb:app_id" content="5243047759106366" />
    <!-- Facebook Pixel Code -->
    <script>
        !function (f, b, e, v, n, t, s) {
            if (f.fbq) return; n = f.fbq = function () {
                n.callMethod ?
                    n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
        }(window, document, 'script',
            'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '5243047759106366');
        fbq('track', 'PageView');
    </script>
    <noscript>
        <img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=5243047759106366&ev=PageView&noscript=1" />
    </noscript>
    <!-- End Facebook Pixel Code -->


    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-190145482-1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());

        gtag('config', 'UA-190145482-1');
    </script>
    <?php /*
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M5948SM');</script>
<!-- End Google Tag Manager -->
*/ ?>


    <?php
}
add_action('wp_head', 'nd_google_tagmanager_script');

/*Add Google Anlytics code*/
function nd_google_tagmanager_script_footer()
{
    ?>
    <?php /*
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M5948SM"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
*/ ?>

    <?php

    if (is_front_page()) { ?>

        <!-- PopUP Scripts -->
        <script>
            (function (w, d, t, h, s, n) {
                w.FlodeskObject = n;
                var fn = function () {
                    (w[n].q = w[n].q || []).push(arguments);
                };
                w[n] = w[n] || fn;
                var f = d.getElementsByTagName(t)[0];
                var v = '?v=' + Math.floor(new Date().getTime() / (120 * 1000)) * 60;
                var sm = d.createElement(t);
                sm.async = true;
                sm.type = 'module';
                sm.src = h + s + '.mjs' + v;
                f.parentNode.insertBefore(sm, f);
                var sn = d.createElement(t);
                sn.async = true;
                sn.noModule = true;
                sn.src = h + s + '.js' + v;
                f.parentNode.insertBefore(sn, f);
            })(window, document, 'script', 'https://assets.flodesk.com', '/universal', 'fd');
        </script>
        <script>
            window.fd('form', {
                formId: '62a9dfb03e1f4ce38387eee4'
            });
        </script>

    <?php } ?>


    <?php
}
add_action('wp_footer', 'nd_google_tagmanager_script_footer');


function csp_my_wp_mail($atts)
{
    $subject = $atts['subject'];
    if ($subject == "New account registration on The Social Blueprint") {
        // 		sharon@ccare.org.au
        $atts['to'] = 'sharon.lowe@icloud.com';
    }
    // 	echo '<pre>';
// 	print_r ($atts);
// $atts['to'] .= '';
    return $atts;
}
add_filter('wp_mail', 'csp_my_wp_mail', 10, 1);


//open event website URL in a new browser tab

function csp_tribe_get_event_website_link_target_blank($target)
{
    $target = "_blank";

    return $target;
}

add_filter('tribe_get_event_website_link_target', 'csp_tribe_get_event_website_link_target_blank');


function csp_add_all_events_link()
{

    if (is_tax('tribe_events_cat')) {
        echo '<a class="pl-3 csp-all-events-link" href="/events/"> « All Events</a>';
    }

}

//add columns to User panel list page
function add_user_columns($column)
{
    $column['user_phone'] = 'Phone';
    $column['user_display_name'] = 'Organisation';
    $column['organization_type'] = 'Organisation Type';
    unset($column['role'], $column['posts']);
    // 	echo '<pre>';print_r($column);die;

    return $column;
}
add_filter('manage_users_columns', 'add_user_columns');

//add the data
function add_user_column_data($val, $column_name, $user_id)
{
    $user = get_userdata($user_id);
    $user_mobile = get_user_meta($user_id, 'uwp_mobile', true);
    $user_role = $user->roles[0];
    //  echo $user_role;die;        
//   print_r( $all_meta_for_user );
// 	echo '<pre>';print_r($user_role);die;

    switch ($column_name) {
        case 'user_display_name':
            if ($user_role == 'contributor') {

                return $user->data->display_name;
            } else {
                return '';
            }


            break;
        case 'user_phone':
            return uwp_get_usermeta($user_id, 'mobile', '');
            break;
        case 'organization_type':
            if ($user_role == 'contributor') {

                return uwp_get_usermeta($user_id, 'business_type', '');
            } else {
                return '';
            }
            break;
        default:
    }
    return;
}
add_filter('manage_users_custom_column', 'add_user_column_data', 10, 3);

/********* Export to csv ***********/
add_action('admin_footer', 'csp_mytheme_export_users');

function csp_mytheme_export_users()
{
    $screen = get_current_screen();
    if ($screen->id != "users")   // Only add to users.php page
        return;
    ?>
    <script type="text/javascript">
        jQuery(document).ready(function ($) {
            $('.tablenav.top .clear, .tablenav.bottom .clear').before('<form action="#" method="POST"><input type="hidden" id="mytheme_export_csv" name="mytheme_export_csv" value="1" /><input class="button button-primary user_export_button" style="margin-top:px;" type="submit" value="<?php esc_attr_e('Export All as CSV', 'mytheme'); ?>" /></form>');
        });
    </script>
    <?php
}

add_action('admin_init', 'csp_export_csv_users'); //you can use admin_init as well

function csp_export_csv_users()
{
    if (!empty($_POST['mytheme_export_csv'])) {

        //         if (current_user_can('manage_options')) {
        header("Content-type: application/force-download");
        header('Content-Disposition: inline; filename="users' . date('YmdHis') . '.csv"');

        // WP_User_Query arguments
        $args = array(
            'order' => 'ASC',
            'orderby' => 'display_name',
            'fields' => 'all',
            'role__not_in' => 'Administrator',
        );

        // The User Query
        $blogusers = get_users($args);
        echo '"First Name","Last Name","Email","Phone","User Type","Organisation Type","Organisation Name"' . "\r\n";
        // Array of WP_User objects.
        foreach ($blogusers as $user) {
            $meta = get_user_meta($user->ID);
            $role = $user->roles;
            $email = $user->user_email;
            $organization = $user->display_name;
            $mobile = uwp_get_usermeta($user->ID, 'mobile', '');

            if ($role[0] == 'contributor') {
                $organisation_type = uwp_get_usermeta($user->ID, 'business_type', '');
                $organization = $user->display_name;
            } else {
                $organisation_type = '';
                $organization = '';
            }

            $first_name = (isset($meta['first_name'][0]) && $meta['first_name'][0] != '') ? $meta['first_name'][0] : '';
            $last_name = (isset($meta['last_name'][0]) && $meta['last_name'][0] != '') ? $meta['last_name'][0] : '';

            echo '"' . $first_name . '","' . $last_name . '","' . $email . '","' . $mobile . '","' . $role[0] . '","' . $organisation_type . '","' . $organization . '"' . "\r\n";
        }

        exit();
        //         }
    }
}

// Add this code to your theme's functions.php file or create a custom plugin.

// https://thesocialblueprint.org.au/wp-admin/index.php?export_cpt_csv=1
function csp_export_custom_post_type_to_csv()
{
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
                get_the_ID(),         // Post ID
                get_the_title(),      // Title
                $author_name,         // Author
                $website,        // Meta Field 1
                $business_type,
                get_the_permalink($cur_id),
                $featured_image
            ));
        }

        // Close the file
        fclose($output);
        exit;
    }
}

// Hook to trigger the export when accessing a specific URL (e.g., ?export_cpt_csv=1)
add_action('admin_init', 'csp_export_custom_post_type_to_csv');



function csp_add_custom_buttons_to_admin_page()
{
    global $pagenow;

    // Check if we're on the post type edit page
    if ($pagenow == 'edit.php' && isset($_GET['post_type']) && $_GET['post_type'] == 'gd_health_listing') {
        ?>
        <script type="text/javascript">
            jQuery(document).ready(function ($) {
                // Create the custom button HTML
                var custom_button = $('<a style="margin-left: 10px; margin-top: 10px;" class="page-title-action11 button button-primary data_export_button" target="_blank" href="<?php echo home_url('/wp-content/export-csv-wpgeo.php?post_type=gd_health_listing'); ?>">Export Data</a>');

                // Append the button next to the "Add New" button
                custom_button.insertAfter('.page-title-action');
            });
        </script>

        <?php
    }

    // Check if we're on the post type edit page
    if ($pagenow == 'edit.php' && isset($_GET['post_type']) && $_GET['post_type'] == 'gd_business') {
        ?>
        <script type="text/javascript">
            jQuery(document).ready(function ($) {
                // Create the custom button HTML
                var custom_button = $('<a style="margin-left: 10px; margin-top: 10px;" class="page-title-action11 button button-primary data_export_button" target="_blank" href="<?php echo home_url('/wp-content/export-businessess-csv.php?post_type=gd_business'); ?>">Export Data</a>');

                // Append the button next to the "Add New" button
                custom_button.insertAfter('.page-title-action');
            });
        </script>

        <?php
    }



    // Check if we're on the post type edit page
    if ($pagenow == 'edit.php' && isset($_GET['post_type']) && $_GET['post_type'] == 'gd_place') {
        ?>
        <script type="text/javascript">
            jQuery(document).ready(function ($) {
                // Create the custom button HTML
                var custom_button = $('<a style="margin-left: 10px; margin-top: 10px;" class="page-title-action11 button button-primary data_export_button" target="_blank" href="<?php echo home_url('/wp-content/gd_place_export.php?post_type=gd_place'); ?>">Export Data</a>');

                // Append the button next to the "Add New" button
                custom_button.insertAfter('.page-title-action');
            });
        </script>

        <?php
    }




    // Check if we're on the post type edit page
    if ($pagenow == 'edit.php' && isset($_GET['post_type']) && $_GET['post_type'] == 'gd_aid_listing') {
        ?>
        <script type="text/javascript">
            jQuery(document).ready(function ($) {
                // Create the custom button HTML
                var custom_button = $('<a style="margin-left: 10px; margin-top: 10px;" class="page-title-action11 button button-primary data_export_button" target="_blank" href="<?php echo home_url('/wp-content/gd_aid_export.php?post_type=gd_aid_listing'); ?>">Export Data</a>');

                // Append the button next to the "Add New" button
                custom_button.insertAfter('.page-title-action');
            });
        </script>

        <?php
    }

    // Check if we're on the post type edit page
    if ($pagenow == 'edit.php' && isset($_GET['post_type']) && $_GET['post_type'] == 'gd_discount') {
        ?>
        <script type="text/javascript">
            jQuery(document).ready(function ($) {
                // Create the custom button HTML
                var custom_button = $('<a style="margin-left: 10px; margin-top: 10px;" class="page-title-action11 button button-primary data_export_button" target="_blank" href="<?php echo home_url('/wp-content/gd_messageboards.php?post_type=gd_discount'); ?>">Export Data</a>');

                // Append the button next to the "Add New" button
                custom_button.insertAfter('.page-title-action');
            });
        </script>

        <?php
    }

    // Check if we're on the post type edit page
    if ($pagenow == 'edit.php' && isset($_GET['post_type']) && $_GET['post_type'] == 'gd_photo_gallery') {
        ?>
        <script type="text/javascript">
            jQuery(document).ready(function ($) {
                // Create the custom button HTML
                var custom_button = $('<a style="margin-left: 10px; margin-top: 10px;" class="page-title-action11 button button-primary data_export_button" target="_blank" href="<?php echo home_url('/wp-content/gd_lovenotes.php?post_type=gd_photo_gallery'); ?>">Export Data</a>');

                // Append the button next to the "Add New" button
                custom_button.insertAfter('.page-title-action');
            });
        </script>

        <?php
    }

    // Check if we're on the post type edit page
    if ($pagenow == 'edit.php' && isset($_GET['post_type']) && $_GET['post_type'] == 'gd_cost_of_living') {
        ?>
        <script type="text/javascript">
            jQuery(document).ready(function ($) {
                // Create the custom button HTML
                var custom_button = $('<a style="margin-left: 10px; margin-top: 10px;" class="page-title-action11 button button-primary data_export_button" target="_blank" href="<?php echo home_url('/wp-content/gd_cost_of_living.php?post_type=gd_cost_of_living'); ?>">Export Data</a>');

                // Append the button next to the "Add New" button
                custom_button.insertAfter('.page-title-action');
            });
        </script>

        <?php
    }



}
add_action('admin_footer', 'csp_add_custom_buttons_to_admin_page');

add_filter( 'tribe_events_community_required_fields', 'my_community_required_fields', 10, 1 );
 
function my_community_required_fields( $fields ) {
 
  if ( ! is_array( $fields ) ) {
    return $fields;
  }
 
  $fields[] = 'EventURL';
 
  return $fields;
}
