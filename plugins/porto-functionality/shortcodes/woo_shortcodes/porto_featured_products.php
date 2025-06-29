<?php

// Porto Featured Products
add_action( 'vc_after_init', 'porto_load_featured_products_shortcode' );

function porto_load_featured_products_shortcode() {
	$animation_type     = porto_vc_animation_type();
	$animation_duration = porto_vc_animation_duration();
	$animation_delay    = porto_vc_animation_delay();
	$animation_reveal_clr = porto_vc_animation_reveal_clr();
	$custom_class       = porto_vc_custom_class();
	$order_by_values    = porto_vc_woo_order_by();
	$order_way_values   = porto_vc_woo_order_way();
	$sort_by_values     = porto_woo_sort_by();

	// woocommerce featured products
	vc_map(
		array(
			'name'        => 'Porto ' . __( 'Featured products', 'js_composer' ),
			'base'        => 'porto_featured_products',
			'icon'        => PORTO_WIDGET_URL . 'woo.png',
			'class'       => 'porto-wpb-widget',
			'category'    => __( 'WooCommerce', 'js_composer' ),
			'description' => __( 'Display products set as "featured"', 'porto-functionality' ),
			'params'      => array_merge(
				array(
					array(
						'type'        => 'textfield',
						'heading'     => __( 'Title', 'woocommerce' ),
						'param_name'  => 'title',
						'admin_label' => true,
					),
					array(
						'type'       => 'dropdown',
						'heading'    => __( 'Title Border Style', 'porto-functionality' ),
						'param_name' => 'title_border_style',
						'dependency' => array(
							'element'   => 'title',
							'not_empty' => true,
						),
						'std'        => '',
						'value'      => array(
							__( 'No Border', 'porto-functionality' )     => '',
							__( 'Bottom Border', 'porto-functionality' ) => 'border-bottom',
							__( 'Middle Border', 'porto-functionality' ) => 'border-middle',
						),
					),
					array(
						'type'       => 'dropdown',
						'heading'    => __( 'Title Align', 'porto-functionality' ),
						'param_name' => 'title_align',
						'value'      => porto_sh_commons( 'align' ),
						'dependency' => array(
							'element'   => 'title',
							'not_empty' => true,
						),
					),
					array(
						'type'        => 'dropdown',
						'heading'     => __( 'View mode', 'porto-functionality' ),
						'param_name'  => 'view',
						'value'       => porto_sh_commons( 'products_view_mode' ),
						'admin_label' => true,
					),
					array(
						'type'       => 'porto_image_select',
						'heading'    => __( 'Grid Layout', 'porto-functionality' ),
						'param_name' => 'grid_layout',
						'dependency' => array(
							'element' => 'view',
							'value'   => array( 'creative' ),
						),
						'std'        => '1',
						'value'      => porto_sh_commons( 'masonry_layouts' ),
					),
					array(
						'type'       => 'number',
						'heading'    => __( 'Grid Height (px)', 'porto-functionality' ),
						'param_name' => 'grid_height',
						'dependency' => array(
							'element' => 'view',
							'value'   => array( 'creative' ),
						),
						'suffix'     => 'px',
						'std'        => 600,
					),
					array(
						'type'        => 'number',
						'heading'     => __( 'Column Spacing (px)', 'porto-functionality' ),
						'description' => __( 'Leave blank if you use theme default value.', 'porto-functionality' ),
						'param_name'  => 'spacing',
						'dependency'  => array(
							'element' => 'view',
							'value'   => array( 'grid', 'creative', 'products-slider' ),
						),
						'suffix'      => 'px',
						'std'         => '',
						'selectors'   => array(
							'{{WRAPPER}}' => '--porto-el-spacing: {{VALUE}}px;',
						),
					),
					array(
						'type'        => 'number',
						'heading'     => __( 'Per page', 'js_composer' ),
						'value'       => 12,
						'param_name'  => 'per_page',
						'description' => __( 'The "per_page" shortcode determines how many products to show on the page', 'js_composer' ),
					),
					array(
						'type'       => 'dropdown',
						'heading'    => __( 'Columns', 'porto-functionality' ),
						'param_name' => 'columns',
						'dependency' => array(
							'element' => 'view',
							'value'   => array( 'products-slider', 'grid', 'divider' ),
						),
						'std'        => '4',
						'value'      => porto_sh_commons( 'products_columns' ),
					),
					array(
						'type'       => 'dropdown',
						'heading'    => __( 'Columns on mobile ( <= 575px )', 'porto-functionality' ),
						'param_name' => 'columns_mobile',
						'dependency' => array(
							'element' => 'view',
							'value'   => array( 'products-slider', 'grid', 'divider' ),
						),
						'std'        => '',
						'value'      => array(
							__( 'Default', 'porto-functionality' ) => '',
							'1' => '1',
							'2' => '2',
							'3' => '3',
						),
					),
					array(
						'type'       => 'dropdown',
						'heading'    => __( 'Column Width', 'porto-functionality' ),
						'param_name' => 'column_width',
						'dependency' => array(
							'element' => 'view',
							'value'   => array( 'products-slider', 'grid', 'divider' ),
						),
						'value'      => porto_sh_commons( 'products_column_width' ),
					),
					array(
						'type'       => 'dropdown',
						'heading'    => __( 'Pagination Style', 'porto-functionality' ),
						'param_name' => 'pagination_style',
						'dependency' => array(
							'element' => 'view',
							'value'   => array( 'list', 'grid', 'divider' ),
						),
						'std'        => '',
						'value'      => array(
							__( 'No pagination', 'porto-functionality' ) => '',
							__( 'Default' )   => 'default',
							__( 'Load more' ) => 'load_more',
						),
					),
					array(
						'type'       => 'porto_multiselect',
						'heading'    => __( 'Show Sort by', 'porto-functionality' ),
						'param_name' => 'show_sort',
						'std'        => '',
						'value'      => $sort_by_values,
					),
					array(
						'type'       => 'textfield',
						'heading'    => __( 'Title for "Sort by Popular"', 'porto-functionality' ),
						'param_name' => 'show_sales_title',
						'dependency' => array(
							'element' => 'show_sort',
							'value'   => 'popular',
						),
					),
					array(
						'type'       => 'textfield',
						'heading'    => __( 'Title for "Sort by Date"', 'porto-functionality' ),
						'param_name' => 'show_new_title',
						'dependency' => array(
							'element' => 'show_sort',
							'value'   => 'date',
						),
					),
					array(
						'type'       => 'textfield',
						'heading'    => __( 'Title for "Sort by Rating"', 'porto-functionality' ),
						'param_name' => 'show_rating_title',
						'dependency' => array(
							'element' => 'show_sort',
							'value'   => 'rating',
						),
					),
					array(
						'type'       => 'textfield',
						'heading'    => __( 'Title for "On Sale"', 'porto-functionality' ),
						'param_name' => 'show_onsale_title',
						'dependency' => array(
							'element' => 'show_sort',
							'value'   => 'onsale',
						),
					),
					array(
						'type'        => 'checkbox',
						'heading'     => __( 'Show category filter', 'porto-functionality' ),
						'param_name'  => 'category_filter',
						'hint'        => '<img src="' . PORTO_HINT_URL . 'wd_category_filter.jpg"/>',
						'std'         => '',
						'admin_label' => true,
					),
					array(
						'type'        => 'dropdown',
						'heading'     => __( 'Filter Style', 'porto-functionality' ),
						'param_name'  => 'filter_style',
						'value'       => array(
							__( 'Vertical', 'porto-functionality' )   => '',
							__( 'Horizontal', 'porto-functionality' ) => 'horizontal',
						),
						'description' => __( 'This field is used only when using "sort by" or "category filter".', 'porto-functionality' ),
					),
					array(
						'type'        => 'dropdown',
						'heading'     => __( 'Order by', 'js_composer' ),
						'param_name'  => 'orderby',
						'value'       => $order_by_values,
						/* translators: %s: Wordpress codex page */
						'description' => sprintf( __( 'Select how to sort retrieved products. More at %s.', 'js_composer' ), '<a href="http://codex.wordpress.org/Class_Reference/WP_Query#Order_.26_Orderby_Parameters" target="_blank">WordPress codex page</a>' ),
					),
					array(
						'type'        => 'dropdown',
						'heading'     => __( 'Order way', 'porto-functionality' ),
						'param_name'  => 'order',
						'value'       => $order_way_values,
						/* translators: %s: Wordpress codex page */
						'description' => sprintf( __( 'Designates the ascending or descending order. More at %s.', 'js_composer' ), '<a href="http://codex.wordpress.org/Class_Reference/WP_Query#Order_.26_Orderby_Parameters" target="_blank">WordPress codex page</a>' ),
					),
					array(
						'type'        => 'dropdown',
						'heading'     => __( 'Product Layout', 'porto-functionality' ),
						'description' => __( 'Select position of add to cart, add to wishlist, quickview.', 'porto-functionality' ),
						'param_name'  => 'addlinks_pos',
						'value'       => porto_sh_commons( 'products_addlinks_pos' ),
					),
					array(
						'type'       => 'number',
						'heading'    => __( 'Overlay Background Opacity (%)', 'porto-functionality' ),
						'param_name' => 'overlay_bg_opacity',
						'dependency' => array(
							'element' => 'addlinks_pos',
							'value'   => array( 'onimage2', 'onimage3' ),
						),
						'suffix'     => '%',
						'std'        => '30',
					),
					array(
						'type'       => 'dropdown',
						'heading'    => __( 'Image Size', 'porto-functionality' ),
						'param_name' => 'image_size',
						'dependency' => array(
							'element' => 'view',
							'value'   => array( 'products-slider', 'grid', 'divider', 'list' ),
						),
						'value'      => porto_sh_commons( 'image_sizes' ),
						'std'        => '',
					),
					$custom_class,
				),
				porto_vc_product_slider_fields( 'products-slider', 'dots-style-1' ),
				array(
					$animation_type,
					$animation_duration,
					$animation_delay,
					$animation_reveal_clr,
				)
			),
		)
	);

	if ( ! class_exists( 'WPBakeryShortCode_Porto_Featured_Products' ) ) {
		class WPBakeryShortCode_Porto_Featured_Products extends WPBakeryShortCode {
		}
	}
}
