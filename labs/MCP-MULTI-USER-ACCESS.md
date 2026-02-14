# MCP Multi-User Access — Technical Specification

## Why This Feature

AI Engine Pro's MCP (Model Context Protocol) currently uses a **single global bearer token** that grants full administrator access to all 98+ MCP tools. This is a binary model: either you have the token (full admin), or you don't (no access).

This works for single-user setups where the site owner connects their own AI client (Claude Desktop, etc.), but it doesn't scale to real-world scenarios:

- **Agencies** want to give clients limited MCP access (e.g., content editing only, no plugin/theme management)
- **Teams** need different access levels for different members (editor vs admin)
- **Service accounts** need scoped tokens for automated workflows (a bot that only manages SEO, or only syncs products)
- **Security** — a leaked token currently means full admin access to everything, including arbitrary SQL execution and PHP file writing

The goal is to replace the single token with a **multi-token system** where each token is linked to a WordPress user, and permissions are determined by that user's WordPress role and capabilities.

---

## Current Architecture

### Authentication Flow (`labs/mcp.php`)

1. A request comes in with a bearer token (via `Authorization` header or URL path)
2. `auth_via_bearer_token()` checks the token against the stored value
3. If it matches, `wp_set_current_user()` is called with the **first administrator user** found via `get_users(['role' => 'administrator'])`
4. All subsequent operations run as that admin user

There's also a `mwai_allow_mcp` filter that defaults to `current_user_can('administrator')`.

### The Privilege Escalation Pattern

Every MCP module (Plugin, Theme, Database, Polylang, WooCommerce) has this code in its `handle_call()` method:

```php
if ( !current_user_can( 'administrator' ) ) {
    wp_set_current_user( 1 );
}
```

This was written to ensure tools have sufficient privileges when called via the bearer token (which may not have a WordPress session). But it means: **even if we set a lower-privilege user, every module silently promotes them back to user ID 1 (super admin).**

MCP Core (`labs/mcp-core.php`) and MCP Dynamic REST (`labs/mcp-rest.php`) have no permission check at all — they rely entirely on the outer auth layer.

### No Per-Tool Capability Checks

**Zero** of the 98+ MCP tools check `current_user_can()` before performing their operation. They all assume the caller is an administrator.

---

## Proposed Solution

### Core Concept

Each MCP access token is **always linked to a WordPress user**. The linked user's WordPress role and capabilities determine what they can do. No custom permission system — we delegate entirely to WordPress's battle-tested capability model.

### Token Data Model

Stored as an array in `wp_options` (key: `mwai_mcp_tokens` or similar), similar to how `mcp_envs` currently works:

```php
[
    [
        'id'        => 'auto-generated-uuid',
        'name'      => 'Jordy - Claude Desktop',    // Friendly label
        'token'     => 'mcp_xxxxxxxxxxxxxxxx',       // Auto-generated bearer token
        'userId'    => 42,                            // Required: linked WordPress user ID
        'features'  => ['core', 'plugin', 'seo'],    // Which MCP features this token can access
        'enabled'   => true,                          // Toggle without deleting
        'createdAt' => '2026-02-11T00:00:00Z',
        'lastUsed'  => '2026-02-11T12:34:56Z',       // Updated on each use
    ],
    // ... more tokens
]
```

### Authentication Flow (New)

When **multi-user mode is disabled** (default): current behavior, single bearer token, full admin. Nothing changes.

When **multi-user mode is enabled**:

1. Request comes in with bearer token
2. Look up the token in the `mwai_mcp_tokens` array
3. If not found → reject (401)
4. If found but `enabled === false` → reject (403)
5. Resolve the linked WordPress user (`userId`)
6. If user doesn't exist or is disabled → reject (403)
7. Call `wp_set_current_user($userId)` — this sets the user context for the entire request
8. Check if the requested MCP feature is in the token's `features` list → if not, reject (403)
9. Check if the user has the required capability for that module → if not, reject (403)
10. Proceed with the tool call — **no escalation**

The global bearer token field is hidden/disabled in the UI when multi-user mode is on.

### Module-Level Capability Gating

Rather than adding `current_user_can()` to all 98+ tools individually, we gate at the **module level**. Each MCP module declares its required WordPress capability:

