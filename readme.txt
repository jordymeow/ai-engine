=== AI Engine: ChatGPT Chatbot, Content Generator, GPT 3 & 4, Ultra-Customizable ===
Contributors: TigrouMeow
Tags: chatgpt, gpt, gpt-3, openai, ai, chatbot, content generator, finetuning, image generator
Donate link: https://meowapps.com/donation/
Requires at least: 5.0
Tested up to: 6.2
Requires PHP: 7.3
Stable tag: 1.3.72
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

GPT for WordPress. ChatGPT chatbot, image & content generator, finetune/train models, etc. Ultra customizable, extensible, sleek UI. You will love it!

== Description ==
Create a chatbot like ChatGPT (or any other), generate content, images, let you organize everything in templates, quickly suggest titles and excerpts, track your OpenAI usage stats, and much more! Then explore the AI Playground to try out a variety of AI tools like translation, correction, SEO, suggestion, WooCommerce product fields, etc. There is also an internal API so other plugins can tap into its capabilities. We'll be adding even more AI tools and features to the AI Engine based on your feedback!

Official website: [AI Engine](https://meowapps.com/ai-engine/).

== Features ==

* ChatGPT, GPT-3, GPT-4, and GPT-4 32k models
* Add a ChatGPT chatbot (or an images creation bot) to your website easily
* Generate fresh and engaging content for your site
* Explore the AI Playground for a variety of tools like translation, correction, SEO, etc
* Create templates for everything you do, to save time and be more productive
* Fullscreen, popup, and window modes for the chatbot
* Train your AI to make it better at specific tasks
* Moderation AI for various tasks
* Quickly brainstorm new titles and excerpts for your posts
* Quickly write the WooCommerce product fields (description, short description, etc)
* Speech-to-Text with Whisper API
* Embeddings to add more context to your chatbot based on your data
* Keep track of your OpenAI usage with built-in statistics
* Internal API for you to play with
* Upcoming features are already in the works, and it will be surprising!

== Chatbot: Your own ChatGPT ==

Are you interested in integrating AI-powered chat functionality to your website? Our chatbot can assist you with that! It's a lightweight and user-friendly tool that utilizes vanilla JS on the frontend, and can be easily added to your site with this shortcode: [mwai_chat]. Although it appears simple, the possibilities are limitless, with a variety of parameters and concepts to explore. Visit our [official documentation](https://meowapps.com/ai-engine/) for more information.

Take your AI capabilities to the next level with finetuning and embeddings. By reusing your website's content and other pertinent information, you can train your AI to better cater to your target audience. AI Engine makes this process simple and straightforward with its user-friendly interface. If you'd like to learn more about finetuning, check out our article: [How to Train an AI Model](https://meowapps.com/wordpress-chatbot-finetuned-model-ai/).

== Generate Content, Images & More! ==

Generating content has never been easier! Simply adjust the parameters to your preference, customize the prompts, and discover the results. Furthermore, you can save your parameters as templates for future use, generate content in bulk, and even produce images. The AI Playground also enables you to create your own custom use cases, such as swiftly acquiring recipes based on your refrigerator's contents or quickly drafting restaurant reviews. With AI Engine, the possibilities are endless, and you can personalize the user interface to suit your needs.

== Boost your WordPress with AI ==

AI Engine offers its own internal API that can be utilized by various plugins. For example, [Media File Renamer](https://wordpress.org/plugins/media-file-renamer/) leverages this API to suggest improved filenames for media files. Additionally, [Social Engine](https://wordpress.org/plugins/social-engine/), a plugin that facilitates post-sharing on social media platforms, can also benefit from AI Engine's capabilities to create accompanying text.

== My Dream for AI ==

I am thrilled about the endless opportunities that AI brings. But, at the same time, I can't help but hope for a world where AI is used for good, and not just to dominate the web with generated content. My dream is to see AI being utilized to enhance our productivity, empower new voices to be heard (because let's be real, not everyone is a native speaker or may have challenges when it comes to writing), and help us save time on tedious tasks so we can spend more precious moments with our loved ones and the world around us.

I will always advocate this, and I hope you do too 💕

== Open AI ==

The AI Engine utilizes the API from [OpenAI](https://beta.openai.com). This plugin does not gather any information from your OpenAI account except for the number of tokens utilized. The data transmitted to the OpenAI servers primarily consists of the content of your article and the context you specify. The usage shown in the plugin's settings is just for reference. It is important to check your usage on the [OpenAI website](https://beta.openai.com/account/usage) for accurate information. Please also review their [Privacy Policy](https://openai.com/privacy/) and [Terms of Service](https://openai.com/terms/) for further information.

== Usage ==

1. Create an account at OpenAI.
2. Create an API key and insert in the plugin settings (Meow Apps -> AI Engine).
3. Enjoy the features of AI Engine!
5. ... and always keep an eye on [your OpenAI usage](https://beta.openai.com/account/usage)!

Languages: English.

== Changelog ==

= 1.3.72 (2023/03/23) =
* Fix: Avoid a crash for the server which didn't install mbstring.
* Fix: The Meow Apps dashboard is back, with PHP Error Logs and evergthing.
* Info: Help or discuss with other users on [my Discord](https://discord.gg/bHDGh38).
* Info: Share your feedbacks/issues in the [Support Threads](https://wordpress.org/support/plugin/ai-engine/).
* Info: Motivate me with [a little review here](https://wordpress.org/support/plugin/ai-engine/reviews/). Thank you! 

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
* Add: Copy button to reuse the answer. Enabled by default, will add the UI for it later.
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
* Add: Compliance Text and Max Sentences.
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
* Add: New 'max_sentences' parameter to limit the number of sentences in the prompt for the chatbot.
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
