// Previous: 2.8.3
// Current: 3.0.5

// React & Vendor Libs
const { } = wp.element;

// NekoUI
import { NekoCheckbox, NekoInput, NekoButton } from '@neko-ui';
import AiIcon from '@app/styles/AiIcon';

const ChunkItem = ({ chunk, viewMode, onToggle, onUpdateTitle, onGenerateTitle, busy, colors }) => {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <NekoCheckbox checked={chunk.enabled} onChange={() => onToggle(chunk.id)} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <NekoInput
              value={chunk.title}
              onChange={(value) => onUpdateTitle(chunk.id, value)}
              style={{ flex: 1 }}
              disabled={!chunk.enabled || busy}
              placeholder="Enter section title..."
            />
            {chunk.enabled && (
              <NekoButton size="small" className="primary" onClick={() => onGenerateTitle(chunk)}
                disabled={busy} title="Generate AI title">
                <AiIcon icon="wand" style={{ width: 14, height: 14, marginRight: 4 }} />
                Generate
              </NekoButton>
            )}
          </div>

          {chunk.enabled && (
            <div style={{ fontSize: 12, color: colors.grey, marginTop: 2, display: 'flex', gap: 5 }}>
              <span>{chunk.pageRange}</span>
              <span>•</span>
              <span>{chunk.tokens} tokens</span>
            </div>
          )}

          {viewMode === 'detailed' && (
            <div style={{
              color: colors.darkGrey,
              marginTop: 8,
              marginBottom: 8,
              maxHeight: 80,
              overflow: 'hidden',
              lineHeight: 1.5,
              position: 'relative'
            }}>
              {chunk.content.substring(0, 200)}
              {chunk.content.length > 200 && (
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: `linear-gradient(to right, transparent, ${colors.lightGrey})`,
                  padding: '0 10px'
                }}>...</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChunkItem;