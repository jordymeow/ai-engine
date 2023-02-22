=== AI Engine: ChatGPT Chatbot, GPT Content Generator, Custom Playground & Features ===
Contributors: TigrouMeow
Tags: chatgpt, gpt, gpt-3, openai, ai, chatbot, content generator, finetuning, image generator
Donate link: https://meowapps.com/donation/
Requires at least: 5.0
Tested up to: 6.1
Requires PHP: 7.3
Stable tag: 1.0.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

GPT AI for WordPress. ChatGPT-style chatbot, image/content generator, finetune and train models, etc. Customizable and sleek UI. Extensible features. Your AI Engine for WP!

== Description ==
With AI Engine, create a ChatGPT-like chatbot (or many of them, with different features and behaviors), generate content, images, let you organize everything in templates, quickly suggest titles and excerpts, track your OpenAI usage stats, and much more! Then explore the AI Playground to try out a variety of AI tools like translation, correction, SEO, suggestion, WooCommerce product fields, etc. There is also an internal API so other plugins can tap into its capabilities. We'll be adding even more AI tools and features to the AI Engine based on your feedback!

Official website: [AI Engine](https://meowapps.com/ai-engine/).

== Features ==

* Add a ChatGPT-style chatbot (or an images creation bot) to your website with a simple shortcode
* Generate fresh and engaging content for your site
* Explore the AI Playground for a variety of tools like translation, correction, SEO, etc
* Create templates for everything you do, to save time and be more productive
* Fullscreen, popup, and window modes for the chatbot
* Train your AI to make it better at specific tasks
* Quickly brainstorm new titles and excerpts for your posts
* Quickly write the WooCommerce product fields (description, short description, etc)
* Keep track of your OpenAI usage with built-in statistics
* Internal API for you to play with
* Upcoming features are already in the works, and it will be surprising!

== Chatbot (ChatGPT-like) ==

Looking to add some AI-powered chat functionality to your website? Our chatbot is here to help! Using vanilla JS on the frontend, it's lightweight and easy to use, with this shortcode: [mwai_chatbot]. Looks simple? Yes, but there are many parameters and countless ideas. Visit the [official documentation](https://meowapps.com/ai-engine/) for more info. 

== Optimize/Generate Content ==

Generate articles with customizable headings, language, and other parameters. Feel free to play around with the settings and even modify the prompts to craft exactly the content you need. You can also generate images using DALL-E model. Keep in mind that currently, the images generated are only in square format (1024x1024) and there are some limitations (OpenAI is in beta).

== Train/Finetune your AI Model ==

In the Fine Tuning section of AI Engine, you can prepare/generate datasets, and train new models based on them, in just a few click! Please check my article on [How to Train an AI Model](https://meowapps.com/wordpress-chatbot-finetuned-model-ai/).

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

= 1.0.4 (2023/02/23) =
* Add: Parameters to hide/show values in the statistics shortcode.
* Add: The mwai-clear class has been added to the Clear button.
* Info: If you want help/discuss with each other, join my Discord server: https://discord.gg/bHDGh38. However, please note that I will not be able to provide support there (I need to stay focus on coding).
* Info: Please share your feedback in the [Support Threads](https://wordpress.org/support/plugin/ai-engine/) and some love through [a review](https://wordpress.org/support/plugin/ai-engine/reviews/). Thank you so much! 😊

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
