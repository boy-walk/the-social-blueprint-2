<?php
// Porto Info List

add_action( 'vc_after_init', 'porto_load_social_icons_element' );

function porto_load_social_icons_element() {

	$custom_class = porto_vc_custom_class();
	$right        = is_rtl() ? 'left' : 'right';
	vc_map(
		array(
			'name'        => __( 'Porto Social Icons', 'porto-functionality' ),
			'base'        => 'porto_social_icons',
			'icon'        => PORTO_WIDGET_URL . 'social-icons.png',
			'class'       => 'porto-wpb-widget porto_social_icons',
			'category'    => __( 'Porto', 'porto-functionality' ),
			'description' => __( 'Display social links', 'porto-functionality' ),
			'params'      => array(
				array(
					'type'       => 'porto_param_heading',
					'text'       => sprintf( __( 'Please see %1$sTheme Options -> Header -> Social Links%2$s panel.', 'porto-functionality' ), '<a href="' . porto_get_theme_option_url( 'show-header-socials' ) . '" target="_blank">', '</a>' ),
					'param_name' => 'social_selectors',
				),
				array(
					'type'       => 'porto_number',
					'heading'    => __( 'Icon Font Size', 'porto-functionality' ),
					'param_name' => 'icon_size',
					'units'      => array( 'px', 'rem', 'em' ),
					'selectors'  => array(
						'{{WRAPPER}} a' => 'font-size: {{VALUE}}{{UNIT}};',
					),
				),
				array(
					'type'        => 'textfield',
					'heading'     => __( 'Icon Width and Height', 'porto-functionality' ),
					'param_name'  => 'icon_border_spacing',
					'description' => __( 'Input units together. e.g: 32px', 'porto-functionality' ),
					'selectors'   => array(
						'{{WRAPPER}} a' => 'width: {{VALUE}};height: {{VALUE}};',
					),
				),
				array(
					'type'       => 'porto_number',
					'heading'    => __( 'Spacing between icons', 'porto-functionality' ),
					'param_name' => 'icon_spacing',
					'units'      => array( 'px', 'rem', 'em' ),
					'selectors'  => array(
						'{{WRAPPER}} a' => 'margin-' . $right . ': {{VALUE}}{{UNIT}};',
					),
				),
				array(
					'type'       => 'textfield',
					'heading'    => __( 'Icon Border Radius', 'porto-functionality' ),
					'param_name' => 'icon_border_radius',
					'selectors'  => array(
						'{{WRAPPER}} a' => 'border-radius: {{VALUE}};',
					),
				),
				array(
					'type'       => 'dropdown',
					'heading'    => __( 'Icon Border Style', 'porto-functionality' ),
					'param_name' => 'icon_border_style',
					'value'      => array(
						__( 'None', 'porto-functionality' ) => '',
						__( 'Solid', 'porto-functionality' ) => 'solid',
						__( 'Dashed', 'porto-functionality' ) => 'dashed',
						__( 'Dotted', 'porto-functionality' ) => 'dotted',
						__( 'Double', 'porto-functionality' ) => 'double',
						__( 'Inset', 'porto-functionality' ) => 'inset',
						__( 'Outset', 'porto-functionality' ) => 'outset',
					),
					'std'        => '',
					'selectors'  => array(
						'{{WRAPPER}} a' => 'border-style: {{VALUE}};',
					),
				),
				array(
					'type'       => 'porto_number',
					'heading'    => __( 'Icon Border Width', 'porto-functionality' ),
					'param_name' => 'icon_border_size',
					'units'      => array( 'px', 'rem', 'em' ),
					'selectors'  => array(
						'{{WRAPPER}} a' => 'border-width: {{VALUE}}{{UNIT}};',
					),
					'dependency' => array(
						'element'   => 'icon_border_style',
						'not_empty' => true,
					),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Color', 'porto-functionality' ),
					'param_name' => 'icon_color',
					'selectors'  => array(
						'{{WRAPPER}}.share-links a:not(:hover)' => 'color: {{VALUE}};',
					),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Icon Background Color', 'porto-functionality' ),
					'param_name' => 'icon_color_bg',
					'selectors'  => array(
						'{{WRAPPER}}.share-links a:not(:hover)' => 'background-color: {{VALUE}};',
					),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Icon Border Color', 'porto-functionality' ),
					'param_name' => 'icon_color_border',
					'selectors'  => array(
						'{{WRAPPER}} a' => 'border-color: {{VALUE}};',
					),
					'dependency' => array(
						'element'   => 'icon_border_style',
						'not_empty' => true,
					),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Hover Color', 'porto-functionality' ),
					'param_name' => 'icon_hover_color',
					'selectors'  => array(
						'{{WRAPPER}} a:hover' => 'color: {{VALUE}};',
					),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Hover Background Color', 'porto-functionality' ),
					'param_name' => 'icon_hover_color_bg',
					'selectors'  => array(
						'{{WRAPPER}} a:hover' => 'background-color: {{VALUE}};',
					),
				),
				array(
					'type'       => 'colorpicker',
					'heading'    => __( 'Hover Border Color', 'porto-functionality' ),
					'param_name' => 'icon_hover_color_border',
					'selectors'  => array(
						'{{WRAPPER}} a:hover' => 'border-color: {{VALUE}};',
					),
					'dependency' => array(
						'element'   => 'icon_border_style',
						'not_empty' => true,
					),
				),
				$custom_class,
			),
		)
	);

	class WPBakeryShortCode_porto_social_icons extends WPBakeryShortCode {
	}
}
