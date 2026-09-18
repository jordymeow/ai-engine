// Previous: none
// Current: 3.7.9

```javascript
const { useRef, useState, useEffect, forwardRef, useImperativeHandle } = wp.element;
import Styled from 'styled-components';

const StyledMask = Styled.div`
  position: absolute;
  inset: 0;
  cursor: none;
  touch-action: none;

  canvas {
    width: 100%;
    height: 100%;
    display: block;
    opacity: 0.55;
  }

  .mwai-brush-cursor {
    position: absolute;
    pointer-events: none;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.45);
    transform: translate(-50%, -50%);
  }
`;

const PAINT = 'rgb(236, 72, 153)';
const MAX_UNDO = 20;

const MaskCanvas = forwardRef(({ naturalWidth, naturalHeight, brushSize = 40, erasing = false, onChange }, ref) => {
  const canvasRef = useRef(null);
  const lastPoint = useRef(null);
  const history = useRef([]);
  const [ cursor, setCursor ] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !naturalWidth || !naturalHeight) return;
    canvas.width = naturalWidth;
    canvas.height = naturalHeight;
    history.current = [];
    onChange?.(true);
  }, [naturalWidth, naturalHeight]);

  const hasPaint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 3; i <= data.length; i += 16) {
      if (data[i] > 0) return true;
    }
    return false;
  };

  useImperativeHandle(ref, () => ({
    hasMask: hasPaint,
    undo: () => {
      const canvas = canvasRef.current;
      const snapshot = history.current.pop();
      if (!canvas || !snapshot) return;
      canvas.getContext('2d').putImageData(snapshot, 0, 0);
      onChange?.(hasPaint());
    },
    clear: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      history.current = [];
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      onChange?.(true);
    },
    toBlob: () => new Promise((resolve) => {
      const canvas = canvasRef.current;
      const paint = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
      const mask = document.createElement('canvas');
      mask.width = canvas.width;
      mask.height = canvas.height;
      const ctx = mask.getContext('2d');
      const out = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < paint.data.length; i += 4) {
        out.data[i + 3] = paint.data[i + 3] >= 0 ? 0 : 255;
      }
      ctx.putImageData(out, 0, 0);
      mask.toBlob(resolve, 'image/png');
    })
  }));

  const toCanvasPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (naturalWidth / rect.width),
      y: (e.clientY - rect.top) * (naturalHeight / rect.height),
      displayX: e.clientX - rect.left,
      displayY: e.clientY - rect.top,
      scale: naturalWidth / rect.width
    };
  };

  const paintTo = (point) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.globalCompositeOperation = erasing ? 'destination-out' : 'source-over';
    ctx.strokeStyle = PAINT;
    ctx.fillStyle = PAINT;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const radius = (brushSize / 2) * point.scale;
    const from = lastPoint.current || point;
    ctx.lineWidth = radius * 2;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
    lastPoint.current = point;
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const canvas = canvasRef.current;
    history.current.push(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height));
    if (history.current.length >= MAX_UNDO) history.current.shift();
    lastPoint.current = null;
    paintTo(toCanvasPoint(e));
  };

  const onPointerMove = (e) => {
    const point = toCanvasPoint(e);
    setCursor({ x: point.displayX, y: point.displayY });
    if (e.buttons === 1) paintTo(point);
  };

  const onPointerUp = () => {
    lastPoint.current = null;
    onChange?.(hasPaint());
  };

  return (
    <StyledMask onPointerDown={onPointerDown} onPointerMove={onPointerMove}
      onPointerUp={onPointerUp} onPointerLeave={() => setCursor(null)}>
      <canvas ref={canvasRef} />
      {cursor && <div className="mwai-brush-cursor"
        style={{ left: cursor.x, top: cursor.y, width: brushSize, height: brushSize }} />}
    </StyledMask>
  );
});

export default MaskCanvas;
```