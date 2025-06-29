<?php
// Porto Info Box
add_action( 'vc_after_init', 'porto_load_info_box_shortcode' );

function porto_load_info_box_shortcode() {

	$animation_type = porto_vc_animation_type();
	$custom_class   = porto_vc_custom_class();

	$animation_type1    = porto_vc_animation_type();
	$animation_duration = porto_vc_animation_duration();
	$animation_delay    = porto_vc_animation_delay();
	$animation_reveal_clr = porto_vc_animation_reveal_clr();

	$animation_type1['param_name'] = 'animation_type1';
	$animation_type['group']       = '';

	$animation_type['heading'] = __( 'Icon Appear Animation', 'porto-functionality' );
	$animation_reveal_clr['dependency']['element'] = 'animation_type1';

	vc_map(
		array(
			'name'                    => __( 'Porto Info Box', 'porto-functionality' ),
			'base'                    => 'porto_info_box',
			'icon'                    => PORTO_WIDGET_URL . 'infobox.png',
			'class'                   => 'porto_info_box porto-wpb-widget',
			'category'                => __( 'Porto', 'porto-functionality' ),
			'description'             => __( 'Adds icon box with custom font icon and text', 'porto-functionality' ),
			'controls'                => 'full',
			'show_settings_on_create' => true,
			'params'                  => array_merge(
				array(
					array(
						'type'        => 'dropdown',
						'heading'     => __( 'Layout', 'porto-functionality' ),
						'param_name'  => 'pos',
						'value'       => array(
							__( 'Icon at Left with heading', 'porto-functionality' ) => 'default',
							__( 'Icon at Right with heading', 'porto-functionality' ) => 'heading-right',
							__( 'Icon at Left', 'porto-functionality' ) => 'left',
							__( 'Icon at Right', 'porto-functionality' ) => 'right',
							__( 'Icon at Top', 'porto-functionality' ) => 'top',
						),
						'description' => __( 'Select icon position. Icon box style will be changed according to the icon position.', 'porto-functionality' ),
					),
					array(
						'type'       => 'porto_button_group',
						'heading'    => __( 'Alignment', 'porto-functionality' ),
						'param_name' => 'h_align',
						'value'      => array(
							'left'   => array(
								'title' => esc_html__( 'Left', 'porto-functionality' ),
								'icon'  => 'fas fa-align-left',
							),
							'center' => array(
								'title' => esc_html__( 'Center', 'porto-functionality' ),
								'icon'  => 'fas fa-align-center',
							),
							'right'  => array(
								'title' => esc_html__( 'Right', 'porto-functionality' ),
								'icon'  => 'fas fa-align-right',
							),
						),
						'std'        => 'center',
						'responsive' => true,
						'dependency' => array(
							'element' => 'pos',
							'value'   => array( 'top' ),
						),
						'selectors' => array(
							'{{WRAPPER}}.porto-sicon-box.top-icon' => 'text-align: {{VALUE}};',
						)
					),
					array(
						'type'        => 'dropdown',
						'heading'     => __( 'Icon to display:', 'porto-functionality' ),
						'param_name'  => 'icon_type',
						'value'       => array(
							__( 'Font Awesome', 'porto-functionality' ) => 'fontawesome',
							__( 'Simple Line Icon', 'porto-functionality' ) => 'simpleline',
							__( 'Porto Icon', 'porto-functionality' ) => 'porto',
							__( 'Custom Image Icon', 'porto-functionality' ) => 'custom',
						),
						'description' => __( 'Use an existing font icon or upload a custom image.', 'porto-functionality' ),
					),
					array(
						'type'       => 'iconpicker',
						'heading'    => __( 'Icon ', 'porto-functionality' ),
						'param_name' => 'icon',
						'dependency' => array(
							'element' => 'icon_type',
							'value'   => array( 'fontawesome' ),
						),
					),
					array(
						'type'       => 'iconpicker',
						'heading'    => __( 'Icon', 'porto-functionality' ),
						'param_name' => 'icon_simpleline',
						'settings'   => array(
							'type'         => 'simpleline',
							'iconsPerPage' => 4000,
						),
						'dependency' => array(
							'element' => 'icon_type',
							'value'   => 'simpleline',
						),
					),
					array(
						'type'       => 'iconpicker',
						'heading'    => __( 'Icon', 'porto-functionality' ),
						'param_name' => 'icon_porto',
						'settings'   => array(
							'type'         => 'porto',
							'iconsPerPage' => 4000,
						),
						'dependency' => array(
							'element' => 'icon_type',
							'value'   => 'porto',
						),
					),
					array(
						'type'        => 'attach_image',
						'heading'     => __( 'Upload Image Icon:', 'porto-functionality' ),
						'param_name'  => 'icon_img',
						'description' => __( 'Upload the custom image icon.', 'porto-functionality' ),
						'dependency'  => array(
							'element' => 'icon_type',
							'value'   => array( 'custom' ),
						),
					),
					$animation_type,
				),
				Porto_Wpb_Dynamic_Tags::get_instance()->dynamic_wpb_tags( 'field', 'title', '' ),
				array(
					array(
						'type'        => 'textfield',
						'heading'     => __( 'Title', 'porto-functionality' ),
						'param_name'  => 'title',
						'admin_label' => true,
						'description' => __( 'Provide the title for this icon box.', 'porto-functionality' ),
						'dependency'  => array(
							'element'  => 'enable_field_title_dynamic',
							'is_empty' => true,
						),
					),
				),
				Porto_Wpb_Dynamic_Tags::get_instance()->dynamic_wpb_tags( 'field', 'subtitle', '' ),
				array(
					array(
						'type'        => 'textfield',
						'heading'     => __( 'Sub title', 'porto-functionality' ),
						'param_name'  => 'subtitle',
						'admin_label' => true,
						'description' => __( 'Provide the sub title for this icon box.', 'porto-functionality' ),
						'dependency'  => array(
							'element'  => 'enable_field_subtitle_dynamic',
							'is_empty' => true,
						),
					),
					array(
						'type'             => 'textarea_html',
						'heading'          => __( 'Description', 'porto-functionality' ),
						'param_name'       => 'content',
						'description'      => __( 'Provide the description for this icon box.', 'porto-functionality' ),
						'edit_field_class' => 'vc_col-xs-12 vc_column wpb_el_type_textarea_html vc_wrapper-param-type-textarea_html vc_shortcode-param',
					),
					array(
						'type'       => 'dropdown',
						'heading'    => __( 'Apply link to:', 'porto-functionality' ),
						'param_name' => 'read_more',
						'value'      => array(
							__( 'No Link', 'porto-functionality' )   => 'none',
							__( 'Complete Box', 'porto-functionality' ) => 'box',
							__( 'Box Title', 'porto-functionality' ) => 'title',
							__( 'Display Read More', 'porto-functionality' ) => 'more',
						),
					),
					array(
						'type'        => 'vc_link',
						'heading'     => __( 'Add Link', 'porto-functionality' ),
						'param_name'  => 'link',
						'description' => __( 'Add a custom link or select existing page.', 'porto-functionality' ),
						'dependency'  => array(
							'element' => 'read_more',
							'value'   => array( 'box', 'title', 'more' ),
						),
					),
					array(
						'type'        => 'textfield',
						'heading'     => __( 'Read More Text', 'porto-functionality' ),
						'param_name'  => 'read_text',
						'value'       => 'Read More',
						'description' => __( 'Customize the read more text.', 'porto-functionality' ),
						'dependency'  => array(
							'element' => 'read_more',
							'value'   => array( 'more' ),
						),
					),
					array(
						'type'        => 'dropdown',
						'heading'     => __( 'Select Hover Effect type', 'porto-functionality' ),
						'param_name'  => 'hover_effect',
						'value'       => array(
							__( 'No Effect', 'porto-functionality' ) => 'style_1',
							__( 'Icon Zoom', 'porto-functionality' ) => 'style_2',
							__( 'Icon Slide Up', 'porto-functionality' ) => 'style_3',
							__( 'Icon Slide Left', 'porto-functionality' ) => 'hover-icon-left',
							__( 'Icon Slide Right', 'porto-functionality' ) => 'hover-icon-right',
						),
						'description' => __( 'Select the type of effct you want on hover', 'porto-functionality' ),
					),
					$custom_class,
					array(
						'type'       => 'dropdown',
						'heading'    => __( 'Icon Style', 'porto-functionality' ),
						'param_name' => 'icon_style',
						'value'      => array(
							__( 'Simple', 'porto-functionality' )            => 'none',
							__( 'Design your own(Recommended)', 'porto-functionality' )   => 'advanced',
							__( 'Circle Background', 'porto-functionality' ) => 'circle',
							__( 'Circle Image(Use image instead of icon on General > Icon option)', 'porto-functionality' )      => 'circle_img',
							__( 'Square Background', 'porto-functionality' ) => 'square',
						),
						'group'      => __( 'Icon Style', 'porto-functionality' ),
					),
					array(
						'type'        => 'number',
						'heading'     => __( 'Image Width', 'porto-functionality' ),
						'param_name'  => 'img_width',
						'value'       => 48,
						'min'         => 16,
						'max'         => 512,
						'suffix'      => 'px',
						'description' => __( 'Provide image width', 'porto-functionality' ),
						'dependency'  => array(
							'element' => 'icon_type',
							'value'   => array( 'custom' ),
						),
						'group'       => __( 'Icon Style', 'porto-functionality' ),
					),
					array(
						'type'       => 'number',
						'heading'    => __( 'Font Size (px)', 'porto-functionality' ),
						'param_name' => 'icon_size',
						'value'      => 32,
						'min'        => 12,
						'max'        => 72,
						'suffix'     => 'px',
						'dependency' => array(
							'element' => 'icon_type',
							'value'   => array( 'fontawesome', 'simpleline', 'porto' ),
						),
						'group'      => __( 'Icon Style', 'porto-functionality' ),
					),
					array(
						'type'       => 'colorpicker',
						'heading'    => __( 'Color', 'porto-functionality' ),
						'param_name' => 'icon_color',
						'dependency' => array(
							'element' => 'icon_type',
							'value'   => array( 'fontawesome', 'simpleline', 'porto' ),
						),
						'group'      => __( 'Icon Style', 'porto-functionality' ),
					),
					array(
						'type'        => 'colorpicker',
						'heading'     => __( 'Background Color', 'porto-functionality' ),
						'param_name'  => 'icon_color_bg',
						'description' => __( 'Select background color for icon.', 'porto-functionality' ),
						'dependency'  => array(
							'element' => 'icon_style',
							'value'   => array( 'circle', 'square', 'advanced' ),
						),
						'group'       => __( 'Icon Style', 'porto-functionality' ),
					),
					array(
						'type'        => 'dropdown',
						'heading'     => __( 'Icon Border Style', 'porto-functionality' ),
						'param_name'  => 'icon_border_style',
						'value'       => array(
							__( 'None', 'porto-functionality' )   => '',
							__( 'Solid', 'porto-functionality' )  => 'solid',
							__( 'Dashed', 'porto-functionality' ) => 'dashed',
							__( 'Dotted', 'porto-functionality' ) => 'dotted',
							__( 'Double', 'porto-functionality' ) => 'double',
							__( 'Inset', 'porto-functionality' )  => 'inset',
							__( 'Outset', 'porto-functionality' ) => 'outset',
						),
						'description' => __( 'Select the border style for icon.', 'porto-functionality' ),
						'dependency'  => array(
							'element' => 'icon_style',
							'value'   => array( 'circle_img', 'advanced' ),
						),
						'group'       => __( 'Icon Style', 'porto-functionality' ),
					),
					array(
						'type'        => 'colorpicker',
						'heading'     => __( 'Border Color', 'porto-functionality' ),
						'param_name'  => 'icon_color_border',
						'value'       => '#333333',
						'description' => __( 'Select border color for icon.', 'porto-functionality' ),
						'dependency'  => array(
							'element'   => 'icon_border_style',
							'not_empty' => true,
						),
						'group'       => __( 'Icon Style', 'porto-functionality' ),
					),
					array(
						'type'        => 'number',
						'heading'     => __( 'Border Width', 'porto-functionality' ),
						'param_name'  => 'icon_border_size',
						'value'       => 1,
						'min'         => 1,
						'max'         => 10,
						'suffix'      => 'px',
						'description' => __( 'Thickness of the border.', 'porto-functionality' ),
						'dependency'  => array(
							'element'   => 'icon_border_style',
							'not_empty' => true,
						),
						'group'       => __( 'Icon Style', 'porto-functionality' ),
					),
					array(
						'type'       => 'number',
						'heading'    => __( 'Border Radius', 'porto-functionality' ),
						'param_name' => 'icon_border_radius',
						'value'      => 500,
						'min'        => 1,
						'max'        => 500,
						'suffix'     => 'px',
						'dependency' => array(
							'element' => 'icon_style',
							'value'   => array( 'none', 'circle_img', 'advanced' ),
						),
						'group'      => __( 'Icon Style', 'porto-functionality' ),
					),
					array(
						'type'        => 'number',
						'heading'     => __( 'Size', 'porto-functionality' ),
						'param_name'  => 'icon_border_spacing',
						'value'       => 50,
						'min'         => 0,
						'max'         => 500,
						'suffix'      => 'px',
						'description' => __( 'Icon width and height for font icon and Spacing from center of the icon till the boundary of border / background for image icon', 'porto-functionality' ),
						'dependency'  => array(
							'element' => 'icon_style',
							'value'   => array( 'circle_img', 'advanced' ),
						),
						'group'       => __( 'Icon Style', 'porto-functionality' ),
					),
					array(
						'type'        => 'porto_dimension',
						'heading'     => __( 'Icon Margin', 'porto-functionality' ),
						'param_name'  => 'icon_margin',
						'selectors'   => array(
							'.porto-sicon-box{{WRAPPER}} .porto-icon, .porto-sicon-box{{WRAPPER}} .porto-sicon-img' => 'margin-top:{{TOP}}; margin-right:{{RIGHT}}; margin-bottom:{{BOTTOM}}; margin-left: {{LEFT}};',
						),
						'responsive'  => true,
						'qa_selector' => '.porto-icon, .porto-sicon-img',
						'group'       => __( 'Icon Style', 'porto-functionality' ),
					),
	
					array(
						'type'       => 'porto_param_heading',
						'param_name' => 'title_text_typography',
						'text'       => __( 'Title settings', 'porto-functionality' ),
						'group'      => __( 'Text Style', 'porto-functionality' ),
					),
					array(
						'type'        => 'dropdown',
						'heading'     => __( 'Tag', 'porto-functionality' ),
						'param_name'  => 'heading_tag',
						'value'       => array(
							__( 'Default', 'porto-functionality' ) => 'h3',
							__( 'H1', 'porto-functionality' ) => 'h1',
							__( 'H2', 'porto-functionality' ) => 'h2',
							__( 'H4', 'porto-functionality' ) => 'h4',
							__( 'H5', 'porto-functionality' ) => 'h5',
							__( 'H6', 'porto-functionality' ) => 'h6',
							__( 'DIV', 'porto-functionality' ) => 'div',
							__( 'P tag', 'porto-functionality' ) => 'p',
						),
						'description' => __( 'Default is H3', 'porto-functionality' ),
						'group'       => __( 'Text Style', 'porto-functionality' ),
					),
					array(
						'type'       => 'porto_typography',
						'heading'    => __( 'Typography', 'porto-functionality' ),
						'param_name' => 'title_font_porto_typography',
						'group'      => __( 'Text Style', 'porto-functionality' ),
						'responsive' => true,
						'selectors'  => array(
							'{{WRAPPER}} .porto-sicon-title',
						),
					),
					array(
						'type'       => 'colorpicker',
						'param_name' => 'title_font_color',
						'heading'    => __( 'Color', 'porto-functionality' ),
						'group'      => __( 'Text Style', 'porto-functionality' ),
						'selectors'  => array(
							'{{WRAPPER}} .porto-sicon-title' => 'color: {{VALUE}};',
						),
					),
					array(
						'type'       => 'colorpicker',
						'param_name' => 'title_font_color_hover',
						'heading'    => __( 'Hover Color', 'porto-functionality' ),
						'dependency' => array(
							'element' => 'read_more',
							'value'   => array( 'box', 'title' ),
						),
						'selectors'  => array(
							'{{WRAPPER}} .porto-sicon-title:hover' => 'color: {{VALUE}};',
						),
						'group'      => __( 'Text Style', 'porto-functionality' ),
					),
					array(
						'type'       => 'porto_param_heading',
						'param_name' => 'subtitle_text_typography',
						'text'       => __( 'Sub title settings', 'porto-functionality' ),
						'group'      => __( 'Text Style', 'porto-functionality' ),
					),
					array(
						'type'       => 'porto_typography',
						'heading'    => __( 'Typography', 'porto-functionality' ),
						'param_name' => 'subtitle_font_porto_typography',
						'group'      => __( 'Text Style', 'porto-functionality' ),
						'responsive' => true,
						'selectors'  => array(
							'{{WRAPPER}} .porto-sicon-header p',
						),
					),
					array(
						'type'       => 'colorpicker',
						'param_name' => 'subtitle_font_color',
						'heading'    => __( 'Color', 'porto-functionality' ),
						'group'      => __( 'Text Style', 'porto-functionality' ),
					),
					array(
						'type'        => 'porto_param_heading',
						'param_name'  => 'desc_text_typography',
						'text'        => __( 'Description settings', 'porto-functionality' ),
						'group'       => __( 'Text Style', 'porto-functionality' ),
						'qa_selector' => '.porto-sicon-description',
					),
					array(
						'type'       => 'porto_typography',
						'heading'    => __( 'Typography', 'porto-functionality' ),
						'param_name' => 'desc_font_porto_typography',
						'group'      => __( 'Text Style', 'porto-functionality' ),
						'responsive' => true,
						'selectors'  => array(
							'{{WRAPPER}} .porto-sicon-description',
						),
					),
					array(
						'type'       => 'colorpicker',
						'param_name' => 'desc_font_color',
						'heading'    => __( 'Color', 'porto-functionality' ),
						'group'      => __( 'Text Style', 'porto-functionality' ),
					),
					array(
						'type'        => 'textfield',
						'heading'     => __( 'Title Margin Top', 'porto-functionality' ),
						'param_name'  => 'title_margin_top',
						'group'       => __( 'Text Style', 'porto-functionality' ),
						'qa_selector' => '.porto-sicon-title',
					),
					array(
						'type'        => 'textfield',
						'heading'     => __( 'Title Margin Bottom', 'porto-functionality' ),
						'param_name'  => 'title_margin_bottom',
						'qa_selector' => '.porto-sicon-title',
						'group'       => __( 'Text Style', 'porto-functionality' ),
					),
					array(
						'type'       => 'textfield',
						'heading'    => __( 'Header Margin Bottom', 'porto-functionality' ),
						'param_name' => 'sub_title_margin_bottom',
						'group'      => __( 'Text Style', 'porto-functionality' ),
					),
					array(
						'type'        => 'checkbox',
						'heading'     => __( 'Layout ( <=575px )', 'porto-functionality' ),
						'param_name'  => 'mobile_pos',
						'description' => __( 'Display the info box as \'Icon at Top\' layout.', 'porto-functionality' ),
						'value'       => array( __( 'Yes', 'js_composer' ) => 'yes' ),
						'dependency' => array(
							'element' => 'pos',
							'value'   => array( 'default', 'heading-right', 'left', 'right' ),
						),
						'selectors'   => array(
							'{{WRAPPER}}.porto-sicon-mobile' => '--porto-infobox-mpos: column;',
						),
						'group'      => __( 'Mobile Layout', 'porto-functionality' ),
					),
					array(
						'type'       => 'porto_button_group',
						'heading'    => __( 'Alignment', 'porto-functionality' ),
						'param_name' => 'mobile_valign',
						'value'      => array(
							'left'   => array(
								'title' => esc_html__( 'Left', 'porto-functionality' ),
								'icon'  => 'fas fa-align-left',
							),
							'center' => array(
								'title' => esc_html__( 'Center', 'porto-functionality' ),
								'icon'  => 'fas fa-align-center',
							),
							'right'  => array(
								'title' => esc_html__( 'Right', 'porto-functionality' ),
								'icon'  => 'fas fa-align-right',
							),
						),
						'std'        => 'center',
						'dependency' => array(
							'element' => 'mobile_pos',
							'value'   => 'yes',
						),
						'selectors' => array(
							'{{WRAPPER}}.porto-sicon-mobile' => '--porto-infobox-mpos-align: {{VALUE}};',
						),
						'group'      => __( 'Mobile Layout', 'porto-functionality' ),
					),
					array(
						'type'             => 'css_editor',
						'heading'          => __( 'CSS', 'porto-functionality' ),
						'param_name'       => 'css_info_box',
						'group'            => __( 'Design', 'porto-functionality' ),
						'edit_field_class' => 'vc_col-sm-12 vc_column no-vc-background no-vc-border creative_link_css_editor',
					),
					$animation_type1,
					$animation_duration,
					$animation_delay,
					$animation_reveal_clr,
				)
			)
		)
	);
}
