# AI Engine - Developer Documentation

This documentation is for developers who want to extend AI Engine with custom functionality. AI Engine provides multiple extension points through filters and APIs that allow you to enhance chatbots, add custom AI tools, and integrate with WordPress in powerful ways.

## Table of Contents
- [WordPress Hooks Reference](#wordpress-hooks-reference) - Complete list of filters and actions
- [Chatbot Actions](#chatbot-actions) - Execute client-side functions from AI responses
- [Chatbot Shortcuts](#chatbot-shortcuts) - Dynamic quick-action buttons in chatbots
- [Chatbot Blocks](#chatbot-blocks) - Interactive HTML content in chat conversations
- [MCP (Model Context Protocol)](#mcp-model-context-protocol) - Enable AI agents to interact with WordPress
- [Discussion Context Menu](#discussion-context-menu) - Customize the discussions interface

---

# WordPress Hooks Reference

AI Engine provides numerous WordPress filters and actions that allow developers to customize and extend its functionality. This section documents the most useful hooks for developers.

## Core AI Filters

### Query and Reply Processing

```php
// Modify AI query before it's sent
add_filter( 'mwai_ai_query', function( $query ) {
    // Modify the query object
    return $query;
});

// Modify AI reply after it's received
add_filter( 'mwai_ai_reply', function( $reply, $query ) {
    // Process or modify the reply
    return $reply;
}, 10, 2 );

// Control whether a query is allowed
add_filter( 'mwai_ai_allowed', function( $allowed, $query, $limits ) {
    // Return true to allow, false to block, or a string error message
    if ( /* some condition */ ) {
        return 'Query blocked due to rate limits';
    }
    return $allowed;
}, 10, 3 );

// Modify AI instructions/context
add_filter( 'mwai_ai_instructions', function( $instructions, $query ) {
    // Add or modify system instructions
    $instructions .= "\nAlways be polite and helpful.";
    return $instructions;
}, 10, 2 );
```

### Error Handling

```php
// Customize error messages shown to users
add_filter( 'mwai_ai_exception', function( $message ) {
    // Hide technical details from users
    if ( strpos( $message, 'API' ) !== false ) {
        return 'Service temporarily unavailable. Please try again.';
    }
    return $message;
});
```

## Chatbot Filters

### Chatbot Parameters and Behavior

```php
// Modify chatbot parameters
add_filter( 'mwai_chatbot_params', function( $params ) {
    // Force specific settings
    $params['temperature'] = 0.7;
    $params['max_tokens'] = 500;
    return $params;
});

// Takeover chatbot response (bypass AI)
add_filter( 'mwai_chatbot_takeover', function( $takeover, $query, $params ) {
    // Check for specific triggers
    if ( strpos( $query->get_message(), 'current time' ) !== false ) {
        return 'The current time is ' . current_time( 'mysql' );
    }
    return $takeover;
}, 10, 3 );

// Modify chatbot query before processing
add_filter( 'mwai_chatbot_query', function( $query, $params ) {
    // Add context or modify the query
    return $query;
}, 10, 2 );

// Process chatbot reply before sending to user
add_filter( 'mwai_chatbot_reply', function( $reply, $query, $params, $extra ) {
    // Add custom formatting or processing
    return $reply;
}, 10, 4 );
```

### Dynamic UI Elements

```php
// Add chatbot shortcuts dynamically
add_filter( 'mwai_chatbot_shortcuts', function( $shortcuts, $args ) {
    $shortcuts[] = [
        'type' => 'message',
        'data' => [
            'label' => 'Help',
            'message' => 'I need help',
            'variant' => 'info'
        ]
    ];
    return $shortcuts;
}, 10, 2 );

// Add chatbot blocks (HTML content)
add_filter( 'mwai_chatbot_blocks', function( $blocks, $args ) {
    $blocks[] = [
        'type' => 'content',
        'data' => [
            'html' => '<div>Custom content</div>',
            'script' => 'console.log("Block loaded");'
        ]
    ];
    return $blocks;
}, 10, 2 );

// Add chatbot actions (function calls)
add_filter( 'mwai_chatbot_actions', function( $actions, $args ) {
    $actions[] = [
        'name' => 'custom_action',
        'data' => ['param' => 'value']
    ];
    return $actions;
}, 10, 2 );
```

## Discussion Filters

### Discussion Metadata Display

These filters allow you to customize how discussion metadata is displayed in the discussion list.

```php
// Customize the start date display
add_filter( 'mwai_discussion_metadata_start_date', function( $formatted_date, $discussion ) {
    // $formatted_date is already formatted (e.g., "5m ago", "Jan 20th")
    // $discussion contains the full discussion data
    
    // Example: Add emoji for recent discussions
    $created_time = strtotime( $discussion['created'] );
    $hours_ago = ( time() - $created_time ) / 3600;
    
    if ( $hours_ago < 1 ) {
        return '🔥 ' . $formatted_date;
    } elseif ( $hours_ago < 24 ) {
        return '✨ ' . $formatted_date;
    }
    
    return $formatted_date;
}, 10, 2 );

// Customize the last update display
add_filter( 'mwai_discussion_metadata_last_update', function( $formatted_date, $discussion ) {
    // Example: Show activity status instead of time
    $updated_time = strtotime( $discussion['updated'] );
    $days_ago = ( time() - $updated_time ) / 86400;
    
    if ( $days_ago < 1 ) {
        return '🟢 Active today';
    } elseif ( $days_ago < 7 ) {
        return '🟡 This week';
    } else {
        return '⚪ ' . $formatted_date;
    }
}, 10, 2 );

// Customize the message count display
add_filter( 'mwai_discussion_metadata_message_count', function( $count, $discussion ) {
    // Example: Format with descriptive text
    if ( $count == 0 ) {
        return 'No messages';
    } elseif ( $count == 1 ) {
        return '1 message';
    } elseif ( $count > 50 ) {
        return $count . ' messages 🔥';
    }
    
    return $count . ' messages';
}, 10, 2 );

// Complete example: Custom badges based on discussion data
add_filter( 'mwai_discussion_metadata_start_date', function( $formatted_date, $discussion ) {
    // Access discussion properties
    $message_count = count( json_decode( $discussion['messages'], true ) );
    $has_title = !empty( $discussion['title'] );
    
    // Add badges based on conditions
    $badges = [];
    if ( $message_count > 20 ) {
        $badges[] = '💬';
    }
    if ( $has_title ) {
        $badges[] = '📝';
    }
    
    $badge_string = !empty( $badges ) ? implode( '', $badges ) . ' ' : '';
    return $badge_string . $formatted_date;
}, 10, 2 );
```

### Available Discussion Data

The `$discussion` parameter contains:
- `id` - Discussion ID
- `chatId` - Unique chat identifier
- `botId` - Associated bot ID
- `title` - Discussion title (may be empty)
- `created` - Creation timestamp
- `updated` - Last update timestamp
- `messages` - JSON string of messages (decode to access)
- `extra` - JSON string of extra data

## Embeddings and Vector Database

```php
// Add custom vector to database
add_filter( 'mwai_embeddings_add_vector', function( $success, $vector, $options ) {
    // Implement custom vector storage
    return $success;
}, 10, 3 );

// Query vectors from database
add_filter( 'mwai_embeddings_query_vectors', function( $results, $searchVectors, $options ) {
    // Implement custom vector search
    return $results;
}, 10, 3 );

// Delete vectors
add_filter( 'mwai_embeddings_delete_vectors', function( $vectorIds, $options ) {
    // Handle vector deletion
    return $vectorIds;
}, 10, 2 );

// Modify context search results
add_filter( 'mwai_context_search', function( $context, $query, $options ) {
    // Add or modify context from embeddings
    return $context;
}, 10, 3 );
```

## Content Processing

```php
// Modify content before AI processing
add_filter( 'mwai_contentaware_content', function( $content, $post ) {
    // Clean or enhance content
    $content = strip_shortcodes( $content );
    return $content;
}, 10, 2 );

// Customize prompt templates
add_filter( 'mwai_prompt_suggestTitles', function( $prompt, $args ) {
    return "Generate 5 SEO-optimized titles for:\n\n";
}, 10, 2 );

add_filter( 'mwai_prompt_translateText', function( $prompt, $args ) {
    return "Translate to {$args['language']} maintaining tone:\n\n";
}, 10, 2 );
```

## AI Forms

```php
// Modify form parameters
add_filter( 'mwai_form_params', function( $params ) {
    $params['submit_label'] = 'Generate Content';
    return $params;
});

// Takeover form submission
add_filter( 'mwai_form_takeover', function( $takeover, $query, $params ) {
    // Handle form submission custom logic
    return $takeover;
}, 10, 3 );

// Process form reply
add_filter( 'mwai_form_reply', function( $reply, $query, $params, $extra ) {
    // Format or process the reply
    return $reply;
}, 10, 4 );

// Customize form field parameters
add_filter( 'mwai_forms_field_params', function( $params ) {
    // Modify field settings
    return $params;
});

// Add custom form styles
add_filter( 'mwai_forms_style', function( $styles, $formId ) {
    $styles .= "\n.mwai-form-{$formId} { border: 2px solid blue; }";
    return $styles;
}, 10, 2 );
```

## Function Calling

```php
// Register custom functions for AI to call
add_filter( 'mwai_functions_list', function( $functions ) {
    $functions[] = [
        'name' => 'get_weather',
        'description' => 'Get current weather',
        'parameters' => [
            'type' => 'object',
            'properties' => [
                'location' => [
                    'type' => 'string',
                    'description' => 'City name'
                ]
            ]
        ]
    ];
    return $functions;
});

// Handle function execution
add_filter( 'mwai_ai_feedback', function( $result, $function, $args ) {
    if ( $function['name'] === 'get_weather' ) {
        // Execute function and return result
        return "Sunny, 25°C in " . $args['location'];
    }
    return $result;
}, 10, 3 );
```

## Statistics and Usage

```php
// Modify usage statistics
add_filter( 'mwai_stats_credits', function( $credits, $userId ) {
    // Implement custom credit system
    return $credits;
}, 10, 2 );

// Customize pricing calculations
add_filter( 'mwai_stats_coins', function( $price, $stats, $atts ) {
    // Apply custom pricing logic
    return $price;
}, 10, 3 );

// Access logs
add_filter( 'mwai_stats_logs_list', function( $logs, $offset, $limit, $filters, $sort ) {
    // Filter or modify logs
    return $logs;
}, 10, 5 );
```

## MCP (Model Context Protocol)

```php
// Register MCP tools
add_filter( 'mwai_mcp_tools', function( $tools ) {
    $tools[] = [
        'name' => 'custom_tool',
        'description' => 'My custom tool',
        'inputSchema' => [/* ... */]
    ];
    return $tools;
});

// Handle MCP tool execution
add_filter( 'mwai_mcp_callback', function( $result, $tool, $args, $id ) {
    if ( $tool === 'custom_tool' ) {
        // Execute and return result
        return ['success' => true, 'data' => 'result'];
    }
    return $result;
}, 10, 4 );

// Control MCP access
add_filter( 'mwai_allow_mcp', function( $allowed, $userId ) {
    // Implement custom access control
    return $allowed;
}, 10, 2 );
```

## Engine Configuration

```php
// Customize AI engine initialization
add_filter( 'mwai_init_engine', function( $engine, $core, $env ) {
    // Return custom engine implementation
    return $engine;
}, 10, 3 );

// Modify model lists
add_filter( 'mwai_openai_models', function( $models ) {
    // Add custom models
    $models[] = 'custom-model-id';
    return $models;
});

// Customize API endpoints
add_filter( 'mwai_openai_endpoint', function( $endpoint, $env ) {
    // Use custom endpoint
    return 'https://custom-api.example.com/v1';
}, 10, 2 );
```

## Actions

```php
// Scheduled tasks
add_action( 'mwai_tasks_run', function() {
    // Run scheduled maintenance tasks
    // This runs on WP cron
});
```

## Best Practices

1. **Priority Matters**: Use appropriate priority values (default is 10) to control execution order
2. **Return Values**: Always return the filtered value, even if unchanged
3. **Error Handling**: Use try-catch blocks in your filters to prevent breaking the plugin
4. **Performance**: Keep filter callbacks lightweight, especially for frequently called filters
5. **Documentation**: Document your custom filters for other developers on your team

---

# Chatbot Actions

Actions allow AI models to trigger client-side JavaScript functions during chat conversations. This enables dynamic interactions like form submissions, API calls, or UI updates directly from the AI's response.

## How Actions Work

When the AI includes a specific action in its response, the chatbot automatically executes the corresponding JavaScript function on the client side. This is particularly useful for:
- Triggering form submissions
- Making API calls
- Updating UI elements
- Collecting user data
- Integrating with third-party services

## Implementation

### Step 1: Create a Callable Action in Code Engine

1. Go to **AI Engine → Code Engine**
2. Create a new snippet with:
   - **Type**: Callable Action
   - **Target**: JS
   - **Name**: Your action name (e.g., `submit_form`)

### Step 2: Write Your JavaScript Function

```javascript
// This function will be called when the AI triggers the action
function submit_form(args) {
    // Access chatbot context
    const chatbot = args.chatbot;
    const message = args.message;
    
    // Your custom logic
    const formData = {
        name: args.name,
        email: args.email,
        message: args.userMessage
    };
    
    // Example: Submit to an API
    fetch('/wp-json/custom/v1/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        // Send response back to chat
        chatbot.addMessage({
            role: 'assistant',
            content: 'Form submitted successfully!'
        });
    });
}
```

### Step 3: Configure AI to Use the Action

In your AI assistant or system prompt, instruct the model to use the action:

```
When the user wants to submit a contact form, use the submit_form action with their name, email, and message.

Example response format:
"I'll submit that form for you now."
[Action: submit_form, Args: {"name": "John", "email": "john@example.com", "userMessage": "Hello!"}]
```

## Action Response Format

The AI should include actions in this format:
```json
{
    "type": "function",
    "data": {
        "name": "action_name",
        "args": {
            "param1": "value1",
            "param2": "value2"
        }
    }
}
```

## Complete Example: Calculator Action

```javascript
// Code Engine Callable Action: "calculate"
function calculate(args) {
    const { operation, a, b, chatbot } = args;
    let result;
    
    switch(operation) {
        case 'add':
            result = a + b;
            break;
        case 'multiply':
            result = a * b;
            break;
        case 'divide':
            result = b !== 0 ? a / b : 'Cannot divide by zero';
            break;
    }
    
    // Display result in chat
    chatbot.addMessage({
        role: 'assistant',
        content: `The result is: ${result}`
    });
}
```

AI Assistant instruction:
```
When asked to perform calculations, use the calculate action.
Example: "What is 5 plus 3?"
Response: "Let me calculate that for you." [Action: calculate, Args: {"operation": "add", "a": 5, "b": 3}]
```

---

# Chatbot Shortcuts

Shortcuts are dynamic quick-action buttons that appear in the chatbot interface. They provide users with suggested actions or common questions, improving the chat experience by offering one-click interactions.

## What Are Shortcuts?

Shortcuts appear as clickable buttons above the chat input. When clicked, they can:
- Send predefined messages to the chatbot
- Trigger specific conversations
- Guide users through common workflows
- Provide contextual suggestions based on the conversation

## Adding Shortcuts via JavaScript

### Basic Example

```javascript
// Add shortcuts to all chatbots
MwaiAPI.chatbots.forEach(chatbot => {
    chatbot.setShortcuts([
        {
            type: 'message',
            data: { 
                label: 'Get Started', 
                message: 'Hello! What can you help me with?',
                variant: 'success',
                icon: '👋'
            }
        },
        {
            type: 'message',
            data: { 
                label: 'Contact Support', 
                message: 'I need help with a technical issue',
                variant: 'warning',
                icon: '🛠️'
            }
        }
    ]);
});
```

### Dynamic Shortcuts Based on Context

```javascript
// Listen for messages and update shortcuts dynamically
MwaiAPI.chatbots.forEach(chatbot => {
    chatbot.on('message', (message) => {
        if (message.content.includes('products')) {
            chatbot.setShortcuts([
                {
                    type: 'message',
                    data: { 
                        label: 'View Catalog', 
                        message: 'Show me your product catalog',
                        variant: 'info'
                    }
                },
                {
                    type: 'message',
                    data: { 
                        label: 'Best Sellers', 
                        message: 'What are your best selling products?',
                        variant: 'success'
                    }
                }
            ]);
        }
    });
});
```

## Adding Shortcuts via PHP

### Basic Implementation

```php
add_filter( 'mwai_chatbot_shortcuts', function ( $shortcuts, $args ) {
    // Add shortcuts for all chatbots
    $shortcuts[] = [
        'type' => 'message',
        'data' => [
            'label' => 'FAQ', 
            'message' => 'Show me frequently asked questions',
            'variant' => 'info',
            'icon' => '❓'
        ]
    ];
    
    $shortcuts[] = [
        'type' => 'message',
        'data' => [
            'label' => 'Pricing', 
            'message' => 'Tell me about your pricing plans',
            'variant' => 'success',
            'icon' => '💰'
        ]
    ];
    
    return $shortcuts;
}, 10, 2);
```

### Conditional Shortcuts

```php
add_filter( 'mwai_chatbot_shortcuts', function ( $shortcuts, $args ) {
    // Show shortcuts based on conversation content
    $hasQuery = isset($args['newMessage']) ? $args['newMessage'] : '';
    $hasReply = isset($args['reply']) ? $args['reply'] : '';
    
    // E-commerce shortcuts when products are mentioned
    if (stripos($hasQuery . $hasReply, 'product') !== false) {
        $shortcuts[] = [
            'type' => 'message',
            'data' => [
                'label' => '🛒 Cart', 
                'message' => 'Show my shopping cart',
                'variant' => 'info'
            ]
        ];
        
        $shortcuts[] = [
            'type' => 'message',
            'data' => [
                'label' => '📦 Track Order', 
                'message' => 'I want to track my order',
                'variant' => 'warning'
            ]
        ];
    }
    
    // Support shortcuts when help is needed
    if (stripos($hasQuery . $hasReply, 'help') !== false || 
        stripos($hasQuery . $hasReply, 'support') !== false) {
        $shortcuts[] = [
            'type' => 'message',
            'data' => [
                'label' => '📧 Email Support', 
                'message' => 'I need to contact support via email',
                'variant' => 'danger'
            ]
        ];
        
        $shortcuts[] = [
            'type' => 'message',
            'data' => [
                'label' => '📞 Call Us', 
                'message' => 'What is your support phone number?',
                'variant' => 'success'
            ]
        ];
    }
    
    return $shortcuts;
}, 10, 2);
```

### User-Specific Shortcuts

```php
add_filter( 'mwai_chatbot_shortcuts', function ( $shortcuts, $args ) {
    // Show different shortcuts based on user role
    if (is_user_logged_in()) {
        $user = wp_get_current_user();
        
        if (in_array('customer', $user->roles)) {
            $shortcuts[] = [
                'type' => 'message',
                'data' => [
                    'label' => 'My Orders', 
                    'message' => 'Show me my recent orders',
                    'variant' => 'info'
                ]
            ];
        }
        
        if (in_array('administrator', $user->roles)) {
            $shortcuts[] = [
                'type' => 'message',
                'data' => [
                    'label' => 'Admin Stats', 
                    'message' => 'Show me the site statistics',
                    'variant' => 'warning'
                ]
            ];
        }
    } else {
        $shortcuts[] = [
            'type' => 'message',
            'data' => [
                'label' => 'Sign Up', 
                'message' => 'How do I create an account?',
                'variant' => 'success'
            ]
        ];
    }
    
    return $shortcuts;
}, 10, 2);
```

## Shortcut Properties

- **type**: Always 'message' for shortcuts
- **data.label**: Button text displayed to user
- **data.message**: Message sent when clicked
- **data.variant**: Button style ('success', 'warning', 'danger', 'info')
- **data.icon**: Optional emoji or icon

---

# Chatbot Blocks

Blocks allow you to inject interactive HTML content directly into chat conversations. Unlike simple text responses, blocks can contain forms, buttons, custom UI elements, and even executable JavaScript.

## What Are Blocks?

Blocks are custom HTML elements that can:
- Display forms for data collection
- Show interactive widgets
- Present rich media content
- Lock the chatbot until user interaction
- Execute custom JavaScript code

## Adding Blocks via JavaScript

### Simple Content Block

```javascript
// Display a welcome message with custom styling
MwaiAPI.getChatbot().setBlocks([
    {
        type: 'content',
        data: { 
            html: `
                <div style="background: #f0f0f0; padding: 20px; border-radius: 10px;">
                    <h3>Welcome to Our Support Chat!</h3>
                    <p>How can we help you today?</p>
                    <ul>
                        <li>Technical Support</li>
                        <li>Billing Questions</li>
                        <li>Product Information</li>
                    </ul>
                </div>
            `
        }
    }
]);
```

### Interactive Form Block

```javascript
// Create a form that locks the chatbot until completed
MwaiAPI.getChatbot().setBlocks([
    {
        type: 'content',
        data: { 
            html: `
                <div class="custom-form-block">
                    <h4>Quick Survey</h4>
                    <p>Please help us improve by answering this question:</p>
                    <form id="surveyForm">
                        <label>How satisfied are you with our service?</label><br>
                        <select id="satisfaction" required>
                            <option value="">Choose...</option>
                            <option value="very-satisfied">Very Satisfied</option>
                            <option value="satisfied">Satisfied</option>
                            <option value="neutral">Neutral</option>
                            <option value="unsatisfied">Unsatisfied</option>
                        </select><br><br>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            `,
            script: `
                const chatbot = MwaiAPI.getChatbot();
                chatbot.lock(); // Prevent further messages
                
                document.getElementById('surveyForm').addEventListener('submit', function(e) {
                    e.preventDefault();
                    const satisfaction = document.getElementById('satisfaction').value;
                    
                    // Send the response as a message
                    chatbot.ask('My satisfaction level is: ' + satisfaction, true);
                    
                    // Remove the block and unlock
                    chatbot.setBlocks([]);
                    chatbot.unlock();
                });
            `
        }
    }
]);
```

## Adding Blocks via PHP

### Conditional Block Display

```php
add_filter( 'mwai_chatbot_blocks', function ( $blocks, $args ) {
    // Show block when specific keywords are detected
    $message = $args['newMessage'] ?? '';
    $reply = $args['reply'] ?? '';
    
    // Show appointment form when appointment is mentioned
    if (stripos($message . $reply, 'appointment') !== false) {
        $blocks[] = [
            'type' => 'content',
            'data' => [
                'html' => '
                    <div class="appointment-block">
                        <h4>Book an Appointment</h4>
                        <form id="appointmentForm">
                            <label>Select Date:</label>
                            <input type="date" id="apptDate" required><br><br>
                            
                            <label>Select Time:</label>
                            <select id="apptTime" required>
                                <option value="9:00">9:00 AM</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="14:00">2:00 PM</option>
                                <option value="15:00">3:00 PM</option>
                            </select><br><br>
                            
                            <label>Your Name:</label>
                            <input type="text" id="apptName" required><br><br>
                            
                            <button type="submit">Book Now</button>
                        </form>
                    </div>
                ',
                'script' => '
                    const chatbot = MwaiAPI.getChatbot("' . $args['botId'] . '");
                    chatbot.lock();
                    
                    document.getElementById("appointmentForm").addEventListener("submit", function(e) {
                        e.preventDefault();
                        
                        const date = document.getElementById("apptDate").value;
                        const time = document.getElementById("apptTime").value;
                        const name = document.getElementById("apptName").value;
                        
                        // Send appointment details
                        chatbot.ask(`Book appointment for ${name} on ${date} at ${time}`, true);
                        
                        // Show confirmation
                        chatbot.setBlocks([{
                            type: "content",
                            data: { 
                                html: "<div style=\"color: green; padding: 10px;\">✅ Appointment request sent!</div>"
                            }
                        }]);
                        
                        chatbot.unlock();
                        
                        // Clear confirmation after 3 seconds
                        setTimeout(() => chatbot.setBlocks([]), 3000);
                    });
                '
            ]
        ];
    }
    
    return $blocks;
}, 10, 2);
```

### Product Showcase Block

```php
add_filter( 'mwai_chatbot_blocks', function ( $blocks, $args ) {
    // Show products when requested
    if (stripos($args['reply'], 'here are our products') !== false) {
        $products = wc_get_products(['limit' => 3, 'status' => 'publish']);
        
        $html = '<div class="products-showcase">';
        $html .= '<h4>Featured Products</h4>';
        $html .= '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">';
        
        foreach ($products as $product) {
            $html .= sprintf(
                '<div style="border: 1px solid #ddd; padding: 10px; text-align: center;">
                    <img src="%s" style="width: 100%%; height: 100px; object-fit: cover;">
                    <h5>%s</h5>
                    <p>%s</p>
                    <button onclick="MwaiAPI.getChatbot(\'%s\').ask(\'Tell me more about %s\', true)">Learn More</button>
                </div>',
                wp_get_attachment_url($product->get_image_id()),
                esc_html($product->get_name()),
                wc_price($product->get_price()),
                $args['botId'],
                esc_html($product->get_name())
            );
        }
        
        $html .= '</div></div>';
        
        $blocks[] = [
            'type' => 'content',
            'data' => ['html' => $html]
        ];
    }
    
    return $blocks;
}, 10, 2);
```

### Data Collection Wizard

```php
add_filter( 'mwai_chatbot_blocks', function ( $blocks, $args ) {
    // Multi-step form wizard
    if (stripos($args['newMessage'], 'start wizard') !== false) {
        $blocks[] = [
            'type' => 'content',
            'data' => [
                'html' => '
                    <div id="wizard" data-step="1">
                        <div class="step" id="step1">
                            <h4>Step 1: Your Information</h4>
                            <input type="text" id="userName" placeholder="Your name">
                            <button onclick="nextStep()">Next</button>
                        </div>
                        
                        <div class="step" id="step2" style="display:none;">
                            <h4>Step 2: Your Interest</h4>
                            <select id="interest">
                                <option>Product Information</option>
                                <option>Technical Support</option>
                                <option>Pricing</option>
                            </select>
                            <button onclick="prevStep()">Back</button>
                            <button onclick="nextStep()">Next</button>
                        </div>
                        
                        <div class="step" id="step3" style="display:none;">
                            <h4>Step 3: Summary</h4>
                            <div id="summary"></div>
                            <button onclick="prevStep()">Back</button>
                            <button onclick="submitWizard()">Submit</button>
                        </div>
                    </div>
                ',
                'script' => '
                    const chatbot = MwaiAPI.getChatbot("' . $args['botId'] . '");
                    chatbot.lock();
                    
                    window.nextStep = function() {
                        const wizard = document.getElementById("wizard");
                        const currentStep = parseInt(wizard.dataset.step);
                        
                        // Hide current step
                        document.getElementById("step" + currentStep).style.display = "none";
                        
                        // Show next step
                        const nextStep = currentStep + 1;
                        document.getElementById("step" + nextStep).style.display = "block";
                        wizard.dataset.step = nextStep;
                        
                        // Update summary on last step
                        if (nextStep === 3) {
                            const name = document.getElementById("userName").value;
                            const interest = document.getElementById("interest").value;
                            document.getElementById("summary").innerHTML = 
                                `<p>Name: ${name}</p><p>Interest: ${interest}</p>`;
                        }
                    };
                    
                    window.prevStep = function() {
                        const wizard = document.getElementById("wizard");
                        const currentStep = parseInt(wizard.dataset.step);
                        document.getElementById("step" + currentStep).style.display = "none";
                        const prevStep = currentStep - 1;
                        document.getElementById("step" + prevStep).style.display = "block";
                        wizard.dataset.step = prevStep;
                    };
                    
                    window.submitWizard = function() {
                        const name = document.getElementById("userName").value;
                        const interest = document.getElementById("interest").value;
                        
                        chatbot.ask(`Wizard completed. Name: ${name}, Interest: ${interest}`, true);
                        chatbot.setBlocks([]);
                        chatbot.unlock();
                    };
                '
            ]
        ];
    }
    
    return $blocks;
}, 10, 2);
```

## Block Best Practices

1. **Always unlock the chatbot** when done with user interaction
2. **Clean up blocks** after they're no longer needed
3. **Use unique IDs** for form elements to avoid conflicts
4. **Test across devices** - ensure blocks work on mobile
5. **Provide fallbacks** for users who might have JavaScript disabled
6. **Keep scripts focused** - each block should have a single purpose

---

# MCP (Model Context Protocol)

The Model Context Protocol (MCP) enables AI agents like Claude to interact with WordPress sites through a standardized tool interface. AI Engine provides a comprehensive MCP implementation that allows developers to extend WordPress functionality accessible to AI.

## Overview

MCP is a protocol that allows AI models to use tools (functions) to interact with external systems. In AI Engine, this means Claude can manage WordPress content, upload media, analyze images, and perform custom operations defined by developers.

## Adding Custom MCP Functions

### Basic Example

```php
// 1. Register your tool
add_filter( 'mwai_mcp_tools', function( $tools ) {
    $tools[] = [
        'name' => 'get_weather',
        'description' => 'Get current weather for a city. Returns temperature and conditions.',
        'inputSchema' => [
            'type' => 'object',
            'properties' => [
                'city' => [
                    'type' => 'string',
                    'description' => 'City name (e.g., "New York", "London")'
                ],
                'units' => [
                    'type' => 'string',
                    'enum' => ['celsius', 'fahrenheit'],
                    'default' => 'celsius',
                    'description' => 'Temperature units'
                ]
            ],
            'required' => ['city']
        ]
    ];
    return $tools;
});

// 2. Handle execution
add_filter( 'mwai_mcp_callback', function( $result, $tool, $args, $id ) {
    if ( $tool !== 'get_weather' ) {
        return $result;
    }
    
    // Your logic here
    $city = $args['city'];
    $units = $args['units'] ?? 'celsius';
    
    // Simulated weather data
    $weather = [
        'city' => $city,
        'temperature' => rand(15, 30),
        'units' => $units,
        'conditions' => 'Partly cloudy'
    ];
    
    return $weather; // AI Engine handles JSON-RPC wrapping
}, 10, 4 );
```

### WordPress Integration Example

```php
// Register a tool for custom post type management
add_filter( 'mwai_mcp_tools', function( $tools ) {
    $tools[] = [
        'name' => 'manage_products',
        'description' => 'Create, update, or search WooCommerce products. Can handle inventory, pricing, and product details.',
        'inputSchema' => [
            'type' => 'object',
            'properties' => [
                'action' => [
                    'type' => 'string',
                    'enum' => ['create', 'update', 'search'],
                    'description' => 'Action to perform'
                ],
                'title' => [
                    'type' => 'string',
                    'description' => 'Product title (for create/update)'
                ],
                'price' => [
                    'type' => 'number',
                    'description' => 'Product price'
                ],
                'sku' => [
                    'type' => 'string',
                    'description' => 'Product SKU'
                ],
                'stock' => [
                    'type' => 'integer',
                    'description' => 'Stock quantity'
                ],
                'search_term' => [
                    'type' => 'string',
                    'description' => 'Search term (for search action)'
                ],
                'product_id' => [
                    'type' => 'integer',
                    'description' => 'Product ID (for update action)'
                ]
            ],
            'required' => ['action']
        ]
    ];
    return $tools;
});

add_filter( 'mwai_mcp_callback', function( $result, $tool, $args, $id ) {
    if ( $tool !== 'manage_products' ) return $result;
    
    switch ( $args['action'] ) {
        case 'create':
            $product = new WC_Product_Simple();
            $product->set_name( $args['title'] );
            $product->set_regular_price( $args['price'] );
            if ( isset($args['sku']) ) $product->set_sku( $args['sku'] );
            if ( isset($args['stock']) ) {
                $product->set_manage_stock( true );
                $product->set_stock_quantity( $args['stock'] );
            }
            $product->save();
            
            return [
                'success' => true,
                'product_id' => $product->get_id(),
                'message' => "Product '{$args['title']}' created successfully"
            ];
            
        case 'search':
            $products = wc_get_products([
                's' => $args['search_term'],
                'limit' => 10
            ]);
            
            return array_map( function($p) {
                return [
                    'id' => $p->get_id(),
                    'title' => $p->get_name(),
                    'price' => $p->get_price(),
                    'stock' => $p->get_stock_quantity()
                ];
            }, $products );
            
        case 'update':
            // Update logic here
            break;
    }
}, 10, 4 );
```

## Best Practices for Tool Descriptions

**EXTREMELY IMPORTANT**: Write clear, detailed descriptions that help AI understand exactly what your tool does and when to use it.

### Good Description Examples

```php
// ✅ GOOD - Clear, specific, and actionable
'description' => 'Search and filter WooCommerce products by name, SKU, or category. Returns product details including price, stock, and variations.'

// ✅ GOOD - Explains capabilities and use cases
'description' => 'Analyze website performance metrics including page load times, database queries, and memory usage. Useful for debugging slow pages.'

// ❌ BAD - Too vague
'description' => 'Handle products'

// ❌ BAD - No context about what it returns
'description' => 'Get data from API'
```

### Parameter Descriptions

Always describe parameters clearly:

```php
'properties' => [
    'post_id' => [
        'type' => 'integer',
        'description' => 'WordPress post ID. Use 0 to get the current post.'
    ],
    'meta_key' => [
        'type' => 'string',
        'description' => 'Custom field name (e.g., "_price", "custom_color")'
    ],
    'format' => [
        'type' => 'string',
        'enum' => ['raw', 'formatted'],
        'default' => 'formatted',
        'description' => 'Output format. "raw" returns database value, "formatted" applies WordPress filters.'
    ]
]
```

## Error Handling

```php
add_filter( 'mwai_mcp_callback', function( $result, $tool, $args, $id ) {
    if ( $tool !== 'your_tool' ) return $result;
    
    try {
        // Validate inputs
        if ( empty($args['required_param']) ) {
            throw new Exception('Missing required parameter: required_param');
        }
        
        // Check permissions
        if ( !current_user_can('edit_posts') ) {
            throw new Exception('Insufficient permissions to perform this action');
        }
        
        // Your logic here
        $data = process_something($args);
        
        if ( !$data ) {
            throw new Exception('Failed to process request: No data returned');
        }
        
        return $data;
        
    } catch ( Exception $e ) {
        // Exception message will be properly formatted as JSON-RPC error
        throw $e;
    }
}, 10, 4 );
```

## Built-in Tools Reference

AI Engine includes 40+ built-in tools. Key categories:

- **Posts**: create_post, read_post, update_post, delete_post, search_posts
- **Media**: upload_media, get_media_url, delete_attachment
- **Users**: create_user, update_user, get_current_user
- **Options**: get_option, update_option
- **AI Features**: vision (image analysis), imagine (image generation)

See implementation examples in:
- `labs/mcp-core.php` - Core WordPress tools
- `labs/mcp-rest.php` - REST API integration
- `premium/mcp_plugin.php` - Plugin management
- `premium/mcp_theme.php` - Theme management

## Testing Your MCP Tools

1. **Enable MCP** in AI Engine settings
2. **Get your Bearer token** from the MCP section
3. **Add to Claude**: Use the MCP server URL with your token
4. **Test with Claude**: Ask Claude to use your custom tool

Example Claude prompt:
```
"Can you search for products with 'laptop' in the name and show me their prices?"
```

## Advanced Features

### Conditional Tool Registration

```php
add_filter( 'mwai_mcp_tools', function( $tools ) {
    // Only add tool if WooCommerce is active
    if ( class_exists('WooCommerce') ) {
        $tools[] = [
            'name' => 'woo_reports',
            'description' => 'Generate WooCommerce sales reports',
            // ... rest of tool definition
        ];
    }
    
    // Add tool based on user capabilities
    if ( current_user_can('manage_options') ) {
        $tools[] = [
            'name' => 'admin_tasks',
            'description' => 'Perform administrative tasks',
            // ... rest of tool definition
        ];
    }
    
    return $tools;
});
```

### Complex Return Values

```php
// Return structured data - AI Engine handles JSON encoding
return [
    'status' => 'success',
    'data' => [
        'total' => 42,
        'items' => $items,
        'metadata' => [
            'generated_at' => current_time('mysql'),
            'cache_hit' => false
        ]
    ],
    'messages' => [
        'Found 42 matching items',
        'Results limited to first 20'
    ]
];
```

### Access Control

```php
// Control MCP access
add_filter( 'mwai_allow_mcp', function( $allow, $user_id ) {
    // Only allow specific users
    $allowed_users = [1, 42, 99];
    return in_array($user_id, $allowed_users);
}, 10, 2 );
```

## Tips for Success

1. **Start Simple**: Begin with read-only tools before adding write operations
2. **Test Thoroughly**: Ensure your tools handle edge cases and invalid inputs
3. **Document Well**: Good descriptions save time and improve AI accuracy
4. **Security First**: Always validate inputs and check permissions
5. **Return Useful Data**: Structure responses for easy AI interpretation

Remember: The MCP system automatically handles JSON-RPC protocol details, so focus on your business logic and return clean, structured data.

---

# Discussion Context Menu

You can customize the context menu that appears when clicking the three-dot icon on discussions. The menu supports regular items, separators, and custom HTML content.

## Menu Item Structure

Each menu item can have the following properties:

- `id`: Unique identifier for the item (required for regular items)
- `type`: Item type - 'separator' or 'title' (optional, defaults to regular item)
- `label`: Text to display (for regular items and titles)
- `onClick`: Function called when item is clicked, receives the discussion object
- `className`: CSS class names (defaults to 'mwai-menu-item')
- `style`: Inline styles object (optional)
- `html`: Custom HTML content (overrides label)

## Examples

### Add Custom Actions

```javascript
// Add a simple alert action
MwaiAPI.addFilter('mwai_discussion_menu_items', (items, discussion) => {
  items.push({
    id: 'alert',
    label: 'Show Info',
    onClick: (discussion) => {
      alert(`Discussion ID: ${discussion.chatId}\nMessages: ${discussion.messages.length}`);
    }
  });
  return items;
});


// Add multiple items with separator
MwaiAPI.addFilter('mwai_discussion_menu_items', (items, discussion) => {
  // Add separator before custom items
  items.push({ type: 'separator' });
  
  // Add title
  items.push({
    type: 'title',
    label: 'Custom Actions'
  });
  
  // Add export action
  items.push({
    id: 'export',
    label: 'Export JSON',
    onClick: (discussion) => {
      const json = JSON.stringify(discussion, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `discussion-${discussion.chatId}.json`;
      a.click();
    }
  });
  
  // Add copy ID action
  items.push({
    id: 'copy-id',
    label: 'Copy Chat ID',
    onClick: (discussion) => {
      navigator.clipboard.writeText(discussion.chatId);
      alert('Chat ID copied to clipboard!');
    }
  });
  
  return items;
});

// Add item with custom HTML and styling
MwaiAPI.addFilter('mwai_discussion_menu_items', (items, discussion) => {
  items.push({
    id: 'custom-html',
    html: `<div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 16px;">📊</span>
      <span>Stats: ${discussion.messages.length} msgs</span>
    </div>`,
    onClick: (discussion) => {
      console.log('Custom item clicked', discussion);
    }
  });
  return items;
});

// Reorder or remove default items
MwaiAPI.addFilter('mwai_discussion_menu_items', (items, discussion) => {
  // Move delete to top
  const deleteItem = items.find(item => item.id === 'delete');
  const otherItems = items.filter(item => item.id !== 'delete');
  return [deleteItem, ...otherItems];
});

// Conditionally show items based on discussion
MwaiAPI.addFilter('mwai_discussion_menu_items', (items, discussion) => {
  // Only show archive option for discussions with more than 10 messages
  if (discussion.messages.length > 10) {
    items.push({
      id: 'archive',
      label: 'Archive',
      className: 'mwai-menu-item',
      style: { color: '#0066cc' },
      onClick: (discussion) => {
        console.log('Archiving discussion:', discussion.chatId);
        // Your archive logic here
      }
    });
  }
  return items;
});
```

### Complete Example with All Features

```javascript
// Comprehensive context menu customization
MwaiAPI.addFilter('mwai_discussion_menu_items', (items, discussion) => {
  // Keep default items
  const newItems = [...items];
  
  // Add separator
  newItems.push({ type: 'separator' });
  
  // Add section title
  newItems.push({
    type: 'title',
    label: 'Developer Tools'
  });
  
  // Add debug info item
  newItems.push({
    id: 'debug',
    label: 'Debug Info',
    onClick: (discussion) => {
      console.log('Discussion Object:', discussion);
      alert(`Chat ID: ${discussion.chatId}\nTitle: ${discussion.title || 'Untitled'}\nMessages: ${discussion.messages.length}`);
    }
  });
  
  // Add item with custom icon (using emoji as HTML)
  newItems.push({
    id: 'favorite',
    html: '<span>⭐ Add to Favorites</span>',
    onClick: (discussion) => {
      // Your favorite logic here
      console.log('Added to favorites:', discussion.chatId);
    }
  });
  
  return newItems;
}, 20); // Higher priority to run after other filters
```