=== AI Engine (ChatGPT-like Chatbot, Content/Image Generator, AI Playground, AI Fine-tuning) ===
Contributors: TigrouMeow
Tags: chatgpt, gpt, gpt-3, openai, ai, chatbot, content generator, finetuning, image generator
Donate link: https://meowapps.com/donation/
Requires at least: 5.0
Tested up to: 6.1
Requires PHP: 7.3
Stable tag: 0.5.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

AI for WordPress. ChatGPT-style chatbot, image & content generator, train AI models, etc. Lot of features, extensible, customizable, sleek UI. Enjoy it! :)

== Description ==

With AI Engine, create a ChatGPT-like chatbot (or many of them, with different features and behaviors), generate content, images, quickly suggest titles and excerpts, track your OpenAI usage stats, and much more! Then explore the AI Playground to try out a variety of AI tools like translation, correction, SEO, suggestion, etc. There is also an internal API so other plugins can tap into its capabilities. We'll be adding even more AI tools and features to the AI Engine based on your feedback!

Official website: [AI Engine](https://meowapps.com/ai-engine/).

== Features ==

* Add a ChatGPT-style chatbot (or an images creation bot) to your website with a simple shortcode
* Generate fresh and engaging content for your site
* Explore the AI Playground for a variety of tools like translation, correction, SEO, etc
* Fullscreen, popup, and window modes for the chatbot
* Train your AI to make it better at specific tasks
* Quickly brainstorm new titles and excerpts for your posts
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

= 0.5.4 (2023/01/29) =
* Add: Avatar position (avatar_position) can be set to "bottom-right", "top-left", etc.
* Add: You can specify an avatar URL for each chatbot (avatar parameter, in the shortcode).
* Fix: The expand icon was always displayed for the popup chatbot, even with fullsize set to false.
* Add: Entries Generator for the Dataset Builder. Use with caution!
* Info: Share with me your feedback in the [Support Threads](https://wordpress.org/support/plugin/ai-engine/), I'll make it better for you! And of course, if you like the plugin, please leave a review on [WordPress.org](https://wordpress.org/support/plugin/ai-engine/reviews/). Thank you!

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
* Add: "casually_fined_tuned" parameter for the chatbot shorcode (for fine-tuned models).

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
