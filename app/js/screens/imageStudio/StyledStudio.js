// Previous: none
// Current: 3.7.9

```javascript
import Styled from 'styled-components';

const StyledStudio = Styled.div`
  --mwai-studio-height: max(620px, calc(100vh - 32px - 110px));
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr) 300px;
  gap: 16px;
  padding: 0;
  height: var(--mwai-studio-height);
  font-size: 13px;
  color: var(--neko-font-color);

  button { font-family: inherit; }

  .mwai-spin { animation: mwai-studio-spin 0.9s linear infinite; }
  @keyframes mwai-studio-spin { to { transform: rotate(360deg); } }
  @keyframes mwai-studio-shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: 200px 0; }
  }

  .mwai-panel {
    background: var(--neko-white);
    border-radius: 0;
    box-shadow: var(--neko-shadow-sm);
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }

  .mwai-panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;
    min-height: 46px;
    font-weight: 600;
    font-size: 13px;
  }

  .mwai-icon-btn {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 0;
    background: var(--neko-main-color-95, #eef3fc);
    color: var(--neko-main-color);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover { background: var(--neko-main-color); color: #fff; }
  }

  .mwai-note {
    color: var(--neko-gray-50);
    font-size: 12px;
    line-height: 1.5;
    margin: 4px 0 0;
  }

  .mwai-shimmer {
    width: 44px;
    height: 44px;
    flex: none;
    border-radius: 8px;
    background: linear-gradient(90deg, var(--neko-gray-95) 0px, var(--neko-gray-90) 60px, var(--neko-gray-95) 120px);
    background-size: 400px 100%;
    animation: mwai-studio-shimmer 1.2s linear infinite;
  }

  .mwai-timer {
    font-variant-numeric: tabular-nums;
    color: var(--neko-gray-50);
    font-size: 11px;
  }

  .mwai-thread-list {
    flex: 1;
    overflow-y: auto;
    padding: 4px 8px 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .mwai-thread {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px;
    border: 0;
    border-radius: 10px;
    background: transparent;
    text-align: left;
    cursor: pointer;
    color: inherit;

    img {
      width: 44px;
      height: 44px;
      flex: none;
      object-fit: cover;
      border-radius: 8px;
      background: var(--neko-gray-95);
    }
    &:hover { background: var(--neko-gray-98); }
    &.active { background: var(--neko-main-color-95, #eef3fc); }
    &.pending { cursor: default; }
  }

  .mwai-thread-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    gap: 2px;
  }

  .mwai-thread-title {
    font-weight: 500;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .mwai-thread-meta {
    font-size: 11px;
    color: var(--neko-gray-50);
  }

  .mwai-thread-actions {
    display: flex;
    gap: 6px;
    padding: 10px;
    border-top: 1px solid var(--neko-gray-95);

    button {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      height: 30px;
      border-radius: 8px;
      border: 1px solid var(--neko-gray-90);
      background: var(--neko-white);
      color: var(--neko-gray-30);
      cursor: pointer;
      font-size: 12px;
      &:hover { border-color: var(--neko-main-color); color: var(--neko-main-color); }
    }
  }

  .mwai-stage {
    position: relative;
    margin: 16px 0;
    border-radius: var(--neko-radius-lg);
    overflow: hidden;
    background:
      radial-gradient(circle at 50% 35%, rgba(90, 120, 200, 0.18), transparent 60%),
      #14161c;
    box-shadow: var(--neko-shadow-md);
    min-height: 0;

    &.dragging { outline: 3px dashed var(--neko-main-color); outline-offset: -8px; }
  }

  .mwai-toolbar, .mwai-maskbar {
    position: absolute;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 5px;
    border-radius: 12px;
    background: rgba(28, 31, 40, 0.82);
    backdrop-filter: blur(10px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
    color: #e8ebf2;
    white-space: nowrap;
  }

  .mwai-toolbar { top: 14px; left: 16px; }
  .mwai-toolbar.mwai-toolbar-right { left: auto; right: 16px; }
  .mwai-maskbar { top: 62px; left: 16px; }

  .mwai-chip {
    display: inline-flex;
    align-items: center;
    height: 32px;
    padding: 0 10px;
    font-size: 12px;
    font-weight: 600;
    color: #aeb6c8;
  }

  .mwai-tool, .mwai-maskbar button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 32px;
    padding: 0 10px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: inherit;
    font-size: 12px;
    cursor: pointer;
    text-decoration: none;

    &:hover:not(:disabled) { background: rgba(255, 255, 255, 0.1); color: #fff; }
    &.on { background: var(--neko-main-color); color: #fff; }
    &:disabled { opacity: 0.35; cursor: default; }
  }

  .mwai-maskbar input[type=range] {
    width: 110px;
    accent-color: var(--neko-main-color);
  }

  .mwai-canvas {
    position: absolute;
    inset: 64px 28px 124px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mwai-frame {
    position: relative;
    line-height: 0;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    background: repeating-conic-gradient(#2a2d36 0% 25%, #22252d 0% 50%) 50% / 20px 20px;

    > img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      user-select: none;
    }
  }

  .mwai-working {
    position: absolute;
    left: 50%;
    bottom: 14px;
    transform: translateX(-50%);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 12px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.65);
    color: #fff;
    font-size: 12px;
    line-height: 1;
    white-space: nowrap;
  }

  .mwai-zoomable { cursor: zoom-in; }

  .mwai-lightbox {
    position: fixed;
    inset: 0;
    z-index: 100000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    background: rgba(8, 10, 14, 0.92);
    cursor: zoom-out;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 4px;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
    }
  }

  .mwai-lightbox-close {
    position: absolute;
    top: 20px;
    right: 24px;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 0;
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover { background: rgba(255, 255, 255, 0.22); }
  }

  .mwai-drop-hint {
    position: absolute;
    inset: 0;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: rgba(20, 22, 28, 0.8);
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    pointer-events: none;
  }

  .mwai-start {
    position: absolute;
    inset: 0 0 128px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    text-align: center;
    color: #e8ebf2;

    h1 {
      color: #fff;
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px;
      line-height: 1.2;
    }
    > p, .mwai-creating p {
      margin: 0 0 26px;
      color: #aeb6c8;
      font-size: 14px;
      max-width: 480px;
    }
  }

  .mwai-start-cards {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    justify-content: center;

    button {
      width: 210px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
      padding: 16px;
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      text-align: left;
      cursor: pointer;
      transition: background var(--neko-duration-fast) var(--neko-ease-out), transform var(--neko-duration-fast) var(--neko-ease-out);

      b { font-size: 14px; margin-top: 4px; }
      span { font-size: 12px; color: #aeb6c8; }
      &:hover { background: rgba(255, 255, 255, 0.1); transform: translateY(-2px); }
    }
  }

  .mwai-ideas {
    margin-top: 26px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    align-items: center;
    max-width: 560px;

    span { color: #7f889c; font-size: 12px; margin-right: 2px; }
    button {
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: transparent;
      color: #cdd3e0;
      border-radius: 999px;
      padding: 5px 11px;
      font-size: 12px;
      cursor: pointer;
      &:hover { border-color: #fff; color: #fff; }
    }
  }

  .mwai-creating {
    display: flex;
    flex-direction: column;
    align-items: center;
    .mwai-creating-art {
      width: 180px;
      height: 180px;
      border-radius: 18px;
      margin-bottom: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(120deg, #232735 0%, #2f3650 50%, #232735 100%);
      background-size: 400px 100%;
      animation: mwai-studio-shimmer 1.4s linear infinite;
    }
    p { margin-bottom: 8px !important; }
  }

  .mwai-composer {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 16px;
    z-index: 4;
    background: var(--neko-white);
    border-radius: 16px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
    padding: 8px;
  }

  .mwai-error {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin: 0 0 8px;
    padding: 8px 10px;
    border-radius: 10px;
    background: #fdecec;
    color: #9b1c1c;
    font-size: 12px;
    line-height: 1.4;
    span { flex: 1; }
    button { border: 0; background: transparent; color: inherit; cursor: pointer; padding: 0; }
  }

  .mwai-modes {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0 0 6px;

    button {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      height: 26px;
      padding: 0 10px;
      border-radius: 999px;
      border: 0;
      background: transparent;
      color: var(--neko-gray-40);
      font-size: 12px;
      cursor: pointer;
      &:hover:not(:disabled) { background: var(--neko-gray-98); }
      &.on { background: var(--neko-main-color-95, #eef3fc); color: var(--neko-main-color); font-weight: 600; }
      &:disabled { opacity: 0.4; cursor: default; }
    }
  }

  .mwai-mode-hint {
    margin-left: auto;
    padding-right: 6px;
    font-size: 11px;
    color: rgb(190, 40, 120);
    font-weight: 600;
  }

  .mwai-input-row {
    display: flex;
    align-items: flex-end;
    gap: 6px;

    textarea {
      flex: 1;
      resize: none;
      border: 0 !important;
      box-shadow: none !important;
      outline: none;
      background: transparent;
      padding: 8px 8px;
      min-height: 38px;
      max-height: 160px;
      font-size: 14px;
      line-height: 1.45;
      color: var(--neko-font-color);
    }
  }

  .mwai-count {
    height: 34px;
    min-height: 34px;
    border-radius: 10px !important;
    border: 1px solid var(--neko-gray-90) !important;
    padding: 0 22px 0 8px !important;
    font-size: 12px;
    color: var(--neko-gray-40);
  }

  .mwai-send {
    width: 38px;
    height: 38px;
    flex: none;
    border-radius: 12px;
    border: 0;
    background: var(--neko-main-color);
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:disabled { background: var(--neko-gray-90); cursor: default; }
  }

  .mwai-side {
    overflow-y: auto;
    scrollbar-gutter: stable;

    section {
      padding: 14px;
      border-bottom: 1px solid var(--neko-gray-95);
      &:last-child { border-bottom: 0; }
    }

    h3 {
      margin: 0 0 10px;
      font-size: 13px;
      font-weight: 600;
    }
  }

  .mwai-versions {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: 340px;
    overflow-y: auto;
    margin: 0 -6px;
  }

  .mwai-version {
    position: relative;
    display: flex;
    gap: 10px;
    padding: 6px;
    border-radius: 10px;
    cursor: pointer;

    img {
      width: 44px;
      height: 44px;
      flex: none;
      object-fit: cover;
      border-radius: 8px;
      background: var(--neko-gray-95);
    }
    &:hover { background: var(--neko-gray-98); }
    &.active { background: var(--neko-main-color-95, #eef3fc); box-shadow: inset 0 0 0 1px var(--neko-main-color-80, #b9cdf2); }
    &.pending { cursor: default; }
    &:hover .mwai-version-delete { opacity: 1; }
  }

  .mwai-version-text { min-width: 0; flex: 1; }

  .mwai-version-head {
    display: flex;
    align-items: center;
    gap: 5px;
    b { font-size: 12px; }
  }

  .mwai-version-prompt {
    margin-top: 2px;
    font-size: 12px;
    line-height: 1.35;
    color: var(--neko-gray-30);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .mwai-version-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 2px;
    font-size: 11px;
    color: var(--neko-gray-50);
    span { display: inline-flex; align-items: center; gap: 3px; }
  }

  .mwai-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 1px 6px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 600;
    background: var(--neko-gray-95);
    color: var(--neko-gray-40);
    &.op-source { background: #eceff5; color: #4b5568; }
    &.op-create { background: #e8f0ff; color: #2456b8; }
    &.op-edit { background: #f1eaff; color: #6a3dc2; }
    &.op-inpaint { background: #fde8f3; color: #b0266f; }
    &.op-variation { background: #e6f6f1; color: #1b7a5c; }
    &.saved { background: #e3f5e8; color: #1e7b3c; }
  }

  .mwai-version-delete {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    border: 0;
    background: var(--neko-white);
    color: var(--neko-gray-50);
    box-shadow: var(--neko-shadow-xs);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    &:hover { color: var(--neko-danger, #d63638); }
  }

  .mwai-preset-actions {
    display: flex;
    gap: 6px;
    margin-top: 8px;

    button {
      height: 28px;
      padding: 0 10px;
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

  .mwai-form {
    display: flex;
    flex-direction: column;
    gap: 4px;

    label {
      font-size: 12px;
      color: var(--neko-gray-40);
      margin-top: 6px;
    }
  }

  .mwai-form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
    margin-top: 10px;
  }

  .mwai-saved {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 10px;
    background: #e3f5e8;
    color: #1e7b3c;
    span { flex: 1; }
    a { color: inherit; font-weight: 600; }
  }

  @media (max-width: 1200px) {
    grid-template-columns: 200px minmax(0, 1fr) 260px;
  }

  @media (max-width: 961px) {
    grid-template-columns: 1fr;
    height: auto;

    .mwai-stage { height: 70vh; }
    .mwai-threads { max-height: 260px; }
    .mwai-tool span { display: none; }
  }
`;

export default StyledStudio;
```