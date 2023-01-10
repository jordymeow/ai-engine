// Previous: 0.1.0
// Current: 0.1.9

const { render } = wp.element;

// Neko UI
import { Dashboard } from '@common';

// Components
import Settings from '@app/components/Settings';
import Playground from '@app/components/Playground';
import PostsListTools from './components/PostsListTools';
import Generator from './components/Generator';
import SlotFills from './components/SlotFills';

document.addEventListener('DOMContentLoaded', function(event) {

	// Settings
	const settings = document.getElementById('mwai-admin-settings');
	if (settings) {
		render((<Settings />), settings);
	}

	// Generator
	const generator = document.getElementById('mwai-generator');
	if (generator) {
		render((<Generator />), generator);
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

	// Common
	const meowDashboard = document.getElementById('meow-common-dashboard');
	if (meowDashboard) {
		render((<Dashboard />), meowDashboard);
	}

});
