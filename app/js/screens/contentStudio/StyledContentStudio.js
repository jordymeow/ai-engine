// Previous: none
// Current: 3.7.9

```
import Styled from 'styled-components';

const StyledContentStudio = Styled.div`
  padding: 0;
  height: calc(100vh - 32px + 110px);
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: var(--neko-font-color);

  button { font-family: inherit; }

  .mwai-cs-spin { animation: mwai-cs-spin 0.9s linear infinite; }
  @keyframes mwai-cs-spin { to { transform: rotate(360deg); } }

  .mwai-cs-muted { color: var(--neko-gray-50); font-size: 12px; line-height: 1.5; }
  .mwai-cs-optional { color: var(--neko-gray-60); font-weight: 400; margin-left: 4px; }
  .mwai-cs-footnote {
    margin: 14px 0 0;
    color: var(--neko-gray-50);
    font-size: 12px;
    line-height: 1.5;
    a { color: var(--neko-main-color); text-decoration: none;
      &:hover { text-decoration: underline; } }
  }

  .mwai-cs-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border: 0;
    background: none;
    padding: 0;
    color: var(--neko-main-color);
    font-size: 12px;
    cursor: pointer;
    text-decoration: none;
    &:hover:not(:disabled) { text-decoration: underline; }
    &:disabled { opacity: 0.45; cursor: default; }
  }

  .mwai-cs-row {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 8px;
  }

  .mwai-cs-stepper {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 14px;
    background: var(--neko-white);
    border-bottom: 1px solid var(--neko-gray-95);
    flex-wrap: wrap;
  }

  .mwai-cs-step {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 34px;
    padding: 0 14px 0 6px;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: var(--neko-gray-40);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;

    .mwai-cs-step-dot {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--neko-gray-95);
    }
    &:hover:not(:disabled) { background: var(--neko-gray-98); }
    &:disabled { opacity: 0.45; cursor: default; }
    &.done .mwai-cs-step-dot { background: #e3f5e8; color: #1e7b3c; }
    &.current {
      background: var(--neko-main-color-95, #eef3fc);
      color: var(--neko-main-color);
      font-weight: 600;
      .mwai-cs-step-dot { background: var(--neko-main-color); color: #fff; }
    }
  }

  .mwai-cs-stepper-meta {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 14px;
    padding-right: 8px;
    color: var(--neko-gray-50);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }

  .mwai-cs-body {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 400px;
    gap: 16px;
  }

  .mwai-cs-panel {
    background: var(--neko-white);
    border-radius: 0;
    box-shadow: var(--neko-shadow-sm);
    overflow-y: auto;
    min-height: 0;
  }

  .mwai-cs-panel-body {
    padding: 18px;
    display: flex;
    flex-direction: column;

    h2 { margin: 0 0 4px; font-size: 18px; font-weight: 700; }
    > .mwai-cs-muted { margin: 0 0 10px; }
    > label { margin: 12px 0 5px; font-size: 12px; font-weight: 600; color: var(--neko-gray-30); }
  }

  .mwai-cs-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    button {
      height: 30px;
      padding: 0 11px;
      border-radius: 999px;
      border: 1px solid var(--neko-gray-90);
      background: var(--neko-white);
      color: var(--neko-gray-30);
      font-size: 12px;
      cursor: pointer;
      span { color: var(--neko-gray-60); margin-left: 3px; }
      &:hover:not(:disabled) { border-color: var(--neko-main-color); color: var(--neko-main-color); }
      &.on { background: var(--neko-main-color); border-color: var(--neko-main-color); color: #fff; span { color: rgba(255,255,255,0.75); } }
      &.on:hover:not(:disabled) { background: var(--neko-main-color); border-color: var(--neko-main-color); color: #fff; }
      &:disabled { opacity: 0.45; cursor: default; }
    }

    &.small button { height: 26px; padding: 0 9px; }
  }

  .mwai-cs-model {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid var(--neko-gray-95);
  }

  .mwai-cs-fields {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 8px;
    label { font-size: 12px; color: var(--neko-gray-40); margin-top: 6px; }
  }

  .mwai-cs-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-top: 18px;
    padding-top: 14px;
    border-top: 1px solid var(--neko-gray-95);
    > :last-child { margin-left: auto; }
  }

  .mwai-cs-error {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    padding: 8px 10px;
    border-radius: 8px;
    background: #fdecec;
    color: #9b1c1c;
    font-size: 12px;
    line-height: 1.4;
    margin-bottom: 8px;
    span { flex: 1; }
    button { border: 0; background: none; color: inherit; cursor: pointer; font-size: 16px; line-height: 1; }
    &.top { margin: 12px 12px 0; }
  }

  .mwai-cs-outline {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 14px;
  }

  .mwai-cs-outline-item {
    position: relative;
    border: 1px solid var(--neko-gray-90);
    border-radius: 10px;
    padding: 8px;
    background: var(--neko-gray-98);

    textarea {
      width: 100%;
      margin-top: 6px;
      border: 0 !important;
      box-shadow: none !important;
      background: transparent;
      resize: none;
      field-sizing: content;
      min-height: 36px;
      font-size: 12px;
      line-height: 1.5;
      color: var(--neko-gray-40);
      padding: 2px 4px 2px 30px;
    }
  }

  .mwai-cs-outline-head {
    display: flex;
    align-items: center;
    gap: 4px;

    input {
      flex: 1;
      min-width: 0;
      border: 0 !important;
      box-shadow: none !important;
      background: transparent;
      font-weight: 600;
      font-size: 13px;
      padding: 2px 4px;
    }
    button {
      width: 24px;
      height: 24px;
      border: 0;
      border-radius: 6px;
      background: transparent;
      color: var(--neko-gray-50);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &:hover:not(:disabled) { background: var(--neko-white); color: var(--neko-gray-20, #1d2327); }
      &:disabled { opacity: 0.3; cursor: default; }
    }
  }

  .mwai-cs-num {
    flex: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--neko-white);
    box-shadow: var(--neko-shadow-xs);
    font-size: 11px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .mwai-cs-written {
    position: absolute;
    right: 10px;
    bottom: 6px;
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 10px;
    color: #1e7b3c;
  }

  .mwai-cs-add {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 34px;
    border: 1px dashed var(--neko-gray-80);
    border-radius: 10px;
    background: transparent;
    color: var(--neko-gray-40);
    cursor: pointer;
    &:hover { border-color: var(--neko-main-color); color: var(--neko-main-color); }
  }

  .mwai-cs-draft-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 8px;
  }

  .mwai-cs-draft-item {
    border: 1px solid var(--neko-gray-95);
    border-radius: 10px;
    overflow: hidden;
    &.open { border-color: var(--neko-main-color-80, #b9cdf2); box-shadow: var(--neko-shadow-xs); }
  }

  .mwai-cs-draft-head {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border: 0;
    background: var(--neko-white);
    text-align: left;
    cursor: pointer;
    &:hover { background: var(--neko-gray-98); }
  }

  .mwai-cs-draft-title { flex: 1; font-weight: 500; font-size: 13px; }

  .mwai-cs-status {
    flex: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    background: var(--neko-gray-95);
    color: var(--neko-gray-40);
    &.done { background: #e3f5e8; color: #1e7b3c; }
    &.writing { background: var(--neko-main-color); color: #fff; }
    &.queued { background: #fff4de; color: #9a6400; }
  }

  .mwai-cs-draft-tools {
    padding: 10px;
    background: var(--neko-gray-98);
    border-top: 1px solid var(--neko-gray-95);
  }

  .mwai-cs-rewrite {
    display: flex;
    gap: 6px;
    margin-top: 8px;
    input {
      flex: 1;
      height: 30px;
      border-radius: 8px;
      border: 1px solid var(--neko-gray-90);
      padding: 0 10px;
      font-size: 12px;
    }
    button {
      width: 32px;
      height: 30px;
      border: 0;
      border-radius: 8px;
      background: var(--neko-main-color);
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &:disabled { background: var(--neko-gray-90); cursor: default; }
    }
  }

  .mwai-cs-chips.titles button {
    height: auto;
    white-space: normal;
    text-align: left;
    line-height: 1.4;
    padding: 6px 11px;
    border-radius: 10px;
  }

  .mwai-cs-featured {
    display: flex;
    gap: 12px;
    align-items: flex-start;

    img {
      width: 132px;
      height: 88px;
      object-fit: cover;
      border-radius: 8px;
      background: var(--neko-gray-95);
    }
    > div { display: flex; flex-direction: column; gap: 2px; }
    &.empty { flex-direction: column; gap: 6px; }
  }

  .mwai-cs-success {
    display: flex;
    gap: 12px;
    padding: 14px;
    margin-top: 10px;
    border-radius: 12px;
    background: #e3f5e8;
    color: #1e7b3c;
    > div { display: flex; flex-direction: column; gap: 3px; color: var(--neko-gray-30); }
    b { color: #1e7b3c; font-size: 14px; }
  }

  .mwai-cs-preview {
    min-height: 0;
    overflow-y: auto;
    border-radius: 0;
    background: #e9ecf2;
    padding: 28px;
  }

  .mwai-cs-paper {
    max-width: 760px;
    min-height: 100%;
    margin: 0 auto;
    padding: 48px 56px;
    box-sizing: border-box;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 10px 40px rgba(20, 30, 60, 0.12);
    color: #1d2327;
    font-size: 16px;
    line-height: 1.75;

    h1 { font-size: 32px; line-height: 1.2; margin: 0 0 18px; font-weight: 800; }
    h2 { font-size: 22px; line-height: 1.3; margin: 0 0 10px; font-weight: 700; }
    h3 { font-size: 18px; margin: 18px 0 8px; }
    p { margin: 0 0 14px; }
    ul, ol { margin: 0 0 14px 22px; }
    li { margin-bottom: 4px; }
  }

  .mwai-cs-lede {
    font-size: 18px;
    color: var(--neko-gray-40);
    border-left: 3px solid var(--neko-main-color);
    padding-left: 14px;
  }

  .mwai-cs-section {
    position: relative;
    margin: 0 -16px 18px;
    padding: 10px 16px;
    border-radius: 8px;
    transition: background var(--neko-duration-fast) var(--neko-ease-out);
    &.active { background: #f3f6fc; box-shadow: inset 3px 0 0 var(--neko-main-color); }
    &.writing { background: #f7f9fd; }
  }

  .mwai-cs-placeholder {
    display: flex;
    flex-direction: column;
    gap: 6px;
    span {
      display: block;
      padding: 6px 10px;
      border-radius: 6px;
      background: #f2f4f8;
      color: #7a8397;
      font-size: 14px;
      line-height: 1.4;
    }
    em { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--neko-main-color); }
  }

  .mwai-cs-empty {
    height: 100%;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-align: center;
    color: var(--neko-gray-50);
    b { color: var(--neko-gray-20, #1d2327); font-size: 18px; }
    span { font-size: 14px; max-width: 420px; }
  }

  @media (max-width: 1100px) {
    .mwai-cs-body { grid-template-columns: 1fr; height: auto; min-height: 0; }
    .mwai-cs-preview { max-height: 80vh; }
    .mwai-cs-paper { padding: 28px 22px; }
  }
`;

export default StyledContentStudio;
```