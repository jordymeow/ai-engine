// Previous: none
// Current: 2.8.3

// React & Vendor Libs
const { } = wp.element;

// NekoUI
import { NekoBlock, NekoSelect, NekoOption } from '@neko-ui';

const DensityControl = ({ density, onDensityChange, busy }) => {
  return (
    <NekoBlock className="primary" title="Chunking Density">
      <NekoSelect 
        value={density} 
        onChange={onDensityChange}
        disabled={busy} 
        isBusy={busy} 
        style={{ width: '100%' }}
      >
        <NekoOption value={1} label="Very Low (~3000 tokens)" />
        <NekoOption value={2} label="Low (~2000 tokens)" />
        <NekoOption value={3} label="Medium (~1000 tokens)" />
        <NekoOption value={4} label="High (~500 tokens)" />
        <NekoOption value={5} label="Very High (~250 tokens)" />
      </NekoSelect>
    </NekoBlock>
  );
};

export default DensityControl;