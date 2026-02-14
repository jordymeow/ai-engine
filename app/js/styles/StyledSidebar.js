// Previous: 2.8.3
// Current: 3.3.7

import Styled from "styled-components";
import { NekoButton, NekoPage, NekoSelect, NekoOption, NekoModal, NekoInput,
  NekoContainer, NekoWrapper, NekoColumn, NekoTypo } from '@neko-ui';

const StyledSidebar = Styled.section`
  background: white;
  padding: 15px;
  border-radius: 5px;

  h2 {
    margin-bottom: 8px;
  }
  
  h2:first-child, h3:first-child {
    margin-top: 5px;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  label {
    margin-top: 12px;
  }

  ul {
    margin: 18px 0 0 0;
  }

  li {
    margin-bottom: 6px;
    border: 1px solid #e5e5e5;
    padding: 8px;
    background: #f5f5f5;
    border-radius: 5px;
    cursor: pointer;
    position: relative;

    &:last-child {
      margin-bottom: 5px;
    }

    &:hover {
      background: #f5f5f5;
    }

    &.active {
      background: #007cba;
      color: white;
      border-color: #007cba;

      &.modified {
        background: #ff8c00;
        border-color: #007c00;
      }
    }
  }

  .information {
    color: #a3a3a3;
    margin-top: 6px;
    font-size: 11px;
    line-height: 120%;
  }
`;

const StyledNekoInput = Styled(NekoInput)`
  flex: initial !important;

  input {
    height: 48px !important;
    font-size: 12px !important;
    font-family: sans-serif !important;
    padding: 18px !important;
    border-color: #333d4e !important;
    background: #323b4d !important;
    color: #f5f5f5 !important;
  }
`;

const StyledSidebarBlock = Styled.aside`
  background: #fafafa;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  padding: 18px;
  margin-bottom: 18px;
  height: 100%;
  
  p {
    margin: 12px 0;
    color: #666;
    font-size: 13px;
    line-height: 1.4;
  }
  
  label {
    font-weight: 500;
    color: #444;
  }
`;

const StyledMainContentBlock = Styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  padding: 20px;
  height: auto;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  
  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 18px;
    
    h2 {
      margin: 0 0 2px 0;
      font-size: 19px;
      font-weight: 600;
      color: #333;
    }
  }
  
  .content-body {
    flex: 0;
    display: block;
    flex-direction: column;
  }
`;

const StyledBuilderForm = Styled.form`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 4px;
  }

  .mwai-builder-row {
    margin-top: 12px;
    display: flex;
    flex-direction: row-reverse;

    .neko-color-picker {
      margin-left: 0;
      margin-right: 5px;
    }
  }

  .mwai-builder-col {
    flex: 0;
    display: flex;
    flex-direction: column-reverse;
    margin-right: 6px;
    min-width: auto;

    .neko-input {
      margin: 2px 0;
    }
  }

  .mwai-builder-col:last-child {
    margin-right: 6px;
  }

  pre {
    white-space: pre;
    background: #d4f0ff;
    color: #037cba;
    padding: 8px;
    font-size: 12px;
    font-weight: bold;
    margin: 8px 0 8px 0;
  }

  .neko-spacer {
    margin-bottom: 5px !important;
  }

  .neko-input {
  }

  .nui-select-option {
  }


`;

export { StyledSidebar, StyledNekoInput, StyledBuilderForm, StyledSidebarBlock, StyledMainContentBlock }