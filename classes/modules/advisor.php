<?php

class Meow_MWAI_Modules_Advisor {
  private $core = null;
  private $update_interval = 24 * 60 * 60;
  private $prompt = "Based on all the plugins I have installed and my WordPress information, can you give me general advice and recommendations about my WordPress setup? Aim for a concise list of 6-8 recommendations total. Consider factors such as whether certain types of plugins are still needed, if some might be deprecated, their overall impact on performance, if there are redundancies or conflicts between plugins, and if some functionality is no longer required with recent versions of WordPress. Provide the recommendations in a JSON format with 'level', 'severity', 'title', and 'description' fields:

    'level' can be 'success', 'warning', or 'danger'. Use 'success' to highlight areas that are working well and should be maintained to keep things running optimally. This motivates the user to continue good practices. Use 'warning' for issues that are not critical but could be improved. Use 'danger' for critical issues that should be addressed immediately.
    'severity' should be an integer from 0 to 100, with 0 being the least severe and 100 being the most severe.
    'title' should be a concise description of the recommendation.
    'description' should provide more details about the recommendation.
    Here is a simple JSON example of the format to use, without any actual data:
    [
    {
    \"level\": \"success\",
    \"severity\": 0,
    \"title\": \"Example Success\",
    \"description\": \"This is an example of a successful recommendation.\"
    },
    {
    
    \"level\": \"warning\",
    \"severity\": 50,
    \"title\": \"Example Warning\",
    \"description\": \"This is an example of a non-critical recommendation.\"
    },
    {
    \"level\": \"danger\",
    \"severity\": 100,
    \"title\": \"Example Danger\",
    \"description\": \"This is an example of a critical recommendation.\"
    }
    ]
    
    Instead of focusing on individual plugins, provide more general and holistic recommendations based on the overall WordPress system and the installed plugins as a whole. Feel free to use titles like \"Useless Plugins\" or \"Performance Considerations\" to group related recommendations. Avoid repeating the same or very similar recommendations. Only output the JSON - do not include any other text or formatting like markdown. If you don't have any recommendations, output an empty array [].
    
    Here are the plugins I have installed, along with my WordPress information:";

  public function __construct( $core ) {
    $this->core = $core;
    add_action( 'init', array( $this, 'init' ) );
    add_action( 'wp_dashboard_setup', array( $this, 'add_dashboard_widget' ) );
  }

  public function init() {
    if ( $_SERVER['REQUEST_METHOD'] === 'POST' && isset( $_POST['refresh_advisor_nonce'] ) ) {
      if ( wp_verify_nonce( $_POST['refresh_advisor_nonce'], 'refresh_advisor_action' ) ) {
        $this->run_advisor();
        wp_safe_redirect( remove_query_arg( 'refresh_advisor' ) );
        exit;
      }
    }
    else if ( $this->core->get_option( 'module_advisor', false ) ) {
      add_action( 'mwai_tasks_run', array( $this, 'check_and_run_advisor' ) );
    }
  }

  private function check_and_run_advisor() {
    $last_run_data = get_option( 'mwai_advisor_data', [] );
    $last_run_time = $last_run_data['date'] ?? 0;
    $current_time = time();
    if ( $current_time - $last_run_time > $this->update_interval ) {
      $this->run_advisor();
    }
  }

