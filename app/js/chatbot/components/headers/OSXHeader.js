// Previous: 3.0.0
// Current: 3.0.2

/**
 * OSXHeader Component
 * 
 * MacOS-style header with traffic light buttons (red, yellow, green).
 * - Red (close) and Yellow (minimize) both close/minimize the chatbot
 * - Green (maximize) toggles between windowed and fullscreen when chatbot is open
 * Visual: compact bar intended to sit above theme headers (e.g., Timeless big header).
 * Maintenance: if the macOS header visuals change, also update the injected CSS
 * in ChatbotUI for `.mwai-header-osx` so behavior and documentation stay aligned.
 */
import React from 'react';

const OSXHeader = ({ title, onClose, onMinimize, onMaximize, theme, showResize, children, onDragStart }) => {
  return (
    <div className="mwai-header mwai-header-osx" onMouseDown={onDragStart} role="toolbar" aria-label="Chat header">
      <div className="mwai-osx-bar">
        <div className="mwai-osx-controls">
          <button
            className="mwai-osx-close"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <svg className="mwai-lucide-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/>
              <path d="M6 6l12 12"/>
            </svg>
          </button>
          <button
            className="mwai-osx-minimize"
            onClick={onMinimize || onClose}
            aria-label="Minimize"
            type="button"
          >
            <svg className="mwai-lucide-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
            </svg>
          </button>
          {showResize && (
            <button
              className="mwai-osx-maximize"
              onClick={onMaximize}
              aria-label="Maximize"
              type="button"
            >
              <svg className="mwai-lucide-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6"/>
                <path d="M9 21H3v-6"/>
                <path d="M21 3l-7 7"/>
                <path d="M3 21l7-7"/>
              </svg>
            </button>
          )}
        </div>
        <div className="mwai-osx-title">{title}</div>
      </div>
      {children && (
        <div className="mwai-osx-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default OSXHeader;
