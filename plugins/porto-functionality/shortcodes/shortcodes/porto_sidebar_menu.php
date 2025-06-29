<?php
// Porto Side Menu
if ( function_exists( 'register_block_type' ) ) {
	register_block_type(
		'porto/porto-sidebar-menu',
		array(
			'attributes'      => array(
				'title'    => array(
					'type' => 'string',
				),
				'nav_menu' => array(
					'type'    => 'string',
					'default' => '',
				),
				'el_class' => array(
					'type' => 'string',
				),
			),
			'editor_script'   => 'porto_blocks',
			'render_callback' => 'porto_shortcode_sidebar_menu',
		)
	);
}

add_action( 'vc_after_init', 'porto_load_sidebar_menu_shortcode' );

function porto_shortcode_sidebar_menu( $atts, $content = null ) {
	ob_start();
	if ( $template = porto_shortcode_template( 'porto_sidebar_menu' ) ) {
		if ( isset( $atts['className'] ) ) {
			$atts['el_class'] = $atts['className'];
		}
		include $template;
	}
	return ob_get_clean();
}

function porto_load_sidebar_menu_shortcode() {

	$custom_class = porto_vc_custom_class();
	$custom_menus = array();
	$menus        = get_terms(
		array(
			'taxonomy'   => 'nav_menu',
			'hide_empty' => false,
		)
	);
	if ( is_array( $menus ) && ! empty( $menus ) ) {
		foreach ( $menus as $single_menu ) {
			if ( is_object( $single_menu ) && isset( $single_menu->name, $single_menu->term_id ) ) {
				$custom_menus[ $single_menu->name ] = $single_menu->term_id;
			}
		}
	}

	vc_map(
		array(
			'name'         => __( 'Side Menu For Side Header or Sidebar', 'porto-functionality' ),
			'base'         => 'porto_sidebar_menu',
			'class'        => 'porto_sidebar_menu porto-wpb-widget',
			'icon'         => PORTO_WIDGET_URL . 'sidebar-menu.png',
			'category'     => __( 'Porto', 'porto-functionality' ),
			'description'  => __( 'Add a side menu to the page.', 'porto-functionality' ),
			'is_container' => false,
			'params'       => array(
				array(
					'type'        => 'checkbox',
					'heading'     => __( 'Is Full Width ?', 'porto-functionality' ),
					'description' => __( 'Turn on to make the menu full-width.', 'porto-functionality' ),
					'param_name'  => 'is_full',
					'value'       => array( __( 'Yes', 'js_composer' ) => 'yes' ),
					'std'         => 'yes',
					'save_always' => true,
					'selectors'   => array(
						'{{WRAPPER}}' => 'width: 100%;',
					),
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Title', 'porto-functionality' ),
					'param_name'  => 'title',
					'admin_label' => true,
				),
				array(
					'type'        => 'dropdown',
					'heading'     => esc_html__( 'Menu', 'porto-functionality' ),
					'param_name'  => 'nav_menu',
					'value'       => $custom_menus,
					/* translators: opening and closing bold tags */
					'description' => empty( $custom_menus ) ? sprintf( esc_html__( 'Custom menus not found. Please visit %1$sAppearance > Menus%2$s page to create new menu.', 'porto-functionality' ), '<b>', '</b>' ) : esc_html__( 'Select menu to display.', 'porto-functionality' ),
					'admin_label' => true,
					'save_always' => true,
				),

				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Background Color', 'porto-functionality' ),
					'param_name' => 'menu_bgc',
					'selectors'  => array(
						'{{WRAPPER}}' => 'background-color: {{VALUE}};',
					),
					'group'      => __( 'Menu', 'porto-functionality' ),
				),
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Border Style', 'porto-functionality' ),
					'param_name'  => 'menu_bs',
					'std'         => 'none',
					'save_always' => true,
					'value'      => array(
						__( 'Default', 'porto-functionality' ) => '',
						__( 'None', 'porto-functionality' )   => 'none',
						__( 'Solid', 'porto-functionality' )  => 'solid',
						__( 'Dashed', 'porto-functionality' ) => 'dashed',
						__( 'Dotted', 'porto-functionality' ) => 'dotted',
						__( 'Double', 'porto-functionality' ) => 'double',
						__( 'Inset', 'porto-functionality' )  => 'inset',
						__( 'Outset', 'porto-functionality' ) => 'outset',
					),
					'selectors'  => array(
						'{{WRAPPER}}' => 'border-style: {{VALUE}};',
					),
					'group'      => __( 'Menu', 'porto-functionality' ),
				),
				array(
					'type'       => 'porto_number',
					'heading'    => __( 'Border Width', 'porto-functionality' ),
					'param_name' => 'menu_bw',
					'units'      => array( 'px' ),
					'dependency' => array(
						'element'            => 'menu_bs',
						'value_not_equal_to' => array( 'none' ),
					),
					'selectors'  => array(
						'{{WRAPPER}}' => 'border-width: {{VALUE}}{{UNIT}};',
					),
					'group'      => __( 'Menu', 'porto-functionality' ),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Border Color', 'porto-functionality' ),
					'param_name' => 'menu_bc',
					'dependency' => array(
						'element'            => 'menu_bs',
						'value_not_equal_to' => array( 'none' ),
					),
					'selectors'  => array(
						'{{WRAPPER}}' => 'border-color: {{VALUE}};',
					),
					'group'      => __( 'Menu', 'porto-functionality' ),
				),
				array(
					'type'        => 'porto_number',
					'heading'     => __( 'Icon Font Size', 'porto-functionality' ),
					'param_name'  => 'icon_fs',
					'units'       => array( 'px' ),
					'selectors'   => array(
						'{{WRAPPER}} .sidebar-menu li.menu-item > a > i' => 'font-size: {{VALUE}}{{UNIT}};',
						'{{WRAPPER}} li.menu-item>a>[class*=" fa-"]' => 'width: auto;',
					),
					'qa_selector' => '.sidebar-menu li.menu-item > a > i',
					'group'       => __( 'Menu', 'porto-functionality' ),
				),
				array(
					'type'       => 'porto_number',
					'heading'    => __( 'Icon Space', 'porto-functionality' ),
					'param_name' => 'icon_space',
					'units'      => array( 'px' ),
					'selectors'  => array(
						'{{WRAPPER}} .sidebar-menu li.menu-item > a > i' => ( is_rtl() ? 'margin-left' : 'margin-right' ) . ': {{VALUE}}{{UNIT}};',
					),
					'group'      => __( 'Menu', 'porto-functionality' ),
				),

				array(
					'type'        => 'porto_typography',
					'heading'     => __( 'Typography', 'porto-functionality' ),
					'param_name'  => 'item_tg',
					'selectors'   => array(
						'{{WRAPPER}} .sidebar-menu > li.menu-item > a, {{WRAPPER}} .sidebar-menu > li.menu-item',
					),
					'line_height' => false,
					'group'       => __( 'Top Level Menu Item', 'porto-functionality' ),
				),
				array(
					'type'        => 'porto_number',
					'heading'     => __( 'Left & Right Spacing', 'porto-functionality' ),
					'param_name'  => 'item_mg',
					'units'       => array( 'px', 'rem', 'em' ),
					'selectors'   => array(
						'{{WRAPPER}} .sidebar-menu > li.menu-item > a' => 'margin-left: {{VALUE}}{{UNIT}}; margin-right: {{VALUE}}{{UNIT}};',
					),
					'qa_selector' => '.sidebar-menu > li:first-child > a',
					'group'       => __( 'Top Level Menu Item', 'porto-functionality' ),
				),
				array(
					'type'       => 'porto_dimension',
					'heading'    => __( 'Padding', 'porto-functionality' ),
					'param_name' => 'item_pd',
					'selectors'  => array(
						'{{WRAPPER}} .sidebar-menu > li.menu-item > a' => 'padding-top: {{TOP}};padding-right: {{RIGHT}};padding-bottom: {{BOTTOM}};padding-left: {{LEFT}};',
						'{{WRAPPER}} .sidebar-menu .popup:before'      => 'top: calc( calc( {{TOP}} / 2 + {{BOTTOM}} / 2 - 0.5px ) + ( -1 * var(--porto-sd-menu-popup-top, 0px) ) );',
						'{{WRAPPER}} .sidebar-menu > li.menu-item > .arrow' => 'margin: 0; top: calc( {{TOP}} / 2 + {{BOTTOM}} / 2 - 6px );',
						'#header {{WRAPPER}} .sidebar-menu > li.menu-item > .arrow' => 'top: calc( {{TOP}} / 2 + {{BOTTOM}} / 2 - 6px );',
					),
					'group'      => __( 'Top Level Menu Item', 'porto-functionality' ),
				),
				array(
					'type'        => 'porto_number',
					'heading'     => __( 'Arrow right position', 'porto-functionality' ),
					'param_name'  => 'arrow_rp',
					'units'       => array( 'px', 'rem', 'em' ),
					'selectors'   => array(
						'{{WRAPPER}} .sidebar-menu > li.menu-item > .arrow' => ( is_rtl() ? 'left' : 'right' ) . ': {{VALUE}}{{UNIT}};',
						'#header {{WRAPPER}} .sidebar-menu li.menu-item > .arrow'  => ( is_rtl() ? 'left' : 'right' ) . ': {{VALUE}}{{UNIT}};',
						'{{WRAPPER}} .side-menu-slide .menu-item-has-children>a:after' => ( is_rtl() ? 'right' : 'left' ) . ': {{VALUE}}{{UNIT}};',
						'{{WRAPPER}} .side-menu-columns>.menu-item-has-children>a:after, {{WRAPPER}} .side-menu-columns .narrow .menu-item-has-children>a:after' => ( is_rtl() ? 'left' : 'right' ) . ': {{VALUE}}{{UNIT}};',
					),
					'qa_selector' => '.sidebar-menu > li > .arrow',
					'group'       => __( 'Top Level Menu Item', 'porto-functionality' ),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Color', 'porto-functionality' ),
					'param_name' => 'item_clr',
					'selectors'  => array(
						'{{WRAPPER}} .sidebar-menu > li.menu-item > a' => 'color: {{VALUE}};',
					),
					'group'      => __( 'Top Level Menu Item', 'porto-functionality' ),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Border Top Color', 'porto-functionality' ),
					'param_name' => 'item_bc',
					'selectors'  => array(
						'{{WRAPPER}} .sidebar-menu > li.menu-item > a' => 'border-top-color: {{VALUE}};',
						'{{WRAPPER}} .sidebar-menu > li.menu-item:hover + li.menu-item > a' => 'border-top-color: {{VALUE}};',
					),
					'group'      => __( 'Top Level Menu Item', 'porto-functionality' ),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Border Bottom Color for Side Header', 'porto-functionality' ),
					'param_name' => 'item_bbc',
					'selectors'  => array(
						'#header {{WRAPPER}} .sidebar-menu > li > a' => 'border-bottom-color: {{VALUE}};',
					),
					'std'         => 'rgba(0,0,0,0.01)',
					'save_always' => true,
					'group'       => __( 'Top Level Menu Item', 'porto-functionality' ),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Arrow Color', 'porto-functionality' ),
					'param_name' => 'arrow_clr',
					'selectors'  => array(
						'{{WRAPPER}} .sidebar-menu > li.menu-item > .arrow:before' => 'color: {{VALUE}};',
						'{{WRAPPER}} .side-menu-slide .menu-item-has-children>a:after' => 'color: {{VALUE}};',
						'{{WRAPPER}} .side-menu-columns>.menu-item-has-children>a:after, {{WRAPPER}} .side-menu-columns .narrow .menu-item-has-children>a:after' => 'color: {{VALUE}};',
					),
					'group'      => __( 'Top Level Menu Item', 'porto-functionality' ),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Hover Background Color', 'porto-functionality' ),
					'param_name' => 'item_hover_bgc',
					'selectors'  => array(
						'{{WRAPPER}} .sidebar-menu > li.menu-item:hover, {{WRAPPER}} .sidebar-menu > li.menu-item.open, {{WRAPPER}} .sidebar-menu > li.menu-item.active' => 'background-color: {{VALUE}};',
					),
					'group'      => __( 'Top Level Menu Item', 'porto-functionality' ),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Hover Color', 'porto-functionality' ),
					'param_name' => 'item_hover_clr',
					'selectors'  => array(
						'{{WRAPPER}} .sidebar-menu > li.menu-item:hover > a, {{WRAPPER}} .sidebar-menu > li.menu-item.open > a, {{WRAPPER}} .sidebar-menu > li.menu-item.active > a' => 'color: {{VALUE}};',
					),
					'group'      => __( 'Top Level Menu Item', 'porto-functionality' ),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Hover Border Top Color', 'porto-functionality' ),
					'param_name' => 'item_hover_bc',
					'selectors'  => array(
						'{{WRAPPER}} .sidebar-menu > li.menu-item:hover > a, {{WRAPPER}} .sidebar-menu > li.menu-item.open > a, {{WRAPPER}} .sidebar-menu > li.menu-item.active > a' => 'border-top-color: {{VALUE}};',
					),
					'group'      => __( 'Top Level Menu Item', 'porto-functionality' ),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Hover Arrow Color', 'porto-functionality' ),
					'param_name' => 'arrow_hover_clr',
					'selectors'  => array(
						'{{WRAPPER}} .sidebar-menu > li.menu-item:hover > .arrow:before, {{WRAPPER}} .sidebar-menu > li.menu-item.active > .arrow:before' => 'color: {{VALUE}};',
						'{{WRAPPER}} .side-menu-slide .menu-item-has-children:hover>a:after, {{WRAPPER}} .side-menu-slide .menu-item-has-children.active>a:after' => 'color: {{VALUE}};',
						'{{WRAPPER}} .side-menu-columns>.menu-item-has-children:hover>a:after, {{WRAPPER}} .side-menu-columns .narrow .menu-item-has-children:hover>a:after, {{WRAPPER}} .side-menu-columns>.menu-item-has-children.active>a:after, {{WRAPPER}} .side-menu-columns .narrow .menu-item-has-children.active>a:after' => 'color: {{VALUE}};',
					),
					'group'      => __( 'Top Level Menu Item', 'porto-functionality' ),
				),
				array(
					'type'       => 'porto_typography',
					'heading'    => __( 'Typography', 'porto-functionality' ),
					'param_name' => 'sub_tg',
					'selectors'  => array(
						'{{WRAPPER}} .sidebar-menu .popup',
					),
					'group'      => __( 'Sub Menu', 'porto-functionality' ),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Color', 'porto-functionality' ),
					'param_name' => 'sub_clr',
					'selectors'  => array(
						'{{WRAPPER}} .sidebar-menu .popup' => 'color: {{VALUE}};',
					),
					'group'      => __( 'Sub Menu', 'porto-functionality' ),
				),
				array(
					'type'        => 'colorpicker',
					'heading'     => __( 'Background Color', 'porto-functionality' ),
					'param_name'  => 'sub_bgc',
					'selectors'   => array(
						'{{WRAPPER}} .wide .popup > .inner, {{WRAPPER}} .side-menu-slide .wide ul.sub-menu, {{WRAPPER}} .narrow ul.sub-menu' => 'background-color: {{VALUE}};',
						// '{{WRAPPER}} .popup:before' => 'border-' . ( is_rtl() ? 'left' : 'right' ) . '-color: {{VALUE}};',
						// '#header {{WRAPPER}} .popup:before' => 'border-' . ( is_rtl() ? 'left' : 'right' ) . '-color: {{VALUE}};',  // style.php
						'{{WRAPPER}} .popup:before' => 'border-left-color: {{VALUE}};border-right-color: {{VALUE}};',
						'#header {{WRAPPER}} .popup:before' => 'border-left-color: {{VALUE}};border-right-color: {{VALUE}};',
					),
					'qa_selector' => '.sidebar-menu>li.has-sub>.popup',
					'group'       => __( 'Sub Menu', 'porto-functionality' ),
				),
				array(
					'type'       => 'porto_dimension',
					'heading'    => __( 'Padding', 'porto-functionality' ),
					'param_name' => 'sub_pd',
					'responsive' => true,
					'selectors'  => array(
						'{{WRAPPER}} .side-menu-accordion .popup .sub-menu, {{WRAPPER}} .side-menu-slide .popup .sub-menu, {{WRAPPER}} .sidebar-menu:not(.side-menu-slide) .wide .popup > .inner' => 'padding-top: {{TOP}};padding-right: {{RIGHT}};padding-bottom: {{BOTTOM}};padding-left: {{LEFT}};',
						'{{WRAPPER}} .narrow ul.sub-menu' => 'padding-top: {{TOP}};padding-right: {{RIGHT}};padding-bottom: {{BOTTOM}};padding-left: {{LEFT}};top: -{{TOP}};',
					),
					'group'      => __( 'Sub Menu', 'porto-functionality' ),
				),
				array(
					'type'        => 'porto_number',
					'heading'     => __( 'Left padding in third level menu', 'porto-functionality' ),
					'param_name'  => 'sub_sub_lpd',
					'units'       => array( 'px', 'rem', 'em' ),
					'responsive'  => true,
					'selectors'   => array(
						'{{WRAPPER}} .narrow ul.sub-menu ul.sub-menu' => 'padding-' . ( is_rtl() ? 'right' : 'left' ) . ': {{VALUE}}{{UNIT}};',
					),
					'qa_selector' => '.narrow .inner>.sub-menu>li.menu-item-has-children>.sub-menu',
					'group'       => __( 'Sub Menu', 'porto-functionality' ),
				),
				array(
					'type'       => 'porto_typography',
					'heading'    => __( 'Label Typography in wide sub menu', 'porto-functionality' ),
					'param_name' => 'sub_label_tg',
					'selectors'  => array(
						'{{WRAPPER}} .wide li.sub > a, #header {{WRAPPER}} .sidebar-menu .wide li.sub > a',
					),
					'group'      => __( 'Sub Menu', 'porto-functionality' ),
				),
				array(
					'type'        => 'colorpicker',
					'heading'     => __( 'Label Color in wide sub menu', 'porto-functionality' ),
					'param_name'  => 'sub_label_clr',
					'selectors'   => array(
						'{{WRAPPER}} .sidebar-menu .wide li.sub.menu-item > a' => 'color: {{VALUE}};',
					),
					'qa_selector' => '.wide li.sub > a',
					'group'       => __( 'Sub Menu', 'porto-functionality' ),
				),

				array(
					'type'       => 'porto_dimension',
					'heading'    => __( 'Padding', 'porto-functionality' ),
					'param_name' => 'subitem_pd',
					'responsive' => true,
					'selectors'  => array(
						'{{WRAPPER}} .wide li.sub li.menu-item > a' => 'padding-top: {{TOP}};padding-right: {{RIGHT}};padding-bottom: {{BOTTOM}};padding-left: {{LEFT}};margin-left: calc(-1 * {{LEFT}});',
						'{{WRAPPER}} .narrow li.menu-item > a, {{WRAPPER}} .side-menu-slide .popup .sub-menu li.menu-item>a' => 'padding-top: {{TOP}};padding-right: {{RIGHT}};padding-bottom: {{BOTTOM}};padding-left: {{LEFT}};',
						'{{WRAPPER}} .narrow li.menu-item>.arrow, #header {{WRAPPER}} .narrow li.menu-item>.arrow' => 'top: calc( {{TOP}} / 2 + {{BOTTOM}} / 2 - 6px );',
					),
					'group'      => __( 'Sub Menu Item', 'porto-functionality' ),
				),
				array(
					'type'        => 'colorpicker',
					'heading'     => __( 'Color', 'porto-functionality' ),
					'param_name'  => 'subitem_clr',
					'selectors'   => array(
						'{{WRAPPER}} .sidebar-menu .sub-menu li.menu-item > a, {{WRAPPER}} .wide li.sub li.menu-item > a' => 'color: {{VALUE}};',
						'#header {{WRAPPER}} .porto-wide-sub-menu li.sub li.menu-item > a' => 'color: {{VALUE}};',
					),
					'qa_selector' => '.wide .inner>.sub-menu .sub-menu li.menu-item:first-child > a, .narrow .inner>.sub-menu>li:first-child > a',
					'group'       => __( 'Sub Menu Item', 'porto-functionality' ),
				),
				array(
					'type'       => 'porto_param_heading',
					'param_name' => 'description_side_narrow',
					'text'       => __( 'Narrow Menu Item', 'porto-functionality' ),
					'group'      => __( 'Sub Menu Item', 'porto-functionality' ),
					'with_group' => true,
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Narrow Menu Item Border Color', 'porto-functionality' ),
					'param_name' => 'subitem_narrow_bc',
					'selectors'  => array(
						'{{WRAPPER}} .narrow li.menu-item > a' => 'border-bottom-color: {{VALUE}};',
					),
					'group'      => __( 'Sub Menu Item', 'porto-functionality' ),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Narrow Menu Item\'s Hover Color', 'porto-functionality' ),
					'param_name' => 'subitem_hover_clr',
					'selectors'  => array(
						'{{WRAPPER}} .sidebar-menu .narrow li.menu-item:hover > a' => 'color: {{VALUE}};',
					),
					'group'      => __( 'Sub Menu Item', 'porto-functionality' ),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Narrow Menu Item\'s Hover Background Color', 'porto-functionality' ),
					'param_name' => 'subitem_hover_bgc',
					'selectors'  => array(
						'{{WRAPPER}} .sidebar-menu .narrow li.menu-item:hover > a' => 'background-color: {{VALUE}};',
						'#header {{WRAPPER}} .sidebar-menu .narrow .menu-item:hover > a' => 'background-color: {{VALUE}};',
					),
					'group'      => __( 'Sub Menu Item', 'porto-functionality' ),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Narrow Menu Item\'s Hover Text Decoration', 'porto-functionality' ),
					'param_name' => 'subitem_hover_td',
					'std'        => '',
					'value'      => array(
						__( 'Default', 'porto-functionality' ) => '',
						'none'         => 'none',
						'underline'    => 'underline',
						'overline'     => 'overline',
						'line-through' => 'line-through',
						'blink'        => 'blink',
					),
					'selectors'  => array(
						'{{WRAPPER}} .narrow li.menu-item > a:hover' => 'text-decoration: {{VALUE}};',
					),
					'group'      => __( 'Sub Menu Item', 'porto-functionality' ),
				),
				array(
					'type'       => 'porto_param_heading',
					'param_name' => 'description_side_wide',
					'text'       => __( 'Wide Menu Item (Mega Menu)', 'porto-functionality' ),
					'group'      => __( 'Sub Menu Item', 'porto-functionality' ),
					'with_group' => true,
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Wide Menu Item\'s Hover Color', 'porto-functionality' ),
					'param_name' => 'sub_wide_item_hover_clr',
					'selectors'  => array(
						'{{WRAPPER}} .wide li.sub li.menu-item:hover > a' => 'color: {{VALUE}};',
						'#header {{WRAPPER}} .porto-wide-sub-menu li.sub li.menu-item:hover > a' => 'color: {{VALUE}};',
					),
					'group'      => __( 'Sub Menu Item', 'porto-functionality' ),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Wide Menu Item\'s Hover Background Color', 'porto-functionality' ),
					'param_name' => 'sub_wide_item_hover_bgc',
					'selectors'  => array(
						'{{WRAPPER}} .wide li.sub li.menu-item:hover > a' => 'background-color: {{VALUE}}; text-decoration: none;',
						'#header {{WRAPPER}} .sidebar-menu .wide li.menu-item li.menu-item > a:hover' => 'background-color: {{VALUE}}; text-decoration: none;',
					),
					'group'      => __( 'Sub Menu Item', 'porto-functionality' ),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Wide Menu Item\'s Hover Text Decoration', 'porto-functionality' ),
					'param_name' => 'sub_wide_item_hover_td',
					'std'        => '',
					'value'      => array(
						__( 'Default', 'porto-functionality' ) => '',
						'none'         => 'none',
						'underline'    => 'underline',
						'overline'     => 'overline',
						'line-through' => 'line-through',
						'blink'        => 'blink',
					),
					'selectors'  => array(
						'{{WRAPPER}} .wide li.sub li.menu-item > a:hover' => 'text-decoration: {{VALUE}};',
						'#header {{WRAPPER}} .sidebar-menu .wide li.menu-item li.menu-item > a:hover' => 'text-decoration: {{VALUE}};',
					),
					'group'      => __( 'Sub Menu Item', 'porto-functionality' ),
				),

				array(
					'type'        => 'porto_typography',
					'heading'     => __( 'Typography', 'porto-functionality' ),
					'param_name'  => 'tip_tg',
					'selectors'   => array(
						'{{WRAPPER}} .tip',
					),
					'qa_selector' => '.tip',
					'group'       => __( 'Tip', 'porto-functionality' ),
				),
				array(
					'type'       => 'porto_dimension',
					'heading'    => __( 'Padding', 'porto-functionality' ),
					'param_name' => 'tip_pd',
					'selectors'  => array(
						'{{WRAPPER}} .tip' => 'padding-top: {{TOP}};padding-right: {{RIGHT}};padding-bottom: {{BOTTOM}};padding-left: {{LEFT}};',
					),
					'group'      => __( 'Tip', 'porto-functionality' ),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Background Color', 'porto-functionality' ),
					'param_name' => 'tip_bgc',
					'selectors'  => array(
						'{{WRAPPER}} .tip' => 'background-color: {{VALUE}};border-color: {{VALUE}};',
					),
					'group'      => __( 'Tip', 'porto-functionality' ),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Text Color', 'porto-functionality' ),
					'param_name' => 'tip_clr',
					'selectors'  => array(
						'{{WRAPPER}} .tip' => 'color: {{VALUE}};',
					),
					'group'      => __( 'Tip', 'porto-functionality' ),
				),
				$custom_class,
				array(
					'type'             => 'css_editor',
					'heading'          => __( 'Css', 'porto-functionality' ),
					'param_name'       => 'css',
					'group'            => __( 'Design', 'porto-functionality' ),
					'edit_field_class' => 'vc_col-sm-12 vc_column no-vc-background no-vc-border creative_link_css_editor',
				),
			),
		)
	);

	if ( class_exists( 'WPBakeryShortCode' ) ) {
		class WPBakeryShortCode_porto_sidebar_menu extends WPBakeryShortCode {
		}
	}
}
