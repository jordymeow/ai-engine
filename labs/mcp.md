# Using MCP with AI Engine

## What's this all about?

**Model‑Context‑Protocol (MCP)** is the open standard Claude uses to talk to external *tool servers.* When Claude detects an MCP server it can:

1. **list** the server's tools (`tools/list`),
2. (optionally) let you pick one, then
3. **call** a tool (`tools/call`) via JSON‑RPC.

With **AI Engine** active your WordPress site publishes **30‑plus tools** that let Claude:

- read & write posts, pages and custom post‑types,
- upload or generate media,
- manage categories, tags & any taxonomy,
- switch, fork and live‑edit themes,
- list plugins… and more.

`mcp.js` is the Node relay that connects Claude Desktop to your WordPress site seamlessly.

> **Heads‑up – advanced users only.** Everything here is still beta. Be ready for CLI work, PHP/FPM restarts and some detective work if hosting layers interfere.

---

## 1 · Quick Start

### Requirements
- **WordPress 6.x** with REST API enabled
- **AI Engine plugin** active
- **Claude Desktop ≥ 0.9.2** 
- **Node ≥ 20.19.0**

### Setup (2 simple steps)

1. **Get your No-Auth URL from WordPress**
   - Go to **AI Engine › DevTools › MCP Settings**
   - Enable **No-Auth URL**
   - Copy the full URL (e.g., `https://yoursite.com/wp-json/mcp/v1/abc123token/sse`)

2. **Add your site and test**
   ```bash
   ./mcp.js add https://yoursite.com/wp-json/mcp/v1/YOUR_TOKEN/sse
   ./mcp.js start
   ```

That's it! Claude should now show a **plug icon** and **hammer** with ≈30 tools.

---

## 2 · Available Commands

```bash
# Add a new site with No-Auth URL (automatically sets it as Claude's target)
./mcp.js add <noauth-url>
# Example: ./mcp.js add https://example.com/wp-json/mcp/v1/abc123/sse

# List all registered sites (→ shows current Claude target)
./mcp.js list

# Interactively select which site Claude should use
./mcp.js select

# Test connection with verbose output
./mcp.js start

# Remove a site
./mcp.js remove <site-url>

# Advanced: Manual testing
./mcp.js post <domain> <json> <session_id>
```

### Smart Defaults
- `start` automatically uses the site Claude is configured for
- `add` automatically sets the new site as Claude's target
- `select` shows a numbered menu when you have multiple sites

---

## 3 · Testing Your Connection

When you run `./mcp.js start`, you'll see:

```
  /\_/\
 ( o.o )
  > ^ <   Welcome to MCP by AI Engine

▶ Connecting to MCP server
https://yoursite.com/wp-json/mcp/v1/sse/

✓ SSE connection established
✓ MCP server connected
https://yoursite.com/wp-json/mcp/v1/messages?session_id=abc123...

Test the connection in another terminal:
./mcp.js post yoursite.com '{"jsonrpc":"2.0","method":"tools/list","id":1}' abc123...

Or test with simple ping (requires Tuned Core):
./mcp.js post yoursite.com '{"jsonrpc":"2.0","method":"mcp_ping","id":2}' abc123...

Results will appear in this terminal.
```

Just copy-paste one of the test commands to verify everything works!

---

## 4 · Multiple Sites Made Easy

If you have multiple WordPress sites:

```bash
# Add all your sites (get each No-Auth URL from WordPress)
./mcp.js add https://site1.com/wp-json/mcp/v1/token1/sse
./mcp.js add https://site2.com/wp-json/mcp/v1/token2/sse
./mcp.js add https://site3.com/wp-json/mcp/v1/token3/sse

# See which one Claude is using
./mcp.js list
# Output:
# → https://site3.com
# • https://site1.com
# • https://site2.com

# Switch to a different site
./mcp.js select
# Shows interactive menu:
# Select a site for Claude:
#   1. https://site1.com
#   2. https://site2.com
#   3. https://site3.com (current)
#
# Enter selection (1-3): 1
# ✓ Claude → https://site1.com
```

---

## 5 · Prompt Ideas

| Level          | Example                                                                                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| *Simple*       | "List my latest 5 posts." "Create a post titled *My AI Journey* (one paragraph) and attach a media‑library image."                  |
| *Intermediate* | "Look at the 10 newest posts, then publish a logical follow‑up. Re‑use existing categories & tags. If no image fits, generate one." |
| *Advanced*     | "Fork *Twenty Twenty‑One* into a grid‑layout theme called *Futurism* supporting post types Article & Project."                      |

---

## 6 · Troubleshooting

### Authentication Issues
- **Claude shows no tools**: Verify your No-Auth URL is correct
- **401/403 errors**: Get a fresh No-Auth URL from WordPress → AI Engine → Dev Tools → MCP Settings
- **Invalid URL format**: Make sure you copied the full URL including `/sse` at the end

