=== AI Engine: Chatbots, Generators, Assistants, GPT 4 and more! ===
Contributors: TigrouMeow
Tags: ai, gpt, openai, chatbot, copilot, chatgpt
Donate link: https://meowapps.com/donation/
Requires at least: 6.0
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 2.1.6
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Add AI into WordPress! Chatbot (ChatGPT), content and images generators, copilot, model training and much more! Highly customizable, sleek UI. You will love it!

== Description ==
Create your own chatbot, craft content and images, coordinate AI-related work using templates, enjoy swift title and excerpt recommendations, play with AI Copilot in the editor for faster work, track statistic and usage, and more! The AI Playground offers a range of AI tools, including translation, correction, SEO, suggestions, WooCommerce product fields, and others. There is also an internal API so other plugins can tap into its capabilities. We'll be adding even more AI tools and features to the AI Engine based on your feedback.

Please make sure you read the [disclaimer](https://meowapps.com/ai-engine/disclaimer/). For more tutorial and information, check the official website: [AI Engine](https://meowapps.com/ai-engine/). Thank you!

== Features ==

* OpenAI: GPT-4 Turbo, GPT-4 Vision, GPT-3.5 Turbo, GPT-3, etc...
* OpenRouter: Claude, Gemini, Mistral, GPTs, etc...
* Add easily an ChatGPT-like chatbot to your website
* Generate fresh and engaging content for your site
* Use the AI Copilot to help you tweak your content, build images, and more
* Explore the AI Playground for a variety of tools (translation, correction, SEO, etc...)
* Create templates for everything you do, to be more productive
* Train your AI to make it better at specific tasks
* Moderation AI for various tasks
* Quickly brainstorm new titles and excerpts for your posts
* Quickly write the WooCommerce product fields
* Speech-to-Text with Whisper API
* Embeddings to add more context to your chatbot based on your data
* Keep track of your OpenAI usage with built-in statistics
* Internal API for you to play with
* And a lot more, just play with it! 💫

== Chatbot ==

Are you interested in integrating AI-powered chat functionality to your website? Our chatbot can assist you with that! Although it appears simple, the possibilities are limitless, with a variety of parameters and concepts to explore. Visit our [official documentation](https://meowapps.com/ai-engine/) for more information.

Take your AI capabilities to the next level with finetuning and embeddings. By reusing your website's content and other pertinent information, you can train your AI to better cater to your target audience. AI Engine makes this process simple and straightforward with its user-friendly interface. If you'd like to learn more about finetuning, check out our article: [How to Train an AI Model](https://meowapps.com/wordpress-chatbot-finetuned-model-ai/).

== AI Copilot ==

In the WordPress editor, hit space and type your question! AI Copilot offers many suggestions to help you think and write quickly. Use the wand symbol to fix your text, translate it, shorten or lengthen it, and find alternative words. 

== Generate Content & Images ==

Simply adjust the parameters to your preference, customize the prompts, and discover the results. You can save your parameters as templates for future use, generate content in bulk, and even produce images. The AI Playground also enables you to create your own custom use cases, such as swiftly acquiring recipes based on your refrigerator's contents or quickly drafting restaurant reviews. With AI Engine, the possibilities are endless, and you can personalize the user interface to suit your needs.

== Boost your WordPress with AI ==

AI Engine offers its own internal API that can be utilized by various plugins. For example, [Media File Renamer](https://wordpress.org/plugins/media-file-renamer/) leverages this API to suggest improved filenames for media files. Additionally, [Social Engine](https://wordpress.org/plugins/social-engine/), a plugin that facilitates post-sharing on social media platforms, can also benefit from AI Engine's capabilities to create accompanying text.

== My Dream for AI ==

I am thrilled about the endless opportunities that AI brings. But, at the same time, I can't help but hope for a world where AI is used for good, and not just to dominate the web with generated content. My dream is to see AI being utilized to enhance our productivity, empower new voices to be heard (because let's be real, not everyone is a native speaker or may have challenges when it comes to writing), and help us save time on tedious tasks so we can spend more precious moments with our loved ones and the world around us.

I will always advocate this, and I hope you do too 💕

== Open AI ==

The AI Engine utilizes the API from [OpenAI](https://beta.openai.com). This plugin does not gather any information from your OpenAI account except for the number of tokens utilized. The data transmitted to the OpenAI servers primarily consists of the content of your article and the context you specify. The usage shown in the plugin's settings is just for reference. It is important to check your usage on the [OpenAI website](https://platform.openai.com/account/usage) for accurate information. Please also review their [Privacy Policy](https://openai.com/privacy/) and [Terms of Service](https://openai.com/terms/) for further information.

== Disclaimer ==

AI Engine is a plugin that helps users connect their websites to AI services like OpenAI's ChatGPT or Microsoft Azure. Users need their own API key and must follow the rules set by the AI service they choose. By using AI Engine, users agree to watch and manage the content made by the AI and handle any problems or misuse. The developer of AI Engine and related parties are not responsible for any issues or losses caused by using the plugin or AI-generated content. Users should talk to a legal expert and follow the laws in their area. The full disclaimer is [here](https://meowapps.com/ai-engine/disclaimer/).

== Compatibility ==

Please be aware that there may be conflicts with certain caching or performance plugins, such as SiteGround Optimizer and Ninja Firewall. To prevent any issues, ensure that the AI Engine is excluded from these plugins.

== Usage ==

1. Create an account at OpenAI.
2. Create an API key and insert in the plugin settings (Meow Apps -> AI Engine).
3. Enjoy the features of AI Engine!
5. ... and always keep an eye on [your OpenAI usage](https://platform.openai.com/account/usage)!

Languages: English.

== Changelog ==

= 2.1.6 (2024/01/20) =
* Update: Pinecone servers.
* Update: Simple API was refactored to be more consistent, and to work with such services as Make.com.
* Fix: Remove the mwai_files_cleanup event on uninstall.
* 🚀 [Click here](https://trello.com/b/8U9SdiMy/ai-engine-feature-requests) to vote for the features you want the most!
* 🎵 Discuss with other users about features and issues on [my Discord](https://discord.gg/bHDGh38).
* 🌴 Keep us motivated with [a little review here](https://wordpress.org/support/plugin/ai-engine/reviews/). Thank you!

= 2.1.5 (2024/01/14) =
* Fix: Avoid a few PHP notices and warnings.
* Fix: Avoid a few security issues.
* Add: Files for vision, DALL-E, Assistants (and others) are stored gracefully along with their metadata.
* Add: Support for charts, images, or files generated by Assistants.
* Add: Support for adding files to Assistants from the chatbot.

= 2.1.4 (2023/12/31) =
* Fix: Custom models (added via mwai_openai_models) weren't shown in the UI.
* Fix: Remove a few PHP warnings.
* Update: Enhanced the structure of the data in the Queries browser.
* 🎉 Last release of 2023! Happy new year everyone, and see you in 2024 for a lot of fun with AI! 💫

= 2.1.3 (2023/12/27) =
* Add: Option to store the generated images automatically instead of using the temporary URLs created by the models.
* Fix: Handle and display errors with the assistants.
* Fix: Focus issues in the input fields.

= 2.1.2 (2023/12/23) =
* Add: Support for OpenRouter, which give you access currently to 73 models.
* Add: Default AI environments for each type of query.
* Add: Reset, Export and Import of your AI Engine settings.
* Update: Huge streamlining of the codebase.

= 2.0.9 (2023/12/19) =
* Update: Streamlined the entire codebase, much cleaner, renamed a lot of things, and made it more consistent.
* Fix: Many little fixes here and there, too many to list.

= 2.0.8 (2023/12/14) =
* Update: The UI related to the Settings has been improved.
* Update: The overall code was refactored and cleaned, to allow the next features.
* Add: Context Max Length was added in the Chatbot Settings, and will override the one in the Settings.

= 2.0.7 (2023/12/07) =
* Fix: Various fixes related to the internal APIs.
* Fix: Chatbot could interfere with the events on mobile.
* Fix: Compatibility with network sites.
* Update: Enhanced some elements in the UI.
* Update: Images can be now dropped on the entire input (not only the little image icon).

= 2.0.5 (2023/12/03) =
* Fix: Logs and conversations were not refreshed correctly when deleted.
* Fix: Missing extra information (such as embeddings) in the discussions tab.

= 2.0.3 (2023/11/26) =
* Add: Assistants are now usable in AI Forms.
* Add: New tab "Fields" in "Queries" tab (to inspect what was send via the AI Forms).
* Add: Added "Generate Image" in the AI CoPilot. 
* Fix: Models weren't displayed correctly when Azure was chosen as the default environment.

= 2.0.1 (2023/11/21) =
* Add: Implemented the new OpenAI Assistants. It's beta, but it's there!
* Update: The former "Assistants" (which were tools in the Admin section) have been renamed into "Utilities".
* Update: Better control of who/what is using the REST API.

= 1.9.99 (2023/11/17) =
* Update: Cleaner way of handling errors in the chatbot.
* Update: Enhanced the way the files are uploaded, and follow the rules set by the Media Library.

= 1.9.98 (2023/11/16) =
* Update: Enhanced the Images Generator a lot, you can now add tasks to it, and let them run. The idea is to move this experience at some point to the Post Editor. 
* Update: The URLs returned by DALL-E are now properly converted into Markdown (and therefore, HTML on the front-end).
* Update: Meow_MWAI_Query_Image is now using DALL-E 3 by default, and 1792x1024 as the resolution.
* Update: Better Discussions UI, displaying the images if they are still available.

= 1.9.97 (2023/11/15) =
* Add: Support for DALL-E 3.
* Fix: Many little fixes.

= 1.9.96 (2023/11/13) =
* Add: GPT-4 model without Vision (since its RPM is much higher).
* Add: simpleJsonQuery function, to retrieve a JSON from the AI.
* Add: New Transcription tab with Image to Text, Audio to Text, Prompt to JSON.
* Add: Useful information are dynamically added under Max Tokens fields. Let's try to make the issues around Max Tokens easier to understand and handle!
* Add: Support for errors from OpenAI while using streaming.
* Fix: MaxTokens in the forms was not working properly.
* Fix: Android Speech Recognition was not working properly.
* Fix: Issue with inputs and textareas when they were used as Output in the Forms.

= 1.9.95 (2023/11/10) =
* Add: New "Images" section in the Settings related to "Vision".
* Update: Much better handling of images (where/how it's stored and sent to the models, their expiries, etc).

= 1.9.94 (2023/11/07) =
* Add: Support for GPT-4 Turbo.
* Add: Support for Qdrant (alternative to Pinecone).
* Add: Support for Vision within the chatbot. It is ultra experimental, but it's there! Play with it, but the user experience has to be improved.

= 1.9.93 (2023/11/03) =
* 🚀 Please check the previous changelog entry.
* Update: Removed a lot of useless code related to legacy chatbot, finetuning, etc.
* Fix: Conversations were not being logged for known IDs.

= 1.9.92 (2023/11/02) =
* Add: Multi-environments for AIs are now supported.
* Update: Discussions are now formatted in the admin too.
* Update: Added new Pinecone environments.
* Update: Enhanced the text cleaning functions to optimize the tokens count.
* Fix: Various fixes and enhancements.
* 🎃 This is major update; check your Settings, Chatbots and Forms.

= 1.9.91 (2023/10/24) =
* Update: Auto Sync Posts now can be set to use a specific environment, index and namespace.
* Fix: Remove many warnings in the JS console.
* Fix: Chatbot with IDs can now be overriden properly.

= 1.9.90 (2023/10/22) =
* Add: Sync Pull (to download remote embeddings - it does not insure that they have content however).
* Update: Better UI for Embeddings. 
* Fix: Many fixes linked to AI Search, auto-retrieval of remote embeddings, and the way the data is handled.
* Fix: Minimum Score and Max Embeddings are now working correctly throughout the plugin.
* Fix: Unselecting an embedding environment will now remove the index and the namespace.
* Fix: A bunch of tiny additional fixes.

= 1.9.88 (2023/10/16) =
* Add: Support of multi-environments with embeddings (only Pinecone environments for now, but more will come soon).
* Fix: Various issues when using embeddings without namespaces.
* Fix: Various other little issues.

= 1.9.87 (2023/10/04) =
* Fix: The mwai_context_search was not being always called.
* Update: Many enhancements with the Embeddings to make them more flexible and powerful, with better error handling.

= 1.9.86 (2023/10/02) =
* Fix: Issue with model being overriden by the default model in the chatbot.
* Update: Better IP resolution for logging.
* Fix: The value from custom DIVs was not always retrieved by AI Forms.

= 1.9.85 (2023/09/30) =
* Update: Better support for gcp-starter server (Pinecone). Let us know if it's better for you!
* Fix: No more swallowing spaces issues when using the AI Assistants in Firefox.
* Fix: Prevent the user to re-use the same botId for different chatbots.
* Fix: Custom ID can now be used in the conversations shortcode (custom_id).

= 1.9.84 (2023/09/23) =
* Fix: For Embeddings in Forms, the "None" could be mistaken for an actual index.
* Update: The filter mwai_forms_params has been re-added into AI Forms, as deprecated. The filter that should actually be used is mwai_form_params (without s).

= 1.9.83 (2023/09/23) =
* Fix: Avoid deprecation issues with PHP 8.2+.

= 1.9.82 (2023/09/22) =
* Fix: The value of external select fields was not interpreted correctly.
* Fix: Better validation in the AI Forms.
* Fix: Empty chatbot shorcode will automatically switch to the default chatbot.
* Fix: Issues on mobile with the chatbot.
* Fix: Avoid displaying the rendered HTML in the chatbot when typed by the user.
* Update: Accept function calls without parameters, and make sure the types are correct.

= 1.9.81 (2023/09/20) =
* Add: New gpt-3.5-turbo-instruct model. Have a look at [this](https://openai.com/research/instruction-following).
* Fix: AI Forms work better with external input fields (such as radios and checkboxes). The debugging mode is also now more verbose.
* Update: Consolidate the way ID and Custom ID are handled. That fixes a few issues with custom chatbots too.

= 1.9.7 (2023/09/16) =
* Fix: Rewrite Content (in Embeddings) uses the right value as Max Tokens.
* Add: The Intro Message in the Settings can now be disabled, for a slighlty cleaner UI.
* Update: Optimized the way the UI is built and refreshed, for a better performance.

= 1.9.6 (2023/09/13) =
* Add: The simpleChatbotQuery has now a memory of the discussion.
* Fix: Handle errors more gracefully when importing data.
* Fix: The data in the Copy Button in the Forms was missing line returns.
* Fix: Some issues with forms if the JS was loaded too early.
* ✨ The clientId was renamed into chatId (update your custom code if you use any).

= 1.9.5 (2023/09/11) =
* Fix: Error when finetuning new models. 
* Fix: Chatbot fullscreen issue.
* Update: AI Submit can be used outside a AI Container.
* Update: Register the user to the conversation with the chatbot if the user logs in.

= 1.9.4 (2023/09/09) =
* Fix: Bulk Generate for the new finetunes.
* Fix: Issues with the dropdown position.
* Add: Copy Button in Forms.
* 😇 The Public REST API is now only accessible if the requests are authenticated, to avoid abuse. The process can however be completely overriden. More information [here](https://meowapps.com/ai-engine/api/#public-rest-api).

= 1.9.3 (2023/09/02) =
* Add: Added a new "simpleChatbotQuery" endpoint. 
* Add: Embeddings Export to JSON.
* Fix: Embeddings Rewrite, Finetunes Entries Generator and WooCommerce Assistant now use correctly the Default Model set in the Settings.
* Update: Set the Batch Size (Hyperparameters) to 4 by default, rather than null.

= 1.9.2 (2023/08/28) =
* Add: The "Finetunes" tab is now about the new models (and new format of JSONL). The former "Finetunes" tab has been renamed into "Legacy Finetunes" (and is only accessible if you enable it in the "Settings"). Try to finetune your own models using GPT 3.5! 🥳 More info [here](https://openai.com/blog/gpt-3-5-turbo-fine-tuning-and-api-updates).
* Info: It will take some time for me to update the documentation, as everything has just been announced by OpenAI and not much of it has been tested by the community (I am also testing it myself). I will update the documentation as soon as I can.

= 1.9.1 (2023/08/22) =
* Fix: Issue with broken avatars.
* Fix: Security limitations were a bit too strict.
* Fix: Issue with forms when using external input elements.
* Update: Optimized content cleaning when used to create embeddings or by other parts of AI Engine.

= 1.9.0 (2023/08/18) =
* Add: Added missing servers for Pinecone.
* Fix: Avoid the double slashes in some URLs.

= 1.8.8 (2023/07/30) =
* Add: Public API. This is really beta, use with caution (and the endpoints might change).

= 1.8.7 (2023/07/22) =
* Add: Support of [Function Calling](https://meowapps.com/ai-engine/api/#function-calling) in the AI Engine API.
* Fix: Import Embeddings was not displaying progress accurately, and some error messages were wrong.

= 1.8.6 (2023/07/20) =
* Add: New JS API filter: [ai.reply](https://meowapps.com/ai-engine/api/#js-filters).
* Add: Embeddings Import (CSV or JSON). Thanks, Mike! ☺️
* Fix: Few issues related to embeddings and their default values.
* Update: Enhanced the checkboxes.
* Update: Added the botId to the Query object.

= 1.8.5 (2023/07/12) =
* Add: New filter "mwai_openai_models" to customize the models list. Check [this example](https://wordpress.org/support/topic/how-to-use-gpt-4-0314/#post-16886291). 
* Fix: Avoid flooding the chatbot via the JS API.
* Fix: Avoid crashing when Deployment Name for Azure is empty.
* ⚠️ Modernized AI form fields to use styles from the block editor. This will crash the forms already made, but they can be restored easily by clicking on the "Attempt Block Recovery" button. 

= 1.8.3 (2023/07/05) =
* Fix: Models list.
* Fix: Pricing.
* Fix: Tab handling when the botId is modified.
* Fix: Submit Block was broken in some cases.
* Update: Enhance the errors management in some cases.

= 1.8.2 (2023/07/04) =
* Update: New OpenAI prices and upgraded the calculation system.
* Fix: There was no env for the forms.
* Fix: Weird issues with non-ASCII characters in tabs and Chatbot IDs.
* Fix: The languages filter was not working anymore.
* Fix: Embeddings were not working with the new forms.
* Fix: The Client-Side JS API was not using the latest context.

= 1.8.1 (2023/07/29) =
* Fix: Little issue with radio fields.

= 1.8.0 (2023/07/26) =
* Fix: Issue with how the logs table was created (it was only working for MySQL 5.6.5+, now works for older MySQL as well).

= 1.7.9 (2023/06/25) =
* Add: DevTools tab for AI Engine. It will be used for advanced debugging and development by developers. I will add more and more little tools there.
* Fix: Avoid some errors if the stats object (from statistics queries) is null.

= 1.7.8 (2023/06/23) =
* Update: The non-public post-types can now be 'Sync All' if they are mentioned in the settings of 'Sync Posts'.

= 1.7.7 (2023/06/18) =
* Add: Many namespaces can now be used at the same time.
* Fix: Issue with the ask() function for the Chatbot JS API.

= 1.7.6 (2023/06/15) =
* Add: Streaming in Playground.
* Update: Enhanced the UI of the Playground.
* Update: Better handling of the errors from OpenAI and Pinecone.

= 1.7.5 (2023/06/14) =
* Add: Added the Turbo 16k model. 
* Fix: Issue where "0" was considered as empty in the case of streaming.
* Fix: The AI Output can now be outside of the AI Container.

= 1.7.3 (2023/06/11) =
* Add: Embeddings Export (no worries, Import will be next!).
* Update: Added a Sync button directly next to the outdated embeddings.
* Fix: Remove a few warnings and notices.

= 1.7.2 (2023/06/07) =
* Fix: Randomize the file used to record streams on the server.
* Fix: New forms now works with selectors as inputs.

= 1.7.1 (2023/06/06) =
* Fix: Limits work better.
* Update: This is really alpha, but discussions work a little bit. Check [this](https://meowapps.com/ai-engine/tutorial/#discussions).

= 1.7.0 (2023/06/04) =
* Update: Forms have been rewritten to be more flexible, including streaming. Parameters are kept only on the server (your users can't see them). If any issue, you can switch back to the Legacy Forms (check the settings).
* Fix: Params relative to UI were not being overriden by the filters.
* Fix: Connection errors with OpenAI or Azure should be displayed.
* Fix: Limits were overriden by a misplaced line of code. Sorry about that!

= 1.6.98 (2023/06/01) =
* Update: Huge improvements on streaming! When it's confirmed (by you dear users) that it works perfectly for the chatbot, I will add streaming to every other parts of AI Engine.

= 1.6.97 (2023/05/31) =
* Fix: Additional fix for limits for admins and editors.
* Fix: Errors weren't sent correctly to the chatbot with stream.
* Fix: Avoid limits override to affect the system limits.
* Update: Removed the condition on apiRef (which was the API KEY used for the requests), as it's not clear how it will behave based on the usage of Azure.

= 1.6.95 (2023/05/29) =
* Fix: There were issues with custom roles.
* Fix: Bypass security filters on words and IPs for embeddings for users with the right capability.
* Fix: Avoid the typewriter and the streaming to collide.

= 1.6.94 (2023/05/28) =
* Add: Streaming for the chatbot (beta). Depending on the server configuration, it might not work.
* Fix: The styles of the syntax highlighting were overriden.
* Fix: Various issues with ID collisions (themes and chatbots).
* Update: The chatbots tab got a little lifting. Might be easier to figure things out for new users.

= 1.6.92 (2023/05/27) =
* Fix: Issues with the new chatbot and finetunes.
* Fix: Improved and fixed issues related to the finetuned models management (the way it was handled was not optimal). Please refresh your models in the Finetunes tab.
* Fix: A variable in the chatbot might not be initialized, thus causing a warning.

= 1.6.90 (2023/05/25) =
* Update: Support of Dall-E through Azure.
* Update: More refactoring (that will allow support of new engines in the future).

= 1.6.89 (2023/05/24) =
* Fix: Issues related to finetuned models with the new chatbot v2.
* Update: The client-side discussions module got a bit better.
* Update: The system messages (usually, errors) are now displayed with a red background in the chatbot.
* Update: Improved the [JS API](https://meowapps.com/ai-engine/api/#simple-server-side-api-js).
* Update: Optimized the CSS of the ChatGPT theme.
* Fix: Sanitization for Text Compliance.

= 1.6.88 (2023/05/21) =
* Update: Slighlty cleaner API for context. If you want to implement you own web search for AI Engine, have a look at [this](https://gist.github.com/jordymeow/c570826db8f72502f5f46a95cda30be5).
* Fix: Avoid the double slash when loading the script.
* Fix: Crash when embeddings' subtype is set to something else than null or a string.
* Fix: Sanitization of the context shouldn't removed the line returns.

= 1.6.85 (2023/05/20) =
* Update: Pinecone servers.
* Fix: Make it simpler for caching system to work with the plugin (nonce / cookie issue).
* Fix: Secured the plugin against potential XSS attacks (thanks to WPScan).
* Fix: Line return support for users input.
* Fix: The filter related to rewriting errors was not always kicking in.
* Update: Enhancements in the discussions UI module. It's very alpha, but you can try it by adding [mwai_discussions id="default"] to a page where the chatbot is.
* Update: Architectural changes. Moving towards the discussions (almost work).

= 1.6.81 (2023/05/17) =
* Fix: Display SQL errors related to logging.
* Update: The MwaiAPI (for developers) is evolving a lot - discussions will be handled by it soon.

= 1.6.79 (2023/05/14) =
* Update: Refactoring and cleaning.
* Fix: Issues with the chatbot when using DALL-E.
* Fix: Remove some potential PHP warnings.

= 1.6.78 (2023/05/13) =
* Add: The messages coming through the API are now all overridable.
* Fix: Rounding issue for price calculation.

= 1.6.77 (2023/05/12) =
* Add: Display of the Post Type for embeddings related to local content.
* Add: Button to duplicate a chatbot.
* Add: Reset button for overall settings.
* Fix: The default service is set to OpenAI (it wasn't set to anything at first).
* Update: Cleaned a bit more the REST API.
* Update: Move the Legacy Chatbot in the Chatbot Settings (it will be hidden to new users).

= 1.6.76 (2023/05/11) =
* Add: Search for Discussions (it's done through the filter in the Preview column).
* Add: Delete Selected/All for the Discussions.
* Add: Reset button for chatbot.
* Update: The REST API has been cleaned out completely, simplified, rectified and improved.

= 1.6.75 (2023/05/10) =
* Fix: Various issues related to the Chatbots's ID and ChatId.

= 1.6.74 (2023/05/09) =
* Fix: Issue with non-string parameters in AI Forms.

= 1.6.73 (2023/05/08) =
* Fix: Issue wih the chatbot's timer.

= 1.6.72 (2023/05/07) =
* Update: Refactoring of the code to handle new features later.
* Add: Usage costs of audio models are now handled and accounted.
* Fix: Issue with custom chatbots that were not truly custom.
* Update: Enhancing how exceptions are being handled for a better error management.

= 1.6.70 (2023/05/06) =
* Fix: Added 'Local Memory' to the parameters.
* Fix: Issue with how Local Memory was handled with multiple IDs.

= 1.6.69 (2023/05/05) =
* Fix: Tokens estimation was happening too early.
* Fix: Issue with chatbot names using only non-ASCII characters.
* Update & Fix: Custom Shortcodes (for Chatbot v2) got much simpler and better.

= 1.6.66 (2023/05/04) =
* Fix: Entries Generator was not getting the right counts.
* Fix: Messages theme had little visual glitches.
* Update: The chatbot scrolls to the bottom of the content when re-opened.
* Update: The paragraphs are back for the ChatGPT Theme.
* Update: The AI Wands is nicer to use, with better busy states.
* Update: More adaptability for the AI Engine API.
* Add: Shortcode "builder" for new chatbots.

= 1.6.64 (2023/05/03) =
* Add: User/IP filter for the Discussions tab.
* Add: User/IP and Env filter for the Queries tab.
* Update: Optimized the way the scrolling is handled when typewriter is used.

= 1.6.63 (2023/05/01) =
* Fix: Removed a notice.
* Update: Refactoring of the code to make it more consistent.
* Update: Attempt to avoid an issue with old plugins loading the JS media library in the footer.

= 1.6.61 (2023/04/30) =
* Update: Some parts of the UI got improved, that will allow for more features to be developed.
* Update: Clean the API, class names, and the files hierarchy to make it more consistant.

= 1.6.59 (2023/04/29) =
* Add: Logs the real issue when rejecting a query.
* Fix: Spinners wasn't working for Messages theme.
* Fix: The AI Wands were not using the language set in the current post.
* Update: Light enhancements to the Messages theme.

= 1.6.58 (2023/04/28) =
* Fix: The input fields were not always focuses in the best way, should be much better now!
* Add: The Speech Recognition of the Web Speech API, just for fun (it's fast and free).

= 1.6.57 (2023/04/27) =
* Update: The chatbot and its shortcode are much more powerful in the way they manage their settings and parameters. If you are still using the old shortcode, switch to the new one. Make sure to test all your chatbots, there are major changes, and let me know if there are issues.
* Update: Chatbot settings are now perfectly opaque (except when related to UI).
* Fix: Some issues with embeddings management.
* Fix: The assistants could not be disabled.
* Fix: Japanese, Chinese (and other languages) typing issues in AI Copilot.

= 1.6.55 (2023/04/26) =
* Update: Using POST instead of PUT for the API calls (that avoid issues with with ModSecurity and other security plugins; though it was gramatically correct to use PUT to update data rather than POST).
* Update: Better error handling for templates.
* Update: Optimized the speed of retrieving logs data.
* Fix: Avoid issue with naming new chatbots 'default'.
* Fix: Issue with models not appearing in the dropdown for finetuning.

= 1.6.53 (2023/04/25) =
* Add: Ability to see the content of the query and reply objects, for any request that goes through AI Engine. This is in the Statistics Tab. API Keys are not logged however, for security reason.
* Fix: Code highlighting was not always working.
* Fix: Issues with Embeddings and PHP 7.3.
* Fix: Show a nicer placeholder than broken images with expired DALL-E images.
* Fix: The Send button which was sending circular data to the stringifyer.

= 1.6.4 (2023/04/24) =
* Add: The JS API. Allows more control over the chatbot (to open it, to modify the typewriter speed, etc). You can find a few examples [here](https://meowapps.com/ai-engine/faq/#control-the-chatbot).
* Add: AI Forms support Speech-to-Text (through whisper).
* Update: A few enhancements on the AI Forms, for more clarity.
* Fix: Japanese keyboard was not supported in the chat textfield.
* Fix: The new chatbot was not working with images yet. Now works with DALL-E.
* Fix: Issue with Safari (the loading animation was staying - looks like a bug in Safari however)
* Fix: Too many parameters were injected in the front chatbot in the case of site-wide.

= 1.6.2 (2023/04/23) =
* Add: Status for Posts Syncing for Embeddings.
* Fix: Scrolldown issue.
* Fix: Issue when placeholders for User Name (in chatbot) didn't have any data. Will now display Guest Name.
* Fix: The admin could crash if OpenAI incidents were not available.
* Add: Added the chatbotId as the ID for the chatbot in the HTML.

= 1.6.0 (2023/04/22) =
* Add: You can choose a different model for the AI Tools (Magic Wand, AI Copilot and Suggestions). It uses to be only Turbo, but you can now pick another one like GPT-4. Look in Settings > Admin Tools.
* Fix: Timeout for Images Generator was too short.
* Fix: Copy issue when typewriter was enabled.
* Update: Optimized the API behind the API Wand and AI Copilot.
* Update: Pinecone servers.
* Update: Improved the errors handling in Content Generator, Playground and Images Generator.

= 1.5.9 (2023/04/21) =
* Update: Errors are handled better.
* Fix: Fullwidth for non-popup chatbot.

= 1.5.8 (2023/04/20) =
* Fix: There were issues with the Audio Transcription.
* Fix: Unhandled role (which was a system role when an error is thrown).
* Fix: Pinecone servers could not been seen easily.
* Add: Possibility to disable local memory.

= 1.5.6 (2023/04/19) =
* Add: Typewriter effect for the chatbot v2, should play well with the syntax coloring and everything else.
* Update: More refactoring and optimization of the chatbot v2. Ready to go forward!

= 1.5.3 (2023/04/18) =
* Fix: Removed a few annoying PHP notices.
* Add: Max Messages for the new chatbot (now the new chatbot has everything and more).
* Add: Statistics tab displays more information, such as the service used (generally, it's OpenAI, but it could be Azure), and if the API Key used was the one set in the admin or if it was a custom one (added by the user for example).
* Update: Enhanced how everything is displayed in Statistics to spot potential issues more easily.
* Update: Reviewed the Settings tab for more clarity.
* Info: Moved the legacy chatbot tab on the very right end to encourage legacy users to switch to the new one.

= 1.5.2 (2023/04/17) =
* Fix: The Chatbot V2 wasn't getting initialized with some themes.
* Add: Context Max Tokens allows truncating the context dynamically (for content-aware, embeddings, etc).
* Add: Better support for Azure (can link instances with models), and a big refactoring or the querying system.
* Fix: The copy button for the new chatbot was not implemented.

= 1.5.1 (2023/04/16) =
* Add: Gutenberg Block for Chatbot.
* Add: Embeddings in Forms.
* Update: Enhance the AI Copilot and Blocks Tooks.
* Fix: Forms were a bit difficult to use (useful indications were hidden by mistake).

= 1.4.8 (2023/04/15) =
* Add: Messages Theme.
* Update: Enhanced the theme system extensively.
* Fix: Many various little fixes.

= 1.4.7 (2023/04/14) =
* Add: Slowing moving to a system for the Chatbot V2 that can handle animations.
* Fix: With the Chatbot V2, always the default chatbot was displayed.

= 1.4.6 (2023/04/13) =
* Add: Friendly message to those who don't have access to GPT-4.
* Fix: Many fixed related to the Chatbot V2.
* Update: Enhanced the content-aware feature (and fixed it for the Chatbot V2)
* Add: Remove failed and cancelled finetuning jobs.
* Update: Cleaned the internal API.

= 1.4.4 (2023/04/12) =
* Add: Site-wide V2 chatbot.
* Add: Remember chats for V2 chatbot.
* Update: Rejected messages will be removed from the conversation and will not be reused in further requests.
* Update: The 'finetuned' status of the models now stand out more in the UI.

= 1.4.3 (2023/04/11) =
* Add: Delete all discussions at once.
* Update: Refresh of the tables and checkboxes (better to keep everything consistent).

= 1.4.2 (2023/04/09) =
* Update: Icon and Avatar for AI are now a bit more unified in the new chatbot system.
* Info: If you miss it, I released a new chabots system, check it out. It's beta!

= 1.4.1 (2023/04/08) =
* Add: New system for chatbots. It's in beta, not everything is working, but as you can see, it will be easier and better to handle the chatbots from now on (and new features will be much easier to add too). You can try them out by heading to the Chatbots tab.
* Update: Pinecone servers.

= 1.4.0 (2023/04/05) =
* Update: Pinecone servers.
* Add: System-wise limits (in order to prevent many kinds of abuse).
* Add: Limits can be set with minutes and seconds.

= 1.3.98 (2023/04/03) =
* Fix: An issue related to memorizing the chats with GPT-Turbo.
* Fix: The Magic Wand was going a bit wild because of my previous optimization.
* Add: {EXCERPT} is now also usable via content aware.

= 1.3.96 (2023/04/02) =
* Fix: Fixes and enhancements related to embeddings.
* Add: Post types filter for Sync Posts for embeddings.
* Add: Security improvements, avoid empty requests, banned words and banned IPs (CIDR ranges supported).

= 1.3.94 (2023/04/01) =
* Fix: Icon param and query->replace (which caused AI Translate not to use the right language).
* Update: Since some of you suddently asked for it, the Magic Wand is back (and it will evolve).
* Fix: The situation with the "Clear" button has been... clarified! 
* Fix: Various fix related to how the Gutenberg librairies are used to avoid collisions.

= 1.3.92 (2023/03/31) =
* Fix: Post Edit links were not working.
* Fix: Issue with finetuned models when their suffix contained a number.
* Update: UI elements.
* Update: Improved internal API.

= 1.3.90 (2023/03/30) =
* Add: Sync Posts with Embeddings (on Publish, on Update, and on Trash).
* Update: When missing orphan embeddings are found (a vector is in Pinecone, but not in WordPress), a specific orphan entry will be created. You can safely delete it. Best to keep everything clean.
* Update: Pinecone servers.

= 1.3.88 (2023/03/29) =
* Update: Content Settings for Embeddings can be saved.
* Add: Support for OpenAI on Microsoft Azure (it's faster than Open AI servers).
* Fix: Issue with Sync All for embeddings.
* Update: Better layouts and colors when code is embedded in the chat.
* Update: Updated dashboard, and lighter bundles.

= 1.3.83 (2023/03/27) =
* Add: New filters to handle the content of the posts.
* Update: Enhanced the discussions management.
* Update: Enhanced the embeddings management.
* Update: Translations.

= 1.3.80 (2023/03/26) =
* Update: Embeddings are more dynamic, handle better hashes, better bulk actions, more placeholders.
* Add: Customization of the admin bar.
* Update: Enhanced the language picker to remember current user choice.
* Fix: The limits were off of one unit.
* Add: Copy button for the output field in the AI Forms.

= 1.3.77 (2023/03/25) =
* Add: Max Tokens for the Forms.
* Add: Discussions tab has now a setting to be disabled (or not).
* Update: Pinecone servers.
* Fix: Color of the progress bars.

= 1.3.75 (2023/03/24) =
* Fix: The TextArea in AI Forms was not working correctly with a default value.
* Fix: Casually Fined Tuned should be turn off if the model is not finetuned.
* Fix: On some installs, floats would be echoed with commas instead of dots.
* Info: It's my birthday ✌️🥳

= 1.3.73 (2023/03/23) =
* Add: Post Type for Content Generator.
* Fix: Avoid a crash for the server which didn't install mbstring.
* Fix: The Meow Apps dashboard is back, with PHP Error Logs and evergthing.

= 1.3.69 (2023/03/22) =
* Fix: Issue with non-default models in the forms.
* Add: Default value and rows for textarea and input fields.
* Fix: Assistants weren't really disabled (depending on the settings).
* Fix: Simplified a few UI elements.

= 1.3.67 (2023/03/21) =
* Update: The Finetunes are now a module, that can be completely disabled (and it is, by default).
* Update: Overhaul of the language system. It's now unified, and I'll make it even better a bit later.
* Update: AI Engine automatically makes sure the texts aren't too long for some operations; it now uses the number of tokens rather than the number of characters. Give better results.
* Fix: Issue in the Content Generator.

= 1.3.65 (2023/03/20) =
* Update: Handle the finetuned models a bit differently, for a faster UI, and lot of improvements (like the ability to cancel a finetune, calculate historical spent amount on deleted models, etc). 

= 1.3.64 (2023/03/19) =
* Update: Retrieve post types rather than only proposing post/page.
* Update: Handle errors from OpenAI a bit better in the admin (there is currently a huge one!).

= 1.3.63 (2023/03/18) =
* Add: New GPT-4 and GPT-4 32k models.
* Update: Enhanced the way the prices are calculated to handle the new models.
* Fix: Better handling on the status icon for the OpenAI servers status.
* Add: Additional servers for Pinecone.

= 1.3.60 (2023/03/17) =
* Add: Discussions tab, with embedding's title displayed in the message, when used.
* Add: Catch errors in the statistics if OpenAI returns something unexpected.
* Update: New colors framework.

= 1.3.57 (2023/03/16) =
* Fix: Temperature was sometimes a bit too rounded.
* Update: Clean the admin screens a little.
* Update: Allow other models in the Content Generator.

= 1.3.54 (2023/03/15) =
* Update: In the Content Generator, sections (headings) are not mandatory anymore. You can simply delete the associated prompt, and the sections fields will be removed as well. You can save it as your new template.
* Add: Width and Max Height for the Chatbot Popup in the Settings.
* Fix: Compatibility issues with older versions of PHP.
* Fix: Make sure the extra context brought by embedding doesn't break the maximum number of tokens.
* Fix: For some reason, some models didn't have the mode and that was leading to the UI to crash.

= 1.3.49 (2023/03/14) =
* Add: Sanitize the content of the context for the shortcode.
* Add: Parameter in the builder for text_input_maxlength.
* Update: Enhanced handling of tokens.

= 1.3.47 (2023/03/13) =
* Add: More Pinecone servers.
* Fix: Enhanced the tokens prediction; client-side also automatically limits the total content depending on it.

= 1.3.44 (2023/03/12) =
* Update: Enhanced the whole bulk system.
* Update: Enhanced the tokens prediction for non-latin languages.

= 1.3.42 (2023/03/11) =
* Fix: Better guess to lower the limit of max tokens dynamically.
* Update: Supports multilingual websites with embedddings (WPML, Polylang).
* Update: Huge update on the way embeddings are created, synchronized and managed.

= 1.3.37 (2023/03/10) =
* Fix: Role management and capabilities.
* Fix: Avoid issue with wp_enqueue_script called at the wrong place.
* Add: Simplified API.
* Add: Maxlength for the chatbot input.
* Update: Working on the UI framework (dark theme will be possible on the WP side).

= 1.3.34 (2023/03/09) =
* Fix: The shortcode builder when tackling empty values.
* Fix: Make it so that the context doesn't break anything whatever the language. Hey, not easy somehow!
* Fix: The embeddings dashboard handles cancellation of bulk operations better.

= 1.3.32 (2023/03/08) =
* Add: Sync embeddings and posts.
* Add: Copy button to reuse the reply. Enabled by default, will add the UI for it later.
* Fix: Support of basics HTML in the compliance text.
* Fix: Avoid issues with Japanese.
* Fix: Enhanced the ChatGPT CSS (better header icons and fullscreen mode).

= 1.3.2 (2023/03/07) =
* Add: New icon_alt parameter to add an Alt Text to the chatbot icon.
* Add: Styles for the tables in the chabot.
* Fix: Moved the external JS/CSS locally.
* Fix: Escaping and sanitization issues.
* Fix: General code cleaning and refactoring.
* Fix: The icon displaying OpenAI status was not showing the warning sign when needed.

= 1.2.30 (2023/03/06) =
* Add: Embeddings. Add more context to your chatbot based on your data.
* Update: Better translations.
* Fix: Better format for the system error messages in the chatbot.🎵

= 1.2.21 (2023/03/05) =
* Add: A little tool to play with Text-to-Speech using Whisper API.
* Add: Quick Usage Costs in the Content Generation (same system as in the Playground).
* Fix: There was an issue for new users without an OpenAI key.
* Fix: There was an issue when picking a different model for finetune.
* Add: The Content Generator now supports {TOPIC} and {TITLE} everywhere.

= 1.2.0 (2023/03/04) =
* Update: Huge refactoring to make the plugin more extensible.
* Fix: UI issue in the Images Generator.

= 1.1.8 (2023/03/03) =
* Fix: TextFields in Forms were broken.
* Fix: Some UI issues on the admin side.
* Update: Make sur the forms are filled (we can add a better validation system at a later point).

= 1.1.6 (2023/03/02) =
* Add: The ChatGPT model is finally here! It's "gpt-3.5-turbo" and you can already use it with your chatbots, forms, in the playground, etc. It's very new so let me know if you find any issues, in the [forums](https://wordpress.org/support/plugin/ai-engine/). Set as the new default.
* Add: Max Length for the Input and TextArea in AI Forms.
* Update: Many little enhancements here and there.
* Fix: Minor bug in the AI Playground.

= 1.1.3 (2023/03/01) =
* Fix: UI issues in the Content Generator linked to the framework update.
* Add: Typewriter effect. I don't recommend it, but if you want to play with it, it's there :)
* Add: New filter: mwai_forms_params.
* Update: Refactoring and minor fixes. Making sure everything is stable and nice.

= 1.1.1 (2023/02/28) =
* Add: New Moderation Module; it's beta, check it out and play with it.
* Update: Big update in my framework.

= 1.1.0 (2023/02/26) =
* Update: Enhanced the whole flow of the chatbot (which also fixed minor issue).
* Update: Better handling of time in the statistics.

= 1.0.8 (2023/02/25) =
* Add: Filter to takeover the conversation programmatically.
* Add: Compliance Text and Max Messages.
* Add: Hyperparams for finetuning.
* Add: Queries viewer.

= 1.0.6 (2023/02/24) =
* Fixes: There were few issues with my Casually Fine-Tuned system.
* Add: Option to resolve shortcodes.

= 1.0.5 (2023/02/23) =
* Add: Limit can be applied on a daily-basis.
* Add: Added ID for AI Submit so that we can hook and customize the advanced params for the AI Forms.
* Add: Parameters to hide/show values in the statistics shortcode.
* Add: The mwai-clear class has been added to the Clear button.

= 1.0.3 (2023/02/22) =
* Fix: There was an alert popping in the AI Forms.
* Update: Better handling of user errors in the AI Forms.
* Update: The ChatGPT theme, if choosen, is applied to AI Forms too.

= 1.0.1 (2023/02/21) =
* Fix: The Form Select wasn't working properly.
* Update: Translation framework.

= 1.0.0 (2023/02/20) =
* Update: Enhance the chabot's input field visually.
* Update: Translation framework.

= 0.9.99 (2023/02/19) =
* Update: Translation framework.

= 0.9.98 (2023/02/18) =
* Fix: There was an exit applied if WP_DEBUG was used.
* Update: Default max_tokens for forms is now 2048.
* Add: New 'max_messages' parameter to limit the number of sentences in the prompt for the chatbot.
* Add: AI Submit now handles using element based on their ID. Use it like this: {#myid}.
* Update: Enhance the internal API with better helpers.

= 0.9.95 (2023/02/17) =
* Fix: Minor fixes related to notices and translations.
* Update: Enhanced Shortcode Builder.
* Add: UI for Custom Icon, Icon Message.
* Fix: Better control of the dirty state of the Post Editor.
* Add: Warn when the AI Forms are not properly set up to avoid issues.

= 0.9.89 (2023/02/16) =
* Fix: Enhancement in the models screen.
* Fix: Better session control.
* Add: New placeholders {TITLE} and {URL} for the Q&A Generator module.
* Update: Avoid an useless warning or two.

= 0.9.86 (2023/02/15) =
* Update: Handle the colors more naturally depending on the CSS variables.
* Update: Make sure the max tokens are respected and not over-setted.
* Update: Better handling of max tokens with forms.
* Add: Enhanced the way the models and managed.
* Fix: Issues with forms using non-latin characters.

= 0.9.85 (2023/02/14) =
* Fix: Minor issues related to max tokens.
* Fix: Some issues with forms, now also better layouts, more types, etc.
* Info: Happy Valentine's Day! 💕 I'll take a few hours off 😊

= 0.9.84 (2023/02/13) =
* Fix: Compile conversations in order to avoid overwhelming the AI.
* Fix: When over the limits, forms display an alert nicely.
* Fix: Quick fix for Rank Math.
* Update: Optimized the way the fields and handled and reset in the Content Generator and the Templates.
* Add: Support of custom language (or type of language) in the Content Generator.
* Info: I would like to focus on making everything amazingly perfect for the version 1.x. I keep the new features for a bit later, and make sure everything we have now is stable and nice, as well as the code quality. Please share your feedback in the [Support Threads](https://wordpress.org/support/plugin/ai-engine/).
* Info: If you enjoy this, don't hesitate to [write a review](https://wordpress.org/support/plugin/ai-engine/reviews/) :)

= 0.9.82 (2023/02/12) =
* Add: Chat logs.
* Update: Cleaning the UI.
* Update: Refactoring.

= 0.9.8 (2023/02/11) =
* Update: Quite a bit of refactoring.
* Add: Forms has the ability to work with DALL-E.
* Add: Position of the popup chatbot is now also in the settings.

= 0.9.6 (2023/02/10) =
* Fix: There was an issue with statistics/logging related to the current API Key.
* Update: Enhanced the shortcode builder to avoid user mistakes. 
* Update: Better sizes for chatbot icons.
* Update: Markdown support in AI Forms.
* Update: Dataset Generator allows replaying the bulk generation from a certain offset.
* Update: Better text validation before quickly generating titles and excerpts.
* Add: Timer in the chatbot button if the query takes more than 1 second.

= 0.9.3 (2023/02/09) =
* Add: Debug Mode.
* Fix: There were issues when both limits were set to zero and special conditions were set through a filter.

= 0.9.0 (2023/02/08) =
* Update: Can handle multiple apiKeys for statistics and limits.
* Update: Enhancements of the AI Forms.
* Update: Enhancements of Content-Aware, avoid repeated sentences, shorten content, etc.
* Fix: Some validations work, to avoid issues and hacks.

= 0.8.8 (2023/02/07) =
* Add: New param for the chatbot: guest_name.
* Update: Better consistency in the UI.
* Fix: Minor fixes.
* Fix: There was a little inconsistency with "Use Topics as Titles".
* Update: Reviewed the styles - but this still need a lot of improvements.

= 0.8.5 (2023/02/06) =
* Add: Pro Users: Visit the Statistics Tab and check the [FAQ](https://meowapps.com/ai-engine/faq/). Lots of fun ahead!
* Update: You can now enable/disable every feature to make the UI yours and for a better UX (that will also allow role-based access to different features).
* Info 1: Templates are super cool! I'd be happy if you could join this [discussion](https://wordpress.org/support/topic/common-use-cases-for-templates/) in the WordPress forums.
* Info 2: Share with me your feedback in the [Support Threads](https://wordpress.org/support/plugin/ai-engine/), I'll make it better for you! And of course, if you like the plugin, please leave a review on [WordPress.org](https://wordpress.org/support/plugin/ai-engine/reviews/). Thank you!

= 0.8.2 (2023/02/05) =
* Update: Enhancements and fixes to the AI Forms + a ChatGPT theme for them.
* Update: A bit of tidying on the UI, and added warning messages to avoid common mistakes.
* Add: Words count in Playground and Content Generator.
* Add: The icon_text parameter to add a text next to the icon of the chatbot.
* Update: Made the CSS of the chatbot slighlty more specific to avoid being overriden by pagebuilders.

= 0.7.6 (2023/02/04) =
* Fix: The icon of the chatbot was not applied.
* Update: Better AI Forms.
* Add: Templates for Content Generator. Templates are now available everywhere I wanted. I'd be happy if you could join this [discussion](https://wordpress.org/support/topic/common-use-cases-for-templates/) in the WordPress forums.

= 0.7.2 (2023/02/03) =
* Update: "casually_fined_tuned" is now "casually_fine_tuned".
* Fix: Editor also have access to the AI features (but not the Settings). This behavior can be filtered.
* Add: AI Forms for Pro (extremely beta but it works).

= 0.6.9 (2023/02/02) =
* Fix: The chatbot could potentially be over other clickable elements.
* Fix: Create Post has an issue in Single Generate mode.
* Add: The Templates Editor is now available in the Images Generator.

= 0.6.6 (2023/02/01) =
* Add: Templates in the Playground are now editable.
* Fix: Avoid the content-aware to take too many tokens.
* Update: Many little enhancements in the UI elements.
* Update: Handles timeouts better. More and more buttons will display the time elapsed.

= 0.6.2 (2023/01/31) =
* Add: The Post Bulk Generate feature is now working nicely.
* Fix: Issue with missing file.
* Add: WooCommerce fields generator for products.
* Update: More modularity to increase UI tidyness and website's performance.

= 0.5.7 (2023/01/30) =
* Update: The chatbot icon is now refered as "icon" (instead of "avatar" previously, which was confusing). We have an icon and an icon_position parameters for the chatbot.
* Fix: Crash while adding rows to the dataset.
* Add: Placeholders for the user name in the chatbot.
* Add: URL support for avatars for the user and/or the AI.

= 0.5.4 (2023/01/29) =
* Add: Avatar position (avatar_position) can be set to "bottom-right", "top-left", etc.
* Add: You can specify an avatar URL for each chatbot (avatar parameter, in the shortcode).
* Fix: The expand icon was always displayed for the popup chatbot, even with fullsize set to false.
* Add: Entries Generator for the Dataset Builder. Use with caution!

= 0.5.1 (2023/01/28) =
* Add: Chatbot avatars.
* Add: Color for the Header Buttons for the Chatbot Popup Window.
* Update: Enhanced the UI of the Settings, Chatbot and Content Generator.
* Update: The ID is now available in the Settings (reminder: ID allows you to set CSS more easily if you do it statically, it also keeps the conversations recorded in the browser between pages).
* Update: Enhancements relative to prompts, their placeholders, and UI visual adaption based on those.

= 0.4.8 (2023/01/27) =
* Add: If no user_name and ai_name are mentioned, avatars will be used.
* Add: Status of OpenAI servers (a little warning sign will also be added on the tab if something is wrong).
* Add: Possibility to modify or remove the error messages through a filter.

= 0.4.6 (2023/01/26) =
* Fixed: Resolved a potential issue with session (used for logging purposes).
* Fixed: The chatbot was not working properly on iPhones. 

= 0.4.5 (2023/01/25) =
* Add: Style the chatbot easily in the Settings.
* Add: Allow extra models to be added.
* Fix: Clean the context and the content-aware feature.

= 0.4.3 (2023/01/24) =
* Update: Allow re-train a fined-tuned model.
* Fix: The session was started too late, potentially causing a warning.

= 0.4.1 (2023/01/23) =
* Update: Better and simpler UI, make it a bit easier overall.
* Add: Statistics and Content-Aware features for Pro.
* Update: Make sure that all the AI requests have an "env" and a logical "session" associated (for logging purposes).

= 0.3.5 (2023/01/22) =
* Update: Better calculation of the OpenAI "Usage".
* Update: Lot of refactoring and code enhancements to allow other AI services to be integrated.
* Add: Generate based on Topic (Content Generator).
* Update: Various enhancements in the UI.

= 0.3.4 (2023/01/22) =
* Add: Code enhancements to support many new actions and filters.
* Add: Added actions and filters to modify the answers, limit the users, etc. More to come soon.

= 0.3.3 (2023/01/21) =
* Add: Languages management (check https://meowapps.com/ai-engine/tutorial/#add-or-remove-languages).
* Add: The chatbot can be displayed in fullscreen (use fullscreen="true" in the shortcode). It works logically with the window/popup mode: no popup? Fullscreen right away! Popup? Fullscreen on click :)
* Fix: A few potential issues that coult break a few things.
* Update: Cleaned the JS, CSS and HTML. I like when it's very tidy before going forward!

= 0.2.9 (2023/01/19) =
* Fix: Responsive.
* Add: Shortcode builder for the chatbot. This makes it much easier!
* Add: Bunch of new options to inject the chatbot everywhere.
* Add: Syntax highlighting for the code potentially generated by the AI.
* Add: The chatbot can be displayed as a window/popup. Sorry, only one icon for now, but will add more!
* Add: Bunch of WordPress filters to modify everything and do everything :)

= 0.2.6 (2023/01/18) =
* Update: Little UI enhancements and fixes.
* Add: "max_tokens" parameter for the chatbot shortcode.
* Add: "casually_fine_tuned" parameter for the chatbot shorcode (for fine-tuned models).

= 0.2.4 (2023/01/17) =
* Update: Perfected the fine-tuning module (UI and features). 
* Update: A few UI fixes but a lot more to come. 

= 0.2.3 (2023/01/16) =
* Add: Module to train your own AI model (visit the Settings > Fine Tuning). My user interface makes it look easy, but creating datasets and training models is not easy. Let's go through this together and I'll enhance AI Engine to make it easier.
* Update: Possible to add new lines in the requests to the chatbot.

= 0.2.2 (2023/01/13) =
* Add: Shortcode that creates an images generator bot.
* Fix: Bots are now responsive.
* Add: Button and placeholder of the bots can be translated.

= 0.2.1 (2023/01/12) =
* Add: Images Generator! After getting your feedback, I will implement this Image Generator in a modal in the Post Editor.

= 0.1.9 (2023/01/09) =
* Add: Many improvements to the chatbot! By default, it now uses ChatGPT style, and it also support replies from the AI using Markdown (and will convert it properly into HTML). Basically, you can have properly displayed code and better formatting in the chat!

= 0.1.7 (2023/01/08) =
* Add: Handle the errors better in the UI.
* Add: The chatbot can be styled a bit more easily.

= 0.1.6 (2023/01/07) =
* Fix: The timeout was 5s, which was too short for some requests. It's now 60s.

= 0.1.5 (2023/01/06) =
* Add: New 'api_key' parameter for the shortcode. The API Key can now be filtered, added through the shortcode, the filters, depending on your conditions.
* Fix: Better handling of errors.

= 0.1.4 (2023/01/05) =
* Update: Sorry, the name of the parameters in the chatbot were confusing. I've changed them to make it more clear.
* Add: New filter, and the possibility to add some CSS to the chatbot, directly through coding. Have a look on https://meowapps.com/ai-engine/.

= 0.1.0 (2023/01/01) =
* Fix: A few fixes in the playground.
* Add: Content Generator (available under Tools and Posts).

= 0.0.7 (2022/12/30) =
* Fix: Little issue in the playground.
* Add: Model and temperature in the playground.
* Updated: Improved the chatbot, with more parameters (temperature, model), and a better layout (HTML only).

= 0.0.3 (2022/12/29) =
* Add: Lightweight chatbot (beta).
* Fix: Missing icon.

= 0.0.1 (2022/12/27) =
* First release.
