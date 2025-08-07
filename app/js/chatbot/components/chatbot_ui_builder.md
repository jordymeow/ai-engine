# Chatbot UI Builder

## Overview

The AI Engine Pro chatbot now features a UI Builder that allows customization of different UI components (Container, Header, Messages, Input, Footer) independently from themes. This system separates visual themes (colors, fonts) from structural components.

## Architecture

### Component Types

1. **Container**: The outer window/frame styling (CSS classes only)
   - `standard`: Default chatbot container
   - `osx`: MacOS-style window with shadow

2. **Header**: The title bar with controls (modular components)
   - `standard`: Default header with close/resize buttons
   - `osx`: MacOS traffic light buttons (red/yellow/green)
   - `none`: No header displayed

3. **Messages**: The conversation history area (modular components)
   - `standard`: Normal conversation view with messages
   - `none`: No messages displayed

4. **Input**: The text input field with submit button (modular components)
   - `standard`: Default input field with submit button
   - `none`: No input field displayed

5. **Footer**: The bottom section with tools (handled via UI settings)
   - `standard`: Tools and compliance text
   - `none`: No footer displayed

### Implementation Details

#### Container System
Containers are implemented using CSS classes on the main chatbot wrapper:
- Applied via `mwai-container-{type}` class
- Styles are injected inline when container/header type is `osx`
- No separate React components needed

#### Header System
Headers use modular React components:
- Components are registered in `ComponentRegistry.js`
- Selected via `headerType` parameter
- Standard header renders inline, custom headers use components

#### File Structure
```
/app/js/chatbot/
├── ChatbotUI.js              # Main UI with CSS class-based containers
├── ChatbotHeader.js          # Header selector/renderer
├── ChatbotContext.js         # Component type state management
├── components/
│   ├── ComponentRegistry.js  # Component registry
│   └── headers/
│       ├── StandardHeader.js
│       ├── OSXHeader.js
│       └── TerminalHeader.js
```

## Usage

### In Admin Settings
1. Go to AI Engine > Chatbots
2. Find the "UI Builder" section (after Appearance)
3. Select components for each part:
   - Container: Choose window style
   - Header: Choose title bar style
   - Content: Currently standard only
   - Footer: Currently standard only

### Parameters
Each chatbot has these component settings:
- `containerType`: Container style (standard, osx, terminal)
- `headerType`: Header style (standard, osx, terminal)
- `contentType`: Content style (standard)
- `footerType`: Footer style (standard)

## Styling

### MacOS Styles
When using MacOS container or header, specific styles are injected:
- Gray header background (#e8e8e8)
- Traffic light buttons with proper colors
- Icons appear on hover (using lucide-react)
- Hidden when chatbot is minimized

### Theme Compatibility
- Components respect theme CSS variables
- Special overrides for ChatGPT theme
- MacOS header maintains its distinctive look across themes

## Technical Notes

### Real-time Updates
Component changes apply immediately without page reload:
- `ChatbotContext` watches for parameter changes
- Updates component types via `useEffect`

### CSS Architecture
- Containers use CSS classes for simplicity
- Headers use React components for interactivity
- Styles injected inline for MacOS-specific overrides
- Theme compatibility maintained through careful specificity

### Future Expansion
The system is designed for easy expansion:
- Content components can be added for different chat layouts
- Footer components can provide different tool arrangements
- New container styles via CSS classes
- New header styles via React components

## Benefits

1. **Flexibility**: Mix themes with different UI structures
2. **Simplicity**: CSS-based containers, component-based headers
3. **Maintainability**: Clear separation of concerns
4. **Compatibility**: Works with all existing themes
5. **Extensibility**: Easy to add new styles