### Connection Issues
- **Can't connect**: Test the No-Auth URL directly in a browser - you should see SSE connection
- **Stalls on managed hosting**: See hosting caveats below

### Quick Reset
```bash
./mcp.js remove yoursite.com
# Get fresh No-Auth URL from WordPress, then:
./mcp.js add https://yoursite.com/wp-json/mcp/v1/NEW_TOKEN/sse
./mcp.js start  # test again
```

---

## 7 · Hosting Caveats

### Edge Caching (Cloudflare/Kinsta)
Edge caching must be **bypassed** for `/wp-json/mcp/*` routes:

*Cloudflare Dashboard › Rules › Bypass Cache* for pattern `/wp-json/mcp/*`

### PHP Worker Limits
Each SSE connection uses one PHP worker. On shared hosting (5-8 workers), multiple Claude tabs can exhaust your pool.

### If Site Stalls
```bash
# Reset and restart PHP
sudo systemctl restart php-fpm
./mcp.js start  # try again
```

---

## 8 · Advanced Usage

### Manual JSON-RPC Testing
```bash
# Test tools list  
./mcp.js post yoursite.com '{"jsonrpc":"2.0","method":"tools/list","id":1}' SESSION_ID

# Test simple ping (requires Tuned Core)
./mcp.js post yoursite.com '{"jsonrpc":"2.0","method":"mcp_ping","id":2}' SESSION_ID
```

### Logs Location
All logs are stored in `~/.mcp/`:
- `mcp.log` - Headers and requests
- `mcp-results.log` - Full responses  
- `error.log` - Errors and crashes
- `sites.json` - Your registered sites

### Verbose PHP Logging
```php
// wp-content/plugins/ai-engine/classes/modules/mcp.php
private $logging = true;
```

Then tail `wp-content/debug.log`.

### Adding Custom MCP Tools

Developers can extend MCP with custom tools using WordPress filters. Here's an example that adds a search function:

```php
// In your theme's functions.php or a custom plugin

// Register your custom tool
add_filter( 'mwai_mcp_tools', function( $tools ) {
    $tools[] = [
        'name' => 'search_posts',
        'description' => 'Search posts by keyword and return titles with URLs',
        'inputSchema' => [
            'type' => 'object',
            'properties' => [
                'keyword' => [
                    'type' => 'string',
                    'description' => 'The keyword to search for in post titles and content',
                ],
                'limit' => [
                    'type' => 'number',
                    'description' => 'Maximum number of results to return (default: 10)',
                    'default' => 10,
                ],
            ],
            'required' => ['keyword'],
        ],
    ];
    
    return $tools;
});

// Handle the tool execution - just return the result!
add_filter( 'mwai_mcp_callback', function( $result, $tool, $args, $id ) {
    if ( $tool !== 'search_posts' ) {
        return $result;
    }
    
    $keyword = $args['keyword'] ?? '';
    $limit = $args['limit'] ?? 10;
    
    // Perform the search
    $query = new WP_Query([
        's' => $keyword,
        'post_type' => 'post',
        'post_status' => 'publish',
        'posts_per_page' => $limit,
    ]);
    
    $results = [];
    if ( $query->have_posts() ) {
        while ( $query->have_posts() ) {
            $query->the_post();
            $results[] = [
                'title' => get_the_title(),
                'url' => get_permalink(),
                'excerpt' => get_the_excerpt(),
                'date' => get_the_date(),
            ];
        }
        wp_reset_postdata();
    }
    
    // Simply return the results - AI Engine handles the JSON-RPC wrapping!
    return $results;
    
    // You can also return:
    // - A string: return 'Found ' . count($results) . ' posts';
    // - An array with 'content' key for custom formatting:
    //   return [
    //       'content' => [
    //           ['type' => 'text', 'text' => 'Search results:'],
    //           ['type' => 'text', 'text' => json_encode($results)]
    //       ]
    //   ];
}, 10, 4 );
```

This simplified example shows:
- Using `mwai_mcp_tools` filter to register new tools
- Defining proper `inputSchema` for tool parameters
- Using `mwai_mcp_callback` filter to handle tool execution
- **Just returning your data** - AI Engine automatically handles the JSON-RPC protocol!

The callback can return:
- **A string**: Simple text response
- **An array**: Will be JSON-encoded and sent to Claude
- **An array with 'content' key**: For custom formatting with multiple text blocks
- **Throw an Exception**: For error handling (AI Engine will format it properly)

Claude will automatically discover your custom tool and can use it like:
> "Search for posts about 'artificial intelligence' and show me the top 5 results"

---

## 9 · What Happens Under the Hood

1. `mcp.js` opens a long‑lived **SSE** connection to `/wp-json/mcp/v1/sse`
2. WordPress sends back a session URL: `/wp-json/mcp/v1/messages?session_id=...`
3. The relay tunnels Claude's JSON‑RPC to that messages endpoint
4. Responses stream back to Claude via stdout
5. When Claude quits, the relay sends `{"method":"mwai/kill"}` and cleans up

Simple and reliable!