# AI Engine – AI for WordPress

AI Engine is a powerful WordPress plugin that brings modern AI capabilities (like GPT-4, ChatGPT, Claude, DALL-E, etc.) straight into your website. It lets you create intelligent chatbots, generate and optimize content (including images and translations), build AI-assisted forms, and integrate AI into your workflows – all through a clean interface in your WordPress dashboard. Developers can leverage AI Engine’s internal APIs and hooks to extend functionality or integrate with other systems, making WordPress a flexible AI-powered platform.

## Features

* **Chatbots & Assistants:** Easily create customizable AI chatbots to engage your visitors. Define their behavior, tone, and appearance (avatars, themes) to suit your site. You can even build advanced AI assistants (GPT-like agents with custom instructions and tools) to handle specific tasks or roles for your users (Pro feature).
* **Content Generation:** Generate high-quality blog posts, pages, or product descriptions with a click. AI Engine can write in your style, suggest titles and excerpts, translate content to other languages, and even create images to accompany your posts.
* **AI Copilot in Editor:** Boost your writing workflow with an AI Copilot integrated into the WordPress editor.
* **Embeddings & Knowledge Base:** Provide your AI with context from your own data. AI Engine can index your site’s content (or custom data) into embeddings, enabling the chatbot to answer questions with knowledge of your content (Pro feature).
* **AI Forms & Image Generation:** Create AI-powered forms that accept user input and produce dynamic outputs, or generate images from text prompts directly in WordPress.
* **Function Calling & Automation:** Define and expose WordPress functions that the AI can call to perform actions.
* **REST API and Internal API:** AI Engine provides REST endpoints and internal PHP/JS APIs for advanced integrations.
* **Multi-Provider Support:** Compatible with OpenAI, Anthropic (Claude), Google (Gemini), OpenRouter, Replicate, Hugging Face, and more.

## Getting Started

**Requirements:** WordPress 6.0+, PHP 7.4+, and an API key from a supported AI provider.

**Installation:**

1. Install the plugin from the WordPress plugin repository or upload it manually.
2. Activate it in the WordPress dashboard.
3. Go to **Meow Apps > AI Engine > Settings**, enter your API key, and configure your environment.

**Build (for developers):**

```bash
yarn
yarn run build
```

## Repository Structure

```
ai-engine/
├── app/              - JavaScript/React front-end logic
├── classes/          - Core PHP logic and APIs
├── common/           - Shared utilities and helpers
├── constants/        - Global configuration and constants
├── images/           - UI assets and icons
├── labs/             - Experimental features (e.g. MCP)
├── themes/           - UI styles and templates
├── vendor/           - Composer dependencies
├── ai-engine.php     - Plugin entry point
├── package.json      - Build configuration
├── webpack.config.js - Webpack bundling
```

## Usage Examples

* **Embed a Chatbot:** Use `[mwai_chat]` shortcode or block.
* **Content Assistant:** Available in post/page editors.
* **AI Forms:** Create dynamic forms powered by AI prompts.
* **Embeddings:** Index content for context-aware AI.
* **REST API:** Automate or extend functionality from external tools.

## Integration Ideas

* Headless WordPress front-ends using AI Engine endpoints
* Developer hooks for function calling, tools, and custom behavior
* External site integrations via REST API

## Claude Integration (MCP)

MCP allows Claude to interact with WordPress using tools defined by AI Engine.

**Tutorial:** [https://meowapps.com/claude-wordpress-mcp/](https://meowapps.com/claude-wordpress-mcp/)

Follow the guide to:

* Enable MCP and generate a token
* Use the `labs/mcp.js` script to register your site
* Allow Claude Desktop to communicate securely with WordPress

## Common Issues

* **Error 429 (OpenAI):** Check billing or quota limits on your OpenAI account.
* **Chatbot delay:** Exclude chatbot pages from caching plugins.
* **"Not allowed" errors:** Ensure correct REST API permissions and roles.
* **Plugin conflicts:** Disable other plugins temporarily to isolate issues.

## Support and Documentation

* **Documentation:** [https://docs.meowapps.com/](https://docs.meowapps.com/)
* **Tutorial:** [https://meowapps.com/ai-engine/tutorial/](https://meowapps.com/ai-engine/tutorial/)
* **Support Forum:** [https://wordpress.org/support/plugin/ai-engine/](https://wordpress.org/support/plugin/ai-engine/)

Please use the WordPress forum for help, not GitHub issues.

## Contributing

Pull requests and issue reports (for bugs or dev-level feedback) are welcome. For general support, use the WordPress forums.

---

© 2025 Meow Apps. Licensed under GPLv2 or later.
