<?php

/**
 * Plugin Name:		TZM Block Reveal Controls
 * Description:		Reveal your blocks with nice animations when they come into view.
 * Version:			1.0.2
 * Author:			TezmoMedia - Jakob Wiens
 * Author URI:		https://www.tezmo.media
 * License:			GPL-2.0-or-later
 * License URI:		https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:		tzm-block-reveal-controls
 * Domain Path:		/languages
 * Requires at least: 6.4
 */

namespace TZM\BlockRevealControls;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

// Check if class exists
if (!class_exists('TZM_Block_Reveal_Controls')) {

    class TZM_Block_Reveal_Controls
    {

        /**
         * Instance of this class
         *
         * @var self|null
         */
        private static $instance = null;

        /**
         * Plugin directory path
         *
         * @var string
         */
        private $plugin_path;

        /**
         * Plugin directory URL
         *
         * @var string
         */
        private $plugin_url;

        /**
         * Constructor
         */
        private function __construct()
        {
            $this->plugin_path = plugin_dir_path(__FILE__);
            $this->plugin_url = plugins_url('', __FILE__);

            $this->init_hooks();
        }

        /**
         * Get singleton instance
         *
         * @return self
         */
        public static function get_instance(): self
        {
            if (null === self::$instance) {
                self::$instance = new self();
            }
            return self::$instance;
        }

        /**
         * Initialize WordPress hooks
         *
         * @return void
         */
        private function init_hooks(): void
        {
            // Render block
            add_filter('render_block', array($this, 'render_block'), 10, 2);

            // Enqueue editor assets
            add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_assets'));

            // Enqueue frontend assets
            add_action('enqueue_block_assets', array($this, 'enqueue_block_assets'));
        }


        /**
         * Enqueue editor assets
         */
        public function enqueue_editor_assets()
        {
            $editor_assets = include($this->plugin_path . 'build/tzm-block-reveal-controls.asset.php');

            wp_enqueue_style(
                'tzm-block-reveal-controls-editor',
                $this->plugin_url . '/build/tzm-block-reveal-controls.css',
                array('wp-editor'),
                $editor_assets['version']
            );
            wp_enqueue_script(
                'tzm-block-reveal-controls-editor',
                $this->plugin_url . '/build/tzm-block-reveal-controls.js',
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
            $assets = include($this->plugin_path . 'build/view-tzm-block-reveal-controls.asset.php');

            wp_enqueue_style(
                'tzm-block-reveal-controls',
                $this->plugin_url . '/build/style-tzm-block-reveal-controls.css',
                is_admin() ? array('wp-editor') : null,
                $assets['version']
            );

            if (!is_admin()) {
                wp_enqueue_script(
                    'tzm-block-reveal-controls',
                    $this->plugin_url . '/build/view-tzm-block-reveal-controls.js',
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

            $html = new \WP_HTML_Tag_Processor($block_content);
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

    // Initialize the plugin
    add_action('plugins_loaded', function () {
        TZM_Block_Reveal_Controls::get_instance();
    });
}
