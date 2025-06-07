# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Engine Pro is a comprehensive WordPress plugin that integrates AI capabilities into WordPress sites. It supports multiple AI providers (OpenAI, Anthropic, Google, Hugging Face, etc.) and offers features like chatbots, content generation, AI forms, embeddings, and function calling.

## Development Commands

```bash
# Install dependencies
yarn install

# Development mode with file watching
yarn dev

# Production build
yarn build

# Bundle analysis
yarn analysis

# Create plugin zip file
yarn zip
```

## Testing & Debugging

### REST API Testing

Test the AI Engine using curl commands:

```bash
# Test simple text query
curl -X POST https://ai.nekod.net/wp-json/mwai/v1/simpleTextQuery \
     -H "Authorization: Bearer hello-meow" \
     -H "Content-Type: application/json" \
     -d '{"message":"Tell me a joke","model":"gpt-4.1-nano"}'

# Test chatbot query
curl -X POST https://ai.nekod.net/wp-json/mwai/v1/simpleChatbotQuery \
     -H "Authorization: Bearer hello-meow" \
     -H "Content-Type: application/json" \
     -d '{"botId":"jordy","message":"Hello!"}'
```

### Log Monitoring

Monitor PHP error logs for debugging:

```bash
# Watch logs in real-time
tail -f ~/sites/ai/logs/php/error.log

# View recent log entries
tail -n 20 ~/sites/ai/logs/php/error.log
```

## Architecture

### Frontend Structure
- **React-based Admin UI**: Located in `/app/js/`
- **Multiple Entry Points**:
  - Admin UI: `/app/js/index.js` → `/app/index.js`
  - Chatbot: `/app/js/chatbot.js` → `/app/chatbot.js`
  - Forms: `/premium/js/forms.js` → `/premium/forms.js`
- **Styled Components**: CSS-in-JS approach using styled-components
- **React Query**: For data fetching and state management

### Backend Structure
- **Main Plugin File**: `ai-engine-pro.php`
- **Engine Pattern**: AI provider implementations in `/classes/engines/`
- **Module Pattern**: Feature modules in `/classes/modules/`
- **Query Types**: Different AI operations in `/classes/queries/`
- **Premium Features**: Pro version features in `/premium/`

### Key Patterns
- **Webpack Configuration**: Multi-entry setup with vendor splitting for admin
- **Path Aliases**:
  - `@root`: `/app/`
  - `@app`: `/app/js/`
  - `@premium`: `/premium/js/`
  - `@common`: `/common/js/`
- **External Dependencies**: React and ReactDOM are loaded externally in production

### API Integration
- **REST API**: Internal APIs for custom integrations
- **MCP Support**: Model Context Protocol for AI agents to manage WordPress
- **Function Calling**: Connect AI models to WordPress functions and APIs

## Development Notes

- PHP 7.4+ required
- WordPress 6.0+ required
- Uses Composer for PHP dependencies (Parsedown)
- Babel configuration targets Chrome 90+ for modern JavaScript features
- Production builds exclude source maps and minimize bundles
- Separate webpack configurations for admin, chatbot, and forms bundles

## Commit Message Guidelines

- When creating commit messages, keep them short and straightforward, with a "." at the end of the sentences, don't mentioned Claude or co-authored.