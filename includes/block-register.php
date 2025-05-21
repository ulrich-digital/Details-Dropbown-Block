<?php
/**
 * Register the custom block
 */

defined('ABSPATH') || exit;

function ud_register_details_dropdown_block() {
    register_block_type_from_metadata(__DIR__ . '/../');
}
add_action('init', 'ud_register_details_dropdown_block');
