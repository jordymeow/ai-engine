<?php
if ( !defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    die;
}

function mwai_remove_crons() {
	$timestamp = wp_next_scheduled( 'mwai_files_cleanup' );
	wp_unschedule_event( $timestamp, 'mwai_files_cleanup' );
	$timestamp = wp_next_scheduled( 'mwai_tasks_internal_run' );
	wp_unschedule_event( $timestamp, 'mwai_tasks_internal_run' );
	$timestamp = wp_next_scheduled( 'mwai_tasks_internal_dev_run' );
	wp_unschedule_event( $timestamp, 'mwai_tasks_internal_dev_run' );
}

function mwai_remove_database() {
	global $wpdb;
	$table_name1 = $wpdb->prefix . "mwai_chats";
	$table_name2 = $wpdb->prefix . "mwai_logmeta";
	$table_name3 = $wpdb->prefix . "mwai_logs";
  $table_name4 = $wpdb->prefix . "mwai_vectors";
	$sql = "DROP TABLE IF EXISTS $table_name1, $table_name2, $table_name3, $table_name4";
	$wpdb->query( $sql );
}

function mwai_remove_options() {
	global $wpdb;
	$options = $wpdb->get_results( "SELECT option_name FROM $wpdb->options WHERE option_name LIKE 'mwai_%'" );
	foreach( $options as $option ) {
		delete_option( $option->option_name );
	}
}

function mwai_uninstall () {
	$options = get_option( 'mwai_options', [] );
	$cleanUninstall = $options['clean_uninstall'];
	if ( $cleanUninstall ) {
		mwai_remove_options();
		mwai_remove_database();
	}
}

mwai_uninstall();
