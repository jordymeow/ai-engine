// Previous: none
// Current: 3.7.9

```javascript
import Styled from 'styled-components';

const StyledWorkbench = Styled.div`
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 16px;
  padding: 0;
  height: max(620px, calc(100vh - 32px - 110px));
  font-size: 13px;
  color: var(--neko-font-color);

  button { font-family: inherit; }

  .mwai-muted {
    color: var(--neko-gray-50);
    font-size: 12px;
    line-height: 1.5;
    margin: 6px 0 0;
  }

  .mwai-wb-side {
    background: var(--neko-white);
    border-radius: 0;
    box-shadow: var(--neko-shadow-sm);
    overflow-y: auto;
    min-height: 0;

    section {
      padding: 14px;
      border-bottom: 1px solid var(--neko-gray-95);
      &:last-child { border-bottom: 0; }
    }
    h3 {
      margin: 0 0 8px;
      font-size: 13px;
      font-weight: 600;
    }
  }

  .mwai-dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    margin-left: 4px;
    border-radius: 50%;
    background: var(--neko-orange, #f0a020);
    vertical-align: middle;
  }

  .mwai-wb-preset-actions {
    display: flex;
    gap: 6px;
    margin-top: 8px;

    button {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      height: 28px;
      padding: 0 9px;
      border-radius: 8px;
      border: 1px solid var(--neko-gray-90);
      background: var(--neko-white);
      color: var(--neko-gray-30);
      font-size: 12px;
      cursor: pointer;
      &:hover:not(:disabled) { border-color: var(--neko-main-color); color: var(--neko-main-color); }
      &:disabled { opacity: 0.45; cursor: default; }
      &.danger { margin-left: auto; }
      &.danger:hover:not(:disabled) { border-color: var(--neko-danger, #d63638); color: var(--neko-danger, #d63638); }
    }
  }

  .mwai-wb-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    label { flex: none; width: 80px; color: var(--neko-gray-40); font-size: 12px; }
    > div { flex: 1; }
  }

  .mwai-wb-totals {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    div { display: flex; flex-direction: column; }
    b { font-size: 15px; font-variant-numeric: tabular-nums; }
    span { font-size: 11px; color: var(--neko-gray-50); }
  }

  .mwai-wb-main {
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
    padding: 16px 16px 16px 0;
  }

  .mwai-wb-toolbar {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;
    flex-wrap: wrap;

    .mwai-wb-title {
      margin-right: auto;
      font-weight: 600;
      font-size: 14px;
      color: var(--neko-gray-20, #1d2327);
    }

    button {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 30px;
      padding: 0 10px;
      border-radius: 8px;
      border: 1px solid var(--neko-gray-90);
      background: var(--neko-white);
      color: var(--neko-gray-30);
      font-size: 12px;
      cursor: pointer;
      &:hover:not(:disabled) { border-color: var(--neko-main-color); color: var(--neko-main-color); }
      &:disabled { opacity: 0.45; cursor: default; }
    }
  }

  .mwai-wb-lanes {
    flex: 1;
    min-height: 0;
    display: grid;
    gap: 12px;
  }

  .mwai-lane {
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
    background: var(--neko-white);
    border-radius: var(--neko-radius-lg);
    box-shadow: var(--neko-shadow-sm);
    overflow: hidden;
  }

  .mwai-lane-head {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px;
    border-bottom: 1px solid var(--neko-gray-95);

    > div { flex: 0 1 auto; min-width: 0; max-width: 100%; }
    > button:first-of-type { margin-left: auto; }

    .neko-select-option { padding-right: 10px; }

    .neko-select-option-label {
      display: block;
      align-self: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      height: auto;
    }
  }

  .mwai-lane-icon {
    flex: none;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 0;
    background: transparent;
    color: var(--neko-gray-50);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover { background: var(--neko-gray-98); color: var(--neko-gray-20, #1d2327); }
    &.on { background: var(--neko-main-color-95, #eef3fc); color: var(--neko-main-color); }
  }

  .mwai-lane-tuning {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 16px;
    padding: 10px 12px;
    background: var(--neko-gray-98);
    border-bottom: 1px solid var(--neko-gray-95);
    font-size: 12px;

    label { display: flex; align-items: center; gap: 8px; }
    input[type=range] { width: 110px; accent-color: var(--neko-main-color); }
    select { height: 26px; min-height: 26px; font-size: 12px; padding: 0 22px 0 6px; }
    button { border: 0; background: none; color: var(--neko-main-color); cursor: pointer; font-size: 12px; padding: 0; }
    .mwai-muted { margin: 0; }
  }

  .mwai-lane-messages {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .mwai-lane-empty {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    text-align: center;
    color: var(--neko-gray-40);
    b { font-size: 16px; color: var(--neko-gray-20, #1d2327); }
  }

  .mwai-msg {
    line-height: 1.55;
    font-size: 13.5px;
    min-width: 0;

    &.user {
      align-self: flex-end;
      max-width: 85%;
      padding: 8px 12px;
      border-radius: 14px 14px 4px 14px;
      background: var(--neko-main-color);
      color: #fff;
      white-space: pre-wrap;
      word-break: break-word;
    }

    &.ai {
      align-self: stretch;
      .mwai-output-handler > *:first-child { margin-top: 0; }
      .mwai-output-handler > *:last-child { margin-bottom: 0; }
      p { margin: 0 0 10px; }
      pre {
        background: #1d2230;
        color: #e6e9f0;
        padding: 10px 12px;
        border-radius: 8px;
        overflow-x: auto;
        font-size: 12px;
      }
      code { font-family: var(--neko-font-mono, monospace); font-size: 12px; }
      :not(pre) > code { background: var(--neko-gray-95); padding: 1px 4px; border-radius: 4px; }
      table { border-collapse: collapse; }
      td, th { border: 1px solid var(--neko-gray-90); padding: 4px 8px; }
    }
  }

  .mwai-msg-error {
    color: #9b1c1c;
    background: #fdecec;
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 12px;
  }

  .mwai-msg-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-top: 6px;
    font-size: 11px;
    color: var(--neko-gray-50);
    font-variant-numeric: tabular-nums;

    button {
      border: 0;
      background: none;
      color: inherit;
      cursor: pointer;
      padding: 0;
      display: inline-flex;
      &:hover { color: var(--neko-main-color); }
    }
  }

  .mwai-thinking {
    display: inline-flex;
    gap: 4px;
    padding: 6px 0;
    span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--neko-gray-70);
      animation: mwai-wb-dot 1s infinite ease-in-out;
      &:nth-child(2) { animation-delay: 0.15s; }
      &:nth-child(3) { animation-delay: 0.3s; }
    }
  }
  @keyframes mwai-wb-dot {
    0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
    40% { opacity: 1; transform: translateY(-3px); }
  }

  .mwai-wb-composer {
    margin-top: 12px;
    display: flex;
    align-items: flex-end;
    gap: 8px;
    padding: 8px;
    background: var(--neko-white);
    border-radius: 16px;
    box-shadow: var(--neko-shadow-md);

    textarea {
      flex: 1;
      resize: none;
      border: 0 !important;
      box-shadow: none !important;
      outline: none;
      background: transparent;
      padding: 8px;
      min-height: 38px;
      max-height: 200px;
      font-size: 14px;
      line-height: 1.45;
    }
  }

  .mwai-wb-send {
    flex: none;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    border: 0;
    background: var(--neko-main-color);
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:disabled { background: var(--neko-gray-90); cursor: default; }
    &.stop { background: var(--neko-gray-20, #1d2327); }
  }

  .mwai-wb-hint {
    margin-top: 6px;
    text-align: center;
    font-size: 11px;
    color: var(--neko-gray-50);
  }

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    height: auto;
    .mwai-wb-main { height: 80vh; }
    .mwai-wb-lanes { grid-template-columns: 1fr !important; overflow-y: auto; }
    .mwai-lane { min-height: 360px; }
  }
`;

export default StyledWorkbench;
```