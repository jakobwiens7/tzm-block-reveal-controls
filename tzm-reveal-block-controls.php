<?php

/**
 * Plugin Name:		TZM Reveal Block Controls
 * Description:		Reveal your blocks with nice animations when they come into view.
 * Version:			0.8.5
 * Author:			TezmoMedia - Jakob Wiens
 * Author URI:		https://www.tezmo.media
 * License:			GPL-2.0-or-later
 * License URI:		https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:		tzm-reveal-block-controls
 * Domain Path:		/languages
 * Requires at least: 6.2
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

// Check if class exists
if (!class_exists('TZM_Reveal_Block_Controls')) {

    class TZM_Reveal_Block_Controls
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
                'tzm-reveal-block-controls',
                false,
                dirname(plugin_basename(__FILE__)) . '/languages/'
            );
        }

        /**
         * Enqueue editor assets
         */
        public function enqueue_editor_assets()
        {
            $editor_assets = include(plugin_dir_path(__FILE__) . 'build/tzm-reveal-block-controls.asset.php');

            wp_enqueue_style(
                'tzm-reveal-block-controls-editor',
                plugins_url('/build/tzm-reveal-block-controls.css', __FILE__),
                array('wp-editor'),
                $editor_assets['version']
            );
            wp_enqueue_script(
                'tzm-reveal-block-controls-editor',
                plugins_url('/build/tzm-reveal-block-controls.js', __FILE__),
                $editor_assets['dependencies'],
                $editor_assets['version']
            );

            // Script Translations
            if (function_exists('wp_set_script_translations')) {
                wp_set_script_translations(
                    'tzm-reveal-block-controls-editor',
                    'tzm-reveal-block-controls',
                    plugin_dir_path(__FILE__) . 'languages'
                );
            }
        }

        /**
         * Enqueue both frontend + editor assets.
         */
        public function enqueue_block_assets()
        {
            $assets = include(plugin_dir_path(__FILE__) . 'build/view-tzm-reveal-block-controls.asset.php');

            wp_enqueue_style(
                'tzm-reveal-block-controls',
                plugins_url('/build/style-tzm-reveal-block-controls.css', __FILE__),
                is_admin() ? array('wp-editor') : null, //$assets['dependencies'],
                $assets['version']
            );

            wp_enqueue_script(
                'tzm-reveal-block-controls',
                plugins_url('/build/view-tzm-reveal-block-controls.js', __FILE__),
                is_admin() ? array('wp-editor') : $assets['dependencies'],
                $assets['version'],
                true
            );
        }


        /**
         * Render block
         */
        public function render_block($block_content, $block)
        {
            if (
                !isset($block['attrs']['revealControls']) ||
                !$block['attrs']['revealControls'] ||
                !isset($block['attrs']['revealControls']['enabled']) ||
                !$block['attrs']['revealControls']['enabled']
            ) {
                return $block_content;
            }

            $reveal_controls = $block['attrs']['revealControls'];
            $classes = [];
            $styles = [];

            foreach ($reveal_controls as $option => $value) {
                switch ($option) {
                    case 'effect':
                        $classes[] = 'tzm-reveal__' . $value;
                        break;
                    case 'permanent':
                        $classes[] = 'tzm-reveal__' . $option;
                        break;
                    case 'easing':
                        $classes[] = 'tzm-reveal__ease-' . $value;
                        break;
                    case 'duration':
                        $styles[] = '--tzm-reveal--duration:' . $value . 'ms';
                        break;
                    case 'delay':
                        $styles[] = '--tzm-reveal--delay:' . $value . 'ms';
                        break;
                }
            }

            // If no options are set add default class 'tzm-reveal'
            if (empty($classes)) $classes[] = 'tzm-reveal';

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

    TZM_Reveal_Block_Controls::get_instance();
}
