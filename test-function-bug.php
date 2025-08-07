<?php
/**
 * Test file to reproduce the Responses API function bug
 * This should be included in your WordPress theme's functions.php or a custom plugin
 */

// Part 1: Define the test function
function define_test_time_function() {
    $definition = [
        'id' => 'get_current_time',
        'type' => 'manual',
        'name' => 'get_current_time',
        'desc' => 'Get the current server time',
        'args' => [
            [
                'name' => 'format',
                'type' => 'string',
                'required' => false,
                'desc' => 'Time format (e.g., "H:i:s" for hour:minute:second)',
            ],
        ],
    ];
    
    return Meow_MWAI_Query_Function::fromJson( $definition );
}

// Method 1: Register function naturally
add_filter( 'mwai_functions_list', function ( $functions ) {
    error_log( 'AI Engine Test: Registering get_current_time function via mwai_functions_list' );
    $functions[] = define_test_time_function();
    return $functions;
}, 10, 1 );

// Method 2: Force-add function to query (uncomment to test this method)
/*
add_filter( 'mwai_ai_query', function ( $query ) {
    error_log( 'AI Engine Test: Force-adding get_current_time function to query' );
    error_log( 'AI Engine Test: Query has previous_response_id: ' . ( $query->previousResponseId ? 'YES - ' . $query->previousResponseId : 'NO' ) );
    $query->add_function( define_test_time_function() );
    return $query;
}, 10, 1 );
*/

// Part 2: Handle the function call
add_filter( 'mwai_ai_feedback', function ( $value, $needFeedback ) {
    error_log( 'AI Engine Test: mwai_ai_feedback called' );
    error_log( 'AI Engine Test: Function requested: ' . print_r( $needFeedback['function']->id ?? 'unknown', true ) );
    
    $function = $needFeedback['function'];
    
    if ( $function->id === 'get_current_time' ) {
        error_log( 'AI Engine Test: Executing get_current_time function' );
        
        $format = $needFeedback['arguments']['format'] ?? 'Y-m-d H:i:s';
        $current_time = current_time( $format );
        
        error_log( 'AI Engine Test: Returning time: ' . $current_time );
        
        return json_encode( [
            'time' => $current_time,
            'timezone' => get_option( 'timezone_string' ) ?: 'UTC',
            'format_used' => $format
        ] );
    }
    
    return $value;
}, 10, 2 );

// Debug filter to log query details
add_filter( 'mwai_ai_query', function ( $query ) {
    error_log( '======= AI Engine Test: Query Debug =======' );
    error_log( 'Query type: ' . get_class( $query ) );
    error_log( 'History strategy: ' . ( $query->historyStrategy ?? 'not set' ) );
    error_log( 'Previous response ID: ' . ( $query->previousResponseId ?? 'none' ) );
    error_log( 'Number of functions: ' . count( $query->functions ?? [] ) );
    
    if ( !empty( $query->functions ) ) {
        foreach ( $query->functions as $func ) {
            error_log( '  - Function: ' . $func->id . ' (' . $func->name . ')' );
        }
    }
    
    error_log( '===========================================' );
    
    return $query;
}, 5, 1 ); // Priority 5 to run before the force-add filter

// Additional debug for the actual API request
add_filter( 'mwai_ai_request', function ( $request, $query ) {
    if ( strpos( $request['url'] ?? '', 'responses' ) !== false ) {
        error_log( '======= AI Engine Test: Responses API Request =======' );
        error_log( 'URL: ' . ( $request['url'] ?? 'not set' ) );
        
        $body = json_decode( $request['body'] ?? '{}', true );
        
        if ( isset( $body['previous_response_id'] ) ) {
            error_log( 'Using previous_response_id: ' . $body['previous_response_id'] );
        }
        
        if ( isset( $body['tools'] ) ) {
            error_log( 'Tools included in request: ' . count( $body['tools'] ) );
            foreach ( $body['tools'] as $tool ) {
                error_log( '  - Tool: ' . ( $tool['function']['name'] ?? 'unknown' ) );
            }
        } else {
            error_log( 'NO TOOLS in request body!' );
        }
        
        error_log( '=====================================================' );
    }
    
    return $request;
}, 10, 2 );

/**
 * Instructions for testing:
 * 
 * 1. Include this file in your WordPress installation
 * 2. Enable "Queries Debug" in AI Engine > Settings > Dev Tools
 * 3. Create a chatbot with OpenAI's Responses API
 * 4. Start a conversation and ask: "What time is it?"
 * 5. The bot should call the get_current_time function
 * 6. Continue the conversation with another message like: "What time is it now?"
 * 7. Check the logs to see if the function is still available
 * 
 * Monitor logs with: tail -f ~/sites/ai/logs/php/error.log | grep "AI Engine Test"
 */