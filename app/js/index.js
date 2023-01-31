// Previous: 0.3.2
// Current: 0.5.8

const { render } = wp.element;
import { QueryClient, useQuery, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } });

// Neko UI
import { Dashboard } from '@common';

// Components
import Settings from '@app/components/Settings';
import Playground from '@app/components/Playground';
import PostsListTools from './components/PostsListTools';
import ContentGenerator from './components/ContentGenerator';
import ImageGenerator from './components/ImageGenerator';
import SlotFills from './components/SlotFills';

// Gutenberg Blocks
import initBlocks from './blocks/index';
import WooCommerceAssistant from './components/assistants/WooCommerce';
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
		render((<Playground />), dashboard);
	}

	// Admin Tools
	const postsListTools = document.getElementById('mwai-admin-postsList');
	if (postsListTools) {
		render((<PostsListTools />), postsListTools);
	}

	// Admin Tools
	const wcAssistant = document.getElementById('mwai-admin-wcAssistant');
	if (postsListTools) {
		render((<WooCommerceAssistant />), wcAssistant);
	}

	// Common
	const meowDashboard = document.getElementById('meow-common-dashboard');
	if (meowDashboard) {
		render(<Dashboard />, meowDashboard);
	}
});
