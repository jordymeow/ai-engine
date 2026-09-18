// Previous: none
// Current: 3.7.9

// React & Vendor Libs
const { useState, useRef } = wp.element;
import Styled from 'styled-components';

const StyledCompare = Styled.div`
  position: absolute;
  inset: 0;
  cursor: ew-resize;
  touch-action: none;
  user-select: none;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
  }

  .mwai-compare-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    margin-left: -1px;
    background: #fff;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
    pointer-events: none;
  }

  .mwai-compare-knob {
    position: absolute;
    top: 50%;
    width: 34px;
    height: 34px;
    margin: -17px 0 0 -17px;
    border-radius: 50%;
    background: #fff;
    box-shadow: var(--neko-shadow-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: var(--neko-gray-30);
    pointer-events: none;
  }

  .mwai-compare-label {
    position: absolute;
    top: 12px;
    padding: 3px 9px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    pointer-events: none;
  }
`;

// "Before" is drawn on top and clipped at the handle, so dragging right reveals more of it.
const CompareOverlay = ({ before }) => {
  const [ position, setPosition ] = useState(50);
  const ref = useRef(null);

  const move = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const next = ((e.clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  };

  return (
    <StyledCompare ref={ref}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); move(e); }}
      onPointerMove={(e) => { if (e.buttons === 1) move(e); }}>
      <img src={before} alt="" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }} />
      <div className="mwai-compare-line" style={{ left: `${position}%` }} />
      <div className="mwai-compare-knob" style={{ left: `${position}%` }}>⇆</div>
      <div className="mwai-compare-label" style={{ left: 12 }}>Before</div>
      <div className="mwai-compare-label" style={{ right: 12 }}>After</div>
    </StyledCompare>
  );
};

export default CompareOverlay;