  public function run_advisor() {
    try {
      global $mwai;
      $mwai->checkStatus();
      $plugins = $this->get_all_installed_plugins();
      
      $finalPrompt = $this->prompt;
      foreach ( $plugins as $plugin ) {
        $finalPrompt .= "Plugin: " . $plugin['title'] . "\n";
        $finalPrompt .= "- Version: " . $plugin['version'] . "\n";
        $finalPrompt .= "- Description: " . $plugin['description'] . "\n";
        $finalPrompt .= "- Enabled: " . ( $plugin['enabled'] ? 'Yes' : 'No' ) . "\n";
      }
      $finalPrompt .= "\n";

      $finalPrompt .= "WordPress Information:\n";
      $finalPrompt .= "- Number of Plugins: " . count( $plugins ) . "\n";
      $finalPrompt .= "- Site URL: " . get_site_url() . "\n";
      $finalPrompt .= "- PHP Version: " . phpversion() . "\n";
      $finalPrompt .= "- WordPress Version: " . get_bloginfo( 'version' ) . "\n";
      $finalPrompt .= "- Theme: " . wp_get_theme()->get( 'Name' ) . "\n";
      $finalPrompt .= "\n";

      $finalPrompt .= "General Information:\n";
      $finalPrompt .= "- Today's Date: " . date( 'Y-m-d' ) . "\n";
      $finalPrompt .= "\n";

      $errors = MeowCommon_Helpers::php_error_logs();
      $errors = array_slice( $errors, -10 );
      if ( !empty( $errors ) ) {
        $finalPrompt .= "PHP Errors: \n";
        foreach ( $errors as $error ) {
          $finalPrompt .= $error['date'] . ' - ' . $error['type'] . ' - ' . $error['content'] . "\n";
        }
      }

      $answer = $mwai->simpleTextQuery( $finalPrompt, [ "scope" => 'advisor' ] );
      $recommendations = json_decode( $answer, true );
      update_option( 'mwai_advisor_data', [
        'date' => time(),
        'data' => $recommendations
      ], false );

    }
    catch ( Exception $e ) {
      error_log( 'AI Engine: ' . $e->getMessage() );
    }
  }

  function get_all_installed_plugins() {
    if ( ! function_exists( 'get_plugins' ) ) {
      require_once ABSPATH . 'wp-admin/includes/plugin.php';
    }
    $all_plugins = get_plugins();
    $active_plugins = get_option( 'active_plugins', array() );
    $plugins_info = array();
    foreach ( $all_plugins as $plugin_path => $plugin_data ) {
      $plugin_info = array(
        'title'       => $plugin_data['Name'],
        'version'     => $plugin_data['Version'],
        'description' => $plugin_data['Description'],
        'enabled'     => in_array($plugin_path, $active_plugins) ? true : false
      );
      $plugins_info[] = $plugin_info;
    }
    return $plugins_info;
  }

  function add_dashboard_widget() {
    wp_add_dashboard_widget(
      'mwai_advisor_widget',
      'AI Engine Advisor',
      array( $this, 'advisor_metabox' )
    );
  }

  function advisor_metabox() {
    $data = get_option( 'mwai_advisor_data', [] );
    $recommendations = $data['data'] ?? [];
    if ( empty( $recommendations ) ) {
      echo '<p>No recommendations yet.</p>';
    }
    else {
      echo '<p>Everyday, AI Engine will analyze your WordPress setup and provide you with recommendations to improve it.</p>';
      echo '<ul>';
      foreach ( $recommendations as $recommendation ) {
        $title = isset( $recommendation['title'] ) ? $recommendation['title'] : 'Miscellaneous';
        $description = isset( $recommendation['description'] ) ? $recommendation['description'] : 'No information available.';
        echo '<li style="display: inline;">';
        echo '<div style="display: flex; margin-bottom: 10px;">';
        echo $this->generate_badge( $recommendation['level'] );
        echo '<div>';
        echo '<strong>' . $title . '</strong> - ' . $description;
        echo '</div>';
        echo '</div>';
        echo '</li>';
      }
      echo '</ul>';
    }
    echo '<form method="POST">';
    wp_nonce_field( 'refresh_advisor_action', 'refresh_advisor_nonce' );
    echo '<div style="display: flex; justify-content: end;">';
    echo '<input type="submit" class="button" value="Refresh Recommendations">';
    echo '</div>';
    echo '</form>';
  }

  function generate_badge( $level ) {
    $color = ($level === 'success') ? '#00ba37' : (($level === 'warning') ? '#dba617' : '#e65054');
    return '<div style="display: flex; align-items: center; margin-bottom: 5px;">
              <div style="width: 20px; height: 20px; margin-right: 10px;">
                <svg aria-hidden="true" focusable="false" width="100%" height="100%" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <circle r="90" cx="100" cy="100" fill="transparent" stroke-dasharray="565.48" stroke-dashoffset="0" style="stroke: #e2e2e2;"></circle>
                  <circle id="bar" r="90" cx="100" cy="100" fill="transparent" stroke-dasharray="565.48" stroke-dashoffset="0" style="stroke-width: 15px; stroke: ' . $color . ';"></circle>
                </svg>
              </div>
            </div>';
  }
}
