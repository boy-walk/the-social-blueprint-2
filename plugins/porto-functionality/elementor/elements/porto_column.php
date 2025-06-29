<?php

/**
 * Porto Column element
 *
 * Carousel, Banner Layer, Creative Grid Item and One Layer Banner
 *
 * @since 6.1.0
 */
use Elementor\Controls_Manager;

class Porto_Elementor_Column extends Elementor\Element_Column {

	public function before_render() {
		global $porto_section;
		$settings = $this->get_settings_for_display();

		$overlay_background = $settings['background_overlay_background'] ?? '';
		$overlay_hover_background = $settings['background_overlay_hover_background'] ?? '';

		$has_background_overlay = in_array( $overlay_background, [ 'classic', 'gradient' ], true ) ||
								  in_array( $overlay_hover_background, [ 'classic', 'gradient' ], true );

		$is_legacy_mode_active    = ! porto_elementor_if_dom_optimization();
		$wrapper_attribute_string = $is_legacy_mode_active ? '_inner_wrapper' : '_widget_wrapper';

		$column_wrap_classes = $is_legacy_mode_active ? array( 'elementor-column-wrap' ) : array( 'elementor-widget-wrap' );

		if ( $this->get_children() ) {
			$column_wrap_classes[] = 'elementor-element-populated';
		}

		$this->add_render_attribute(
			array(
				'_inner_wrapper'      => array(
					'class' => $column_wrap_classes,
				),
				'_widget_wrapper'     => array(
					'class' => $is_legacy_mode_active ? 'elementor-widget-wrap' : $column_wrap_classes,
				),
				'_background_overlay' => array(
					'class' => array( 'elementor-background-overlay' ),
				),
			)
		);

		if ( 'tab_content' === $settings['as_banner_layer'] ) {
			$pane_id = $this->get_data( 'id' );
			if ( isset( $porto_section['section'] ) && 'tab' == $porto_section['section'] ) {
				$porto_section['tab_data'][] = array(
					'title'    => $settings['tab_content_title'],
					'icon'     => $settings['tab_content_icon'],
					'icon_pos' => $settings['tab_icon_pos'],
					'id'       => $pane_id,
				);
			}
			$this->add_render_attribute(
				array(
					'_wrapper' => array(
						'class' => array( 'tab-pane fade' ),
						'id'    => array( 'tab-' . $pane_id ),
					),
				)
			);
			if ( isset( $porto_section['index'] ) ) {
				if ( 0 == $porto_section['index'] ) {
					$this->add_render_attribute(
						array(
							'_wrapper' => array(
								'class' => array( 'active show' ),
							),
						)
					);
				}
				$porto_section['index'] = ++$porto_section['index'];
			}
		}
		?>
		<<?php	// PHPCS - the method get_html_tag is safe.
		echo $this->get_html_tag(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		?> <?php $this->print_render_attribute_string( '_wrapper' ); ?>>
		<?php
		if ( 'banner' === $settings['as_banner_layer'] ) {
			
			if ( ! empty( $settings['banner_image'] ) && ( ! empty( $settings['banner_image']['id'] ) || ! empty( $settings['banner_image']['url'] ) ) ) {
				$attr    = array( 'class' => 'porto-ibanner-img' . ( ! empty( $settings['banner_effect'] ) ? ' invisible' : '' ) );

				if ( ! empty( $settings['banner_image']['id'] ) ) {
					$img_src = wp_get_attachment_image_src( $settings['banner_image']['id'], ! empty( $settings['banner_image_size'] ) ? $settings['banner_image_size'] : 'full' );
				} else if ( ! empty( $settings['banner_image']['url'] ) ) {
					$img_src = array( $settings['banner_image']['url'] );
					if (  ! empty( $settings['banner_image']['alt'] ) ) {
						$img_src[] = $settings['banner_image']['alt'];
					}
				}

				// Banner effect and parallax effect
				if ( '' !== $settings['banner_effect'] || '' !== $settings['particle_effect'] ) {
					// Background Effect
					$background_wrapclass = '';
					$background_class     = '';
					if ( $settings['banner_effect'] ) {
						$background_class = ' ' . $settings['banner_effect'];
					}
					// Particle Effect
					$particle_class = '';
					if ( $settings['particle_effect'] ) {
						$particle_class = ' ' . $settings['particle_effect'];
					}

					if ( ! empty( $img_src[0] ) ) {
						if ( '' == $settings['particle_effect'] || '' !== $settings['banner_effect'] ) {
							$banner_img = esc_url( $img_src[0] );
						}
						echo '<div class="banner-effect-wrapper' . $background_wrapclass . '">';
						echo '<div class="banner-effect' . $background_class . '"' . ( empty( $banner_img ) ? '' : ' style="background-image: url(' . $banner_img . '); background-size: cover;background-position: center;"' ) . '>';

						if ( '' !== $settings['particle_effect'] ) {
							echo '<div class="particle-effect' . $particle_class . '"></div>';
						}
						echo '</div>';
						echo '</div>';
					}
				}

				// Generate 'srcset' and 'sizes'
				$image_meta          = wp_get_attachment_metadata( $settings['banner_image']['id'] );
				$settings_min_height = false;
				if ( ! empty( $settings['min_height']['size'] ) && 'px' == $settings['min_height']['unit'] ) {
					if ( ! $settings_min_height ) {
						$settings_min_height = (int) $settings['min_height']['size'];
					}
				}
				if ( ! empty( $settings['min_height_tablet']['size'] ) && 'px' == $settings['min_height_tablet']['unit'] ) {
					if ( ! $settings_min_height || (int) $settings['min_height_tablet']['size'] < $settings_min_height ) {
						$settings_min_height = (int) $settings['min_height_tablet']['size'];
					}
				}
				if ( ! empty( $settings['min_height_mobile']['size'] ) && 'px' == $settings['min_height_mobile']['unit'] ) {
					if ( ! $settings_min_height || (int) $settings['min_height_mobile']['size'] < $settings_min_height ) {
						$settings_min_height = (int) $settings['min_height_mobile']['size'];
					}
				}
				if ( $settings_min_height && is_array( $image_meta ) && is_array( $image_meta['sizes'] ) && ! empty( $image_meta['width'] ) ) {
					$ratio = $image_meta['height'] / $image_meta['width'];
					foreach ( $image_meta['sizes'] as $key => $size ) {
						if ( $size['width'] * (float) $ratio < $settings_min_height ) {
							unset( $image_meta['sizes'][ $key ] );
						}
					}
				}
				$srcset = wp_get_attachment_image_srcset( $settings['banner_image']['id'], ! empty( $settings['banner_image_size'] ) ? $settings['banner_image_size'] : 'full', $image_meta );
				$sizes  = wp_get_attachment_image_sizes( $settings['banner_image']['id'], ! empty( $settings['banner_image_size'] ) ? $settings['banner_image_size'] : 'full', $image_meta );
				if ( $srcset && $sizes ) {
					$attr['srcset'] = $srcset;
					$attr['sizes']  = $sizes;
				}

				if ( is_array( $img_src ) ) {
					$attr_str_escaped = '';
					foreach ( $attr as $key => $val ) {
						$attr_str_escaped .= ' ' . esc_html( $key ) . '="' . esc_attr( $val ) . '"';
					}
					if ( ! empty( $settings['banner_image']['id'] ) ) {
						echo '<img src="' . esc_url( $img_src[0] ) . '" alt="' . esc_attr( trim( get_post_meta( $settings['banner_image']['id'], '_wp_attachment_image_alt', true ) ) ) . '" width="' . esc_attr( $img_src[1] ) . '" height="' . esc_attr( $img_src[2] ) . '"' . $attr_str_escaped . '>';
					} else {
						echo '<img src="' . esc_url( $img_src[0] ) . '" ' . ( ! empty( $img_src[1] ) ? 'alt="' . $img_src[1] . '" ' : '' ) . $attr_str_escaped . '>';
					}
				}
			}
			if ( 'yes' == $settings['add_container'] ) {
				echo '<div class="container">';
			}
		} 
		if ( 'yes' == $settings['as_banner_layer'] || 'banner' == $settings['as_banner_layer'] ) {
			$extra_style = '';
			$id          = $this->get_id();
			
			// Desktop
			$x_pos = floatval( $settings['horizontal']['size'] );
			$y_pos = floatval( $settings['vertical']['size'] );
			$extra_style .= $this->porto_column_banner_pos( $x_pos, $y_pos, $id );

			// Tablet
			$x_tablet_pos = ( isset( $settings['horizontal_tablet'] ) && '' !== $settings['horizontal_tablet']['size'] ) ? floatval( $settings['horizontal_tablet']['size'] ) : '';
			$y_tablet_pos = ( isset( $settings['vertical_tablet'] ) && '' !== $settings['vertical_tablet']['size'] ) ? floatval( $settings['vertical_tablet']['size'] ) : '';
			$extra_style .= $this->porto_column_banner_pos( $x_tablet_pos, $y_tablet_pos, $id, '991px' );

			// Mobile
			$x_mobile_pos = ( isset( $settings['horizontal_mobile'] ) && '' !== $settings['horizontal_mobile']['size'] ) ? floatval( $settings['horizontal_mobile']['size'] ) : '';
			$y_mobile_pos = ( isset( $settings['vertical_mobile'] ) && '' !== $settings['vertical_mobile']['size'] ) ? floatval( $settings['vertical_mobile']['size'] ) : '';
			$extra_style .= $this->porto_column_banner_pos( $x_mobile_pos, $y_mobile_pos, $id, '767px' );

			echo '<style>';
			echo porto_filter_output( $extra_style );
			echo '</style>';
		}
		?>
			<div <?php $this->print_render_attribute_string( $wrapper_attribute_string ); ?>>
		<?php if ( $has_background_overlay ) : ?>
			<div <?php $this->print_render_attribute_string( '_background_overlay' ); ?>></div>
		<?php endif; ?>
		<?php if ( $is_legacy_mode_active ) : ?>
			<div <?php $this->print_render_attribute_string( '_widget_wrapper' ); ?>>
		<?php endif; ?>
		<?php
	}

	public function after_render() {
		$settings = $this->get_settings_for_display();
		if ( ! porto_elementor_if_dom_optimization() ) {
			?>
				</div>
		<?php } ?>
			</div>
		<?php if ( 'banner' === $settings['as_banner_layer'] && 'yes' == $settings['add_container'] ) : ?>
			</div>
		<?php endif; ?>
		</<?php
		// PHPCS - the method get_html_tag is safe.
		echo $this->get_html_tag(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<?php
	}

	private function get_html_tag() {
		$html_tag = $this->get_settings( 'html_tag' );

		if ( empty( $html_tag ) ) {
			$html_tag = 'div';
		}

		return Elementor\Utils::validate_html_tag( $html_tag );
	}

	private function porto_column_banner_pos( $x_pos, $y_pos, $id, $breakpoint = false ) {
		if ( '' === $x_pos && '' === $y_pos ) {
			return '';
		}
		$extra_style = '';
		if ( $breakpoint ) {
			$extra_style .= '@media(max-width: ' . $breakpoint . '){';
		}
		$extra_style .= '.elementor-element-' . $id . ' .porto-ibanner-layer {';
		if ( '' !== $x_pos ) {
			if ( 50.0 === $x_pos ) {
				if ( 50.0 === $y_pos ) {
					$extra_style .= 'left: 50%;right: unset;top: 50%;bottom: unset;transform: translate(-50%, -50%);';
				} else {
					$extra_style .= 'left: 50%;right: unset;transform: translateX(-50%);';
				}
			} elseif ( 50.0 > $x_pos ) {
				$extra_style .= 'left:' . $x_pos . '%;right: unset;';
			} else {
				$extra_style .= 'right:' . ( 100 - $x_pos ) . '%;left: unset;';
			}
		}
		if ( '' !== $y_pos ) {
			if ( 50.0 === $y_pos ) {
				if ( 50.0 !== $x_pos ) {
					$extra_style .= 'top: 50%;bottom: unset;transform: translateY(-50%);';
				}
			} elseif ( 50.0 > $y_pos ) {
				$extra_style .= 'top:' . $y_pos . '%;bottom: unset;';
			} else {
				$extra_style .= 'bottom:' . ( 100 - $y_pos ) . '%;top: unset;';
			}
		}
		if ( $breakpoint  ) {
			if ( ( '' !== $x_pos || '' !== $y_pos ) && 50.0 != $x_pos && 50.0 != $y_pos ) {
				$extra_style .= 'transform: none;';
			}
			$extra_style .= '}';
		}
		$extra_style .= '}';
		return $extra_style;
	}
	
	protected function register_controls() {
		parent::register_controls();
	}
}

add_action( 'elementor/element/column/layout/after_section_end', 'porto_elementor_column_custom_control', 10, 2 );
add_action( 'elementor/element/column/section_advanced/after_section_end', 'porto_elementor_mpx_controls', 10, 2 );
add_action( 'elementor/element/column/section_effects/after_section_end', 'porto_elementor_animation_controls', 10, 2 );
add_filter( 'elementor/column/print_template', 'porto_elementor_print_column_template', 10, 2 );
add_action( 'elementor/frontend/column/before_render', 'porto_elementor_column_add_custom_attrs', 10, 1 );
add_action( 'elementor/element/column/section_style/before_section_end', 'porto_elementor_element_add_parallax', 10, 2 );

function porto_elementor_column_custom_control( $self, $args ) {

	$left  = is_rtl() ? 'right' : 'left';
	$right = is_rtl() ? 'left' : 'right';
	// removed required attribute for Column Width(_inline_size) field
	$self->update_control(
		'_inline_size',
		array(
			'required' => false,
		)
	);

	$self->start_controls_section(
		'section_column_additional',
		array(
			'label'       => esc_html__( 'Porto Additional Settings', 'porto-functionality' ),
			'tab'         => Controls_Manager::TAB_LAYOUT,
			'qa_selector' => '>.elementor-element-populated',
		)
	);

	$self->add_control(
		'as_banner_layer',
		array(
			'type'    => Controls_Manager::SELECT,
			'label'   => esc_html__( 'Use as', 'porto-functionality' ),
			'options' => array(
				''            => esc_html__( 'Default', 'porto-functionality' ),
				'carousel'    => esc_html__( 'Carousel', 'porto-functionality' ),
				'yes'         => esc_html__( 'Banner Layer', 'porto-functionality' ),
				'grid_item'   => esc_html__( 'Creative Grid Item', 'porto-functionality' ),
				'banner'      => esc_html__( 'One Layer Banner', 'porto-functionality' ),
				'is_half'     => esc_html__( 'Half Contanier', 'porto-functionality' ),
				'sticky'      => esc_html__( 'Sticky Container', 'porto-functionality' ),
				'tab_content' => esc_html__( 'Tab Content', 'porto-functionality' ),
				'split_layer' => esc_html__( 'Split Layer', 'porto-functionality' ),
			),
		)
	);

	/* start carousel controls */
	$self->add_control(
		'enable_flick',
		array(
			'type'        => Controls_Manager::SWITCHER,
			'label'       => __( 'Enable Flick Type', 'porto-functionality' ),
			'description' => sprintf( __( 'This option shows the carousel at the container\'s width. %1$sRead More%2$s', 'porto-functionality' ), '<a href="https://www.portotheme.com/wordpress/porto/documentation/how-to-use-porto-flick-carousel" target="_blank">', '</a>' ),
			'condition'   => array(
				'as_banner_layer' => 'carousel',
			),
		)
	);
	
	$self->add_control(
		'flick_opacity',
		array(
			'type'       => Controls_Manager::SLIDER,
			'label'      => __( 'Opacity of Inactive item', 'porto-functionality' ),
			'range'      => array(
				'px'  => array(
					'step' => 0.1,
					'min'  => 0,
					'max'  => 1,
				),
			),
			'default'    => array(
				'size' => '0.5',
				'unit' => 'px',
			),
			'size_units' => array(
				'px',
			),
			'selectors'  => array(
				'.elementor-element-{{ID}} .owl-item:not(.active)' => 'opacity: {{SIZE}}',
			),
			'condition' => array(
				'as_banner_layer' => 'carousel',
				'enable_flick!'   => '',
			),
		)
	);

	$self->add_control(
		'stage_padding',
		array(
			'label'     => esc_html__( 'Stage Padding (px)', 'porto-functionality' ),
			'type'      => Controls_Manager::NUMBER,
			'min'       => 0,
			'max'       => 100,
			'step'      => 1,
			'condition' => array(
				'as_banner_layer' => 'carousel',
				'enable_flick'    => '',
			),
		)
	);

	$self->add_control(
		'disable_mouse_drag',
		array(
			'type'        => Controls_Manager::SWITCHER,
			'label'       => esc_html__( 'Disable Mouse Drag', 'porto-functionality' ),
			'description' => esc_html__( 'This option will disapprove Mouse Drag.', 'porto-functionality' ),
			'condition'   => array(
				'as_banner_layer' => 'carousel',
			),
		)
	);

	$self->add_responsive_control(
		'items',
		array(
			'label'     => esc_html__( 'Items', 'porto-functionality' ),
			'type'      => Controls_Manager::SLIDER,
			'range'     => array(
				'px' => array(
					'step' => 1,
					'min'  => 1,
					'max'  => 6,
				),
			),
			'condition' => array(
				'as_banner_layer' => 'carousel',
			),
		)
	);

	$self->add_control(
		'item_margin',
		array(
			'label'              => esc_html__( 'Item Margin (px)', 'porto-functionality' ),
			'type'               => Controls_Manager::NUMBER,
			'default'            => 0,
			'min'                => '0',
			'max'                => '100',
			'step'               => '1',
			'placeholder'        => '0',
			'render_type'        => 'template',
			'frontend_available' => true,
			'selectors'          => array(
				'.elementor-element-{{ID}} > .elementor-column-wrap > .porto-carousel, .elementor-element-{{ID}} > .porto-carousel' => '--porto-el-spacing: {{VALUE}}px;',
			),
			'condition'          => array(
				'as_banner_layer' => 'carousel',
			),
		)
	);

	$self->add_control(
		'set_loop',
		array(
			'type'      => Controls_Manager::SWITCHER,
			'label'     => esc_html__( 'Infinite Loop', 'porto-functionality' ),
			'condition' => array(
				'as_banner_layer' => 'carousel',
			),
		)
	);

	$self->add_control(
		'show_nav',
		array(
			'type'      => Controls_Manager::SWITCHER,
			'label'     => esc_html__( 'Show Nav', 'porto-functionality' ),
			'condition' => array(
				'as_banner_layer' => 'carousel',
			),
		)
	);

	$self->add_control(
		'show_nav_hover',
		array(
			'type'      => Controls_Manager::SWITCHER,
			'label'     => esc_html__( 'Show Nav on Hover', 'porto-functionality' ),
			'condition' => array(
				'as_banner_layer' => 'carousel',
				'show_nav'        => 'yes',
			),
		)
	);

	$self->add_control(
		'nav_pos',
		array(
			'type'        => Controls_Manager::SELECT,
			'label'       => esc_html__( 'Nav Position', 'porto-functionality' ),
			'options'     => array(
				''                => esc_html__( 'Middle', 'porto-functionality' ),
				'nav-pos-inside'  => esc_html__( 'Middle Inside', 'porto-functionality' ),
				'nav-pos-outside' => esc_html__( 'Middle Outside', 'porto-functionality' ),
				'show-nav-title'  => esc_html__( 'Top', 'porto-functionality' ),
				'nav-bottom'      => esc_html__( 'Bottom', 'porto-functionality' ),
				'custom-pos'      => esc_html__( 'Custom', 'porto-functionality' ),
			),
			'condition'   => array(
				'as_banner_layer' => 'carousel',
				'show_nav'        => 'yes',
			),
			'qa_selector' => '>.elementor-widget-wrap>.owl-nav > .owl-prev, >.elementor-column-wrap>.elementor-widget-wrap>.owl-nav > .owl-prev',
		)
	);

	$carousel_nav_types = porto_sh_commons( 'carousel_nav_types' );
	$carousel_nav_types = array_combine( array_values( $carousel_nav_types ), array_keys( $carousel_nav_types ) );

	$self->add_control(
		'nav_type',
		array(
			'type'      => Controls_Manager::SELECT,
			'label'     => esc_html__( 'Nav Type', 'porto-functionality' ),
			'options'   => $carousel_nav_types,
			'condition' => array(
				'as_banner_layer' => 'carousel',
				'show_nav'        => 'yes',
			),
		)
	);

	$self->add_responsive_control(
		'nav_visible',
		array(
			'label'       => esc_html__( 'Navigation Visible', 'porto-functionality' ),
			'type'        => Controls_Manager::CHOOSE,
			'description' => esc_html__( 'Show or Hide the Navigation', 'porto-functionality' ),
			'options'     => array(
				'block' => array(
					'title' => esc_html__( 'Show', 'porto-functionality' ),
					'icon'  => 'far fa-eye',
				),
				'none'  => array(
					'title' => esc_html__( 'Hide', 'porto-functionality' ),
					'icon'  => 'far fa-eye-slash',
				),
			),
			'condition'   => array(
				'as_banner_layer' => 'carousel',
				'show_nav'        => 'yes',
			),
			'selectors'   => array(
				'.elementor-element-{{ID}} .owl-nav:not(.disabled)' => 'display:{{VALUE}} !important;',
			),
		)
	);
	
	$self->add_control(
		'slide_nav_fs',
		array(
			'type'      => Controls_Manager::SLIDER,
			'label'     => esc_html__( 'Nav Font Size', 'porto-functionality' ),
			'size_units'=> array(
				'px',
				'rem',
				'%',
			),
			'selectors' => array(
				'{{WRAPPER}} .owl-nav button' => 'font-size: {{SIZE}}px !important;',
			),
			'separator' => 'before',
			'condition' => array(
				'as_banner_layer' => 'carousel',
				'show_nav'        => 'yes',
			),
		)
	);

	$self->add_control(
		'slide_nav_width',
		array(
			'type'       => Controls_Manager::SLIDER,
			'label'      => esc_html__( 'Nav Width', 'porto-functionality' ),
			'size_units' => array(
				'px',
				'rem',
				'%',
			),
			'selectors'  => array(
				'{{WRAPPER}} .owl-nav button' => 'width: {{SIZE}}{{UNIT}} !important;',
			),
			'condition'  => array(
				'as_banner_layer' => 'carousel',
				'show_nav'        => 'yes',
				'nav_type'        => array( '', 'rounded-nav', 'big-nav', 'nav-style-3' ),
			),
		)
	);

	$self->add_control(
		'slide_nav_height',
		array(
			'type'       => Controls_Manager::SLIDER,
			'label'      => esc_html__( 'Nav Height', 'porto-functionality' ),
			'size_units' => array(
				'px',
				'rem',
				'%',
			),
			'selectors'  => array(
				'{{WRAPPER}} .owl-nav button' => 'height: {{SIZE}}{{UNIT}} !important;',
			),
			'condition'  => array(
				'as_banner_layer' => 'carousel',
				'show_nav'        => 'yes',
				'nav_type'        => array( '', 'rounded-nav', 'big-nav', 'nav-style-3' ),
			),
		)
	);

	$self->add_control(
		'slide_nav_br',
		array(
			'type'       => Controls_Manager::SLIDER,
			'label'      => esc_html__( 'Border Radius', 'porto-functionality' ),
			'size_units' => array(
				'px',
				'%',
			),
			'range'      => array(
				'%' => array(
					'min' => 0,
					'max' => 50,
				)
			),
			'selectors'  => array(
				'{{WRAPPER}} .owl-nav button' => 'border-radius: {{SIZE}}{{UNIT}} !important;',
			),
			'condition'  => array(
				'as_banner_layer' => 'carousel',
				'show_nav'        => 'yes',
				'nav_type'        => array( '', 'rounded-nav', 'big-nav', 'nav-style-3' ),
			),
		)
	);

	$self->add_responsive_control(
		'slide_navs_h_origin',
		array(
			'type'       => Controls_Manager::SLIDER,
			'label'      => esc_html__( 'Nav Origin X Position', 'porto-functionality' ),
			'size_units' => array(
				'px',
				'rem',
				'%',
			),
			'selectors'  => array(
				'{{WRAPPER}} .owl-nav:not(.disabled)' => "{$left}: {{SIZE}}{{UNIT}} !important; {$right}: unset !important;",
			),
			'separator'  => 'before',
			'condition'  => array(
				'as_banner_layer' => 'carousel',
				'show_nav'        => 'yes',
				'nav_pos'         => array( 'custom-pos', 'show-nav-title' ),
			),
		)
	);

	$self->add_responsive_control(
		'slide_nav_v_pos',
		array(
			'type'       => Controls_Manager::SLIDER,
			'label'      => esc_html__( 'Nav Origin Y Position', 'porto-functionality' ),
			'size_units' => array(
				'px',
				'rem',
				'%',
			),
			'selectors'  => array(
				'{{WRAPPER}} .owl-nav' => 'top: {{SIZE}}{{UNIT}} !important;',
			),
			'condition'  => array(
				'as_banner_layer' => 'carousel',
				'show_nav'        => 'yes',
				'nav_pos'         => array( 'custom-pos', 'show-nav-title' ),
			),
		)
	);

	$self->add_responsive_control(
		'slide_nav_h_pos',
		array(
			'type'       => Controls_Manager::SLIDER,
			'label'      => esc_html__( 'Horizontal Nav Position', 'porto-functionality' ),
			'size_units' => array(
				'px',
				'rem',
				'%',
			),
			'range'      => array(
				'px' => array(
					'min' => -100,
					'max' => 100,
				),
				'rem' => array(
					'min' => -10,
					'max' => 10,
				),
				'%' => array(
					'min' => -100,
					'max' => 100,
				)
			),
			'selectors'  => array(
				'{{WRAPPER}} .owl-nav button.owl-prev'                                    => "{$left}: {{SIZE}}{{UNIT}} !important;",
				'{{WRAPPER}} .owl-carousel:not(.show-nav-title) .owl-nav button.owl-next' => "{$right}: {{SIZE}}{{UNIT}} !important;",
				'{{WRAPPER}}.owl-carousel:not(.show-nav-title) .owl-nav button.owl-next'  => "{$right}: {{SIZE}}{{UNIT}} !important;",
			),
			'condition'  => array(
				'as_banner_layer' => 'carousel',
				'show_nav'        => 'yes',
				'nav_pos'         => array( 'custom-pos', 'show-nav-title' ),
			),
		)
	);

	$self->add_control(
		'slide_nav_color',
		array(
			'label'     => esc_html__( 'Nav Color', 'porto-functionality' ),
			'type'      => Controls_Manager::COLOR,
			'selectors' => array(
				'{{WRAPPER}} .owl-nav button' => 'color: {{VALUE}} !important;',
			),
			'condition' => array(
				'as_banner_layer' => 'carousel',
				'show_nav'        => 'yes',
			),
		)
	);

	$self->add_control(
		'slide_nav_h_color',
		array(
			'label'     => esc_html__( 'Hover Nav Color', 'porto-functionality' ),
			'type'      => Controls_Manager::COLOR,
			'selectors' => array(
				'{{WRAPPER}} .owl-nav button:not(.disabled):hover' => 'color: {{VALUE}} !important;',
			),
			'condition' => array(
				'as_banner_layer' => 'carousel',
				'show_nav'        => 'yes',
			),
		)
	);

	$self->add_control(
		'slide_nav_bg_color',
		array(
			'label'     => esc_html__( 'Nav Background Color', 'porto-functionality' ),
			'type'      => Controls_Manager::COLOR,
			'selectors' => array(
				'{{WRAPPER}} .owl-nav button' => 'background-color: {{VALUE}} !important;',
			),
			'condition' => array(
				'as_banner_layer' => 'carousel',
				'show_nav'        => 'yes',
				'nav_type'        => array( '', 'big-nav', 'nav-style-3' ),
			),
		)
	);

	$self->add_control(
		'slide_nav_h_bg_color',
		array(
			'label'     => esc_html__( 'Hover Background Color', 'porto-functionality' ),
			'type'      => Controls_Manager::COLOR,
			'selectors' => array(
				'{{WRAPPER}} .owl-nav button:not(.disabled):hover' => 'background-color: {{VALUE}} !important;',
			),
			'condition' => array(
				'as_banner_layer' => 'carousel',
				'show_nav'        => 'yes',
				'nav_type'        => array( '', 'big-nav', 'nav-style-3' ),
			),
		)
	);

	$self->add_control(
		'slide_nav_br_color',
		array(
			'label'     => esc_html__( 'Nav Border Color', 'porto-functionality' ),
			'type'      => Controls_Manager::COLOR,
			'selectors' => array(
				'{{WRAPPER}} .owl-nav button' => 'border-color: {{VALUE}} !important;',
			),
			'condition' => array(
				'as_banner_layer' => 'carousel',
				'show_nav'        => 'yes',
				'nav_type'        => 'rounded-nav',
			),
		)
	);

	$self->add_control(
		'slide_nav_h_br_color',
		array(
			'label'     => esc_html__( 'Hover Nav Border Color', 'porto-functionality' ),
			'type'      => Controls_Manager::COLOR,
			'selectors' => array(
				'{{WRAPPER}} .owl-nav button:not(.disabled):hover' => 'border-color: {{VALUE}} !important;',
			),
			'condition' => array(
				'as_banner_layer' => 'carousel',
				'show_nav'        => 'yes',
				'nav_type'        => 'rounded-nav',
			),
		)
	);

	$self->add_control(
		'show_dots',
		array(
			'type'      => Controls_Manager::SWITCHER,
			'label'     => esc_html__( 'Show Dots', 'porto-functionality' ),
			'separator' => 'before',
			'condition' => array(
				'as_banner_layer' => 'carousel',
			),
		)
	);

	$self->add_control(
		'dots_style',
		array(
			'type'      => Controls_Manager::SELECT,
			'label'     => esc_html__( 'Dots Style', 'porto-functionality' ),
			'options'   => array(
				''             => esc_html__( 'Default', 'porto-functionality' ),
				'dots-style-1' => esc_html__( 'Circle inner dot', 'porto-functionality' ),
			),
			'condition' => array(
				'as_banner_layer' => 'carousel',
				'show_dots'       => 'yes',
			),
		)
	);

	$self->add_control(
		'dots_pos',
		array(
			'type'        => Controls_Manager::SELECT,
			'label'       => esc_html__( 'Dots Position', 'porto-functionality' ),
			'options'     => array(
				''                => esc_html__( 'Outside', 'porto-functionality' ),
				'nav-inside'      => esc_html__( 'Inside', 'porto-functionality' ),
				'show-dots-title' => esc_html__( 'Top beside title', 'porto-functionality' ),
				'custom-dots'     => esc_html__( 'Custom', 'porto-functionality' ),
			),
			'condition'   => array(
				'as_banner_layer' => 'carousel',
				'show_dots'       => 'yes',
			),
			'qa_selector' => '.owl-dots > .owl-dot:first-child',
		)
	);

	$self->add_responsive_control(
		'dots_size',
		array(
			'type'       => Controls_Manager::SLIDER,
			'label'      => esc_html__( 'Dots Size', 'porto-functionality' ),
			'size_units' => array(
				'px',
				'rem',
				'%',
			),
			'range'      => array(
				'px' => array(
					'step' => 1,
					'min'  => 1,
					'max'  => 60,
				),
			),
			'selectors'  => array(
				'.elementor-element-{{ID}} .owl-dots .owl-dot span' => 'width: {{SIZE}}{{UNIT}};height: {{SIZE}}{{UNIT}};',
				'.elementor-element-{{ID}} .dots-style-1 .owl-dot span::after' => 'border-width: calc( 2px + ( {{SIZE}}{{UNIT}} - 14px ) / 2 ) !important;',
			),
			'condition'  => array(
				'as_banner_layer' => 'carousel',
				'show_dots'       => 'yes',
			),
		)
	);
	$self->add_responsive_control(
		'dots_spacing',
		array(
			'type'       => Controls_Manager::SLIDER,
			'label'      => esc_html__( 'Dots Spacing', 'porto-functionality' ),
			'size_units' => array(
				'px',
				'rem',
				'%',
			),
			'selectors'  => array(
				'.elementor-element-{{ID}} .owl-carousel .owl-dots span' => 'margin: {{SIZE}}{{UNIT}};',
			),
			'condition'  => array(
				'as_banner_layer' => 'carousel',
				'show_dots'       => 'yes',
			),
		)
	);

	$self->add_responsive_control(
		'dots_visible',
		array(
			'label'       => esc_html__( 'Dots Visible', 'porto-functionality' ),
			'type'        => Controls_Manager::CHOOSE,
			'description' => esc_html__( 'Show or Hide the Dots', 'porto-functionality' ),
			'options'     => array(
				'block' => array(
					'title' => esc_html__( 'Show', 'porto-functionality' ),
					'icon'  => 'far fa-eye',
				),
				'none' => array(
					'title' => esc_html__( 'Hide', 'porto-functionality' ),
					'icon'  => 'far fa-eye-slash',
				),
			),
			'condition'   => array(
				'as_banner_layer' => 'carousel',
				'show_dots'       => 'yes',
			),
			'selectors'   => array(
				'.elementor-element-{{ID}} .owl-dots:not(.disabled)' => 'display:{{VALUE}} !important;',
			),
		)
	);

	$self->add_responsive_control(
		'dots_pos_top',
		array(
			'type'      => Controls_Manager::SLIDER,
			'label'     => esc_html__( 'Top Position', 'porto-functionality' ),
			'size_units'=> array(
				'px',
				'rem',
				'%',
			),
			'selectors' => array(
				'{{WRAPPER}} .owl-dots' => 'top: {{SIZE}}{{UNIT}} !important;',
			),
			'condition' => array(
				'as_banner_layer' => 'carousel',
				'dots_pos'        => 'custom-dots',
				'show_dots'       => 'yes',
			),
		)
	);

	$self->add_responsive_control(
		'dots_pos_bottom',
		array(
			'type'       => Controls_Manager::SLIDER,
			'label'      => esc_html__( 'Bottom Position', 'porto-functionality' ),
			'size_units' => array(
				'px',
				'rem',
				'%',
			),
			'selectors'  => array(
				'{{WRAPPER}} .owl-dots' => 'bottom: {{SIZE}}{{UNIT}} !important;',
			),
			'condition'  => array(
				'as_banner_layer' => 'carousel',
				'dots_pos'        => 'custom-dots',
				'show_dots'       => 'yes',
			),
		)
	);

	$self->add_responsive_control(
		'dots_pos_left',
		array(
			'type'       => Controls_Manager::SLIDER,
			'label'      => esc_html__( 'left Position', 'porto-functionality' ),
			'size_units' => array(
				'px',
				'rem',
				'%',
			),
			'selectors'  => array(
				'{{WRAPPER}} .owl-dots' => 'left: {{SIZE}}{{UNIT}} !important;',
			),
			'condition'  => array(
				'as_banner_layer' => 'carousel',
				'dots_pos'        => 'custom-dots',
				'show_dots'       => 'yes',
			),
		)
	);

	$self->add_responsive_control(
		'dots_pos_right',
		array(
			'type'       => Controls_Manager::SLIDER,
			'label'      => esc_html__( 'Right Position', 'porto-functionality' ),
			'size_units' => array(
				'px',
				'rem',
				'%',
			),
			'selectors'  => array(
				'{{WRAPPER}} .owl-dots' => 'right: {{SIZE}}{{UNIT}} !important;',
			),
			'condition'  => array(
				'as_banner_layer' => 'carousel',
				'dots_pos'        => 'custom-dots',
				'show_dots'       => 'yes',
			),
		)
	);

	$self->add_control(
		'dots_original',
		array(
			'label'     => esc_html__( 'Dots Translate X', 'porto-functionality' ),
			'type'      => 'image_choose',
			'options'   => array(
				'-50%' => 'transform/left.jpg',
				''     => 'transform/center.jpg',
				'50%'  => 'transform/right.jpg',
			),
			'condition' => array(
				'as_banner_layer' => 'carousel',
				'show_dots'       => 'yes',
				'dots_pos'        => 'custom-dots',
			),
			'default'   => '',
			'selectors' => array(
				'{{WRAPPER}} .owl-dots:not(.disabled)' => 'transform: translateX( {{VALUE}} ) !important;',
			),
		)
	);
			
	$self->add_control(
		'dots_br_color',
		array(
			'label'     => esc_html__( 'Dots Color', 'porto-functionality' ),
			'type'      => Controls_Manager::COLOR,
			'selectors' => array(
				'{{WRAPPER}} .owl-dot span' => 'border-color: {{VALUE}} !important;',
			),
			'separator' => 'before',
			'condition' => array(
				'as_banner_layer' => 'carousel',
				'show_dots'       => 'yes',
				'dots_style'      => 'dots-style-1',
			),
		)
	);

	$self->add_control(
		'dots_abr_color',
		array(
			'label'     => esc_html__( 'Dots Active Color', 'porto-functionality' ),
			'type'      => Controls_Manager::COLOR,
			'selectors' => array(
				'{{WRAPPER}} .owl-dot.active span, {{WRAPPER}} .owl-dot:hover span' => 'color: {{VALUE}} !important; border-color: {{VALUE}} !important;',
			),
			'condition' => array(
				'as_banner_layer' => 'carousel',
				'show_dots'       => 'yes',
				'dots_style'      => 'dots-style-1',
			),
		)
	);

	$self->add_control(
		'dots_bg_color',
		array(
			'label'     => esc_html__( 'Dots Color', 'porto-functionality' ),
			'type'      => Controls_Manager::COLOR,
			'selectors' => array(
				'{{WRAPPER}} .owl-dot span' => 'background-color: {{VALUE}} !important;',
			),
			'separator' => 'before',
			'condition' => array(
				'as_banner_layer' => 'carousel',
				'show_dots'       => 'yes',
				'dots_style'      => '',
			),
		)
	);

	$self->add_control(
		'dots_abg_color',
		array(
			'label'     => esc_html__( 'Dots Active Color', 'porto-functionality' ),
			'type'      => Controls_Manager::COLOR,
			'selectors' => array(
				'{{WRAPPER}} .owl-dot.active span, {{WRAPPER}} .owl-dot:hover span' => 'background-color: {{VALUE}} !important;',
			),
			'condition' => array(
				'as_banner_layer' => 'carousel',
				'show_dots'       => 'yes',
				'dots_style'      => '',
			),
		)
	);

	$self->add_control(
		'dots_align',
		array(
			'type'      => Controls_Manager::SELECT,
			'label'     => esc_html__( 'Dots Align', 'porto-functionality' ),
			'options'   => array(
				''                  => esc_html__( 'Right', 'porto-functionality' ),
				'nav-inside-center' => esc_html__( 'Center', 'porto-functionality' ),
				'nav-inside-left'   => esc_html__( 'Left', 'porto-functionality' ),
			),
			'condition' => array(
				'as_banner_layer' => 'carousel',
				'show_dots'       => 'yes',
				'dots_pos'        => 'nav-inside',
			),
		)
	);

	$self->add_control(
		'autoplay',
		array(
			'type'      => Controls_Manager::SWITCHER,
			'label'     => esc_html__( 'Auto Play', 'porto-functionality' ),
			'separator' => 'before',
			'condition' => array(
				'as_banner_layer' => 'carousel',
			),
		)
	);

	$self->add_control(
		'autoplay_timeout',
		array(
			'type'      => Controls_Manager::NUMBER,
			'label'     => esc_html__( 'Auto Play Timeout', 'porto-functionality' ),
			'default'   => 5000,
			'condition' => array(
				'as_banner_layer' => 'carousel',
				'autoplay'        => 'yes',
			),
		)
	);

	$self->add_control(
		'fullscreen',
		array(
			'type'      => Controls_Manager::SWITCHER,
			'label'     => esc_html__( 'Full Screen', 'porto-functionality' ),
			'condition' => array(
				'as_banner_layer' => 'carousel',
			),
		)
	);

	$self->add_control(
		'center',
		array(
			'type'        => Controls_Manager::SWITCHER,
			'label'       => esc_html__( 'Center Item', 'porto-functionality' ),
			'description' => esc_html__( 'This will add "center" class to the center item.', 'porto-functionality' ),
			'condition'   => array(
				'as_banner_layer' => 'carousel',
			),
		)
	);

	$self->add_control(
		'carousel_v_align',
		array(
			'label'       => esc_html__( 'Vertical Align', 'porto-functionality' ),
			'type'        => Controls_Manager::CHOOSE,
			'options'     => array(
				'flex-start'   => array(
					'title' => esc_html__( 'Top', 'porto-functionality' ),
					'icon'  => 'eicon-v-align-top',
				),
				'center'  => array(
					'title' => esc_html__( 'Middle', 'porto-functionality' ),
					'icon'  => 'eicon-v-align-middle',
				),
				'flex-end'     => array(
					'title' => esc_html__( 'Bottom', 'porto-functionality' ),
					'icon'  => 'eicon-v-align-bottom',
				),
			),
			'selectors' => array(
				'.elementor-element-{{ID}} .owl-stage' => 'display: flex;align-items: {{VALUE}};flex-wrap: wrap;',
			),
			'condition'   => array(
				'as_banner_layer' => 'carousel',
			),
		)
	);
	/* end carousel controls */

	$self->add_control(
		'banner_image',
		array(
			'type'        => Controls_Manager::MEDIA,
			'label'       => esc_html__( 'Banner Image', 'porto-functionality' ),
			'description' => esc_html__( 'Upload the image for this banner', 'porto-functionality' ),
			'condition'   => array(
				'as_banner_layer' => 'banner',
			),
			'dynamic'     => array(
				'active' => true,
			),
		)
	);

	$self->add_group_control(
		\Elementor\Group_Control_Image_Size::get_type(),
		array(
			'name'      => 'banner_image', // Usage: `{name}_size` and `{name}_custom_dimension`, in this case `image_size` and `image_custom_dimension`.
			'default'   => 'full',
			'separator' => 'none',
			'condition' => array(
				'as_banner_layer' => 'banner',
			),
		)
	);

	$self->add_control(
		'banner_color_bg2',
		array(
			'type'      => Controls_Manager::COLOR,
			'label'     => esc_html__( 'Background Color', 'porto-functionality' ),
			'selectors' => array(
				'{{WRAPPER}}' => 'background-color: {{VALUE}};',
			),
			'condition' => array(
				'as_banner_layer' => 'banner',
			),
		)
	);

	$self->add_control(
		'add_container',
		array(
			'type'      => Controls_Manager::SWITCHER,
			'label'     => esc_html__( 'Add Container', 'porto-functionality' ),
			'condition' => array(
				'as_banner_layer' => 'banner',
			),
		)
	);

	$self->add_responsive_control(
		'min_height',
		array(
			'label'      => esc_html__( 'Banner Min Height', 'porto-functionality' ),
			'type'       => Controls_Manager::SLIDER,
			'range'      => array(
				'px' => array(
					'step' => 1,
					'min'  => 1,
					'max'  => 1000,
				),
				'%'  => array(
					'step' => 1,
					'min'  => 1,
					'max'  => 100,
				),
				'vh' => array(
					'step' => 1,
					'min'  => 1,
					'max'  => 100,
				),
				'vw' => array(
					'step' => 1,
					'min'  => 1,
					'max'  => 100,
				),
				'em' => array(
					'step' => 1,
					'min'  => 1,
					'max'  => 100,
				),
			),
			'size_units' => array(
				'%',
				'px',
				'vh',
				'vw',
				'em',
			),
			'selectors'  => array(
				'{{WRAPPER}} > .porto-ibanner, {{WRAPPER}}.porto-ibanner' => 'min-height: {{SIZE}}{{UNIT}};',
			),
			'condition'  => array(
				'as_banner_layer' => 'banner',
			),
		)
	);
	$self->add_control(
		'hover_effect',
		array(
			'type'      => Controls_Manager::SELECT,
			'label'     => esc_html__( 'Hover Effect', 'porto-functionality' ),
			'options'   => array(
				''                   => esc_html__( 'None', 'porto-functionality' ),
				'porto-ibe-zoom'     => esc_html__( 'Zoom', 'porto-functionality' ),
				'porto-ibe-effect-1' => esc_html__( 'Effect 1', 'porto-functionality' ),
				'porto-ibe-effect-2' => esc_html__( 'Effect 2', 'porto-functionality' ),
				'porto-ibe-effect-3' => esc_html__( 'Effect 3', 'porto-functionality' ),
				'porto-ibe-effect-4' => esc_html__( 'Effect 4', 'porto-functionality' ),
			),
			'condition' => array(
				'as_banner_layer' => 'banner',
			),
		)
	);
	$self->add_control(
		'banner_effect',
		array(
			'type'      => Controls_Manager::SELECT,
			'label'     => esc_html__( 'Backgrund Effect', 'porto-functionality' ),
			'options'   => array(
				''                   => esc_html__( 'No', 'porto-functionality' ),
				'kenBurnsToRight'    => esc_html__( 'kenBurnsRight', 'porto-functionality' ),
				'kenBurnsToLeft'     => esc_html__( 'kenBurnsLeft', 'porto-functionality' ),
				'kenBurnsToLeftTop'  => esc_html__( 'kenBurnsLeftToTop', 'porto-functionality' ),
				'kenBurnsToRightTop' => esc_html__( 'kenBurnsRightToTop', 'porto-functionality' ),
			),
			'condition' => array(
				'as_banner_layer' => 'banner',
			),
		)
	);

	$self->add_responsive_control(
		'banner_effect_duration',
		array(
			'label'      => esc_html__( 'Background Effect Duration (s)', 'porto-functionality' ),
			'type'       => Controls_Manager::SLIDER,
			'size_units' => array(
				's',
			),
			'default'    => array(
				'size' => 30,
				'unit' => 's',
			),
			'range'      => array(
				's' => array(
					'step' => 1,
					'min'  => 0,
					'max'  => 60,
				),
			),
			'selectors'  => array(
				'.elementor-element-{{ID}} .banner-effect' => 'animation-duration:{{SIZE}}s;',
			),
			'condition'  => array(
				'as_banner_layer' => 'banner',
				'banner_effect!'  => '',
			),
		)
	);

	$self->add_control(
		'particle_effect',
		array(
			'type'      => Controls_Manager::SELECT,
			'label'     => esc_html__( 'Particle Effects', 'porto-functionality' ),
			'options'   => array(
				''         => esc_html__( 'No', 'porto-functionality' ),
				'snowfall' => esc_html__( 'Snowfall', 'porto-functionality' ),
				'sparkle'  => esc_html__( 'Sparkle', 'porto-functionality' ),
			),
			'condition' => array(
				'as_banner_layer' => 'banner',
			),
		)
	);

	$self->add_control(
		'banner_layer_divider',
		array(
			'type'      => Controls_Manager::DIVIDER,
			'condition' => array(
				'as_banner_layer' => 'banner',
			),
		)
	);
	$self->add_control(
		'banner_layer_heading',
		array(
			'label'     => esc_html__( 'Banner Layer Settings', 'porto-functionality' ),
			'type'      => Controls_Manager::HEADING,
			'condition' => array(
				'as_banner_layer' => 'banner',
			),
		)
	);

	$self->add_responsive_control(
		'width',
		array(
			'type'       => Controls_Manager::SLIDER,
			'label'      => esc_html__( 'Width', 'porto-functionality' ),
			'range'      => array(
				'%'  => array(
					'step' => 1,
					'min'  => 1,
					'max'  => 100,
				),
				'px' => array(
					'step' => 1,
					'min'  => 1,
					'max'  => 1000,
				),
				'vw' => array(
					'step' => 1,
					'min'  => 1,
					'max'  => 100,
				),
			),
			'size_units' => array(
				'%',
				'px',
				'vw',
			),
			'default'    => array(
				'unit' => '%',
			),
			'selectors'  => array(
				'{{WRAPPER}} .porto-ibanner-layer' => 'width: {{SIZE}}{{UNIT}};',
			),
			'condition'  => array(
				'as_banner_layer' => array( 'yes', 'banner' ),
			),
		)
	);

	$self->add_responsive_control(
		'width1',
		array(
			'type'                => Controls_Manager::SLIDER,
			'label'               => esc_html__( 'Width', 'porto-functionality' ),
			'description'         => esc_html__( 'This will not work if you use preset layout.', 'porto-functionality' ),
			'range'               => array(
				'%' => array(
					'step' => 1,
					'min'  => 1,
					'max'  => 100,
				),
			),
			'size_units'          => array(
				'%',
			),
			'default'             => array(
				'unit' => '%',
			),
			'selectors'           => array(
				'.elementor-element-{{ID}}.porto-grid-item' => 'width: {{SIZE}}%;',
			),
			'min_affected_device' => array(
				Elementor\Controls_Stack::RESPONSIVE_DESKTOP => Elementor\Controls_Stack::RESPONSIVE_TABLET,
				Elementor\Controls_Stack::RESPONSIVE_TABLET  => Elementor\Controls_Stack::RESPONSIVE_TABLET,
			),
			'condition'           => array(
				'as_banner_layer' => 'grid_item',
			),
		)
	);

	$self->add_responsive_control(
		'height',
		array(
			'type'       => Controls_Manager::SLIDER,
			'label'      => esc_html__( 'Height', 'porto-functionality' ),
			'range'      => array(
				'%'  => array(
					'step' => 1,
					'min'  => 1,
					'max'  => 100,
				),
				'px' => array(
					'step' => 1,
					'min'  => 1,
					'max'  => 1000,
				),
				'vw' => array(
					'step' => 1,
					'min'  => 1,
					'max'  => 100,
				),
			),
			'size_units' => array(
				'%',
				'px',
				'vw',
				'em',
			),
			'default'    => array(
				'unit' => '%',
			),
			'selectors'  => array(
				'{{WRAPPER}} .porto-ibanner-layer' => 'height: {{SIZE}}{{UNIT}};',
			),
			'condition'  => array(
				'as_banner_layer' => array( 'yes', 'banner' ),
			),
		)
	);

	$self->add_responsive_control(
		'horizontal',
		array(
			'type'        => Controls_Manager::SLIDER,
			'label'       => esc_html__( 'Horizontal Position (%)', 'porto-functionality' ),
			'range'       => array(
				'%' => array(
					'step' => 1,
					'min'  => -50,
					'max'  => 150,
				),
			),
			'default'     => array(
				'unit' => '%',
				'size' => 50,
			),
			'description' => esc_html__( '50 is center, 0 is left and 100 is right.', 'porto-functionality' ),
			'condition'   => array(
				'as_banner_layer' => array( 'yes', 'banner' ),
			),
		)
	);

	$self->add_responsive_control(
		'vertical',
		array(
			'type'        => Controls_Manager::SLIDER,
			'label'       => esc_html__( 'Vertical Position (%)', 'porto-functionality' ),
			'range'       => array(
				'%' => array(
					'step' => 1,
					'min'  => -50,
					'max'  => 150,
				),
			),
			'default'     => array(
				'unit' => '%',
				'size' => 50,
			),
			'description' => esc_html__( '50 is middle, 0 is top and 100 is bottom.', 'porto-functionality' ),
			'condition'   => array(
				'as_banner_layer' => array( 'yes', 'banner' ),
			),
		)
	);

	$self->add_responsive_control(
		'text_align1',
		array(
			'label'              => esc_html__( 'Text Align', 'elementor' ),
			'type'               => Controls_Manager::CHOOSE,
			'options'            => array(
				'left'    => array(
					'title' => esc_html__( 'Left', 'elementor' ),
					'icon'  => 'eicon-text-align-left',
				),
				'center'  => array(
					'title' => esc_html__( 'Center', 'elementor' ),
					'icon'  => 'eicon-text-align-center',
				),
				'right'   => array(
					'title' => esc_html__( 'Right', 'elementor' ),
					'icon'  => 'eicon-text-align-right',
				),
				'justify' => array(
					'title' => esc_html__( 'Justified', 'elementor' ),
					'icon'  => 'eicon-text-align-justify',
				),
			),
			'default'            => '',
			'selectors'          => array(
				'{{WRAPPER}} .porto-ibanner-layer' => 'text-align: {{VALUE}};',
			),
			'frontend_available' => true,
			'condition'          => array(
				'as_banner_layer' => array( 'yes', 'banner' ),
			),
		)
	);

	$self->add_control(
		'css_anim_type',
		array(
			'label'     => esc_html__( 'CSS Animation', 'porto-functionality' ),
			'type'      => Controls_Manager::ANIMATION,
			'condition' => array(
				'as_banner_layer' => array( 'yes', 'banner' ),
			),
		)
	);

	$self->add_control(
		'css_anim_delay',
		array(
			'label'     => esc_html__( 'CSS Animation Delay (ms)', 'porto-functionality' ),
			'type'      => Controls_Manager::NUMBER,
			'step'      => 50,
			'min'       => 0,
			'max'       => 8000,
			'condition' => array(
				'as_banner_layer' => array( 'yes', 'banner' ),
				'css_anim_type!'  => '',
			),
		)
	);

	$self->add_control(
		'css_anim_duration',
		array(
			'label'     => esc_html__( 'CSS Animation Duration (ms)', 'porto-functionality' ),
			'type'      => Controls_Manager::NUMBER,
			'step'      => 100,
			'min'       => 100,
			'max'       => 4000,
			'condition' => array(
				'as_banner_layer' => array( 'yes', 'banner' ),
				'css_anim_type!'  => '',
			),
		)
	);

	$self->add_control(
		'is_half_right',
		array(
			'type'      => Controls_Manager::SWITCHER,
			'label'     => esc_html__( 'Is Right Aligned?', 'porto-functionality' ),
			'condition' => array(
				'as_banner_layer' => 'is_half',
			),
		)
	);

	$self->add_control(
		'animate_in',
		array(
			'label'       => esc_html__( 'Item Animation In', 'porto-functionality' ),
			'label_block' => true,
			'placeholder' => 'fadeIn',
			'type'        => Controls_Manager::TEXT,
			'condition'   => array(
				'as_banner_layer' => 'carousel',
			),
		)
	);

	$self->add_control(
		'animate_out',
		array(
			'label'       => esc_html__( 'Item Animation Out', 'porto-functionality' ),
			'label_block' => true,
			'placeholder' => 'fadeOut',
			'type'        => Controls_Manager::TEXT,
			'condition'   => array(
				'as_banner_layer' => 'carousel',
			),
		)
	);

	$self->add_control(
		'tab_description',
		array(
			'label'     => sprintf(esc_html__( 'Read this %sarticle%s to find out more about this settings.', 'porto-functionality' ), '<a href="https://www.portotheme.com/wordpress/porto/documentation/section-tab/" target="_blank">','</a>' ) ,
			'type'      => Controls_Manager::HEADING,
			'condition' => array(
				'as_banner_layer' => 'tab_content',
			),
		)
	);

	$self->add_control(
		'tab_content_title',
		array(
			'type'      => Controls_Manager::TEXT,
			'label'     => esc_html__( 'Nav Title', 'porto-functionality' ),
			'default'   => esc_html__( 'Nav Title', 'porto-functionality' ),
			'condition' => array(
				'as_banner_layer' => 'tab_content',
			),
		)
	);

	$self->add_control(
		'tab_navs_up_icon_pos',
		array(
			'label'       => esc_html__( 'Navs Position', 'porto-functionality' ),
			'description' => esc_html__( 'Controls alignment of nav titles. Choose from Start, Center, End.', 'porto-functionality' ),
			'type'        => Controls_Manager::CHOOSE,
			'options'     => array(
				'left'   => array(
					'title' => esc_html__( 'Start', 'porto-functionality' ),
					'icon'  => 'eicon-text-align-left',
				),
				'center' => array(
					'title' => esc_html__( 'Center', 'porto-functionality' ),
					'icon'  => 'eicon-text-align-center',
				),
				'right'  => array(
					'title' => esc_html__( 'End', 'porto-functionality' ),
					'icon'  => 'eicon-text-align-right',
				),
			),
			'selectors'   => array(
				'.section-tabs .nav-item[pane-id="{{ID}}"] .nav-link' => 'text-align: {{VALUE}};',
				'.section-tabs .nav-item[pane-id="{{ID}}"]:not(.nav-icon-up) .nav-link' => 'justify-content: {{VALUE}};',
			),
			'condition'   => array(
				'as_banner_layer' => 'tab_content',
			),
		)
	);

	$self->add_control(
		'tab_content_icon',
		array(
			'type'                   => Controls_Manager::ICONS,
			'label'                  => __( 'Icon', 'porto-functionality' ),
			'fa4compatibility'       => 'icon',
			'skin'                   => 'inline',
			'exclude_inline_options' => array( 'svg' ),
			'label_block'            => false,
			'condition'              => array(
				'as_banner_layer' => 'tab_content',
			),
		)
	);

	$self->add_control(
		'tab_icon_pos',
		array(
			'label'       => esc_html__( 'Nav Type With Icon', 'porto-functionality' ),
			'description' => esc_html__( 'Choose icon position of each tab nav. Choose from Left, Up, Right, Bottom.', 'porto-functionality' ),
			'default'     => 'left',
			'label_block' => false,
			'type'        => Controls_Manager::CHOOSE,
			'options'     => array(
				'up'   => array(
					'title' => esc_html__( 'Up', 'porto-functionality' ),
					'icon'  => 'eicon-v-align-top',
				),
				'left' => array(
					'title' => esc_html__( 'Left', 'porto-functionality' ),
					'icon'  => 'eicon-h-align-left',
				),
			),
			'condition'   => array(
				'as_banner_layer'          => 'tab_content',
				'tab_content_icon[value]!' => '',
			),
		)
	);

	$self->add_control(
		'tab_icon_space',
		array(
			'label'       => esc_html__( 'Nav Icon Spacing (px)', 'porto-functionality' ),
			'description' => esc_html__( 'Controls spacing between icon and label in nav item.', 'porto-functionality' ),
			'type'        => Controls_Manager::SLIDER,
			'range'       => array(
				'px' => array(
					'step' => 1,
					'min'  => 1,
					'max'  => 50,
				),
			),
			'condition'   => array(
				'as_banner_layer'          => 'tab_content',
				'tab_content_icon[value]!' => '',
			),
			'selectors'   => array(
				'.section-tabs .nav-item.nav-icon-up[pane-id="{{ID}}"] .nav-link i' => 'margin-bottom: {{SIZE}}px;',
				'.section-tabs .nav-item:not(.nav-icon-up)[pane-id="{{ID}}"] .nav-link i' => 'margin-right: {{SIZE}}px;',
			),
		)
	);

	$self->add_control(
		'tab_icon_size',
		array(
			'label'       => esc_html__( 'Nav Icon Size (px)', 'porto-functionality' ),
			'description' => esc_html__( 'Controls icon size of tab item header.', 'porto-functionality' ),
			'type'        => Controls_Manager::SLIDER,
			'range'       => array(
				'px' => array(
					'step' => 1,
					'min'  => 1,
					'max'  => 50,
				),
			),
			'condition'   => array(
				'as_banner_layer'          => 'tab_content',
				'tab_content_icon[value]!' => '',
			),
			'selectors'   => array(
				'.section-tabs .nav-item[pane-id="{{ID}}"] .nav-link i' => 'font-size: {{SIZE}}px;',
			),
		)
	);

	/* Start Split Layer */
	$self->add_control(
		'split_description',
		array(
			'type'      => Controls_Manager::HEADING,
			'label'     => sprintf( esc_html__( 'The Hover Split option of the parent section should be selected. Read this %sarticle%s to find out more about this settings.', 'porto-functionality' ), '<a href="https://www.portotheme.com/wordpress/porto/documentation/how-to-use-hover-split-effect/" target="_blank">','</a>' ),
			'condition' => array(
				'as_banner_layer' => array( 'split_layer' ),
			),
		)
	);
	/* End Split Layer */

	$self->add_control(
		'porto_el_cls',
		array(
			'label'     => esc_html__( 'Extra Class', 'porto-functionality' ),
			'type'      => Controls_Manager::TEXT,
			'condition' => array(
				'as_banner_layer!' => '',
			),
		)
	);

	/* start sticky options */

	$self->add_control(
		'container_selector',
		array(
			'label'       => esc_html__( 'Container Selector', 'porto-functionality' ),
			'description' => esc_html__( 'Closest parent element which contains sticky and background elements.', 'porto-functionality' ),
			'type'        => Controls_Manager::TEXT,
			'condition'   => array(
				'as_banner_layer' => array( 'sticky' ),
			),
		)
	);
	$self->add_control(
		'min_width',
		array(
			'label'     => esc_html__( 'Min Width (unit: px)', 'porto-functionality' ),
			'type'      => Controls_Manager::NUMBER,
			'min'       => 320,
			'max'       => 1920,
			'step'      => 1,
			'default'   => 768,
			'condition' => array(
				'as_banner_layer' => array( 'sticky' ),
			),
		)
	);
	$self->add_control(
		'offset_top',
		array(
			'label'       => esc_html__( 'Top (unit: px)', 'porto-functionality' ),
			'description' => esc_html__( 'Top position when active', 'porto-functionality' ),
			'type'        => Controls_Manager::NUMBER,
			'min'         => 0,
			'max'         => 500,
			'step'        => 1,
			'default'     => 110,
			'condition'   => array(
				'as_banner_layer' => array( 'sticky' ),
			),
		)
	);
	$self->add_control(
		'offset_bottom',
		array(
			'label'       => esc_html__( 'Bottom (unit: px)', 'porto-functionality' ),
			'description' => __( 'Bottom position when active', 'porto-functionality' ),
			'type'        => Controls_Manager::NUMBER,
			'min'         => 0,
			'max'         => 500,
			'step'        => 1,
			'default'     => 0,
			'condition'   => array(
				'as_banner_layer' => array( 'sticky' ),
			),
		)
	);
	$self->add_control(
		'active_class',
		array(
			'label'     => esc_html__( 'Active Class', 'porto-functionality' ),
			'type'      => Controls_Manager::TEXT,
			'condition' => array(
				'as_banner_layer' => array( 'sticky' ),
			),
		)
	);
	$self->add_control(
		'autofit',
		array(
			'label'     => esc_html__( 'Auto Fit', 'porto-functionality' ),
			'type'      => Controls_Manager::SWITCHER,
			'condition' => array(
				'as_banner_layer' => array( 'sticky' ),
			),
		)
	);
	/* end sticky options */

	$self->end_controls_section();

	$self->start_controls_section(
		'section_column_floating_fields',
		array(
			'label' => esc_html__( 'Floating Animation', 'porto-functionality' ),
			'tab'   => Controls_Manager::TAB_LAYOUT,
		)
	);

	$floating_options = porto_update_vc_options_to_elementor( porto_shortcode_floating_fields() );
	$floating_options['floating_transition']['condition']['floating_start_pos'] = $floating_options['floating_horizontal']['condition']['floating_start_pos'] = $floating_options['floating_duration']['condition']['floating_start_pos'] = array( 'none', 'top', 'bottom' );

	$floating_options['floating_speed']['condition']['floating_circle'] = $floating_options['floating_transition']['condition']['floating_circle'] = $floating_options['floating_horizontal']['condition']['floating_circle'] = $floating_options['floating_duration']['condition']['floating_circle'] = '';

	foreach ( $floating_options as $key => $opt ) {
		unset( $opt['condition']['animation_type'] );
		$self->add_control( $key, $opt );
	}

	$self->end_controls_section();
}

function porto_elementor_print_column_template( $content, $self ) {
	$legacy_enabled = ! porto_elementor_if_dom_optimization();
	ob_start();
	?>
	<#
		let extra_class = '',
			extra_style = '',
			extra_class1 = '',
			extra_attr = '',
			extra_widget_attr = '',
			before_html = '',
			extra_widget_style = '';
		if ( 'yes' == settings.as_banner_layer || 'banner' == settings.as_banner_layer ) {
			extra_class1 += ' porto-ibanner-layer';
			
			function porto_column_banner_pos( horizontal, vertical, id, breakpoint = false ) {
				if ( '' === horizontal && '' === vertical ) {
					return '';
				}
				let extra_widget_style = '';
				if ( breakpoint ) {
					extra_widget_style += ' @media(max-width: ' + breakpoint + ') { ';
				}
				extra_widget_style += ' .elementor-element-' + id + ' .porto-ibanner-layer {';
				if ( '' !== horizontal ) {
					if (50 == Number(horizontal)) {
						if (50 == Number(vertical) ) {
							extra_widget_style += 'left: 50%;right: unset;top: 50%;bottom: unset;transform: translate(-50%, -50%);';
						} else {
							extra_widget_style += 'left: 50%;right: unset;transform: translateX(-50%);';
						}
					} else if (50 > Number(horizontal)) {
						extra_widget_style += 'left:' + Number(horizontal) + '%;right: unset;';
					} else {
						extra_widget_style += 'right:' + (100 - Number(horizontal)) + '%;left: unset;';
					}
				}
				if ( '' !== vertical ) {
					if (50 == Number(vertical)) {
						if ( 50 != Number(horizontal) ) {
							extra_widget_style += 'top: 50%;bottom: unset;transform: translateY(-50%);';
						}
					} else if (50 > Number(vertical)) {
						extra_widget_style += 'top:' + Number(vertical) + '%; bottom: unset;';
					} else {
						extra_widget_style += 'bottom:' + (100 - Number(vertical)) + '%; top: unset;';
					}
				}

				if ( breakpoint ) {
					if ( ( '' !== horizontal || '' !== vertical ) && 50 != Number(horizontal) && 50 != Number(vertical) ) {
						extra_widget_style += ' transform: none;';
					}
					extra_widget_style += ' }';
				}
				extra_widget_style += '}';
				return extra_widget_style;
			}

			// Desktop
			extra_widget_style += porto_column_banner_pos( settings.horizontal.size, settings.vertical.size, id );
			// Tablet
			extra_widget_style += porto_column_banner_pos( settings.horizontal_tablet.size, settings.vertical_tablet.size, id, '991px' );
			// Mobile
			extra_widget_style += porto_column_banner_pos( settings.horizontal_mobile.size, settings.vertical_mobile.size, id, '767px' );

			if ( settings.css_anim_type ) {
				extra_widget_attr += ' data-appear-animation="' + settings.css_anim_type + '"';
				if ( settings.css_anim_type ) {
					extra_widget_attr += ' data-appear-animation-delay="' + Number( settings.css_anim_delay ) + '"';
				}
				if ( settings.css_anim_duration ) {
					extra_widget_attr += ' data-appear-animation-duration="' + Number( settings.css_anim_duration ) + '"';
				}
			}

			if ( 'banner' == settings.as_banner_layer ) {
				extra_widget_attr += ' data-wrap_cls="porto-ibanner' + ( settings.hover_effect ? ' ' + settings.hover_effect : '' ) + '"';
				if ( 'yes' == settings.add_container ) {
					extra_widget_attr += ' data-add_container="1"';
				}

				var image = {
						id: settings.banner_image.id,
						url: settings.banner_image.url,
						size: settings.banner_image_size,
						dimension: settings.banner_image_custom_dimension,
						model: view.getEditModel()
					},
					image_url = elementor.imagesManager.getImageUrl( image );

				// Background and particle effect
				if( '' !== settings.banner_effect || '' !== settings.particle_effect ) {
					let banner_effectwrapClass = 'banner-effect-wrapper';
					let banner_effectClass = 'banner-effect ';
					let particle_effectClass   = 'particle-effect ';
					if ( '' !== settings.banner_effect ) {
						banner_effectClass += settings.banner_effect ;
					}
					if ( '' !== settings.particle_effect ) {
						particle_effectClass += settings.particle_effect;
					}
					if ( settings.banner_image.url ) {
						let banner_img = '';
						if ( ! settings.particle_effect || settings.banner_effect ) {
							banner_img = 'background-image: url(' + image_url + '); background-size: cover;background-position: center;';
						}
						#>
						<div class="{{ banner_effectwrapClass }}">
						<div class="{{ banner_effectClass }}" style="{{ banner_img }}">
						<# if ( '' !== settings.particle_effect ) { #>
							<div class="{{ particle_effectClass }}"></div>
						<# } #>
						</div>
						</div>
					<# }
				}

				settings.gap = 'no';
				if ( image_url ) {
					#>
					<img class="porto-ibanner-img{{ '' !== settings.banner_effect ? ' invisible' : '' }}" src="{{ image_url }}" />
					<#
				}
			}
		} else if ( 'grid_item' == settings.as_banner_layer && settings.width1 ) {
			extra_style += ' data-width=' + JSON.stringify( settings.width1 );
		} else if ( 'carousel' == settings.as_banner_layer ) {
			let extra_options = {};
			settings.gap = 'no';
			extra_class1 += ' owl-carousel porto-carousel has-ccols';

			if ( 'yes' == settings.enable_flick ) {
				extra_class1 += ' flick-carousel';
			}
			
			if ( 'yes' == settings.show_nav ) {
				if ( settings.nav_pos ) {
					extra_class1 += ' ' + settings.nav_pos;
				}
				if ( settings.nav_type ) {
					extra_class1 += ' ' + settings.nav_type;
				}
				if ( 'yes' == settings.show_nav_hover ) {
					extra_class1 += ' show-nav-hover';
				}
			}

			if ( 'yes' == settings.show_dots ) {
				if ( settings.dots_style ) {
					extra_class1 +=  ' ' + settings.dots_style;
				}
				if ( settings.dots_pos ) {
					extra_class1 +=  ' ' + settings.dots_pos;
					if ( 'nav-inside' == settings.dots_pos ) {
						extra_class1 += ' ' + settings.dots_align;
					}
				}
			}

			if ( settings.item_margin ) {
				extra_class1 += ' has-ccols-spacing';
			}

		
			if ( Number( settings.items_tablet.size ) > 1 ) {
				extra_class1 += ' ccols-md-' + Number( settings.items_tablet.size );
			}
			if ( Number( settings.items_mobile.size ) > 1 ) {
				extra_class1 += ' ccols-' + Number( settings.items_mobile.size );
			} else {
				extra_class1 += ' ccols-1';
			}

			extra_options["nav"] = 'yes' == settings.show_nav;
			extra_options["dots"] = 'yes' == settings.show_dots;
			extra_options["items"] = Number( settings.items.size );
			extra_options["margin"] = Number( settings.item_margin );
			extra_options["themeConfig"] = true;
			extra_options["responsive"] = {};
			extra_options["responsive"][elementorFrontend.config.breakpoints['xs']] = Math.max(Number( settings.items_mobile.size ), 1);
			extra_options["responsive"][elementorFrontend.config.breakpoints['sm']] = Math.max(Number( settings.items_tablet.size ) - 1, Number( settings.items_mobile.size ), 1);
			extra_options["responsive"][elementorFrontend.config.breakpoints['md']] = Math.max(Number( settings.items_tablet.size ), 1);
			if( settings.set_loop && 'yes' == settings.set_loop ){
				extra_options["loop"] = true;
			} else {
				extra_options["loop"] = false;
			}
			
			if( settings.disable_mouse_drag && 'yes' == settings.disable_mouse_drag){
				extra_options["mouseDrag"] = false;
				extra_options["touchDrag"] = false;
			} else {
				extra_options["mouseDrag"] = true;
				extra_options["touchDrag"] = true;
			}
			if( settings.animate_out ){
				extra_options["animateOut"] = settings.animate_out;
			}
			if(settings.animate_in ){
				extra_options["animateIn"] = settings.animate_in;
			}
			let is_lg = false;
			if (Math.max(Number( settings.items.size ), 1) > Math.max(Number( settings.items_tablet.size ), 1) + 1) {
				extra_options["responsive"][elementorFrontend.config.breakpoints['lg']] = Math.max(Number( settings.items.size ) - 1, 1);
				extra_options["responsive"][elementorFrontend.config.breakpoints['xl']] = Math.max(Number( settings.items.size ), 1);
				extra_class1 += ' ccols-lg-' + Math.max(Number( settings.items.size ) - 1, 1);
				extra_class1 += ' ccols-sl-' + Math.max(Number( settings.items.size ), 1);
				is_lg = true;
			} else {
				extra_options["responsive"][elementorFrontend.config.breakpoints['lg']] = Math.max(Number( settings.items.size ), 1);
			}
			if ( ! is_lg ) {
				if ( Number( settings.items.size ) > 1 ) {
					extra_class1 += ' ccols-lg-' + Number( settings.items.size );
				}
			}
			if ('yes' == settings.autoplay) {
				extra_options['autoplay']           = true;
				extra_options['autoplayTimeout']    = Number( settings.autoplay_timeout );
				extra_options['autoplayHoverPause'] = true;
			} else {
				extra_options['autoplay'] = false;
			}
			if ( 'yes' == settings.fullscreen ) {
				extra_class1               += ' fullscreen-carousel';
				extra_options['fullscreen'] = true;
			}
			if ( 'yes' == settings.center ) {
				extra_options['center'] = true;
			}
			if (settings.stage_padding) {
				extra_options["stagePadding"] = Number(settings.stage_padding);
			}

			extra_attr += ' data-plugin-options=' + JSON.stringify( extra_options );
		} else if ('is_half' == settings.as_banner_layer) {
			extra_class += ' col-half-section';
			if (settings.is_half_right) {
				extra_class += ' col-half-section-right';
			}
			if (100 === Number(settings._inline_size_tablet)) {
				extra_class += ' col-fullwidth-md';
			}
		} else if ( 'sticky' == settings.as_banner_layer ) {
			let extra_options = {};
			extra_class += ' porto-sticky';
			extra_options['containerSelector'] = settings['container_selector'] ? settings['container_selector'] : '';
			extra_options['minWidth']          = settings['min_width'] ? Number( settings['min_width'] ) : 767;
			extra_options['padding']           = {};
			extra_options['padding']['top']    = '' !== settings['offset_top'] ? Number( settings['offset_top'] ) : 110;
			extra_options['padding']['bottom'] = settings['offset_bottom'] ? Number( settings['offset_bottom'] ) : 0;
			extra_options['activeClass']       = settings['active_class'] ? settings['active_class'] : 'sticky-active';
			if ( settings['autofit'] ) {
				extra_options['autoFit'] = true;
			}
			extra_style += ' data-plugin-options=' + JSON.stringify( extra_options );
		} else if( 'tab_content' == settings.as_banner_layer ) {
			if( settings.tab_content_title ){
				extra_attr += ' data-tab-title="' + settings.tab_content_title + '"';
			}
			if ( settings.tab_content_icon && settings.tab_content_icon.value ) {
				extra_attr += ' data-tab-icon="' + settings.tab_content_icon.value + '"';
			}
			if( settings.tab_icon_pos ){
				extra_attr += ' data-tab-pos="' + settings.tab_icon_pos + '"';
			}
		} else if ( 'split_layer' == settings.as_banner_layer ) {
			extra_class += ' split-slide';
		}

		if ( 'yes' == settings.content_collapse ) {
			extra_class += ' content-collapse-wrap';
		}
		if (settings.parallax_speed.size) {
			extra_class += ' porto-parallax';
			extra_style += ' data-parallax-speed=' + parseFloat(settings.parallax_speed.size);

			if (settings.parallax_horizontal) {
				extra_style += ' data-parallax-type=' + 'horizontal';
			}
			if ( settings.parallax_scale ) {
				if ( settings.parallax_scale_invert ) {
					extra_style += ' data-parallax-scale=' + 'invert';
				} else {
					extra_style += ' data-parallax-scale';
				}
			}
		}
		if ( typeof porto_elementor_add_floating_options != 'undefined' ) {
			extra_attr += porto_elementor_add_floating_options( settings );
		}

		if ( settings.as_banner_layer && settings.porto_el_cls ) {
			if ( 'carousel' == settings.as_banner_layer || 'yes' == settings.as_banner_layer || 'banner' == settings.as_banner_layer ) {
				extra_class1 += ' ' + settings.porto_el_cls;
			} else {
				extra_class += ' ' + settings.porto_el_cls;
			}
		}

		if (!settings.as_banner_layer) {
			before_html += '<div class="elementor-background-overlay"></div>';
		}
	#>
	<?php if ( $legacy_enabled ) : ?>
	<div class="elementor-column-wrap{{ extra_class }}"{{{ extra_style }}}>
		<# if ( extra_widget_style ) { #>
			<style>{{{extra_widget_style}}}</style>
		<# } #>
		<div class="elementor-background-overlay"></div>
		<div class="elementor-widget-wrap{{ extra_class1 }}"{{{ extra_attr }}}{{{ extra_widget_attr }}}></div>
	</div>
	<?php else : ?>
		<div class="elementor-widget-wrap{{ extra_class }}{{ extra_class1 }}"{{{ extra_style }}}{{{ extra_attr }}}{{{ extra_widget_attr }}}>
		{{{ before_html }}}
		<# if ( extra_widget_style ) { #>
			<style>{{{extra_widget_style}}}</style>
		<# } #>
	</div>
		<?php
	endif;
	// Porto Column Additional shortcode
	?>
	<div class="porto-el-column-shortcodes"><a href="#" class="porto-el-column-shortcode porto-additional-option" title="Column Additional Settings"><i class="Simple-Line-Icons-settings"></i></a></div>
	<?php
	return ob_get_clean();
}

function porto_elementor_column_add_custom_attrs( $self ) {
	$legacy_enabled = ! porto_elementor_if_dom_optimization();

	$settings = $self->get_settings_for_display();

	if ( 'yes' == $settings['as_banner_layer'] || 'banner' == $settings['as_banner_layer'] ) {
		global $porto_banner_add_container;
		if ( ! empty( $porto_banner_add_container ) ) {
			$self->add_render_attribute( '_wrapper', 'class', 'container' );
		}
		$extra_class = array( 'porto-ibanner-layer' );

		if ( isset( $settings['porto_el_cls'] ) && $settings['porto_el_cls'] ) {
			$extra_class[] = esc_attr( $settings['porto_el_cls'] );
		}
		$wrapper_name = '_widget_wrapper';
		$self->add_render_attribute( $wrapper_name, 'class', $extra_class );

		if ( isset( $settings['css_anim_type'] ) && $settings['css_anim_type'] ) {
			$self->add_render_attribute( $wrapper_name, 'data-appear-animation', esc_attr( $settings['css_anim_type'] ) );
			if ( ! empty( $settings['css_anim_delay'] ) ) {
				$self->add_render_attribute( $wrapper_name, 'data-appear-animation-delay', absint( $settings['css_anim_delay'] ) );
			}
			if ( ! empty( $settings['css_anim_duration'] ) ) {
				$self->add_render_attribute( $wrapper_name, 'data-appear-animation-duration', absint( $settings['css_anim_duration'] ) );
			}
		}

		if ( 'banner' == $settings['as_banner_layer'] ) {
			$self->add_render_attribute( '_wrapper', 'class', 'porto-ibanner' . ( ! empty( $settings['hover_effect'] ) ? ' ' . $settings['hover_effect'] : '' ) );
		}
	} elseif ( 'carousel' == $settings['as_banner_layer'] ) {
		$items        = 0 < intval( $settings['items']['size'] ) ? $settings['items']['size'] : 1;
		$items_tablet = isset( $settings['items_tablet'] ) && 0 < intval( $settings['items_tablet']['size'] ) ? $settings['items_tablet']['size'] : 1;
		$items_mobile = isset( $settings['items_mobile'] ) && 0 < intval( $settings['items_mobile']['size'] ) ? $settings['items_mobile']['size'] : 1;

		$settings['gap'] = 'no';
		$extra_class     = array( 'porto-carousel', 'owl-carousel', 'has-ccols' );
		if ( 'yes' == $settings['enable_flick'] ) {
			$extra_class[] = 'flick-carousel';
		}
		if ( 'yes' == $settings['show_nav'] ) {
			if ( $settings['nav_pos'] ) {
				$extra_class[] = esc_attr( $settings['nav_pos'] );
			}
			if ( $settings['nav_type'] ) {
				$extra_class[] = esc_attr( $settings['nav_type'] );
			}
			if ( 'yes' == $settings['show_nav_hover'] ) {
				$extra_class[] = 'show-nav-hover';
			}
		}

		if ( 'yes' == $settings['show_dots'] ) {
			if ( $settings['dots_style'] ) {
				$extra_class[] = esc_attr( $settings['dots_style'] );
			}
			if ( $settings['dots_pos'] ) {
				$extra_class[] = esc_attr( $settings['dots_pos'] );
				if ( 'nav-inside' == $settings['dots_pos'] ) {
					$extra_class[] = esc_attr( $settings['dots_align'] );
				}
			}
		}

		if ( $settings['item_margin'] ) {
			$extra_class[] = 'has-ccols-spacing';
		}


		if ( (int) $items_tablet > 1 ) {
			$extra_class[] = 'ccols-md-' . intval( $items_tablet );
		}
		if ( (int) $items_mobile > 1 ) {
			$extra_class[] = 'ccols-' . intval( $items_mobile );
		} else {
			$extra_class[] = 'ccols-1';
		}

		$extra_options                = array();
		$extra_options['margin']      = '' !== $settings['item_margin'] ? (int) $settings['item_margin'] : 0;
		$extra_options['items']       = (int) $items;
		$extra_options['nav']         = 'yes' == $settings['show_nav'];
		$extra_options['dots']        = 'yes' == $settings['show_dots'];
		$extra_options['themeConfig'] = true;
		if ( isset( $settings['set_loop'] ) ) {
			if ( 'yes' == $settings['set_loop'] ) {
				$extra_options['loop'] = true;
			} else {
				$extra_options['loop'] = false;
			}
		}
		if ( isset( $settings['disable_mouse_drag'] ) && 'yes' == $settings['disable_mouse_drag'] ) {
			$extra_options['mouseDrag'] = false;
			$extra_options['touchDrag'] = false;
		} else {
			$extra_options['mouseDrag'] = true;
			$extra_options['touchDrag'] = true;
		}
		if ( ! empty( $settings['animate_out'] ) ) {
			$extra_options['animateOut'] = $settings['animate_out'];
		}
		if ( ! empty( $settings['animate_in'] ) ) {
			$extra_options['animateIn'] = $settings['animate_in'];
		}
		$breakpoints = Elementor\Core\Responsive\Responsive::get_breakpoints();
		$is_lg = false;
		if ( 1 !== intval( $items ) ) {
			$extra_options['responsive'] = array( $breakpoints['xs'] => (int) $items_mobile );

			$items_sm = $items_tablet - 1 >= $items_mobile ? $items_tablet - 1 : $items_mobile;
			if ( (int) $items_sm !== (int) $items_mobile ) {
				$extra_options['responsive'][ $breakpoints['sm'] ] = (int) $items_sm;
			}
			if ( (int) $items_tablet !== (int) $items_sm ) {
				$extra_options['responsive'][ $breakpoints['md'] ] = (int) $items_tablet;
			}
			if ( (int) $items !== (int) $items_tablet ) {
				if ( (int) $items > (int) $items_tablet + 1 ) {
					$extra_options['responsive'][ $breakpoints['lg'] ] = (int) $items_tablet + 1;
					$extra_options['responsive'][ $breakpoints['xl'] ] = (int) $items;
					$extra_class[] = 'ccols-sl-' . intval( $items );
					$extra_class[] = 'ccols-lg-' . ( (int) $items_tablet + 1 );
					$is_lg = true;
				} else {
					$extra_options['responsive'][ $breakpoints['lg'] ] = (int) $items;
				}
			}
		}
		if ( ! $is_lg ) {
			if ( (int) $items > 1 ) {
				$extra_class[] = 'ccols-lg-' . intval( $items );
			}
		}
		if ( 'yes' == $settings['autoplay'] ) {
			$extra_options['autoplay']           = true;
			$extra_options['autoplayTimeout']    = (int) $settings['autoplay_timeout'];
			$extra_options['autoplayHoverPause'] = true;
		} else {
			$extra_options['autoplay'] = false;
		}
		if ( isset( $settings['fullscreen'] ) && 'yes' == $settings['fullscreen'] ) {
			$extra_class[]               = 'fullscreen-carousel';
			$extra_options['fullscreen'] = true;
		}
		if ( isset( $settings['center'] ) && 'yes' == $settings['center'] ) {
			$extra_options['center'] = true;
		}
		if ( ! empty( $settings['stage_padding'] ) ) {
			$extra_options['stagePadding'] = (int) $settings['stage_padding'];
		}

		if ( isset( $settings['porto_el_cls'] ) && $settings['porto_el_cls'] ) {
			$extra_class[] = esc_attr( $settings['porto_el_cls'] );
		}

		$self->add_render_attribute( '_widget_wrapper', 'class', $extra_class );
		$self->add_render_attribute( '_widget_wrapper', 'data-plugin-options', esc_attr( json_encode( $extra_options ) ) );

	} elseif ( 'is_half' == $settings['as_banner_layer'] ) {
		$extra_class = array( 'col-half-section' );
		if ( isset( $settings['is_half_right'] ) && 'yes' == $settings['is_half_right'] ) {
			$extra_class[] = 'col-half-section-right';
		}
		if ( isset( $settings['_inline_size_tablet'] ) && 100 === (int) $settings['_inline_size_tablet'] ) {
			$extra_class[] = 'col-fullwidth-md';
		}
		if ( ! empty( $settings['porto_el_cls'] ) ) {
			$extra_class[] = esc_attr( trim( $settings['porto_el_cls'] ) );
		}
		$wrapper_name = $legacy_enabled ? '_inner_wrapper' : '_widget_wrapper';
		$self->add_render_attribute( $wrapper_name, 'class', $extra_class );
	} elseif ( 'sticky' == $settings['as_banner_layer'] ) {
		$options                      = array();
		$options['containerSelector'] = ! empty( $settings['container_selector'] ) ? $settings['container_selector'] : '';
		$options['minWidth']          = ! empty( $settings['min_width'] ) ? (int) $settings['min_width'] : 767;
		$options['padding']           = array();
		$options['padding']['top']    = isset( $settings['offset_top'] ) && '' !== $settings['offset_top'] ? (int) $settings['offset_top'] : 110;
		$options['padding']['bottom'] = ! empty( $settings['offset_bottom'] ) ? (int) $settings['offset_bottom'] : 0;
		$options['activeClass']       = ! empty( $settings['active_class'] ) ? esc_attr( $settings['active_class'] ) : 'sticky-active';
		if ( ! empty( $settings['autofit'] ) ) {
			$options['autoFit'] = true;
		}
		$options      = json_encode( $options );
		$wrapper_name = $legacy_enabled ? '_inner_wrapper' : '_widget_wrapper';
		$extra_class  = array( 'porto-sticky' );
		if ( ! empty( $settings['porto_el_cls'] ) ) {
			$extra_class[] = esc_attr( trim( $settings['porto_el_cls'] ) );
		}
		$self->add_render_attribute( $wrapper_name, 'class', $extra_class );
		$self->add_render_attribute( $wrapper_name, 'data-plugin-options', $options );
	} elseif ( 'split_layer' == $settings['as_banner_layer'] ){
		$self->add_render_attribute( '_wrapper', 'class', 'split-slide' );
	} else {
		global $porto_grid_layout, $porto_item_count, $porto_grid_type;
		$is_inner = $self->get_data( 'isInner' );
		if ( ( ( empty( $is_inner ) && empty( $porto_grid_type ) ) || ( ! empty( $is_inner ) && ! empty( $porto_grid_type ) ) ) && isset( $porto_grid_layout ) && is_array( $porto_grid_layout ) ) {
			$extra_class = array();
			if ( isset( $settings['porto_el_cls'] ) && $settings['porto_el_cls'] ) {
				$extra_class[] = esc_attr( $settings['porto_el_cls'] );
			}
			if ( isset( $porto_item_count ) && ( 0 === $porto_item_count || ! empty( $porto_item_count ) ) ) {
				$grid_layout   = $porto_grid_layout[ $porto_item_count % count( $porto_grid_layout ) ];
				$extra_class[] = esc_attr( 'porto-grid-item grid-col-' . $grid_layout['width'] . ' grid-col-md-' . $grid_layout['width_md'] . ( isset( $grid_layout['width_lg'] ) ? ' grid-col-lg-' . $grid_layout['width_lg'] : '' ) . ( isset( $grid_layout['height'] ) ? ' grid-height-' . $grid_layout['height'] : '' ) );
				$porto_item_count++;
			} else {
				$extra_class[]       = 'porto-grid-item';
				$porto_grid_layout[] = $settings['width1'];
				if ( isset( $settings['width1_tablet'] ) && ! empty( $settings['width1_tablet']['size'] ) ) {
					$porto_grid_layout[] = $settings['width1_tablet'];
				}
				if ( isset( $settings['width1_mobile'] ) && ! empty( $settings['width1_mobile']['size'] ) ) {
					$porto_grid_layout[] = $settings['width1_mobile'];
				}
			}
			$self->add_render_attribute( '_wrapper', 'class', $extra_class );
		}
	}

	if ( ! empty( $settings['parallax_speed']['size'] ) ) {
		$wrapper_name = $legacy_enabled ? '_inner_wrapper' : '_widget_wrapper';
		$self->add_render_attribute( $wrapper_name, 'data-plugin-parallax', '' );
		$self->add_render_attribute( $wrapper_name, 'data-plugin-options', '{"speed": ' . floatval( $settings['parallax_speed']['size'] ) . '}' );

		if ( ! empty( $settings['parallax_horizontal'] ) ) {
			$self->add_render_attribute( $wrapper_name, 'data-parallax-type', 'horizontal' );
		}
		if ( ! empty( $settings['parallax_scale'] ) ) {
			if ( ! empty( $settings['parallax_scale_invert'] ) ) {
				$self->add_render_attribute( $wrapper_name, 'data-parallax-scale', 'invert' );
			} else {
				$self->add_render_attribute( $wrapper_name, 'data-parallax-scale', '' );
			}
		}
		wp_enqueue_script( 'skrollr' );
	}

	$floating_attrs = porto_shortcode_add_floating_options( $settings, true );
	if ( $floating_attrs ) {
		foreach ( $floating_attrs as $key => $val ) {
			$self->add_render_attribute( '_widget_wrapper', $key, $val );
		}
	}

	$mpx_attrs = porto_get_mpx_options( $settings );
	if ( $mpx_attrs ) {
		foreach ( $mpx_attrs as $key => $val ) {
			$self->add_render_attribute( '_wrapper', $key, $val );
		}
	}
	if ( ! empty( $settings['content_collapse'] ) ) {
		$self->add_render_attribute( '_wrapper', 'class', 'content-collapse-wrap' );
	}
}
