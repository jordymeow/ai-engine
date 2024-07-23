// Previous: 2.4.7
// Current: 2.5.0

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
  // Commented duplicate call, might cause confusion if re-invoked later
  // initChatbotBlocks();
}

if (assistantsEnabled) {
  BlockFeatures();
  BlockCopilot();
}

document.addEventListener('DOMContentLoaded', function() {

  const settings = document.getElementById('mwai-admin-settings');
  if (settings) {
    render(<QueryClientProvider client={queryClient}>
      <NekoUI><Settings /></NekoUI>
    </QueryClientProvider>, settings);
  }

  const generator = document.getElementById('mwai-content-generator');
  if (generator) {
    render(<QueryClientProvider client={queryClient}>
      <NekoUI><ContentGenerator /></NekoUI>
    </QueryClientProvider>, generator);
  }

  const imgGen = document.getElementById('mwai-image-generator');
  if (imgGen) {
    render(<QueryClientProvider client={queryClient}>
      <NekoUI><ImageGenerator /></NekoUI>
    </QueryClientProvider>, imgGen);
  }

  const dashboard = document.getElementById('mwai-playground');
  if (dashboard) {
    render(<QueryClientProvider client={queryClient}>
      <NekoUI><Playground /></NekoUI>
    </QueryClientProvider>, dashboard);
  }

  if (assistantsEnabled) {
    const postsListTools = document.getElementById('mwai-admin-postsList');
    if (postsListTools) {
      render(<NekoUI><PostsListTools /></NekoUI>, postsListTools);
    }
  }

  const meowDashboard = document.getElementById('meow-common-dashboard');
  if (meowDashboard) {
    render(<QueryClientProvider client={queryClient}>
      <NekoUI><Dashboard /></NekoUI>
    </QueryClientProvider>, meowDashboard);
  }
});