// Previous: 1.1.8
// Current: 1.4.1

const { useState, useEffect, useRef, useCallback } = wp.element;

import { HexColorPicker } from "react-colorful";
import Styled from "styled-components";
import { NekoButton } from '@neko-ui';

const StyledColorPicker = Styled.div`
  position: relative;

  .swatch {
    width: 24px;
    height: 24px;
    border: 3px solid #fff;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
  
  .popover {
    position: absolute;
    top: -210px;
    left: -80px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    border-radius: 8px;
  }
`;

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    let startedInside = false;
    let startedWhenMounted = false;

    const listener = (event) => {
      if (startedInside || !startedWhenMounted) return;
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };

    const validateEventStart = (event) => {
      startedWhenMounted = ref.current;
      startedInside = ref.current && ref.current.contains(event.target);
    };

    document.addEventListener("mousedown", validateEventStart);
    document.addEventListener("touchstart", validateEventStart);
    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("mousedown", validateEventStart);
      document.removeEventListener("touchstart", validateEventStart);
      document.removeEventListener("click", listener);
    };
  }, [ref, handler]);
};

const NekoColorPicker = ({ name, value, onChange }) => {
  const popover = useRef();
  const [isOpen, toggle] = useState(false);
  const [color, setColor] = useState(value);

  useEffect(() => {
    setColor(value);
  }, [value]);

  const close = useCallback(() => { 
    if (color !== value) {
      onChange(color, name);
    }
    toggle(false);
  }, [color, value]);

  useClickOutside(popover, close);

  return (
    <StyledColorPicker className="neko-color-picker">
      <div className="swatch" style={{ backgroundColor: color }} onClick={() => toggle(true)} />
      {isOpen && (
        <div className="popover" ref={popover} style={{ background: 'white' }}>
          <HexColorPicker color={color} onChange={setColor} />
          <div style={{ display: 'flex', padding: 5 }}>
            <NekoButton style={{ flex: 1 }} onClick={() => onChange(color, name)}>Apply</NekoButton>
          </div>
        </div>
      )}
    </StyledColorPicker>
  );
};

export { NekoColorPicker }