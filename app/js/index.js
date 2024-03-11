// Previous: 1.6.56
// Current: 2.2.4

const { render } = wp.element;
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({ 
	defaultOptions: { 
		queries: { 
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			retry: false,
			placeholderData: (prev) => prev,
		}
	}
});

// Neko UI
import { NekoUI } from '@neko-ui';
import { Dashboard } from '@common';

// Components
import { options } from './settings';
import Settings from '@app/screens/Settings';
import Playground from '@app/screens/Playground';
import PostsListTools from './modules/PostsListTools';
import ContentGenerator from './screens/ContentGenerator';
import ImageGenerator from './screens/ImageGenerator';
import BlockFeatures from './modules/BlockFeatures';
import BlockCopilot from './modules/BlockCopilot';

// Gutenberg Blocks
import { initChatbotBlocks, initFormsBlocks } from './blocks/index';
import WooCommerceAssistant from './modules/WooCommerce';

const chatbotsEnabled = options.module_chatbots;
const assistantsEnabled = options.module_suggestions;
const formsEnabled = options.module_forms;
const woocommerceEnabled = options.module_woocommerce;

if (chatbotsEnabled) {
	initChatbotBlocks();
}

if (formsEnabled) {
	initFormsBlocks();
	initChatbotBlocks();
}

if (assistantsEnabled) {
	BlockFeatures();
	BlockCopilot();
}

document.addEventListener('DOMContentLoaded', function() {

	// Settings
	const settings = document.getElementById('mwai-admin-settings');
	if (settings) {
		render(<QueryClientProvider client={queryClient}>
			<NekoUI><Settings /></NekoUI>
		</QueryClientProvider>, settings);
	}

	// Content Generator
	const generator = document.getElementById('mwai-content-generator');
	if (generator) {
		render(<QueryClientProvider client={queryClient}>
			<NekoUI><ContentGenerator /></NekoUI>
		</QueryClientProvider>, generator);
	}

	// Image Generator
	const imgGen = document.getElementById('mwai-image-generator');
	if (imgGen) {
		render(<QueryClientProvider client={queryClient}>
			<NekoUI><ImageGenerator /></NekoUI>
		</QueryClientProvider>, imgGen);
	}

	// Dashboard
	const dashboard = document.getElementById('mwai-playground');
	if (dashboard) {
		render(<QueryClientProvider client={queryClient}>
			<NekoUI><Playground /></NekoUI>
		</QueryClientProvider>, dashboard);
	}

	// Admin Tools
	if (assistantsEnabled) {
		const postsListTools = document.getElementById('mwai-admin-postsList');
		if (postsListTools) {
			render(<NekoUI><PostsListTools /></NekoUI>, postsListTools);
		}
	}

	// // Admin Tools
	if (woocommerceEnabled) {
		const wcAssistant = document.getElementById('mwai-admin-wcAssistant');
		if (wcAssistant) {
			render(<NekoUI><WooCommerceAssistant /></NekoUI>, wcAssistant);
		}
	}

	// Common
	const meowDashboard = document.getElementById('meow-common-dashboard');
	if (meowDashboard) {
		render(<QueryClientProvider client={queryClient}>
			<NekoUI><Dashboard /></NekoUI>
		</QueryClientProvider>, meowDashboard);
	}
});