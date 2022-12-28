// Previous: 0.6.8
// Current: 0.0.3

// React & Vendor Libs
import React from 'react';
import ReactDOM from 'react-dom';

// Components
import Settings from '@app/components/Settings';
import Playground from '@app/components/Playground';
import PostsListTools from './components/PostsListTools';
import SlotFills from './components/SlotFills';

document.addEventListener('DOMContentLoaded', function(event) {

	// Settings
	const settings = document.getElementById('mwai-admin-settings');
	if (settings) {
		ReactDOM.render((<Settings />), settings);
	}

	// Dashboard
	const dashboard = document.getElementById('mwai-playground');
	if (dashboard) {
		ReactDOM.render((<Playground />), dashboard);
	}

	// Admin Tools
	const postsListTools = document.getElementById('mwai-admin-postsList');
	if (postsListTools) {
		ReactDOM.render((<PostsListTools />), postsListTools);
	}

});
