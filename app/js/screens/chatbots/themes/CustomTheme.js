// Previous: 2.6.5
// Current: 2.8.5

import { useMemo, useState, useEffect } from 'wp.element';

const DefaultCSS = `/* AI Engine Pro - Custom Theme CSS
   This is a comprehensive starting template for creating your own chatbot theme.
   Modify the CSS variables and styles below to customize your chatbot's appearance. */

/* ==========================================
   CSS VARIABLES - Customize these first!
   ========================================== */
.mwai-THEME_ID-theme {
  /* Core Spacing & Sizing */
  --mwai-spacing: 15px;
  --mwai-fontSize: 14px;
  --mwai-lineHeight: 1.6;
  --mwai-borderRadius: 10px;
  --mwai-width: 350px;
  --mwai-maxHeight: 600px;
  
  /* Colors - Primary Palette */
  --mwai-fontColor: #1a1a1a;
  --mwai-bgPrimary: #ffffff;
  --mwai-bgSecondary: #f8f9fa;
  --mwai-primaryColor: #0066cc;
  --mwai-primaryHover: #0052a3;
  
  /* Message Colors */
  --mwai-userBgColor: #0066cc;
  --mwai-userTextColor: #ffffff;
  --mwai-aiBgColor: #f1f3f5;
  --mwai-aiTextColor: #1a1a1a;
  
  /* UI Element Colors */
  --mwai-borderColor: #e1e4e8;
  --mwai-shadowColor: rgba(0, 0, 0, 0.1);
  --mwai-headerBg: #f8f9fa;
  --mwai-inputBg: #ffffff;
  --mwai-buttonBg: #0066cc;
  --mwai-buttonHover: #0052a3;
  
  /* Typography */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* ==========================================
   MAIN CONTAINER & LAYOUT
   ========================================== */
.mwai-THEME_ID-theme.mwai-chatbot {
  font-size: var(--mwai-fontSize);
  line-height: var(--mwai-lineHeight);
  color: var(--mwai-fontColor);
  background: var(--mwai-bgPrimary);
}

.mwai-THEME_ID-theme .mwai-content {
  background: var(--mwai-bgPrimary);
  border-radius: var(--mwai-borderRadius);
  box-shadow: 0 2px 10px var(--mwai-shadowColor);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* ==========================================
   HEADER SECTION
   ========================================== */
.mwai-THEME_ID-theme .mwai-header {
  display: none;
}

.mwai-THEME_ID-theme .mwai-header .mwai-name-text {
  font-weight: 600;
  flex: 1;
}

.mwai-THEME_ID-theme .mwai-header .mwai-buttons {
  display: flex;
  gap: 8px;
}

.mwai-THEME_ID-theme .mwai-header .mwai-close-button,
.mwai-THEME_ID-theme .mwai-header .mwai-resize-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--mwai-fontColor);
  opacity: 0.6;
  transition: opacity 0.2s;
}

.mwai-THEME_ID-theme .mwai-header .mwai-close-button:hover,
.mwai-THEME_ID-theme .mwai-header .mwai-resize-button:hover {
  opacity: 1;
}

/* ==========================================
   CONVERSATION AREA
   ========================================== */
.mwai-THEME_ID-theme .mwai-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.mwai-THEME_ID-theme .mwai-conversation {
  flex: 1;
  overflow-y: auto;
  padding: var(--mwai-spacing);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Scrollbar Styling */
.mwai-THEME_ID-theme .mwai-conversation::-webkit-scrollbar {
  width: 6px;
}

.mwai-THEME_ID-theme .mwai-conversation::-webkit-scrollbar-track {
  background: transparent;
}

.mwai-THEME_ID-theme .mwai-conversation::-webkit-scrollbar-thumb {
  background: var(--mwai-borderColor);
  border-radius: 3px;
}

/* ==========================================
   MESSAGES / REPLIES
   ========================================== */
.mwai-THEME_ID-theme .mwai-reply {
  display: flex;
  gap: 10px;
  animation: mwai-fade-in 0.3s ease-in;
}

/* User Messages */
.mwai-THEME_ID-theme .mwai-reply.mwai-user {
  background: var(--mwai-userBgColor);
  color: var(--mwai-userTextColor);
  border-radius: var(--mwai-borderRadius);
  padding: 10px 15px;
}

.mwai-THEME_ID-theme .mwai-reply.mwai-user .mwai-text {
  max-width: 100%;
  word-wrap: break-word;
}

/* AI Messages */
.mwai-THEME_ID-theme .mwai-reply.mwai-ai {
  background: var(--mwai-aiBgColor);
  color: var(--mwai-aiTextColor);
  border-radius: var(--mwai-borderRadius);
  padding: 10px 15px;
}

.mwai-THEME_ID-theme .mwai-reply.mwai-ai .mwai-text {
  max-width: 100%;
  word-wrap: break-word;
}

/* System Messages */
.mwai-THEME_ID-theme .mwai-reply.mwai-system .mwai-text {
  background: var(--mwai-bgSecondary);
  color: var(--mwai-fontColor);
  opacity: 0.8;
  border-radius: var(--mwai-borderRadius);
  padding: 8px 12px;
  text-align: center;
  font-size: 0.9em;
  margin: 0 auto;
}

/* Avatar */
.mwai-THEME_ID-theme .mwai-reply .mwai-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--mwai-bgSecondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mwai-THEME_ID-theme .mwai-reply .mwai-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

/* Copy Button */
.mwai-THEME_ID-theme .mwai-reply-actions {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}

.mwai-THEME_ID-theme .mwai-copy-button {
  background: var(--mwai-bgSecondary);
  border: 1px solid var(--mwai-borderColor);
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  color: var(--mwai-fontColor);
  transition: all 0.2s;
}

.mwai-THEME_ID-theme .mwai-copy-button:hover {
  background: var(--mwai-primaryColor);
  color: white;
  border-color: var(--mwai-primaryColor);
}

/* ==========================================
   INPUT AREA
   ========================================== */
.mwai-THEME_ID-theme .mwai-input {
  padding: var(--mwai-spacing);
  border-top: 1px solid var(--mwai-borderColor);
  background: var(--mwai-inputBg);
  display: flex;
  gap: 10px;
  align-items: center;
}

.mwai-THEME_ID-theme .mwai-input-text {
  flex: 1;
  display: flex;
  align-items: center;
  background: var(--mwai-bgSecondary);
  border: 1px solid var(--mwai-borderColor);
  border-radius: calc(var(--mwai-borderRadius) / 2);
  padding: 8px 12px;
}

.mwai-THEME_ID-theme .mwai-input-text textarea {
  flex: 1;
  border: none;
  background: transparent;
  resize: none;
  outline: none;
  font-family: inherit;
  font-size: inherit;
  line-height: 1.4;
  max-height: 100px;
  color: var(--mwai-fontColor);
}

/* Prevent focus outlines and selection */
.mwai-THEME_ID-theme .mwai-input-text:focus,
.mwai-THEME_ID-theme .mwai-input-text *:focus {
  outline: none;
  box-shadow: none;
}

.mwai-THEME_ID-theme .mwai-input:focus-within {
  outline: none;
}

.mwai-THEME_ID-theme .mwai-input-text textarea::placeholder {
  color: var(--mwai-fontColor);
  opacity: 0.5;
}

/* Input Buttons */
.mwai-THEME_ID-theme .mwai-microphone {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--mwai-fontColor);
  opacity: 0.6;
  transition: opacity 0.2s;
}

.mwai-THEME_ID-theme .mwai-microphone:hover {
  opacity: 1;
}

/* File Upload - Minimalist */
.mwai-THEME_ID-theme .mwai-file-upload {
  position: relative;
  display: flex;
  align-items: center;
}

.mwai-THEME_ID-theme .mwai-file-upload-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: var(--mwai-fontColor);
  opacity: 0.6;
}

/* Default state - plus icon */
.mwai-THEME_ID-theme .mwai-file-upload-icon::before {
  content: "+";
  font-size: 20px;
  font-weight: 300;
}

/* File uploaded states - checkmark */
.mwai-THEME_ID-theme .mwai-file-upload-icon.mwai-image-ok::before,
.mwai-THEME_ID-theme .mwai-file-upload-icon.mwai-document-ok::before {
  content: "✓";
  font-size: 16px;
}

/* Hover on uploaded files - show remove option */
.mwai-THEME_ID-theme .mwai-file-upload-icon.mwai-image-ok:hover::before,
.mwai-THEME_ID-theme .mwai-file-upload-icon.mwai-document-ok:hover::before,
.mwai-THEME_ID-theme .mwai-file-upload-icon.mwai-image-del::before,
.mwai-THEME_ID-theme .mwai-file-upload-icon.mwai-document-del::before {
  content: "×";
  font-size: 20px;
  font-weight: 300;
}

/* Uploading states - minimal indicator */
.mwai-THEME_ID-theme .mwai-file-upload-icon.mwai-image-up::before,
.mwai-THEME_ID-theme .mwai-file-upload-icon.mwai-document-up::before {
  content: "•";
  font-size: 24px;
}

/* Progress indicator - hidden for minimalism */
.mwai-THEME_ID-theme .mwai-file-upload-progress {
  display: none;
}

.mwai-THEME_ID-theme .mwai-input-submit {
  background: var(--mwai-buttonBg);
  color: white;
  border: none;
  border-radius: calc(var(--mwai-borderRadius) / 2);
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.mwai-THEME_ID-theme .mwai-input-submit:hover:not(:disabled) {
  background: var(--mwai-buttonHover);
}

.mwai-THEME_ID-theme .mwai-input-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ==========================================
   WINDOW MODE SPECIFIC
   ========================================== */
.mwai-THEME_ID-theme.mwai-window {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: var(--mwai-width);
  z-index: 9999;
}

.mwai-THEME_ID-theme.mwai-window .mwai-content {
  display: none;
  opacity: 0;
  max-height: var(--mwai-maxHeight);
  transition: opacity 0.3s ease-in-out;
}

.mwai-THEME_ID-theme.mwai-window.mwai-open .mwai-content {
  display: flex;
  opacity: 1;
}

.mwai-THEME_ID-theme.mwai-window.mwai-open .mwai-trigger {
  display: none;
}

/* Window Positions */
.mwai-THEME_ID-theme.mwai-window.mwai-bottom-left {
  right: auto;
  left: 30px;
}

.mwai-THEME_ID-theme.mwai-window.mwai-top-right {
  top: 30px;
  bottom: auto;
}

.mwai-THEME_ID-theme.mwai-window.mwai-top-left {
  top: 30px;
  bottom: auto;
  right: auto;
  left: 30px;
}

/* ==========================================
   TRIGGER BUTTON
   ========================================== */
.mwai-THEME_ID-theme .mwai-trigger {
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: 9999;
}

.mwai-THEME_ID-theme .mwai-trigger .mwai-icon-container {
  background: var(--mwai-primaryColor);
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px var(--mwai-shadowColor);
  transition: transform 0.2s, box-shadow 0.2s;
}

.mwai-THEME_ID-theme .mwai-trigger .mwai-icon-container:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px var(--mwai-shadowColor);
}

.mwai-THEME_ID-theme .mwai-trigger .mwai-icon-text {
  background: var(--mwai-bgPrimary);
  color: var(--mwai-fontColor);
  border: 1px solid var(--mwai-borderColor);
  box-shadow: 0 2px 8px var(--mwai-shadowColor);
  max-width: 200px;
  font-size: 13px;
  margin-bottom: 10px;
  padding: 10px 15px;
  border-radius: var(--mwai-borderRadius);
}

/* ==========================================
   LOADING & ANIMATIONS
   ========================================== */
@keyframes mwai-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mwai-THEME_ID-theme .mwai-bouncing-dots {
  display: flex;
  gap: 4px;
  padding: 10px;
}

.mwai-THEME_ID-theme .mwai-dot {
  width: 8px;
  height: 8px;
  background: var(--mwai-primaryColor);
  border-radius: 50%;
  animation: mwai-bounce 1.4s infinite ease-in-out both;
}

.mwai-THEME_ID-theme .mwai-dot1 { animation-delay: -0.32s; }
.mwai-THEME_ID-theme .mwai-dot2 { animation-delay: -0.16s; }
.mwai-THEME_ID-theme .mwai-dot3 { animation-delay: 0; }

@keyframes mwai-bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* ==========================================
   ERROR & SYSTEM MESSAGES
   ========================================== */
.mwai-THEME_ID-theme .mwai-error {
  background: #fee;
  color: #c33;
  padding: 10px;
  border-radius: var(--mwai-borderRadius);
  margin: 10px;
  text-align: center;
  font-size: 0.9em;
}

/* ==========================================
   SHORTCUTS & BLOCKS
   ========================================== */
.mwai-THEME_ID-theme .mwai-shortcuts {
  padding: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.mwai-THEME_ID-theme .mwai-shortcut {
  background: var(--mwai-bgSecondary);
  border: 1px solid var(--mwai-borderColor);
  border-radius: calc(var(--mwai-borderRadius) / 2);
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s;
}

.mwai-THEME_ID-theme .mwai-shortcut:hover {
  background: var(--mwai-primaryColor);
  color: white;
  border-color: var(--mwai-primaryColor);
}

/* ==========================================
   RESPONSIVE & MOBILE
   ========================================== */
@media (max-width: 768px) {
  .mwai-THEME_ID-theme.mwai-window {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  
  .mwai-THEME_ID-theme.mwai-window .mwai-content {
    max-height: 100%;
    border-radius: 0;
  }
  
  .mwai-THEME_ID-theme .mwai-trigger {
    right: 20px;
    bottom: 20px;
  }
}`;

