<?php

/**
 * Plugin Name:		TZM Reveal Block Controls
 * Description:		Reveal your blocks with nice animations when they enter the viewport.
 * Version:			0.0.1
 * Author:			TezmoMedia - Jakob Wiens
 * Author URI:		https://www.tezmo.media
 * License:			GPL-2.0-or-later
 * License URI:		https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:		tzm-reveal-block-controls
 * Domain Path:		/languages
 *
 * @package	tzm
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
            add_action('plugins_loaded', array($this, 'load_textdomain'));

            // Render block
            add_filter('render_block', array($this, 'render_block'), 10, 2);

            // Enqueue block editor assets
            add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_assets'));

            // Enqueue both frontend + editor block assets.
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
         * Enqueue block editor assets
         */
        public function enqueue_editor_assets()
        {
            $editor_assets = include(plugin_dir_path(__FILE__) . 'dist/tzm-reveal-block-controls.asset.php');

            wp_enqueue_style(
                'tzm-reveal-block-controls-editor',
                plugins_url('/dist/tzm-reveal-block-controls.css', __FILE__),
                array('wp-editor'),
                $editor_assets['version']
            );
            wp_enqueue_script(
                'tzm-reveal-block-controls-editor',
                plugins_url('/dist/tzm-reveal-block-controls.js', __FILE__),
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
         * Enqueue both frontend + editor block assets.
         */
        public function enqueue_block_assets()
        {
            // Apply Filter to allow or prevent CSS output
            if (!apply_filters('tzm_reveal_block_controls_output_css', true)) return;


            // Enqueue the breakpoint styles
            $frontend_assets = include(plugin_dir_path(__FILE__) . 'dist/tzm-reveal-block-controls.asset.php');

            wp_enqueue_style(
                'tzm-reveal-block-controls',
                plugins_url('/dist/style-tzm-reveal-block-controls.css', __FILE__),
                is_admin() ? array('wp-editor') : array(),
                $frontend_assets['version'],
            );
            wp_enqueue_script(
                'tzm-reveal-block-controls-editor',
                plugins_url('/dist/tzm-reveal-block-controls-frontend.js', __FILE__),
                $frontend_assets['dependencies'],
                $frontend_assets['version']
            );
        }

        /**
         * Render block
         */
        public function render_block($block_content, $block)
        {
            if (!isset($block['attrs']['revealControls']) || !$block['attrs']['revealControls']) {
                return $block_content;
            }

            $reveal_controls = $block['attrs']['revealControls'];
            $classes = [];
            $styles = [];


            // Collect classes
            foreach ($reveal_controls as $option => $value) {
            }
            $classes = implode(' ', $classes);

            // Collect styles
            foreach ($reveal_controls as $option => $value) {
            }
            $styles = implode(';', $styles);

            // Replace classes
            if ($classes) {
                // ...if there is no class attribute
                if (!str_contains($block_content, 'class')) {
                    $block_content = preg_replace(
                        '/>/',
                        ' class="">',
                        $block_content,
                        1
                    );
                }
                // ...if class attribute is null
                elseif (!str_contains($block_content, 'class=')) {
                    $block_content = preg_replace(
                        '/class/',
                        'class=""',
                        $block_content,
                        1
                    );
                }
                $block_content = preg_replace(
                    '/' . preg_quote('class="', '/') . '/',
                    'class="' . $classes . ' ',
                    $block_content,
                    1
                );
            }

            // Replace styles
            if ($styles) {
                // ...if there is no style attribute
                if (!str_contains($block_content, ' style')) {
                    $block_content = preg_replace(
                        '/>/',
                        ' style="">',
                        $block_content,
                        1
                    );
                }
                // ...if style attribute is null
                elseif (!str_contains($block_content, ' style=')) {
                    $block_content = preg_replace(
                        '/style/',
                        'style=""',
                        $block_content,
                        1
                    );
                }
                $block_content = preg_replace(
                    '/' . preg_quote('style="', '/') . '/',
                    'style="' . $styles . ';',
                    $block_content,
                    1
                );
            }

            return $block_content;
        }
    }

    TZM_Reveal_Block_Controls::get_instance();
}
