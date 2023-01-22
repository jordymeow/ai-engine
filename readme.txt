=== AI Engine (ChatGPT-like Chatbot, Content/Image Generator, AI Playground, AI Fine-tuning) ===
Contributors: TigrouMeow
Tags: chatgpt, gpt, gpt-3, openai, ai, chatbot, content generator, finetuning, image generator
Donate link: https://meowapps.com/donation/
Requires at least: 5.0
Tested up to: 6.1
Requires PHP: 7.3
Stable tag: 0.3.5
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

AI for WordPress! ChatGPT-style chatbot, Image & Content Generator, Train AI Models, etc. Lot of features + Extensible + Customizable + Sleek UI = 💕

== Description ==

With AI Engine, create a ChatGPT-like chatbot (or many of them, with different features and behaviors), generate content, images, quickly suggest titles and excerpts, track your OpenAI usage stats, and much more! Then explore the AI Playground to try out a variety of AI tools like translation, correction, SEO, suggestion, etc. There is also an internal API so other plugins can tap into its capabilities. We'll be adding even more AI tools and features to the AI Engine based on your feedback!

Official website: [AI Engine](https://meowapps.com/ai-engine/).

== Features ==

* Generate fresh and engaging content for your site
* Explore the AI Playground for a variety of tools like translation, correction, and ChatGPT-style discussions
* Add a ChatGPT-style chatbot (or an images creation bot) to your website with a simple shortcode
* Fullscreen, popup, and window modes for the chatbot
* Train your AI to make it better at specific tasks
* Easily create new titles and excerpts for your posts
* Keep track of your OpenAI usage with built-in statistics
* Internal API for you to play with
* Upcoming features include translation to any language and the ability to improve specific paragraphs
* And so much more on the way!

== Shortcode: ChatGPT & Image Generation Bot ==

Looking to add some AI-powered chat functionality to your website? Our chatbot is here to help! Using vanilla JS on the frontend, it's lightweight and easy to use, with this shortcode: [mwai_chatbot]. Looks simple? Yes, but there are many parameters and countless ideas. Visite the [official documentation](https://meowapps.com/ai-engine/) for more information. 

== Content Generator ==

Generate articles with customizable headings, language, and other parameters. Feel free to play around with the settings and even modify the prompts to craft exactly the content you need.

You can also generate images using DALL-E model. Keep in mind that currently, the images generated are only in square format (1024x1024) and there are some limitations (OpenAI is in beta).

== Train your AI ==

In the Fine Tuning section of AI Engine, you can prepare datasets, manage them, and train new models based on them, in just a few click.

== Meow Apps + AI ==

I am really excited about the amazing possibilities that AI technology brings to the world of online content creation. I believe that by working together, AI and humans can create something truly special. However, I don't want to see a boring web full of robot-generated content. Instead, I want AI to be used to boost and amplify the unique voice of human creators. New voices will be heard, new ideas will be shared, and new perspectives will be explored. Together, let's do this! 💕

== Open AI ==

The AI Engine utilizes the API from [OpenAI](https://beta.openai.com). This plugin does not gather any information from your OpenAI account except for the number of tokens utilized. The data transmitted to the OpenAI servers primarily consists of the content of your article and the context you specify. The usage shown in the plugin's settings is just for reference. It is important to check your usage on the [OpenAI website](https://beta.openai.com/account/usage) for accurate information. Please also review their [Privacy Policy](https://openai.com/privacy/) and [Terms of Service](https://openai.com/terms/) for further information.

== Usage ==

1. Create an account at OpenAI.
2. Create an API key and insert in the plugin settings (Meow Apps -> AI Engine).
3. Enjoy the features of AI Engine!
5. ... and always keep an eye on [your OpenAI usage](https://beta.openai.com/account/usage)!

Languages: English.

== Changelog ==

= 0.3.5 (2023/01/22) =
* Update: Better calculation of the OpenAI "Usage".
* Update: Lot of refactoring and code enhancements to allow other AI services to be integrated.
* Add: Generate based on Topic (Content Generator).
* Update: Various enhancements in the UI.
* Info: Share with me your feedback in the [Support Threads](https://wordpress.org/support/plugin/ai-engine/), I'll make it better for you! And of course, if you like the plugin, please leave a review on [WordPress.org](https://wordpress.org/support/plugin/ai-engine/reviews/). Thank you!


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

= 0.1.2 (2023/01/05) =
* Add: New filter for the chatbot. More info here: https://meowapps.com/ai-engine/.

= 0.1.0 (2023/01/03) =
* Add: Content Generator (available under Tools and Posts).

= 0.0.8 (2023/01/01) =
* Fix: A few fixes in the playground.

= 0.0.7 (2022/12/30) =
* Fix: Little issue in the playground.
* Add: Model and temperature in the playground.

= 0.0.6 (2022/12/30) =
* Updated: Improved the chatbot, with more parameters (temperature, model), and a better layout (HTML only).

= 0.0.3 (2022/12/29) =
* Add: Lightweight chatbot (beta).
* Fix: Missing icon.

= 0.0.1 (2022/12/27) =
* First release.
