=== AI Engine ===
Contributors: TigrouMeow
Tags: ai, chatbot, gpt, copilot, translate
Donate link: https://www.patreon.com/meowapps
Requires at least: 6.0
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 2.8.4
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

Start with the [main tutorial](https://meowapps.com/ai-engine/tutorial/) or browse the full [documentation](https://docs.meowapps.com/).

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

Check the [docs](https://docs.meowapps.com/), [support forum](https://wordpress.org/support/plugin/ai-engine/), or join us on [Discord](https://discord.com/invite/bHDGh38).

== Changelog ==

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

= 2.6.8 (2024/11/13) =
* Add: Similar to "Vision", support for "Files". For now, that means you can upload PDF in the chatbot while using Sonnet 3.5. This will be expanded to other models and features in the future. 
* Add: Messages Integrity Check. This will help fighting against malicious attempts to modify the system/assistant messages in the chatbot. When a query to the chatbot will be detected as malicious, an entry will be added in the Logs of the Dev Tools (in AI Engine's UI). It's for testing purposes for now, for those who are interested in helping us testing this, and once bulletproof, it will be deployed as an option with kick/ban features.
* Update: Discussions now include the start sentence as well.
* Fix: The WP Cron related to discussions was running way too often (forgot to remove the debug).
* Fix: Encode the data used in chatbot shortcodes to avoid issues with special characters.
* Fix: Support for embeddings models without defined dimensions (hi, Ollama's embed models!).

= 2.6.7 (2024/11/08) =
* Fix: Enforcing discussions title length (and default title in case of error) to avoid repeated API calls.

= 2.6.6 (2024/11/04) =
* Add: Titles for Conversations. Those titles can be edited by the users.
* Add: The user can also delete the conversations.
* Add: Added default icons when Send and Clear texts are empty.
* Add: Resolution support in the chatbot shortcode.
* Add: AI Discussions Block (and there was already a Chatbot Block if you didn't know).
* Add: mwai_form_takeover filter to override the reply for AI Forms.
* Update: Much smoother flow with the Discussions module.
* Update: Nicer icon for microphone.
* Update: Better (earlier as well) handling of default envs and models.
* Update: Re-organized the Anthropic models.
* Fix: Issue with the Clear button (version 2.6.5).
* Fix: The customId issue when using the Chatbot Block.
* Fix: SQL injection issue in the Discussions module (really minor, as only admins could do it).

= 2.6.3 (2024/10/13) =
* Add: Support for Assistants via Azure.
* Fix: Site-wide chatbot was considered an override.
* Fix: Fullscreen for chatbot should force the max-width and max-height.
* Update: Gets the models via Replicate much faster.
* Update: Set Replicate to use JPG.
* Update: Architectural improvements for OpenAI Assistants.

= 2.6.2 (2024/09/18) =
* Add: Support for the new o1 models from OpenAI (preview and mini).
* Fix: A few minor fixes for developers.

= 2.6.1 (2024/08/31) =
* Add: Vision for more Google models.
* Add: Chatbot Block now supports params directly.
* Add: Icon support in shortcuts.
* Update: Max Tokens and Temperature are now unset by default. That avoids many little issues.
* Fix: Better handling of the custom chatbot.
* Fix: Random fixes and improvements.

= 2.6.0 (2024/08/28) =
* Add: For those with many chatbots! You can now pick a new way to display the chatbots in the admin, it can be either tabs (default), or a filterable dropdown.
* Fix: Google Gemini was not working properly.
* Fix: There was a fixed max length defined for messages.

= 2.5.9 (2024/08/24) =
* Fix: Avoid crashes while rendering odd markdown in the chatbot.
* Update: Enhanced the core so that add-on like Ollama can be used with models such as the Llava model. You can now use Image Vision for free, it works amazingly!
* Update: Fullscreen moved to Appareance.
* Fix: Better handling of the resolutions handled by AI models; that avoids the crash many of you experienced in the Chatbots section.
* Fix: Removed a few warnings and notices.
* Add: AI Forms can be used with any text-to-image model (I know you want to use Flux!).
* Add: gpt-4o can now be fine-tuned.

= 2.5.6 (2024/08/21) =
* Add: Support for Replicate. Play with Flux, it's awesome! 🍀
* Update: Better copilot. It now uses the whole post as the context for your copilot queries. 
* Add: The copilot can also create images. The actual prompt to create the image is generated through AI, by using the context of the post, and the instructions you provide.
* Add: Logger in the DevTools.
* Update: Better handling of the pricing related to images.
* Update: The template system has been improved and redesigned a bit, so that it can be used in other parts of AI Engine or WordPress at a later point.
* Update: Added middle-out transformer for OpenRouter.

= 2.5.5 (2024/08/05) =
* Add: More efficient and complete translation feature. Check the "Translate Post" button!
* Fix: Avoid using emoji by default in the options related GDPR because it crashes on some installs.
* Fix: Make sure the streaming temporary files are removed.
* Update: Avoid the GDPR to be asked every time.
* Update: Simplified parts of the code, removed potential warnings.

= 2.5.4 (2024/08/02) =
* Add: You can now manually enter the model you would like to use for finetuning.
* Update: Finetuning features in AI Engine has been improved, like the way they are handled, displayed, calculated, etc.
* Fix: Max Messages was missing in the custom shortcode.

= 2.5.3 (2024/08/01) =
* Fix: The prices were not calculated properly. This was entirely reviewed.
* Fix: Avoid errors when context is provided without embeddings.
* Fix: A much better experience when AI Engine is installed for the first time.
* Update: Removed a lot of code and checks which became unnecessary. 
* Update: Added customId in the ai.reply filter.

= 2.5.2 (2024/07/29) =
* Add: New settings related to GDPR. The user will now have to accept conditions before using the chatbot.
* Update: Retrieve content from remote vectors, if needed and if the local ones are not available.
* Fix: Insert the System Message when a new entry is created in the Dataset Generator.
* Fix: Avoid an issue with empty but existing argument with tools.
* Fix: Issues related to buttons/shortcuts and their CSS.
* Fix: Allow having AI Forms without inputs.
* Fix: The Reset Limits issue.

= 2.5.1 (2024/07/25) =
* Add: Option to enable or disable the Virtual Keyboard Fix.
* Update: Much better Default CSS for Custom Theme.
* Fix: Issues related to the Virtual Keyboard Fix.
* Fix: Force the log file to have the .log extension, to avoid security issues.
* Fix: Shortcuts were not pushed by the server-side.
* Fix: The expiration 'Never' was crashing when used with Assistants Upload.
* Update: If DevTools is disabled, all the related debug options are disabled as well.

= 2.5.0 (2024/07/23) =
* Update: A better and enhanced copy button, that also now works in forms.
* Update: Improved drag n' drop for chatbot files.
* Update: Forms now use the same CSS as chatbots (you can try Timeless with them).
* Update: New unnecessary icon with Nyao, just for fun!
* Fix: TTS functionality on Android.
* Fix: Some features related to the Magic Wand were broken.
* Fix: The chatbot tabs were a bit clunky.
* Fix: Virtual keyboard hack for a better mobile experience.
* Fix: Various CSS-related issues and additional mobile CSS fixes.

= 2.4.9 (2024/07/19) =
* Add: Support for [GPT-4o mini](https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/). 
* Add: Support for HTML Blocks and Shortcuts (Quick Actions) via MwaiAPI in JS and PHP filters.
* Fix: Better handling of documents, annotations and images created via the OpenAI Assistants.
* Fix: Better CSS for the buttons and the scroll in the chatbot.
* Fix: The MwaiAPI was registering the chatbots twice, and now works in the admin as well.
* Fix: Input Max Length was not handled properly in the chatbot (UTF-8 related).

= 2.4.8 (2024/07/17) =
* Add: A first implementation of actions and blocks for the chatbot. Actions in JS are also handled. Please note that documentation will come later, this is for internal testing for now.
* Update: The chatId is now returned by simpleChatbotQuery.
* Update: Streamlined the naming of a few functions and filters related to the Statistics Module.
* Fix: Minor fixes, such as the button in Timeless.
* Fix: Three minor security issues (simpleVisionQuery SSRF, logs file as a PHP file, SQL injection via sort parameter). Those attacks could only be performed by, actually, an admin.

= 2.4.7 (2024/07/07) =
* Update: New system for the avatars used in the chatbot. You can set different avatars for the icon, the AI, the guest. Emoticons are also supported.
* Update: Improved the Timeless theme.
* Update: Improved the way the nonce is handled.
* Update: Streamlined the way function calling works.
* Update: Modified default avatars.
* Update: The JS filter ai.reply now returns the chatId and botId as well.
* Fix: Minor issues.

= 2.4.6 (2024/07/03) =
* Update: Anonymized file uploads.
* Update: Enhancement on the Timeless Theme.
* Update: Optimized the way the session is started.
* Fix: Various issues related to avatars, user names, etc.
* Fix: Other minor issues.

= 2.4.5 (2024/06/28) =
* Fix: Resolved the function calling issue with non-streamed assistants.
* Add: Included vision for OpenRouter's GPT-4o and Gemini-Flash.
* Fix: Matched label IDs with inputs in AI Forms.
* Update: Major refactoring of the chatbot codebase. This will allow for more flexibility and features in the future. It will be rolled out progressively. Let us know if you encounter any issues.

= 2.4.4 (2024/06/23) =
* Fix: Improve nonce handling to eliminate the 'Cookie check failed' error in the chatbot.

= 2.4.3 (2024/06/21) =
* Add: Claude-3.5 Sonnet (Anthropic).
* Fix: Issues related to envId in AI environments.
* Fix: Issues related to Anthropic + function calling + streaming.
* Fix: Avoid the Selected Discussion to break the Discussions tab.
* Fix: Minor fixes related to the Advisor.
* Fix: The Discussion shortcode was not working properly with themes.
* Fix: Issues related to embeddings sync, and how they are displayed in the admin.

= 2.4.0 (2024/06/15) =
* Update: The chatbot bundle size has been reduced.
* Update: The CSS (and themes) used by the chatbot has been improved, simplified. It works better on mobile, it is more customizable, and the icons are handled via SVG sprites, for better performance and flexibility.
* Update: Moved to a more dynamic way to handle the engines and models.
* Update: Add-ons are now in a tab instead of a submenu
* Update: Intense code cleanup and enhancements in how the options are handled.
* Fix: There were a few issues related to Azure (streaming, in particular).
* Fix: Chatbot rejects files (based on the settings) in a more logical way.
* Fix: Removed issues related to URL building in the chatbot.
* Add: Chatbot can now be displayed in a colored bubble.
* Add: Chatbot's icon message can now be delayed by x seconds.
* Add: Page selector for Queries, Embeddings and Discussions.
* Add: Released a new add-on for "Ollama", a local LLM. More about it [here](https://meowapps.com/products/ollama/).
* 🚀 Please backup your website before making this update, as it includes a lot of changes.

= 2.3.8 (2024/06/08) =
* Add: The AI Engine Advisor! Once activated, this module will help you optimize your WordPress based on your plugins, your theme, and your server.
* Add: Support for Add-ons. They will be developed by Meow Apps or third-party developers. The first one is called "Notifications".
* Add: OpenAI usage data is retrieved when streaming is used.
* Fix: Improved browser-native speech recognition.
* Update: Reduce the size of the bundles.

= 2.3.7 (2024/06/03) =
* Add: New chart in the dashboard. I hope you'll like it!
* Update: Longer conversation can now be kept in the DB.
* Update: Sanitize Pinecone URL.
* Update: Refreshed Neko UI.

= 2.3.6 (2024/05/29) =
* Update: Streamlined the way uploaded files are handled.
* Add: Allow using Vision without the need of writing a query.
* Fix: Handle better the way(s!) the links are displayed in the chatbot.
* Update: Code cleanup and enhancements.

= 2.3.5 (2024/05/24) =
* Update: New icons and better upload states.
* Add: Logs for developers.
* Fix: CSS on mobile, Messages Theme, ChatGPT Theme.
* Fix: Repetitive characters with speech recognition.
* Update: Strengthened the shortcode component and included mandatory classes.

= 2.3.4 (2024/05/21) =
* Fix: The "current" issue in the dashboard.
* Fix: The OpenAI errors received while streaming are now displayed in the chatbot.
* Add: The Environment ID is now visible in the "Environments for AI".

= 2.3.3 (2024/05/19) =
* Add: Support for Vision in Assistants v2.
* Add: Support for Function Calls with OpenAI's Assistants v2.
* Add: Support for Functions Calls via Streaming with Anthropic.
* Update: Enhanced the way uploads are handled and displayed in the chatbot.
* Fix: Issue with finetuned models when used in chatbots.
* Fix: Many little fixes that troubled some of you on Discord! 😬 I am always checking!

= 2.3.0 (2024/05/14) =
* Add: Support for GPT-4o (OpenAI).
* Fix: Improved (and fixed) the finetuning process.
* Update: Many enhancements and fixes in the code.

= 2.2.95 (2024/04/25) =
* Add: Support for File Search and Vector Stores with Assistants v2.
* Fix: Create the default chatbot if it's missing.
* Fix: Unicode support for banned words.
* Fix: Discussions do not need to be enabled for assistants to work.

= 2.2.94 (2024/04/25) =
* Add: Streaming with Assistants.
* Update: Support for Assistants v2.
* Fix: In some cases, 'Rewrite Content' was ignored.
* Info: Please remember that the [Assistants API](https://platform.openai.com/docs/assistants/overview) is a beta feature of OpenAI. Expect changes, issues, etc.

= 2.2.92 (2024/04/21) =
* Add: 'Chatbot' column in the 'Discussions' table.
* Add: Categories for Embeddings Auto-Sync.
* Update: TextArea for Start Sentence.
* Fix: Issue with the Forms REST API.
* Fix: Keep the line returns in the 'Instructions'.
* Fix: When replying with Function Calling, keep the content and context of the messages.
* Fix: Issue related to typing spaces within Gutenberg.
* Fix: Avoid iframe to be executed in the Discussions tab.
* Fix: And a few other minor issues.
* Fix: Avoid issues with nonce.

= 2.2.81 (2024/04/17) =
* Fix: Issue with Content Aware. Besides {CONTENT}, it now also supports {TITLE}, {EXCERPT} and {URL}.
* Add: New GPT-4 Turbo model (GPT-4 Turbo) which supports Vision, Function Calling, JSON.

= 2.2.70 (2024/04/15) =
* Add: Support for Function and Tools Calls with OpenAI and Claude, with back-and-forth feedback loop. Models can now get values to functions in you WordPress. The Pro Version of AI Engine also connects to [code-engine](https://wordpress.org/plugins/code-engine/) to make this much easier.
* Update: The WooCommerce Assistant has been moved to [SEO Engine](https://wordpress.org/plugins/seo-engine/). We shouldn't bloat AI Engine with features related to SEO.
* Fix: Copilot wasn't working with the latest version of WP.
* Fix: Arbitrary File Upload security issue.
* Fix: Fixes and enhancements in the AI Forms.

= 2.2.63 (2024/03/25) =
* Add: The chatbot displays the uploaded images.
* Update: More elegant refresh of the embeddings.
* Update: If functions are added to query, but the models don't support it, they will be removed rather than causing an error on the API side (an error will be logged).
* Fix: Issues related to the arguments order in chat_submit.

= 2.2.62 (2024/03/19) =
* Update: Cleaner handling of tokens and prices.
* Update: Enhanced the way mime types are handled, that fixes issues with Claude Vision.
* Fix: There was an issue with Max Messages with Claude.

= 2.2.61 (2024/03/16) =
* Fix: Embeddings should be synchronized one by one when handled by WP-Cron.
* Fix: Dimensions should not be used in the API when using Embeddings prior to v3 with OpenAI.
* Info: Please check the previous changelog as the previous updates were quite important.

= 2.2.60 (2024/03/15) =
* Add: Support for the new Claude Haiku model from Anthropic.

= 2.2.57 (2024/03/14) =
* Note: Please backup your website before making this update.
* Fix: Rewrite Content in Embeddings was not working properly.
* Fix: Avoid weird error about the model not being the same when empty.
* Fix: Improved the embeddings system upgrade process.
* Update: Extra sanitization of the replies from OpenAI Assistants.
* Add: Handle (multi) function calls with OpenAI assistants (via mwai_ai_function filter).
* Add: Export Discussions to JSON.
* Fix: Minor issues.

= 2.2.4 (2024/03/12) =
* Update: Huge overhaul of the embeddings system. It's now much more powerful, flexible and reliable. 

= 2.2.3 (2024/03/07) =
* Add: Support for Anthropic, its latest models of Claude with Vision.
* Add: The chatId is now available in the Chatbot JS API.
* Fix: Tokens with a zero as a string were not handled properly.
* Fix: The wrong expiration option was used with generated images.
* Fix: The Organization ID was not properly handled in some cases.
* Fix: Banned words were not properly handled in some cases.
* Fix: Audio to Text was not working properly.
* Fix: Embeddings Auto-Sync was not triggered properly in some cases.

= 2.2.2 (2024/03/02) =
* Add: Support for Hugging Face.
* Add: Automatically update the outdated embeddings in background.
* Fix: A few lightweight security issues were handled.

= 2.2.0 (2024/02/24) =
* Add: Support for Google Gemini.
* Add: Support for OpenAI's Organization ID.
* Fix: Avoid issues related to low limits related to embeddings searches.
* Fix: A few other minor issues fixed.
* Fix: Retrieve all assistants, without any limit.

= 2.1.9 (2024/02/08) =
* Fix: Resolved an issue with additional_instructions.
* Add: Support for set_instructions in queries used by assistants.
* Update: Reviewed and updated default parameters for embeddings search.

= 2.1.7 (2024/02/04) =
* Add: Enhanced embeddings handling, including fixes, automatic EnvID mismatch resolution, and support for new models.
* Add: Implemented additional_instructions for contextual guidance in assistants and memory for default EnvID.
* Fix: Corrected issues with image downloading from URLs and Local Download functionality.
* Update: Streamlined embeddings environment with support for context and updates to models and vectors table.

= 2.1.6 (2024/01/20) =
* Update: Pinecone servers.
* Update: Simple API was refactored to be more consistent, and to work with such services as Make.com.
* Fix: Remove the mwai_files_cleanup event on uninstall.

= 2.1.5 (2024/01/14) =
* Fix: Avoid a few PHP notices and warnings.
* Fix: Avoid a few security issues.
* Add: Files for vision, DALL-E, Assistants (and others) are stored gracefully along with their metadata.
* Add: Support for charts, images, or files generated by Assistants.
* Add: Support for adding files to Assistants from the chatbot.
