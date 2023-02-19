// Previous: 0.6.8
// Current: 0.1.0

import Styled from "styled-components";
import { NekoButton, NekoPage, NekoSelect, NekoOption, NekoModal, NekoInput,
  NekoContainer, NekoWrapper, NekoColumn, NekoTypo } from '@neko-ui';

const StyledSidebar = Styled.div`
  background: white;
  padding: 15px;
  border-radius: 5px;

  h2 {
    margin-bottom: 8px;
  }
  
  h3:first-child {
    margin-top: 0;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  label {
    margin-top: 10px;
  }

  ul {
    margin: 20px 0 0 0;
  }

  li {
    margin-bottom: 5px;
    border: 1px solid #e5e5e5;
    padding: 8px;
    background: #f5f5f5;
    border-radius: 5px;
    cursor: pointer;
    position: relative;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      background: #e5e5e5;
    }

    &.active {
      background: #007cba;
      color: white;
      border-color: #007cba;

      &.modified {
        background: #ff8c00;
        border-color: #ff8c00;
      }
    }
  }

  .information {
    color: #a3a3a3;
    margin-top: 5px;
    font-size: 12px;
    line-height: 100%;
  }
`;

const StyledNekoInput = Styled(NekoInput)`
  flex: auto !important;

  input {
    height: 50px !important;
    font-size: 13px !important;
    font-family: monospace !important;
    padding: 20px !important;
    border-color: #333d4e !important;
    background: #333d4e !important;
    color: white !important;
  }
`;

const StyledBuilderForm = Styled.div`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 3px;
  }

  .mwai-builder-row {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .neko-color-picker {
      margin-left: 5px;
    }
  }

  .mwai-builder-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-right: 5px;
  }

  .mwai-builder-col:last-child {
    margin-right: 0;
  }

  pre {
    white-space: pre-wrap;
    background: #d4f0ff;
    color: #037cba;
    padding: 10px;
    font-size: 13px;
    font-weight: bold;
    margin: 20px 0;
  }

  .neko-spacer {
    margin-bottom: 0 !important;
  }

  .neko-input {
  }

  .nui-select-option {
  }
`;

export { StyledSidebar, StyledNekoInput, StyledBuilderForm }