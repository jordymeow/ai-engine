// Previous: 1.3.64
// Current: 1.3.65

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
import Settings from '@app/screens/Settings';
import Playground from '@app/screens/Playground';
import PostsListTools from './modules/PostsListTools';
import ContentGenerator from './screens/ContentGenerator';
import ImageGenerator from './screens/ImageGenerator';
import SlotFills from './modules/SlotFills';

// Gutenberg Blocks
import initBlocks from './blocks/index';
import WooCommerceAssistant from './modules/WooCommerce';
initBlocks();

document.addEventListener('DOMContentLoaded', function() {

	SlotFills();

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
	const postsListTools = document.getElementById('mwai-admin-postsList');
	if (postsListTools) {
		render(<NekoUI><PostsListTools /></NekoUI>, postsListTools);
	}

	// Admin Tools
	const wcAssistant = document.getElementById('mwai-admin-wcAssistant');
	if (wcAssistant) {
		render(<NekoUI><WooCommerceAssistant /></NekoUI>, wcAssistant);
	}

	// Common
	const meowDashboard = document.getElementById('meow-common-dashboard');
	if (meowDashboard) {
		render(<Dashboard />, meowDashboard);
	}
});
