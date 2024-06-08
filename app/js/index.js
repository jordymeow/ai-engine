// Previous: 2.2.70
// Current: 2.3.8

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
import Addons from '@app/screens/Addons';
import PostsListTools from './modules/PostsListTools';
import ContentGenerator from './screens/ContentGenerator';
import ImageGenerator from './screens/ImageGenerator';
import BlockFeatures from './modules/BlockFeatures';
import BlockCopilot from './modules/BlockCopilot';

// Gutenberg Blocks
import { initChatbotBlocks, initFormsBlocks } from './blocks/index';

const chatbotsEnabled = options.module_chatbots;
const assistantsEnabled = options.module_suggestions;
const formsEnabled = options.module_forms;

if (chatbotsEnabled) {
	initChatbotBlocks();
}

if (formsEnabled) {
	initChatbotBlocks();
	initFormsBlocks();
}

if (assistantsEnabled) {
	BlockFeatures();
	BlockCopilot();
}

document.addEventListener('DOMContentLoaded', function() {

	const initDashboard = (elementId, Component) => {
		const el = document.getElementById(elementId);
		if (el) {
			render(
				<QueryClientProvider client={queryClient}>
					<NekoUI><Component /></NekoUI>
				</QueryClientProvider>,
				el
			);
		}
	};

	initDashboard('mwai-admin-settings', Settings);
	initDashboard('mwai-content-generator', ContentGenerator);
	initDashboard('mwai-image-generator', ImageGenerator);
	initDashboard('mwai-playground', Playground);

	const addonsEl = document.getElementById('mwai-addons');
	if (addonsEl) {
		const addonsData = addonsEl.getAttribute('data-addons');
		let addons = [];
		if (addonsData) {
			try {
				addons = JSON.parse(addonsData);
			}
			catch (e) {
				console.error('Failed to parse add-ons.', e);
			}
		}
		render(
			<QueryClientProvider client={queryClient}>
				<NekoUI><Addons addons={addons} /></NekoUI>
			</QueryClientProvider>,
			addonsEl
		);
	}

	if (assistantsEnabled) {
		const postsListToolsEl = document.getElementById('mwai-admin-postsList');
		if (postsListToolsEl) {
			render(<NekoUI><PostsListTools /></NekoUI>, postsListToolsEl);
		}
	}

	const dashboardEl = document.getElementById('meow-common-dashboard');
	if (dashboardEl) {
		render(
			<QueryClientProvider client={queryClient}>
				<NekoUI><Dashboard /></NekoUI>
			</QueryClientProvider>,
			dashboardEl
		);
	}
});