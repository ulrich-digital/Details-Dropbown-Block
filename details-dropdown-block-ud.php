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

defined('ABSPATH') || exit;

function details_dropdown_block_ud_register_block() {
    register_block_type(__DIR__);
}
add_action('init', 'details_dropdown_block_ud_register_block');



