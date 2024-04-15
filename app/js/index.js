// Previous: 2.2.4
// Current: 2.2.70

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

import { NekoUI } from '@neko-ui';
import { Dashboard } from '@common';

import { options } from './settings';
import Settings from '@app/screens/Settings';
import Playground from '@app/screens/Playground';
import PostsListTools from './modules/PostsListTools';
import ContentGenerator from './screens/ContentGenerator';
import ImageGenerator from './screens/ImageGenerator';
import BlockFeatures from './modules/BlockFeatures';
import BlockCopilot from './modules/BlockCopilot';

import { initChatbotBlocks, initFormsBlocks } from './blocks/index';

const chatbotsEnabled = options.module_chatbots;
const assistantsEnabled = options.module_suggestions;
const formsEnabled = options.module_forms;

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

	const settingsContainer = document.getElementById('mwai-admin-settings');
	if (settingsContainer) {
		render(<QueryClientProvider client={queryClient}>
			<NekoUI><Settings /></NekoUI>
		</QueryClientProvider>, settingsContainer);
	}

	const contentGenContainer = document.getElementById('mwai-content-generator');
	if (contentGenContainer) {
		render(<QueryClientProvider client={queryClient}>
			<NekoUI><ContentGenerator /></NekoUI>
		</QueryClientProvider>, contentGenContainer);
	}

	const imageGenContainer = document.getElementById('mwai-image-generator');
	if (imageGenContainer) {
		render(<QueryClientProvider client={queryClient}>
			<NekoUI><ImageGenerator /></NekoUI>
		</QueryClientProvider>, imageGenContainer);
	}

	const dashboardContainer = document.getElementById('mwai-playground');
	if (dashboardContainer) {
		render(<QueryClientProvider client={queryClient}>
			<NekoUI><Playground /></NekoUI>
		</QueryClientProvider>, dashboardContainer);
	}

	if (assistantsEnabled) {
		const postsTools = document.getElementById('mwai-admin-postsList');
		if (postsTools) {
			render(<NekoUI><PostsListTools /></NekoUI>, postsTools);
		}
	}

	const meowDashboard = document.getElementById('meow-common-dashboard');
	if (meowDashboard) {
		render(<QueryClientProvider client={queryClient}>
			<NekoUI><Dashboard /></NekoUI>
		</QueryClientProvider>, meowDashboard);
	}
});