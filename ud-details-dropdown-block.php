<?php
/**
 * Plugin Name: Details Dropdown Block
 * Description: Ein Gutenberg-Block für aufklappbare Details mit PDF- und Link-Optionen.
 * Version: 1.0
 * Author: ulrich.digital
 * Author URI: https://ulrich.digital/
 * Text Domain: details-dropdown-block-ud
 *
 * @package details-dropdown-block-ud
 */

/**
 * Hinweis:
 * Diese Datei dient ausschliesslich als Einstiegspunkt für das Plugin.
 */


defined('ABSPATH') || exit;

foreach ([
    'helpers.php',           // Allgemeine Hilfsfunktionen
    // 'api.php',
    // 'render.php',
    'block-register.php',    // Block-Registrierung via block.json
    'enqueue.php'            // Enqueue von Styles/Scripts
] as $file) {
    require_once __DIR__ . '/includes/' . $file;
}

// Direktlink zur Einstellungsseite im Plugin-Menü
/*
add_filter('plugin_action_links_' . plugin_basename(__FILE__), function ($links) {
    $url = admin_url('options-general.php?page=cpm_settings');
    $settings_link = '<a href="' . esc_url($url) . '">Einstellungen</a>';
    array_unshift($links, $settings_link); // ganz vorne einfügen
    return $links;
});
*/