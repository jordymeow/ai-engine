=== AI Engine ===
Contributors: TigrouMeow
Tags: ai, chatbot, gpt, copilot, translate
Donate link: https://www.patreon.com/meowapps
Requires at least: 6.0
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 2.9.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

AI meets WordPress. Your site can now chat, write poetry, solve problems, and maybe make you coffee.

== Description ==
AI Engine seamlessly connects WordPress with the world of AI. It brings modern AI capabilities straight into your site, letting you work smarter without leaving your dashboard. From writing and translating content to generating images and managing media, everything is tightly integrated so you can stay focused on what matters.

You can create a chatbot to assist your visitors, answer support questions, or guide users through your products and services. Need fresh content? AI Engine can write posts in your voice, help rewrite existing ones, or translate them naturally into other languages. It can also generate custom images for your articles, refine messy text, or just lend a hand when you’re stuck.

For developers and power users, AI Engine offers internal APIs, shortcode flexibility, and advanced features like function calling and real-time audio chat. You can build your own AI-powered tools, automate tasks, or even create AI-driven SaaS applications on top of WordPress. And with support for a wide range of providers—OpenAI, Anthropic, Google, Hugging Face, and more—you have full control over the models you want to use.

Everything is designed to feel native to WordPress. Whether you're exploring ideas in the AI Playground, using Copilot to help in the editor, or letting an AI agent manage your content through MCP, AI Engine is built to grow with you—and shaped by real user feedback every step of the way.

