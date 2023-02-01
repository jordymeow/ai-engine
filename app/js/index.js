// Previous: 0.5.9
// Current: 0.6.6

const { render } = wp.element;
import { QueryClient, useQuery, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } });

// Neko UI
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
		render((<QueryClientProvider client={queryClient}><Settings /></QueryClientProvider>), settings);
	}

	// Content Generator
	const generator = document.getElementById('mwai-content-generator');
	if (generator) {
		render((<ContentGenerator />), generator);
	}

	// Image Generator
	const imgGen = document.getElementById('mwai-image-generator');
	if (imgGen) {
		render((<ImageGenerator />), imgGen);
	}

	// Dashboard
	const dashboard = document.getElementById('mwai-playground');
	if (dashboard) {
		render((<QueryClientProvider client={queryClient}><Playground /></QueryClientProvider>), dashboard);
	}

	// Admin Tools
	const postsListTools = document.getElementById('mwai-admin-postsList');
	if (postsListTools) {
		render((<PostsListTools />), postsListTools);
	}

	// Admin Tools
	const wcAssistant = document.getElementById('mwai-admin-wcAssistant');
	if (wcAssistant) {
		render((<WooCommerceAssistant />), wcAssistant);
	}

	// Common
	const meowDashboard = document.getElementById('meow-common-dashboard');
	if (meowDashboard) {
		render(<Dashboard />, meowDashboard);
	}
});