| Module | ID | Required Capability | Rationale |
|--------|----|--------------------:|-----------|
| Core (posts, terms, media, users, options, comments) | `core` | `edit_posts` | Basic content operations. Individual WP functions add secondary checks. |
| Plugin Management | `plugin` | `manage_options` | Admin-only. Creates/deletes PHP files on disk. |
| Theme Management | `theme` | `edit_theme_options` | Admin-only. Creates/deletes files on disk. |
| Database | `database` | `manage_options` | Admin-only. Executes arbitrary SQL. |
| WooCommerce | `woocommerce` | `manage_woocommerce` | WooCommerce manager role. |
| Polylang | `polylang` | `edit_posts` | Content operations. |
| Dynamic REST | `rest` | `edit_posts` | Defers to WP REST permission callbacks. |
| Third-party (default) | varies | `manage_options` | Unknown tools default to admin-only for safety. |

In each module's `handle_call()`, replace the escalation pattern:

```php
// BEFORE (current — escalates to admin):
if ( !current_user_can( 'administrator' ) ) {
    wp_set_current_user( 1 );
}

// AFTER (multi-user mode — denies if insufficient):
if ( $this->core->is_multi_user_mcp() ) {
    if ( !current_user_can( $this->required_capability ) ) {
        throw new Exception( 'Insufficient permissions for ' . $this->module_name );
    }
    // Do NOT escalate. The user stays as whoever they are.
}
else {
    // Legacy behavior: single token mode, escalate as before
    if ( !current_user_can( 'administrator' ) ) {
        wp_set_current_user( 1 );
    }
}
```

This keeps backward compatibility when multi-user is off, and enforces real permissions when it's on.

### MCP Core Tools — Special Considerations

MCP Core (`mcp-core.php`) has 36+ tools spanning very different capability requirements:

| Tool Group | Examples | Actual Capability Needed |
|------------|----------|------------------------:|
| Posts/Pages | `wp_get_posts`, `wp_create_post`, `wp_delete_post` | `edit_posts`, `delete_posts` |
| Users | `wp_get_users`, `wp_create_user`, `wp_update_user` | `list_users`, `create_users`, `edit_users` |
| Options | `wp_get_option`, `wp_update_option` | `manage_options` |
| Comments | `wp_get_comments`, `wp_create_comment`, `wp_delete_comment` | `moderate_comments` |
| Terms/Taxonomies | `wp_get_terms`, `wp_create_term`, `wp_delete_term` | `manage_categories` |
| Media | `wp_get_media`, `wp_upload_media`, `wp_delete_media` | `upload_files` |

Setting the module-level gate to `edit_posts` would let editors access posts/media but they'd still be blocked by WordPress's own checks when trying to create users or update options. However, they could potentially call `wp_get_option` and `wp_get_users` since those functions don't always check capabilities internally.

**Decision needed**: Should MCP Core be split into sub-modules (content, users, options, media)? Or should we add per-tool-group checks within `handle_call()`? The latter is simpler:

```php
// In mcp-core.php handle_call():
$admin_only_tools = ['wp_get_option', 'wp_update_option', 'wp_get_users',
    'wp_create_user', 'wp_update_user'];

if ( $this->core->is_multi_user_mcp() && in_array($tool_name, $admin_only_tools) ) {
    if ( !current_user_can( 'manage_options' ) ) {
        throw new Exception( 'This tool requires administrator access.' );
    }
}
```

This avoids splitting the module while protecting the most sensitive tools.

### Third-Party MCP Features (Filters)

Third-party plugins (SEO Engine, etc.) register MCP features via filters. They need a way to declare their required capability. We extend the registration filter:

```php
// Current registration (example):
add_filter( 'mwai_mcp_features', function( $features ) {
    $features[] = [
        'id'    => 'seo-engine',
        'name'  => 'SEO Engine',
        'tools' => [ ... ],
    ];
    return $features;
});

// Updated registration with capability:
add_filter( 'mwai_mcp_features', function( $features ) {
    $features[] = [
        'id'         => 'seo-engine',
        'name'       => 'SEO Engine',
        'tools'      => [ ... ],
        'capability' => 'manage_options', // NEW: required capability
    ];
    return $features;
});
```

If `capability` is not declared, it defaults to `manage_options` (admin-only) for safety. This is a conservative default — third-party tools are admin-only until explicitly declared otherwise.

---

## Admin UI

### Location

Settings > MCP tab, new section **above** MCP Functions: **"MCP Access"**

