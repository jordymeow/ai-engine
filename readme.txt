=== AI Engine: Chatbots, Generators, Assistants, GPT 4 and more! ===
Contributors: TigrouMeow
Tags: ai, gpt, openai, chatbot, copilot, chatgpt
Donate link: https://meowapps.com/donation/
Requires at least: 6.0
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 2.1.7
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

= 2.1.7 (2024/02/04) =
* Add: Enhanced embeddings handling, including fixes, automatic EnvID mismatch resolution, and support for new models.
* Add: Implemented additional_instructions for contextual guidance in assistants and memory for default EnvID.
* Fix: Corrected issues with image downloading from URLs and Local Download functionality.
* Update: Streamlined embeddings environment with support for context and updates to models and vectors table.
* 🚀 [Click here](https://trello.com/b/8U9SdiMy/ai-engine-feature-requests) to vote for the features you want the most!
* 🎵 Discuss with other users about features and issues on [my Discord](https://discord.gg/bHDGh38).
* 🌴 Keep us motivated with [a little review here](https://wordpress.org/support/plugin/ai-engine/reviews/). Thank you!

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