// NekoUI
import { NekoInput, NekoButton,
  NekoTextArea, NekoSpacer } from '@neko-ui';

import i18n from '@root/i18n';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";

const CustomTheme = (props) => {
  const { theme, onUpdateTheme } = props;
  const [ css, setCss ] = useState("");

  useEffect(() => {
    setCss(theme.style);
  }, [theme]);

  const isDirty = useMemo(() => {
    return css !== theme.style;
  }, [css, theme]);

  const setDefaultCSS = () => {
    const newCss = DefaultCSS.replace(/THEME_ID/g, theme.themeId || "default");
    setCss(newCss);
  };

  return (<StyledBuilderForm>
    <div className="mwai-builder-row">
      <div className="mwai-builder-col">
        <label>{i18n.COMMON.NAME}:</label>
        <NekoInput name="name" data-form-type="other"
          value={theme.name}
          onBlur={onUpdateTheme}
          onEnter={onUpdateTheme}
        />
      </div>
      <div className="mwai-builder-col">
        <div>
          <label style={{ display: 'block' }}>{i18n.COMMON.ID}:</label>
          <NekoInput name="themeId" type="text" placeholder="Optional"
            value={theme.themeId}
            onBlur={onUpdateTheme}
            onEnter={onUpdateTheme}
          />
        </div>
      </div>
    </div>
    <NekoSpacer />
    <label>Custom CSS:</label>
    <NekoTextArea name="css" value={css} onChange={setCss} rows={16} tabToSpaces={2}></NekoTextArea>
    <div style={{ display: 'flex' }}>
      <NekoButton fullWidth onClick={setDefaultCSS}>
        Default CSS
      </NekoButton>
      <NekoButton fullWidth onClick={() => { onUpdateTheme(css, 'style') }} disabled={!isDirty}>
        Apply CSS
      </NekoButton>
    </div>
  </StyledBuilderForm>);
};

export default CustomTheme;