### Layout

**Toggle**: "Multi-User Access" (off by default)

When **off**: current UI unchanged (global bearer token field visible).

When **on**:
- Global bearer token field is hidden (replaced by a note explaining it's disabled)
- Token list appears (accordion UI, same pattern as MCP Servers)
- Each accordion item shows:

```
┌─────────────────────────────────────────────────────┐
│ ▼ Jordy - Claude Desktop                    [Toggle]│
├─────────────────────────────────────────────────────┤
│ Name:     [Jordy - Claude Desktop          ]        │
│ Token:    [mcp_xxxxxxxxxxxx] [Copy] [Regenerate]    │
│ User:     [Jordy Meow (admin) ▼            ]        │
│                                                     │
│ ▼ Features                                          │
│   ☑ Core (Posts, Media, Terms, Comments)            │
│   ☑ Plugin Management                               │
│   ☑ Theme Management                                │
│   ☐ Database                                        │
│   ☑ SEO Engine                                      │
│   ☐ WooCommerce                                     │
│                                                     │
│ ▼ Info                                              │
│   Created: 2026-02-11                               │
│   Last Used: 2026-02-11 12:34                       │
│   Token ID: abc123                                  │
│                                                     │
│                                        [Delete]     │
└─────────────────────────────────────────────────────┘
```

The features list is **dynamically populated** from all registered MCP modules (built-in + third-party via filters). Each feature shows its display name and whether it requires admin-level access.

---

## Full Tool Audit

### Overview

| Module | File | Tools | Permission Check | Escalates? |
|--------|------|------:|:----------------:|:----------:|
| Core | `labs/mcp-core.php` | 36+ | None | No (relies on auth layer) |
| Dynamic REST | `labs/mcp-rest.php` | ~15 | None (defers to WP REST) | No |
| Plugin | `premium/mcp-plugin.php` | 14 | Escalates to user 1 | **Yes** |
| Theme | `premium/mcp-theme.php` | 14 | Escalates to user 1 | **Yes** |
| Database | `premium/mcp-database.php` | 1 | Escalates to user 1 | **Yes** |
| Polylang | `premium/mcp-polylang.php` | 11 | Escalates to user 1 | **Yes** |
| WooCommerce | `premium/mcp-woo-commerce.php` | 22+ | Escalates to user 1 | **Yes** |
| **Total** | | **~98+** | **0 per-tool checks** | |

### MCP Core — `labs/mcp-core.php` (36+ tools)

No `handle_call()` permission check. No escalation. Relies entirely on the outer auth layer.

| Tool | Type | Should Require |
|------|:----:|---------------:|
| `wp_list_plugins` | READ | `activate_plugins` |
| `wp_get_users` | READ | `list_users` |
| `wp_create_user` | WRITE | `create_users` |
| `wp_update_user` | WRITE | `edit_users` / `promote_users` |
| `wp_get_comments` | READ | `moderate_comments` |
| `wp_create_comment` | WRITE | `moderate_comments` |
| `wp_update_comment` | WRITE | `moderate_comments` |
| `wp_delete_comment` | DESTRUCTIVE | `moderate_comments` |
| `wp_get_option` | READ | `manage_options` |
| `wp_update_option` | WRITE | `manage_options` |
| `wp_count_posts` | READ | `read` |
| `wp_count_terms` | READ | `read` |
| `wp_count_media` | READ | `read` |
| `wp_get_post_types` | READ | `read` |
| `wp_get_posts` | READ | `edit_posts` |
| `wp_get_post` | READ | `edit_posts` |
| `wp_get_post_snapshot` | READ | `edit_posts` |
| `wp_create_post` | WRITE | `edit_posts` / `publish_posts` |
| `wp_update_post` | WRITE | `edit_posts` |
| `wp_delete_post` | DESTRUCTIVE | `delete_posts` |
| `wp_alter_post` | WRITE | `edit_posts` |
| `wp_get_post_meta` | READ | `edit_posts` |
| `wp_update_post_meta` | WRITE | `edit_posts` |
| `wp_delete_post_meta` | DESTRUCTIVE | `edit_posts` |
| `wp_set_featured_image` | WRITE | `edit_posts` |
| `wp_get_taxonomies` | READ | `read` |
| `wp_get_terms` | READ | `read` |
| `wp_create_term` | WRITE | `manage_categories` |
| `wp_update_term` | WRITE | `manage_categories` |
| `wp_delete_term` | DESTRUCTIVE | `manage_categories` |
| `wp_get_post_terms` | READ | `read` |
| `wp_add_post_terms` | WRITE | `edit_posts` |
| `wp_get_media` | READ | `upload_files` |
| `wp_upload_media` | WRITE | `upload_files` |
| `wp_upload_request` | WRITE | `upload_files` |
| `wp_update_media` | WRITE | `upload_files` |
| `wp_delete_media` | DESTRUCTIVE | `delete_posts` |
| `mwai_vision` | READ (uses AI credits) | `edit_posts` |
| `mwai_image` | WRITE (uses AI credits) | `upload_files` |

**Sensitive tools within Core** that need extra gating in multi-user mode:
- `wp_get_option` / `wp_update_option` — can read/write ANY WordPress option
- `wp_get_users` / `wp_create_user` / `wp_update_user` — user management, can change passwords and roles
- `wp_list_plugins` — can reveal installed plugins (information disclosure)

### MCP Plugin — `premium/mcp-plugin.php` (14 tools)

`handle_call()` escalates to user 1 if not admin. Has `safe_path()` traversal protection and `is_ai_plugin()` restriction (write operations limited to AI Engine-created plugins).

| Tool | Type | Notes |
|------|:----:|------:|
| `wp_list_plugins_detailed` | READ | Lists ALL plugins |
| `wp_activate_plugin` | WRITE | Works on ANY plugin |
| `wp_deactivate_plugin` | WRITE | Works on ANY plugin |
| `wp_create_plugin` | WRITE | Creates PHP files on disk |
| `wp_copy_plugin` | WRITE | Copies files on disk |
| `wp_rename_plugin` | WRITE | Renames plugin directory |
| `wp_delete_plugin` | DESTRUCTIVE | Deletes plugin (AI-created only) |
| `wp_plugin_mkdir` | WRITE | Creates directories |
| `wp_plugin_list_dir` | READ | Lists filesystem |
| `wp_plugin_delete_path` | DESTRUCTIVE | Recursive delete |
| `wp_plugin_get_file` | READ | Reads PHP source code |
| `wp_plugin_put_file` | WRITE | Writes arbitrary PHP files |
| `wp_plugin_alter_file` | WRITE | Search/replace in PHP files |

**Risk**: `wp_plugin_put_file` can write arbitrary PHP — effectively remote code execution.

### MCP Theme — `premium/mcp-theme.php` (14 tools)

Same escalation pattern. Same `safe_path()` and `is_ai_theme()` protections.

| Tool | Type | Notes |
|------|:----:|------:|
| `wp_list_themes` | READ | Lists ALL themes |
| `wp_switch_theme` | WRITE | Changes active theme (ANY theme) |
| `wp_create_theme` | WRITE | Creates theme files on disk |
| `wp_copy_theme` | WRITE | Copies theme files |
| `wp_rename_theme` | WRITE | Renames theme directory |
| `wp_delete_theme` | DESTRUCTIVE | Deletes theme (AI-created only) |
| `wp_theme_mkdir` | WRITE | Creates directories |
| `wp_theme_list_dir` | READ | Lists filesystem |
| `wp_theme_delete_path` | DESTRUCTIVE | Recursive delete |
| `wp_theme_get_file` | READ | Reads source files |
| `wp_theme_put_file` | WRITE | Writes arbitrary files |
| `wp_theme_alter_file` | WRITE | Search/replace in files |
| `wp_theme_set_screenshot` | WRITE | Downloads URL to filesystem |

### MCP Database — `premium/mcp-database.php` (1 tool)

| Tool | Type | Notes |
|------|:----:|------:|
| `wp_db_query` | READ + WRITE + DESTRUCTIVE | **Executes arbitrary SQL.** Differentiates SELECT (read) vs other (write) but does NOT prevent DROP/TRUNCATE/DELETE. |

**Highest-risk tool in the entire MCP suite.** Should always be admin-only.

### MCP Polylang — `premium/mcp-polylang.php` (11 tools)

| Tool | Type |
|------|:----:|
| `pll_get_languages` | READ |
| `pll_get_post_language` | READ |
| `pll_set_post_language` | WRITE |
| `pll_get_post_translations` | READ |
| `pll_link_translations` | WRITE |
| `pll_get_term_translations` | READ |
| `pll_translate_term` | READ |
| `pll_get_posts` | READ |
| `pll_get_posts_missing_translation` | READ |
| `pll_create_translation` | WRITE (creates posts) |
| `pll_translation_status` | READ |

### MCP WooCommerce — `premium/mcp-woo-commerce.php` (22+ tools)

| Tool | Type | Notes |
|------|:----:|------:|
| `wc_list_products` | READ | |
| `wc_get_product` | READ | |
| `wc_create_product` | WRITE | |
| `wc_update_product` | WRITE | |
| `wc_delete_product` | DESTRUCTIVE | |
| `wc_alter_product` | WRITE | |
| `wc_list_orders` | READ | Exposes billing/PII |
| `wc_get_order` | READ | Exposes billing/PII |
| `wc_update_order_status` | WRITE | |
| `wc_add_order_note` | WRITE | |
| `wc_create_refund` | DESTRUCTIVE | Financial impact |
| `wc_get_orders_by_customer` | READ | Exposes PII |
| `wc_update_stock` | WRITE | |
| `wc_get_sales_report` | READ | |
| `wc_get_top_sellers` | READ | |
| `wc_get_revenue_stats` | READ | |
| `wc_get_low_stock_products` | READ | |
| `wc_get_stock_report` | READ | |
| `wc_bulk_update_stock` | WRITE | |
| `wc_list_customers` | READ | Exposes PII |
| `wc_get_customer` | READ | Exposes PII |
| `wc_update_customer` | WRITE | |
| `wc_list_reviews` | READ | |
| `wc_approve_review` | WRITE | |
| `wc_delete_review` | DESTRUCTIVE | |

### MCP Dynamic REST — `labs/mcp-rest.php` (~15 tools)

These call `rest_do_request()` which runs through WordPress REST API permission callbacks. Since the current user is always admin, those callbacks always pass. With multi-user mode, the WP REST permission callbacks would actually enforce real permissions.

| Tool | Type |
|------|:----:|
| `list_posts` | READ |
| `get_posts` | READ |
| `create_posts` | WRITE |
| `update_posts` | WRITE |
| `delete_posts` | DESTRUCTIVE |
| `list_pages` | READ |
| `get_pages` | READ |
| `create_pages` | WRITE |
| `update_pages` | WRITE |
| `delete_pages` | DESTRUCTIVE |
| `list_media` | READ |
| `get_media` | READ |
| `create_media` | WRITE |
| `update_media` | WRITE |
| `delete_media` | DESTRUCTIVE |

---

## Technical Challenges

### 1. Backward Compatibility

Multi-user mode must be **opt-in**. When disabled, everything works exactly as before. The escalation pattern stays for legacy mode. This is critical — thousands of users have the current setup working.

### 2. The Escalation Pattern Must Be Conditional

All 5 modules with the `wp_set_current_user(1)` escalation need to be modified. The change is mechanical but must be done carefully in each file:

Files to modify:
- `premium/mcp-plugin.php` — `handle_call()`
- `premium/mcp-theme.php` — `handle_call()`
- `premium/mcp-database.php` — `handle_call()`
- `premium/mcp-polylang.php` — `handle_call()`
- `premium/mcp-woo-commerce.php` — `handle_call()`
- `labs/mcp-core.php` — needs a NEW check added
- `labs/mcp-rest.php` — needs a NEW check added

### 3. MCP Core Is Too Broad

MCP Core has 36+ tools spanning `read` (count posts) to `manage_options` (update any option) to `create_users`. Setting a single required capability for the whole module is insufficient.

**Recommended approach**: Group the sensitive tools and add an inner check:

```php
// In mcp-core.php, within handle_call() when multi-user is enabled:
$admin_tools = [
    'wp_get_option', 'wp_update_option',
    'wp_get_users', 'wp_create_user', 'wp_update_user',
    'wp_list_plugins'
];
if ( in_array( $tool_name, $admin_tools ) && !current_user_can( 'manage_options' ) ) {
    throw new Exception( 'This tool requires administrator access.' );
}
```

This keeps the module intact while protecting the most dangerous tools.

### 4. Upload Endpoint Security

The `/upload/{token}` route (`labs/mcp.php`, line 149) currently uses `'permission_callback' => '__return_true'` and internally escalates to user 1. In multi-user mode, it needs to:

1. Validate the one-time upload token (transient)
2. Resolve which MCP token initiated the upload request
3. Set the correct user context
4. Check `upload_files` capability

### 5. Token Generation and Storage

- Tokens should be cryptographically random (e.g., `wp_generate_password(48, false)` prefixed with `mcp_`)
- Stored in `wp_options` (encrypted if possible, but at minimum not plaintext-visible in the admin)
- Token lookup must be efficient — on every MCP request, we search the token array. For small numbers of tokens (<100), a simple loop is fine

### 6. User Deletion / Role Changes

If a linked WordPress user is deleted or their role is downgraded:
- Tokens linked to deleted users should be automatically disabled
- Role changes take effect immediately (next MCP request checks current capabilities)
- Consider a hook on `delete_user` and `set_user_role` to update/disable affected tokens

### 7. Third-Party Feature Registration

Third-party plugins adding MCP features need to declare their required capability. The filter interface should be:

```php
// Existing filter for registering MCP features:
add_filter( 'mwai_mcp_features', function( $features ) {
    $features[] = [
        'id'         => 'seo-engine',
        'name'       => 'SEO Engine',
        'capability' => 'manage_options',  // NEW field
        'tools'      => [ ... ],
    ];
    return $features;
});
```

If `capability` is omitted, default to `manage_options` (admin-only). This is the safe default — unknown tools are restricted until explicitly opened up.

### 8. Rate Limiting and Audit Trail (Future, Not V1)

Not required for v1, but the token infrastructure makes these easy to add later:
- Per-token rate limits
- Per-token usage logging (which tools were called, when, by which token)
- Token expiration dates
- OAuth integration (token generated via OAuth flow instead of manually)

---

## Implementation Steps

### Phase 1: Token Management Backend

1. Create token storage helper (CRUD operations on `mwai_mcp_tokens` option)
2. Add REST endpoints for token management (create, update, delete, list)
3. Token generation utility (cryptographically random, prefixed)

### Phase 2: Auth Middleware

1. Add `is_multi_user_mcp()` check to `Meow_MWAI_Labs_MCP`
2. Modify `auth_via_bearer_token()` to look up tokens from the array when multi-user is enabled
3. Resolve linked user and call `wp_set_current_user($userId)`
4. Check feature access against the token's `features` list
5. Update `lastUsed` timestamp on successful auth

### Phase 3: Module Permission Gating

1. Modify `handle_call()` in all 7 modules (5 with escalation + 2 without)
2. Replace escalation with capability check when `is_multi_user_mcp()` is true
3. Add inner tool-group checks for MCP Core's sensitive tools
4. Fix the upload endpoint to respect multi-user context

### Phase 4: Admin UI

1. Add "MCP Access" section to Settings > MCP tab
2. Multi-user toggle (shows/hides global bearer token vs token list)
3. Token accordion UI (reuse MCP Servers pattern)
4. User dropdown (WordPress users with at least `edit_posts` capability)
5. Feature checkboxes (dynamically populated from registered MCP modules)
6. Token copy/regenerate actions

### Phase 5: Safety Nets

1. Hook into `delete_user` to disable orphaned tokens
2. Hook into `set_user_role` to log role changes (or auto-disable if downgraded below minimum)
3. Add migration: when multi-user is first enabled, auto-create one token linked to the current admin with all features enabled (smooth transition)
4. Add a warning in the UI when linking to a non-admin user about what they won't be able to access

---

## What V1 Does NOT Include

- OAuth / external auth providers
- Per-tool granular permissions (module-level is sufficient)
- Token expiration dates
- Usage analytics per token
- Rate limiting per token
- API key rotation / scheduled regeneration

These can all be added incrementally on top of the token infrastructure.

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|:----------:|:------:|:----------:|
| Existing setups break when updating | Low | High | Multi-user is opt-in, off by default. Legacy behavior unchanged. |
| Module escalation pattern missed in one file | Medium | High | Mechanical change, but audit all files. Test each module. |
| MCP Core sensitive tools accessible to editors | Medium | Medium | Inner tool-group checks for admin-only tools. |
| Third-party features without capability declaration | Medium | Low | Default to `manage_options` (admin-only). |
| Linked user deleted, token stays active | Low | Medium | Hook on `delete_user` to auto-disable. |
| Token leaked | Medium | Varies | Impact limited to linked user's capabilities (not full admin). This is the whole point of the feature. |
