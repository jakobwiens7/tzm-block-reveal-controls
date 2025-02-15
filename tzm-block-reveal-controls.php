<?php

/**
 * Plugin Name:		TZM Block Reveal Controls
 * Description:		Reveal your blocks with nice animations when they come into view.
 * Version:			1.0.0
 * Author:			TezmoMedia - Jakob Wiens
 * Author URI:		https://www.tezmo.media
 * License:			GPL-2.0-or-later
 * License URI:		https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:		tzm-block-reveal-controls
 * Domain Path:		/languages
 * Requires at least: 6.4
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

// Check if class exists
if (!class_exists('TZM_Block_Reveal_Controls')) {

    class TZM_Block_Reveal_Controls
    {
        // The instance of this class
        private static $instance = null;

        // Returns the instance of this class.
        public static function get_instance()
        {
            if (null === self::$instance) {
                self::$instance = new self();
            }
            return self::$instance;
        }

        public function __construct()
        {
            // Load plugin textdomain
            add_action('init', array($this, 'load_textdomain'));

            // Render block
            add_filter('render_block', array($this, 'render_block'), 10, 2);

            // Enqueue editor assets
            add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_assets'));

            // Enqueue frontend assets
            add_action('enqueue_block_assets', array($this, 'enqueue_block_assets'));
        }

        /**
         * Load plugin textdomain
         */
        public function load_textdomain()
        {
            load_plugin_textdomain(
                'tzm-block-reveal-controls',
                false,
                dirname(plugin_basename(__FILE__)) . '/languages/'
            );
        }

        /**
         * Enqueue editor assets
         */
        public function enqueue_editor_assets()
        {
            $editor_assets = include(plugin_dir_path(__FILE__) . 'build/tzm-block-reveal-controls.asset.php');

            wp_enqueue_style(
                'tzm-block-reveal-controls-editor',
                plugins_url('/build/tzm-block-reveal-controls.css', __FILE__),
                array('wp-editor'),
                $editor_assets['version']
            );
            wp_enqueue_script(
                'tzm-block-reveal-controls-editor',
                plugins_url('/build/tzm-block-reveal-controls.js', __FILE__),
                $editor_assets['dependencies'],
                $editor_assets['version'],
                true
            );

            // Script Translations
            if (function_exists('wp_set_script_translations')) {
                wp_set_script_translations(
                    'tzm-block-reveal-controls-editor',
                    'tzm-block-reveal-controls',
                    plugin_dir_path(__FILE__) . 'languages'
                );
            }
        }

        /**
         * Enqueue both frontend + editor assets.
         */
        public function enqueue_block_assets()
        {
            $assets = include(plugin_dir_path(__FILE__) . 'build/view-tzm-block-reveal-controls.asset.php');

            wp_enqueue_style(
                'tzm-block-reveal-controls',
                plugins_url('/build/style-tzm-block-reveal-controls.css', __FILE__),
                is_admin() ? array('wp-editor') : null,
                $assets['version']
            );

            if (!is_admin()) {
                wp_enqueue_script(
                    'tzm-block-reveal-controls',
                    plugins_url('/build/view-tzm-block-reveal-controls.js', __FILE__),
                    $assets['dependencies'],
                    $assets['version'],
                    true
                );
            }
        }


        /**
         * Render block
         */
        public function render_block($block_content, $block)
        {
            if (
                !isset($block['attrs']['revealControls']) ||
                !$block['attrs']['revealControls'] ||
                !isset($block['attrs']['revealControls']['effect']) ||
                !$block['attrs']['revealControls']['effect']
            ) {
                return $block_content;
            }

            $reveal_controls = $block['attrs']['revealControls'];
            $classes = [];
            $styles = [];

            foreach ($reveal_controls as $option => $value) {
                switch ($option) {
                    case 'effect':
                        $classes[] = 'tzm-block-reveal__' . $value;
                        break;
                    case 'permanent':
                        $classes[] = 'tzm-block-reveal__' . $option;
                        break;
                    case 'easing':
                        $classes[] = 'tzm-block-reveal__ease-' . $value;
                        break;
                    case 'duration':
                        $styles[] = '--tzm-block-reveal--duration:' . $value . 'ms';
                        break;
                    case 'delay':
                        $styles[] = '--tzm-block-reveal--delay:' . $value . 'ms';
                        break;
                }
            }

            $classes = implode(' ', $classes);
            $styles = implode(';', $styles);

            $html = new WP_HTML_Tag_Processor($block_content);
            $html->next_tag();

            if ($classes) {
                $html->add_class($classes);
            }

            if ($styles) {
                $html_style = $html->get_attribute('style');
                $html->set_attribute('style', $html_style ? $html_style . '; ' . $styles : $styles);
            }

            return $html->get_updated_html();
        }
    }

    TZM_Block_Reveal_Controls::get_instance();
}