Please make sure you read the [disclaimer](https://meowapps.com/ai-engine/disclaimer/). For more tutorial and information, check the official website: [AI Engine](https://meowapps.com/ai-engine/). Thank you!

== Features ==

* **Model Management**: Effortlessly bring the latest AI models (GPT 4.1, Claude, Gemini, o3, o4, 4o, and more) to your WordPress. Quickly set your preferred models to match your specific WordPress workflows.
* **Chatbots**: Easily create interactive chatbots. Customize themes, avatars, and conversation flows to fit your brand or use case.
* **AI Forms**: Build AI-driven forms that handle text, images, audio, or file uploads—perfect for advanced support tickets, creative prompts, or user submissions.
* **Copilot**: Transform the WordPress editor into your personal AI assistant. Simply hit “space” or use the wand icons to get real-time suggestions, quick translations, or content rewrites.
* **Image & Translation**: Create images from prompts, break language barriers with instant translations, and quickly refine existing text for clarity and SEO.
* **Finetuning & Embeddings**: Fine-tune AI models to match your domain or style, and use embeddings for smarter AI interactions, content classification, or personalized recommendations.
* **Discussions & Memory Tracking**: Let users engage in longer or more complex conversations with the chatbot. All data can be stored, analyzed, and even exported for further insights.
* **Function Calling**: Connect the AI models to your WordPress functions, tools, or APIs. For example, you can use the chatbot to allow your users to interact with your store, book appointments, or get real-time data.
* **Internal & External APIs**: Integrate AI Engine’s capabilities into other plugins or custom applications through built-in internal APIs or via REST—perfect for building advanced WordPress SaaS solutions.
- **MCP (Model Context Protocol)**: Allow powerful AI agents (like Claude) to fully control and manage your WordPress site. Automate posts, content updates, manage media, and seamlessly integrate advanced AI workflows. AI Engine can also connect to external MCP servers, expanding your AI's capabilities beyond WordPress.
* **AI-Powered Search**: Enhance WordPress search with three intelligent methods: standard WordPress search, AI-generated progressive keyword search that creates multiple search variations with decreasing specificity, and embeddings-based semantic search for meaning-based results.
* **PDF Import for Embeddings**: Import PDF documents with automatic chunking, title generation, and intelligent content extraction for building comprehensive knowledge bases.
* **Insights & Usage Control**: Track usage, monitor tokens, and manage costs with detailed analytics. Tools like role-based access, banned words, or content safety filters help you maintain a secure environment.
* **Extensive Integration**: Seamlessly works with Media File Renamer, SEO Engine, Social Engine, Code Engine, and other WordPress plugins to power advanced AI features site-wide.
* **Flexible Theming & Shortcodes**: Control the look and behavior of your AI integrations using pre-built themes or your own custom CSS. Place chatbots or AI-driven forms anywhere using simple shortcodes.

Please note that some features require a Pro license (AI Forms, Embeddings, Usage Control, Realtime Chatbot). For more information, check the [official website](https://meowapps.com/ai-engine/).

== MCP (Model Context Protocol) ==

While WordPress core may one day add MCP support, AI Engine is already there. We've built a smart wrapper around WordPress's Core API that turns your site into an intelligent MCP server.

This means AI agents like Claude and ChatGPT can connect directly to your WordPress site and actually understand how it works. They can browse your content, edit articles, check SEO, manage your media files, and handle complex tasks without getting confused or lost like they do with regular APIs.

The best part? Other plugins can easily add their own features to this MCP system. [SEO Engine](https://wordpress.org/plugins/seo-engine/), [Social Engine](https://wordpress.org/plugins/social-engine/), and [Code Engine](https://wordpress.org/plugins/code-engine/) are already connecting (or will be soon), so AI agents can manage your entire WordPress site just like a skilled human would.

AI Engine also works the other way around—it can connect to external MCP servers, giving your AI access to tools and services beyond WordPress. This means your chatbots and AI assistants can tap into a growing ecosystem of MCP-enabled applications and APIs.

== Beyond the Features ==

Since AI Engine has its own internal APIs, this allows you and others to integrate AI features to your WordPress. It has been officially integrated with many plugins to enhance their functionality. Here are a few examples:

* [Media File Renamer](https://wordpress.org/plugins/media-file-renamer/)
* [SEO Engine](https://wordpress.org/plugins/seo-engine/)
* [Social Engine](https://wordpress.org/plugins/social-engine/)
* [Code Engine](https://wordpress.org/plugins/code-engine/)

== My Dream for AI ==

I am thrilled about the endless opportunities that AI brings. But, at the same time, I can't help but hope for a world where AI is used for good, and not just to dominate the web with generated content. My dream is to see AI being utilized to enhance our productivity, empower new voices to be heard (because let's be real, not everyone is a native speaker or may have challenges when it comes to writing), and help us save time on tedious tasks so we can spend more precious moments with our loved ones and the world around us.

I will always advocate this, and I hope you do too 💕

== Disclaimer ==

AI Engine is a plugin that helps you to connect your websites to AI services. You need your own API keys and must follow the rules set by the AI service you choose. For OpenAI, check their [Terms of Service](https://openai.com/terms/) and [Privacy Policy](https://openai.com/privacy/). It is also important to check your usage on the [OpenAI website](https://platform.openai.com/usage) for accurate information. Please do so with other services as well.

The developer of AI Engine and related parties are not responsible for any issues or losses caused by using the plugin or AI-generated content. You should talk to a legal expert and follow the laws and regulations of your country. AI Engine does only store data on your own server, and it is your responsibility to keep it safe. AI Engine's full disclaimer is [here](https://meowapps.com/ai-engine/disclaimer/).

== Compatibility ==

Please be aware that there may be conflicts with certain caching or performance plugins, such as SiteGround Optimizer and Ninja Firewall. To prevent any issues, ensure that the AI Engine is excluded from these plugins.

== Usage ==

1. Create an account at OpenAI.
2. Create an API key and insert in the plugin settings (Meow Apps -> AI Engine).
3. Enjoy the features of AI Engine!
5. ... and always keep an eye on [your OpenAI usage](https://platform.openai.com/usage)!

== Frequently Asked Questions ==

= Where can I find tutorials and documentation for AI Engine? =

Start with the [main tutorial](https://meowapps.com/ai-engine/tutorial/) or browse the full [documentation](https://ai.thehiddendocs.com/).

= Where can I ask questions or get support? =

Visit the [AI Engine Support Forum](https://wordpress.org/support/plugin/ai-engine/) or join the [community on Discord](https://discord.com/invite/bHDGh38).

= Can I contribute to the plugin? =

Yes! Contributions are welcome on the [GitHub repository](https://github.com/jordymeow/ai-engine).

= Why am I getting “Error 429: You exceeded your current quota”? =

This means your OpenAI API key has reached its limit or has no billing enabled. Check your [OpenAI billing settings](https://platform.openai.com/account/billing).

= The chatbot doesn’t show responses until I refresh the page. What’s wrong? =

This may be caused by a caching plugin. Try excluding the chatbot container or relevant pages from caching.

= AI Engine is giving me “Sorry, you are not allowed...” errors. What should I do? =

This is usually a REST API permission issue. Make sure you’re logged in and that your roles and tokens are set up correctly.

= Does AI Engine conflict with other plugins? =

Some plugins like caching tools (SiteGround Optimizer, WP Fastest Cache), TranslatePress, or The Events Calendar may interfere. Check plugin settings or disable specific features if needed.

= I'm seeing issues after updating WordPress or Chrome. Why? =

Sometimes updates introduce temporary compatibility issues. Make sure you’re using the latest version of AI Engine and clear your browser cache.

= Why isn’t my image generation working with Azure/OpenAI? =

Check that your API key has permissions for image generation, and that the model and endpoint are correctly set. See documentation for more.

= My question isn’t listed here. Where else can I find help? =

Check the [docs](https://ai.thehiddendocs.com/), [support forum](https://wordpress.org/support/plugin/ai-engine/), or join us on [Discord](https://discord.com/invite/bHDGh38).

== Changelog ==

= 2.9.2 (2025/07/11) =
* Add: Google embeddings are now live—only relevant environments show up, and we’ve built in safeguards against dimension mismatches.
* Add: A handy metadata bar in Discussions shows start date, last update, and message count. Plus, you can tweak its look via settings or our new PHP filters.
* Update: Embeddings sync now pops up a sleek NekoModal (goodbye alerts!), with clear stats on what’s updated, added, up-to-date, or errored—and even backend action logs.
* Update: API error messages got friendlier and more helpful.
* Update: Tables everywhere got a makeover—cleaner layouts, raw model names, better spacing, and clearer dimensions.
* Fix: Cron jobs no longer crash when no default environment or model is set.
* Fix: Chatbot module warnings when params or chatId were missing have been squashed with extra validation.
* Fix: System-logs no longer throw “undefined ‘sort’ key” warnings.
* Fix: Embeddings sync now clears the WP post cache so content changes are always detected, logs checksums for debugging, and adds a read-only Env ID field.
* Fix: Model/dimension mismatches are only checked if you’ve opted in, and the active Env ID is now visible in the UI.
* Fix: Custom chatbots keep their own embeddings environment instead of inheriting the default.
* Fix: Google model names are deduped and cleaned up (suffixes now in parentheses), with the newest versions listed first.

= 2.9.1 (2025/07/08) =
* Fix: Corrected guest user authentication by fixing the strpos check in session validation and making the start_session endpoint publicly accessible for proper guest login support.
* Add: Introduced options for Embeddings Search supporting multiple search methods.
* Add: New simpleFastTextQuery API endpoint.
* Update: Optimized vector search queries to accurately handle exclusion terms.

= 2.9.0 (2025/07/07) =
* Add: Persisted templates in Content Generator, Images Generator, and Playground.
* Update: Improved clarity in tables and selects.
* Fix: Limited PHP session starts to AI Engine's REST endpoints and added session status checks.
* Fix: Improved error handling for dynamic function additions via mwai_ai_query filter and ensured proper JSON encoding for mwai_ai_feedback objects in Chat Completions API.
* Fix: Enhanced CSV/JSON import error handling with detailed validation, specific error messages, and helpful examples in a modal dialog.
* Fix: Corrected guest user display in Discussions and Insights tables.

= 2.8.9 (2025/07/05) =
* Fix: Pinecone vector listing now correctly handles variable index dimensions by generating matching zero vectors instead of using a hardcoded size.
* Fix: Pinecone index name extraction has been improved to accurately process hyphenated index names, and a dimension mismatch indicator has been added next to the AI Environment title in embedding settings.
* Add: simpleTranscribeAudio method now provides a consistent API for audio transcription using the default AI audio settings.
* Fix: functions_list now exclusively retrieves snippets of the "function" type from Code Engine to improve accuracy.

= 2.8.8 (2025/07/04) =
* Add: Customizable Languages section in Settings > Others for easier language management.  
* Add: Query tracking in usage statistics with accuracy indicators for token counts and pricing sources.  
* Fix: Code Engine now correctly uses function names instead of snippet names for better clarity.  
* Fix: Resolved PHP warning when syncing vectors caused by missing ai_embeddings_dimensions key.  
* Fix: Fixed UI errors related to embedding model selectors, including conditional display, dimension validation, and UI improvements.

= 2.8.7 (2025/07/02) =
* Add: Smarter token and nonce management for longer, more reliable sessions.
* Fix: Hotfix resolves issues with event logs display and enables proper event logging under Streaming mode for realtime chatbots.
* Add: Quick Test buttons for AI and embedding environments to verify API connections.
* Update: Default embeddings set to text-embedding-3-small.
* Fix: Prevents duplicate Media Library entries and stops unwanted auto-saving in the Images Generator.
* Add: Web Search support for Google Gemini models.
* Fix: XSS vulnerability hotfix in chatbot shortcode.
* Fix: Hotfix for unquoted userId in SQL queries to prevent database errors.
* Update: Enhanced usage metrics, cleaner model names, and more.
* Fix: Improved multiple function call handling and resolved reset issues for compatibility with OpenAI, Claude, and Google.
* Add: Initial limits for Realtime (still a bit tricky, but progressing!).
* Update: Improved PDF import with different chunking modes.
* Update: Improved the default CSS theme.
* Update: General refactoring with many small improvements and fixes.
* Update: Better debugging and error handling all around.

= 2.8.4 (2025/06/18) =
* Add: History Strategy for Responses API chatbots. This allows chatbots to maintain a history of interactions, including images being modified or generated.
* Add: AI Want support for more blocks, like tables, lists, headers, etc.
* Add: Tools support (web_search, image_generation) with the Responses API.
* Add: Edit Mode for Images, with mask support.
* Update: Streamlined MCP logging, improved documentation.
* Fix: Duplicate Media Library entries.
* Fix: PDF worker URL (sorry about that, guys).
* Fix: Vision support for Responses API.
* Fix: Hotfix for security issues related to MCP.
* Info: More fixes and improvements which are too numerous to list here. We will have another round of improvements coming within 3-4 days. Don't hesitate to leave a review and mention something you would like to see improved or fixed.

= 2.8.3 (2025/06/07) =
* Add: Support for the new OpenAI Responses API (function calling, vision, feedback, MCP) – enable it in Settings when you’re ready.
Add: Vector-Aware Search – override the default WordPress search with either AI-generated keywords or Embeddings for sharper results.
* Add: PDF Import – upload a PDF, tweak the chunk size, and auto-create embeddings in one flow.
* Add: Embeddings stream event that shows when external context is pulled in.
* Add: Stream-events viewer now appears under each chatbot whenever Client Debug is on (and streaming is enabled).
* Add: Claude MCP support, MCP-server picker in Chatbots, per-category Show Details buttons, and copy-to-clipboard endpoint fields; you can even create or edit plugins via MCP.
* Add: “Does Not Contain” operator for AI Conditional Blocks.
* Add: Extensible context menus in Discussions through new MwaiAPI filters.
* Add: dev-notes.md packed with tips for developers who want to extend AI Engine.
* Update: Replaced NekoCollapsableCategories with NekoAccordions and refreshed the whole Settings navigation.
* Update: Streaming debugger renamed to ChatbotEvents, unified wording, and clearer status messages.
* Fix: Function-execution mapping, duplicate result events, and double fires in React.
* Fix: Error and input states are now fully isolated per chatbot instance.
* Fix: Clear button and reset logic in the event viewer.
* Security: Patched a potential MCP injection vector.
* Misc: Many small optimisations, typo/translation fixes, and cleaner source comments.
* 🎵 Discuss with others about AI Engine on [the Discord](https://discord.gg/bHDGh38).
* 🌴 Keep us motivated with [a little review here](https://wordpress.org/support/plugin/ai-engine/reviews/). Thank you!
* 🥰 If you want to help us, we started a [Patreon](https://www.patreon.com/meowapps). Thank you!
* 🚀 [Click here](https://trello.com/b/8U9SdiMy/ai-engine-feature-requests) to vote for the features you want the most.

= 2.8.2 (2025/05/23) =
* Add: New Claude 4 models for enhanced AI capabilities.
* Update: Settings reorganized for improved usability, and Statistics and Embeddings renamed to Insights and Knowledge for better clarity.
* Fix: Hotfix for streaming issues and added a filter to customize the discussions refresh interval.
* Update: More consistent and user-friendly UI in Content and Image Generators, including a clean modal for Image Generator and improved custom chatbot block.
* Add: Multi-condition support for AI Forms with new operators, and better handling of required fields within conditional containers.

= 2.8.1 (2025/05/03) =
* Fix: Resolve issue with DALL-E model usage on Azure platforms.
* Add: Allow API Key override through query parameter for OpenRouter integration.
* Add: Filter `mwai_discussions_refresh_interval` to control how often the discussions list refreshes.

= 2.7.9 (2025/04/30) =
* Add: Support for gpt-image (the latest OpenAI model).
* Add: Support for MCP (Model Context Protocol). Check the [tutorial](https://meowapps.com/claude-wordpress-mcp/)! It's awesome, but remember it's a beta feature.
* Fix: Avoid a few warnings and notices.
* Fix: Compatibility with stateless WPs.
* Fix: Added Row Actions in Pages.
* Update: Accurate pricing is now always smoothly retrieved for OpenRouter, thanks to their new API.
* Update: Optimized the bundle size of the chatbot.

= 2.7.6 (2025/04/15) =
* Add: Added GPT 4.1 models, and set 4.1 Nano as the new default model.
* Add: Privacy First option to set the amount of personal data to the minimum.
* Add: Handle array properties for Function Calling.
* Add: Scope can now be modified for chatbots and forms.
* Add: Add a filter in the models dropdown if there are more than 16 models.
* Add: Accurate pricing with OpenRouter can be enabled by adding MWAI_OPENROUTER_ACCURATE_PRICING to your wp-config.php, and setting it to true. This will add 1-2 seconds to the response time.
* Update: Only define MWAI_TIMEOUT if it's not defined yet, that allows it to be overridden.
* Fix: An AI form without any inputs should be always valid.
* Fix: Give more info when an Pinecone upsert fails.
* Fix: Improvements for Google Gemini. Now works with Function Calling. Special thanks to Anaheim!
* Fix: Avoid a silent crash with Pinecone when a slash is added to the Server URL.
* Fix: Prevent Meow_MWAI_Query_Parameter to crash WordPress entirely.

= 2.7.5 (2025/03/12) =
* Add: Introduced support for Claude 3.7.
* Add: Updated pricing and added support for gpt-4.5-preview, o1-mini, and o3-mini.
* Fix: OpenAI Assistants (tools) can now be updated without overwriting existing settings.
* Fix: Prevented AI Forms from overriding HTML elements without a data-default-value attribute.
* Fix: Required fields in AI Forms are now strictly enforced, even if not mentioned in the prompt.
* Fix: Resolved issues with fields via selectors not being saved or re-applied on load.
* Update: Added additional checks to ensure the store is processed before attaching it to a thread in OpenAI Assistants.
* Update: Improved support for Assistants working with Forms and individual File Uploads, though OpenAI's Vector Store remains buggy.
* Fix: Addressed an issue with AI Forms and MIME types—OpenAI only supports images, but Anthropic handles PDFs well.
* Update: Replaced set_max_sentences with set_max_messages for better clarity.
* Update: Links in the chatbot now always open in a new tab for better user experience.
* Note: Function Calling is now expected to work, but Gemini remains unreliable.
* Remove: No more OpenAI Status, as they have discontinued their RSS feed.

= 2.7.4 (2025/01/26) =
* Add: Support for Perplexity models.
* Add: MwaiAPI works with AI Forms (ai.formReply filter, forms, getForm).
* Update: Azure API set to 2024-12-01 version.
* Update: Apply the tools and vision tags correctly on models from OpenRouter.
* Fix: Re-added the shortcode related to statistics.
* Fix: Fallback to default resolution if the model doesn't support the resolution.
* Info: New add-on for DeepSeek: https://meowapps.com/products/deepseek/.

= 2.7.3 (2025/01/16) =
* Add: Realtime is now supported in Discussions and Queries (costs are calculated based on the tokens returned by OpenAI).
* Update: Smarter way to handle the synchronization of embeddings. They are deleted if they have no content, and they only synchronize if it is needed.
* Update: OpenAI now uses max_completion_tokens instead of max_tokens.
* Fix: With AI Forms, the Select/Radio could show no option selected by default.
* Fix: o1 wasn't working properly with the Content Generator (the issue was related to Max Tokens).
* Add: In Content Generator, Max Tokens are now optional.
* Fix: Avoid the Chatbot Block to crash when switching to Custom.
* Add: A button to 'Run Tasks' in the 'Dev Tools'.

= 2.7.2 (2025/01/05) =
* Add: Realtime Audio Chatbot (Pro Version)! It works very well, including with function calling. Try it out! But be careful, those models are quite pricey. AI Engine doesn't handle the statistics yet (Queries / Discussions tabs).
* Add: New attribute 'className' for the Shortcuts API.
* Fix: Selectors in AI Forms now retrieve the content in divs correctly.
* Fix: The Chat Block in Custom Mode was not working properly.

= 2.6.9 (2025/01/01) =
* Info: Happy New Year to you all, AI bro's and sis'! 🎉
* Add: Support for o1 (if you have access to it).
* Update: Handle streaming with o1 (depending on the exact model).
* Info: o1 Preview and o1 Mini doesn't work with Instructions or Contexts (Embeddings, etc.). This is a limitation from OpenAI. AI Engine will handle this as soon as OpenAI allows it. However, it works with o1.
* Add: o1 support in the Usage section.
* Add: Option for the auto-titling feature for discussions.
* Add: Option to modify the Header Subtitle for the Timeless Theme ("Discuss with").
* Add: Option to Ignore Word Boundaries (= spaces!) in the Security section.
* Add: Three new JS functions for the Chatbot API: getBlocks, addBlock and removeBlockById.
* Add: New Upload Field in the AI Forms. Work with images, files, audios (one file per form for now).
* Add: New 'callback' type for the Shortcuts. It requires an 'onClick' function.
* Add: Added {CATEGORY}, {CATEGORIES}, {AUTHOR}, {PUBLISH_DATE} placeholders for embeddings' prompt.
* Add: Local Memory for the AI Forms (check the parameters of the Submit Block).
* Add: Reset Button for AI Forms.
* Update: The auto-titling feature for discussions is now more reliable.
* Update: HTML is allowed in the Instructions.
* Update: Better instructions in the Finetunes Data Editor.
* Update: Tiny enhancements on the Timeless Theme.
* Add: Button to Reset Usage (Dashboard tab).
* Fix: Issue related to initial HTML blocks (the GRDP block could reset all the blocks).
* Fix: The Discussions Auto-Refresh only works if the browser tab is active.
* Fix: Using chatId via the API was causing a crash.
* Fix: Enhanced the internal API around takeovers.
* Fix: Assistants were not behaving properly when a Function Call was not giving back the expected result.
* Fix: Context in the Queries (Statistics Module) is now available for Assistants.
* Fix: Handle RTL websites better.
* Fix: If the environment is Default, then Model is also Default (for Chatbots and AI Forms).

