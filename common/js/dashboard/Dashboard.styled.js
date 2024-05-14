// React & Vendor Libs
import Styled from 'styled-components';

// NekoUI
import { NekoBlock } from '@neko-ui';

const TabText = Styled.div`
  color: white;
  padding: 15px;
  margin-bottom: -15px;

  a {
    color: #7dedff;
    text-decoration: none;
  }

  p {
    font-size: 15px;
  }
`;

const StyledPluginBlock = Styled(NekoBlock)`

  .neko-block-title {
    display: none;
  }

  .plugin-desc {
    display: flex;
    flex-direction: column;
    margin-left: 15px;
  }

  .neko-block-content {
    display: flex;
    padding: 15px;

    h2 {
      font-size: 18px;
      margin: 0;

      a {
        text-decoration: none;
      }
    }

    p {
      margin: 0px;
      margin-top: 10px;
      font-size: 13px;
      line-height: 1.5;
    }

    .plugin-actual-desc {
      font-size: 13px;
      font-weight: 500;
    }
  }
`;

const StyledPluginImage = Styled.img`
  height: 125px;
  width: auto;
  border-radius: 10px;
  background: lightgray;
`;

const StyledPhpInfo = Styled.div`

  margin: 15px;

  .center {
    background: white;
    color: black;
    border-radius: 10px;
    padding: 10px;
    max-width: 100%
    overflow: none;

    h2 {
      font-size: 26px;
    }

    table {
      width: 100%;

      tr td:first-child {
        width: 220px;
        font-weight: bold;
        color: #1e7cba;
      }

      * {
        overflow-wrap: anywhere;
      }
    }
  }

  hr {
    border-color: #1e7cba;
  }
`;

const StyledPhpErrorLogs = Styled.ul`
  margin-top: 10px;
  background: rgb(0, 72, 88);
  padding: 10px;
  color: rgb(58, 212, 58);
  max-height: 600px;
  min-height: 200px;
  display: block;
  font-family: monospace;
  font-size: 12px;
  white-space: pre;
  overflow-x: auto;
  width: calc(100vw - 276px);
  color: white;

  .log-date {
    color: var(--neko-yellow);
    margin-left: 8px;
  }

  .log-type {
    background: #0000004d;
    padding: 2px 5px;
    border-radius: 8px;
    text-transform: uppercase;
  }

  .log-content {
    display: block;
  }

  .log-warning .log-type {
    background: var(--neko-yellow);
    color: white;
  }

  .log-fatal .log-type {
    background: var(--neko-red);
    color: white;
  }
`;

export { TabText, StyledPluginBlock, StyledPluginImage, StyledPhpInfo, StyledPhpErrorLogs };