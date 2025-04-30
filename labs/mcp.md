# Using MCP with AI Engine

## What’s this all about?

**Model‑Context‑Protocol (MCP)** is the open standard Claude (and, soon, ChatGPT) uses to talk to external *tool servers.* When Claude detects an MCP server it can

1. **list** the server’s tools (`tools/list`),
2. (optionally) let you pick one, then
3. **call** a tool (`tools/call`) via JSON‑RPC.

With **AI Engine** active your WordPress site publishes **30‑plus tools** that let Claude

- read & write posts, pages and custom post‑types,
- upload or generate media,
- manage categories, tags & any taxonomy,
- switch, fork and live‑edit themes,
- list plugins… and more.

`mcp.js` is the Node relay that

1. opens a long‑lived **SSE** (`/wp-json/mcp/v1/sse`),
2. tunnels Claude’s JSON‑RPC to `/wp-json/mcp/v1/messages`,
3. streams replies back to Claude via stdout,
4. and cleans up automatically when Claude quits.

> **Heads‑up – advanced users only.** Everything here is still beta. Be ready for CLI work, PHP/FPM restarts and some detective work if hosting layers interfere.

---

## 1 · Install requirements

| Requirement                | Details                                   |
| -------------------------- | ----------------------------------------- |
| **WordPress 6.x**          | REST API enabled.                         |
| **AI Engine plugin**       | Folder `wp-content/plugins/ai-engine`.    |
| **Claude Desktop ≥ 0.9.2** | macOS (tested) • Windows (paths differ).  |
| **Node ≥ 20.19.0**         | `node -v` — multiple versions? use `nvm`. |

`mcp.js` handles everything else – registering, patching Claude’s config, launching the relay and shutting it down.

---

## 2 · Bearer‑token authentication

### WordPress side  
Go to **AI Engine › DevTools tab › MCP Settings** and set **“Bearer token”** (`mcp_bearer_token`).  
Leave it blank if you want the endpoint public.

### Relay side  
Supply the same token when you register the site:

```bash
labs/mcp.js add https://example.com  MY_SUPER_TOKEN
```

The token is stored in `~/.mcp/sites.json`:

```jsonc
{
  "example.com": {
    "url": "https://example.com",
    "token": "MY_SUPER_TOKEN"
  }
}
```

The relay adds an `Authorization: Bearer …` header to every request.

> **Important**  When the token is wrong or missing, WordPress replies 401 / 403.  
> The relay converts that into JSON‑RPC errors, but **Claude shows no pop‑up** – the tools pane simply stays disabled.  
> Check Claude’s log (⌘ ⌥ C → *AI Engine*) or `~/.mcp/error.log` for details.

---

## 3 · Connect Claude to your site

```bash
# 1 · Register & write Claude’s config (token optional)
labs/mcp.js add https://example.com  MY_SUPER_TOKEN

# 2 · Start a verbose relay to watch the handshake
labs/mcp.js start example.com
```

Claude should show a **plug icon** and a **hammer** with ≈30 tools once auth succeeds.

---

## 4 · Prompt ideas

| Level          | Example                                                                                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| *Simple*       | “List my latest 5 posts.” “Create a post titled *My AI Journey* (one paragraph) and attach a media‑library image.”                  |
| *Intermediate* | “Look at the 10 newest posts, then publish a logical follow‑up. Re‑use existing categories & tags. If no image fits, generate one.” |
| *Advanced*     | “Fork *Twenty Twenty‑One* into a grid‑layout theme called *Futurism* supporting post types Article & Project.”                      |

---

## 5 · Hosting caveats & **Edge‑Caching gotcha**

Each SSE ties up **one PHP worker**. On managed hosts that means 5–8 workers by default; two Claude tabs can consume half your pool.

### Kinsta / Cloudflare Edge Caching

Edge caching must be **bypassed** for `/wp-json/mcp/*` – otherwise Cloudflare buffers the stream for CLI clients and the relay stalls.

*Dashboard › Edge Rules →* **Bypass Cache / Disable Security** for `/wp-json/mcp/*`.

### If the site stalls

```bash
labs/mcp.js claude none   # drop Claude’s MCP entry
sudo systemctl restart php-fpm
```

---

## 6 · `mcp.js` CLI cheatsheet

```bash
# verbose relay (console)
mcp.js start  example.com
# silent relay (Claude uses this)
mcp.js relay  example.com

# manage sites & tokens
mcp.js add     mysite.com TOKEN
mcp.js claude  mysite.com
mcp.js list

# ad‑hoc RPC call
mcp.js post mysite.com '{"method":"tools/list"}' <session_id>
```

Logs → `~/.mcp/` (`mcp.log`, `mcp-results.log`, `error.log`).

---

## 7 · Verbose PHP logging (optional)

```php
// wp-content/plugins/ai-engine/classes/modules/mcp.php
private $logging = true;
```

Tail `wp-content/debug.log`.

---

## 8 · Shutdown sequence

1. Relay detects stdin close.  
2. Sends `{ "method":"mwai/kill" }` to `/messages`.  
3. Aborts the SSE fetch.  
4. Exits 0.

WordPress ends its loop and frees the PHP worker.

*(Windows: if you see lingering `node.exe`, run inside WSL 2 or add a `SIGTERM` handler.)*
