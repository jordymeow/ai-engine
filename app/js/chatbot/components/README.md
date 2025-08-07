# Chatbot Components

This directory contains modular components for the AI Engine Pro chatbot UI Builder system.

## Overview

The UI Builder allows users to customize their chatbot's appearance by selecting different components for five distinct areas:

1. **Container**: The overall chatbot wrapper (handled via CSS classes)
2. **Header**: The title bar with controls
3. **Messages**: The conversation/chat history area
4. **Input**: The text input field with submit button
5. **Footer**: The bottom area with tools and compliance text

## Current Architecture

### Implemented Components

#### Headers
- **Standard**: Default header with title and standard buttons
- **OSX (MacOS)**: MacOS-style header with traffic light buttons
- **None**: No header displayed

#### Containers (CSS Classes)
- **Standard**: Default container style
- **OSX (MacOS)**: MacOS-style container with rounded corners and shadow

### Planned Components

#### Messages Area
- **Standard**: Default message display with avatars and timestamps
- **Minimal**: Compact message display without avatars
- **Chat Bubbles**: Messages in speech bubble style
- **Terminal**: Terminal-style output display

#### Input Area
- **Standard**: Default input with submit button
- **Minimal**: Clean input without borders
- **Enhanced**: Input with additional action buttons
- **Terminal**: Command-line style input

#### Footer (Already Implemented in UI)
- **Standard**: Default footer with tools and compliance
- **None**: No footer displayed

## Component Structure

Each component area serves a specific purpose:

- **Container**: Defines the overall appearance and behavior of the chatbot window
- **Header**: Provides window controls (close, minimize, maximize) and displays the chatbot title
- **Messages**: Displays the conversation history with user and AI messages
- **Input**: Handles user text input and message submission
- **Footer**: Shows additional tools (file upload, etc.) and compliance/legal text

## Architecture Details

Components are registered in `ComponentRegistry.js` and can be dynamically selected through the chatbot settings. The system supports:

- Real-time preview updates in the admin interface
- Theme compatibility with proper styling overrides
- Modular architecture for easy extension
- Independent styling for each component area

## Future Enhancements

The modular architecture allows for:
- Mix-and-match components (e.g., Terminal header with Chat Bubble messages)
- Custom component development
- Component-specific settings and configurations
- Enhanced accessibility options per component

## Documentation

For detailed implementation guidelines and component creation instructions, see [chatbot_ui_builder.md](./chatbot_ui_builder.md).