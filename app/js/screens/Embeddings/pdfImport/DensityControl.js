// Previous: 2.8.3
// Current: 3.0.5

// React & Vendor Libs
const { } = wp.element;

// NekoUI
import { NekoBlock, NekoSelect, NekoOption } from '@neko-ui';
import { useNekoColors } from '@neko-ui';

const DensityControl = ({ density, onDensityChange, busy }) => {
  const { colors } = useNekoColors();
  
  return (
    <NekoBlock className="primary" title="Chunking Density">
      <NekoSelect 
        value={density} 
        onChange={onDensityChange}
        disabled={busy} 
        isBusy={busy} 
        style={{ width: '100%' }}
      >
        <NekoOption value={1} label="Very Low (~1200 tokens)" />
        <NekoOption value={2} label="Low (~800 tokens)" />
        <NekoOption value={3} label="Medium (~600 tokens)" />
        <NekoOption value={4} label="High (~400 tokens)" />
        <NekoOption value={5} label="Very High (~200 tokens) ⚠️" />
      </NekoSelect>
      <p style={{ fontSize: 12, color: density === 5 ? colors.orange : colors.grey, marginTop: 10, marginBottom: 0 }}>
        {density === 5 
          ? "⚠️ Very High density may fail with large PDFs due to memory limits. Consider using High instead."
          : "Smaller chunks improve retrieval precision for RAG. Medium (600 tokens) is optimal for most use cases."}
      </p>
    </NekoBlock>
  );
};

export default DensityControl;