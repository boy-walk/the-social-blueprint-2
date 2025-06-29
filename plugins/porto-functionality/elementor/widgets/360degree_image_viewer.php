<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Porto Image Gallery widget
 *
 * @since 2.2.0
 */

use Elementor\Controls_Manager;

class Porto_Elementor_360degree_Image_Viewer_Widget extends \Elementor\Widget_Base {

	public function get_name() {
		return 'porto_360_degree_image_viewer';
	}

	public function get_title() {
		return __( 'Porto 360 Degree Image Viewer', 'porto-functionality' );
	}

	public function get_categories() {
		return array( 'porto-elements' );
	}

	public function get_keywords() {
		return array( 'image', 'gallery', '360', 'degree', 'viewer', '3d' );
	}

	public function get_icon() {
		return 'fas fa-dice-d20 porto-elementor-widget-icon';
	}

	public function get_script_depends() {
		if ( ( isset( $_REQUEST['action'] ) && 'elementor' == $_REQUEST['action'] ) || isset( $_REQUEST['elementor-preview'] ) ) {
			return array( 'porto-elementor-widgets-js', '360-degrees-product-viewer' );
		} else {
			return array();
		}
	}

	protected function register_controls() {

		$this->start_controls_section(
			'section_360_degree_image_viewer',
			array(
				'label' => __( '360 Degree Image Viewer', 'porto-functionality' ),
			)
		);

		$this->add_control(
			'img_source',
			array(
				'type'        => Controls_Manager::MEDIA,
				'label'       => __( 'Source Image', 'porto-functionality' ),
				'description' => __( 'A set of frames that will be shown in each degrees.<br /><strong>Note: If image width is larger than 2560px, you might need to reset the threshold for image width or height under Porto -> Speed Optimize Wizard -> Performance section</strong>.', 'porto-functionality' ),
				'dynamic'     => array(
					'active' => true,
				),
			)
		);

		$this->add_control(
			'img_preview',
			array(
				'type'        => Controls_Manager::MEDIA,
				'label'       => __( 'Preview Image', 'porto-functionality' ),
				'description' => __( 'Preview image describes starter image before initialize and size of a frame in source image.', 'porto-functionality' ),
				'dynamic'     => array(
					'active' => true,
				),
			)
		);

		$this->add_control(
			'frame_count',
			array(
				'type'    => Controls_Manager::NUMBER,
				'label'   => __( 'Frame Count', 'porto-functionality' ),
				'default' => 16,
				'min'     => 2,
				'max'     => 360,
			)
		);

		$this->add_control(
			'friction',
			array(
				'type'        => Controls_Manager::NUMBER,
				'label'       => __( 'Friction', 'porto-functionality' ),
				'description' => __( 'Ratio value used to calculate the dragging width per one frame when dragging image', 'porto-functionality' ),
				'default'     => 0.33,
				'min'         => 0.01,
				'max'         => 1.00,
				'step'        => 0.01,
			)
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_bar_style',
			array(
				'label'     => esc_html__( 'Bar', 'porto-functionality' ),
				'tab'       => Controls_Manager::TAB_STYLE,
			)
		);
		$this->add_control(
			'bar_w',
			array(
				'type'       => Controls_Manager::SLIDER,
				'label'      => __( 'Width', 'porto-functionality' ),
				'range'      => array(
					'px' => array(
						'step' => 1,
						'min'  => 100,
						'max'  => 800,
					),
					'em' => array(
						'step' => 1,
						'min'  => 10,
						'max'  => 80,
					),
					'%' => array(
						'step' => 1,
						'min'  => 1,
						'max'  => 100,
					),
				),
				'size_units' => array(
					'px',
					'em',
					'%',
				),
				'selectors'  => array(
					'.elementor-element-{{ID}} .cd-product-viewer-handle' => 'width: {{SIZE}}{{UNIT}}; max-width: none;',
				),
			)
		);
		$this->add_control(
			'bar_h',
			array(
				'type'       => Controls_Manager::SLIDER,
				'label'      => __( 'Height', 'porto-functionality' ),
				'range'      => array(
					'px' => array(
						'step' => 1,
						'min'  => 0,
						'max'  => 20,
					),
					'em' => array(
						'step' => 0.1,
						'min'  => 0.1,
						'max'  => 2,
					),
				),
				'size_units' => array(
					'px',
					'em',
				),
				'selectors'  => array(
					'.elementor-element-{{ID}} .cd-product-viewer-handle' => 'height: {{SIZE}}{{UNIT}};',
				),
			)
		);
		$this->add_control(
			'bar_br',
			array(
				'type'       => Controls_Manager::SLIDER,
				'label'      => __( 'Border Radius', 'porto-functionality' ),
				'range'      => array(
					'px' => array(
						'step' => 1,
						'min'  => 0,
						'max'  => 10,
					),
					'%' => array(
						'step' => 1,
						'min'  => 0,
						'max'  => 50,
					),
				),
				'size_units' => array(
					'px',
					'%',
				),
				'selectors'  => array(
					'.elementor-element-{{ID}} .cd-product-viewer-handle' => 'border-radius: {{SIZE}}{{UNIT}};',
				),
			)
		);
		$this->add_control(
			'bar_bg',
			array(
				'type'      => Controls_Manager::COLOR,
				'label'     => __( 'Background Color', 'porto-functionality' ),
				'selectors' => array(
					'.elementor-element-{{ID}} .cd-product-viewer-handle .fill' => 'background-color: {{VALUE}};',
				),
			)
		);

		$this->end_controls_section();
	}

	protected function render() {
		$atts = $this->get_settings_for_display();

		if ( $template = porto_shortcode_template( 'porto_360degree_image_viewer' ) ) {
			if ( ! empty( $atts['img_source'] ) && ! empty( $atts['img_source']['id'] ) ) {
				$atts['img_source'] = $atts['img_source']['id'];
			} else if ( ! empty( $atts['img_source'] ) && ! empty( $atts['img_source']['url'] ) ) {
				$atts['img_source'] = $atts['img_source']['url'];
			}

			if ( ! empty( $atts['img_preview'] ) && ! empty( $atts['img_preview']['id'] ) ) {
				$atts['img_preview'] = $atts['img_preview']['id'];
			} else if ( ! empty( $atts['img_preview'] ) && ! empty( $atts['img_preview']['url'] ) ) {
				$atts['img_preview'] = $atts['img_preview']['url'];
			}

			include $template;
		}
	}

}
