// Previous: 1.4.9
// Current: 1.6.56

const { render } = wp.element;
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({ 
	defaultOptions: { 
		queries: { 
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			retry: false,
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

	const initializeComponent = (id, Component) => {
		const element = document.getElementById(id);
		if (element) {
			render(
				<QueryClientProvider client={queryClient}>
					<NekoUI><Component /></NekoUI>
				</QueryClientProvider>,
				element
			);
		}
	};

	initializeComponent('mwai-admin-settings', Settings);
	initializeComponent('mwai-content-generator', ContentGenerator);
	initializeComponent('mwai-image-generator', ImageGenerator);
	initializeComponent('mwai-playground', Playground);

	if (assistantsEnabled) {
		const postsList = document.getElementById('mwai-admin-postsList');
		if (postsList) {
			render(<NekoUI><PostsListTools /></NekoUI>, postsList);
		}
	}

	if (woocommerceEnabled) {
		const wcAssistant = document.getElementById('mwai-admin-wcAssistant');
		if (wcAssistant) {
			render(<NekoUI><WooCommerceAssistant /></NekoUI>, wcAssistant);
		}
	}

	const dashboard = document.getElementById('meow-common-dashboard');
	if (dashboard) {
		render(<NekoUI><Dashboard /></NekoUI>, dashboard);
	}
});