// Previous: none
// Current: 2.9.9

import React from 'react';
import styled from 'styled-components';

const Header = styled.div`
  .mwai-standard-header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background: var(--mwai-backgroundPrimaryColor);
    border-bottom: 1px solid var(--mwai-borderColor);
    
    .mwai-buttons {
      display: flex;
      gap: 8px;
      margin-left: auto;
      
      .mwai-resize-button,
      .mwai-close-button {
        width: 20px;
        height: 20px;
        cursor: pointer;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        opacity: 0.6;
        transition: opacity 0.2s;
        
        &:hover {
          opacity: 1;
        }
      }
      
      .mwai-resize-button {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>');
      }
      
      .mwai-close-button {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" preserveAspectRatio="xMidYMid meet"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>');
      }
    }
  }
`;

const StandardHeader = ({ title, onResize, onClose, showResize = false }) => {
  return (
    <Header>
      <div className="mwai-modular-header mwai-standard-header">
        {title && <div className="mwai-title">{title}</div>}
        <div className="mwai-buttons">
          {showResize && (
            <div className="mwai-resize-button" onClick={onResize} />
          )}
          <div className="mwai-close-button" onClick={onClose} />
        </div>
      </div>
    </Header>
  );
};

export default StandardHeader;