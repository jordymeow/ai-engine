// Previous: 2.8.3
// Current: 2.8.5

const { useState, useMemo } = wp.element;

import { NekoBlock, NekoButton, NekoColumn, NekoSpacer, NekoSelect, NekoOption } from '@neko-ui';
import { useNekoColors, nekoFetch } from '@neko-ui';

import ChunkItem from './ChunkItem';
import DensityControl from './DensityControl';
import AiIcon from '@app/styles/AiIcon';
import { apiUrl, restNonce } from '@app/settings';

const OptimizeStep = ({
  editableChunks,
  setEditableChunks,
  chunks,
  setChunks,
  chunkingDensity,
  setChunkingDensity,
  pdfData,
  busy,
  setBusy,
  setError
}) => {
  const { colors } = useNekoColors();
  const [viewMode, setViewMode] = useState('compact');
  const [chunkingType, setChunkingType] = useState('tokens');

  const enabledCount = useMemo(() => editableChunks.filter(c => c.enabled).length, [editableChunks]);

  const toggleChunk = (chunkId) => {
    setEditableChunks(prev => prev.map(chunk =>
      chunk.id === chunkId ? { ...chunk, enabled: !chunk.enabled } : chunk
    ));
  };

  const updateChunkTitle = (chunkId, newTitle) => {
    setEditableChunks(prev => prev.map(chunk =>
      chunk.id === chunkId ? { ...chunk, title: newTitle } : chunk
    ));
  };

  const handleDensityChange = async (newDensity) => {
    setChunkingDensity(newDensity);
    if (pdfData) {
      await regenerateChunks(newDensity, chunkingType);
    }
  };

  const handleChunkingTypeChange = async (newType) => {
    setChunkingType(newType);
    if (pdfData) {
      await regenerateChunks(chunkingDensity, newType);
    }
  };

  const regenerateChunks = async (density, type = 'tokens') => {
    setBusy(true);
    setError(null);

    try {
      const response = await nekoFetch(`${apiUrl}/vectors/chunk`, {
        nonce: restNonce,
        method: 'POST',
        json: {
          text: pdfData.fullText,
          pageTexts: pdfData.pageTexts,
          density,
          fileName: pdfData.fileName,
          chunkingType: type,
          detectedHeadings: type === 'chapters' ? pdfData.detectedHeadings : []
        }
      });

      if (response.chunks) {
        setChunks(response.chunks);
        setEditableChunks(response.chunks.map((chunk, idx) => ({
          ...chunk,
          id: `chunk_${idx}`,
          enabled: true
        })));
      }
    } catch (err) {
      setError('Failed to regenerate chunks: ' + err.message);
    } finally {
      setBusy(false);
    }
  };

  const generateSingleTitle = async (chunk) => {
    setBusy(true);
    setError(null);

    try {
      const contentPreview = chunk.content.substring(0, 1000).trim();
      const prompt = `Read this text section and create a clear, descriptive title (max 50 characters) that captures its main topic. Reply with ONLY the title, nothing else:\n\n${contentPreview}`;

      const response = await nekoFetch(`${apiUrl}/simpleTextQuery`, {
        nonce: restNonce,
        method: 'POST',
        json: {
          message: prompt,
          options: {
            scope: 'embeddings-title',
            max_tokens: 25,
            temperature: 0.2
          }
        }
      });

      if (response.success && response.data) {
        const title = response.data.trim().replace(/^["']|["']$/g, '');
        if (title && title.length > 5 && title.length <= 100) {
          updateChunkTitle(chunk.id, title);
        }
      } else {
        setError(response.message || 'Failed to generate title');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate title');
    } finally {
      setBusy(false);
    }
  };

  const generateAllTitles = async () => {
    setBusy(true);
    setError(null);

    try {
      const enabledChunks = editableChunks.filter(c => c.enabled);
      const batchSize = 5;

      for (let i = 0; i < enabledChunks.length; i += batchSize) {
        const batch = enabledChunks.slice(i, i + batchSize);
        const promises = batch.map(async (chunk) => {
          try {
            const contentPreview = chunk.content.substring(0, 1000).trim();
            const prompt = `Read this text section and create a clear, descriptive title (max 50 characters) that captures its main topic. Reply with ONLY the title, nothing else:\n\n${contentPreview}`;

            const response = await nekoFetch(`${apiUrl}/simpleTextQuery`, {
              nonce: restNonce,
              method: 'POST',
              json: {
                message: prompt,
                options: {
                  scope: 'embeddings-title',
                  max_tokens: 25,
                  temperature: 0.2
                }
              }
            });

            if (response.success && response.data) {
              const title = response.data.trim().replace(/^["']|["']$/g, '');
              if (title && title.length > 5 && title.length <= 100) {
                return { chunkId: chunk.id, title };
              }
            }
          } catch (err) {
            console.error('Failed to generate title for chunk:', err);
          }
          return null;
        });

        const results = await Promise.all(promises);

        setEditableChunks(prev => {
          const updated = [...prev];
          results.forEach(result => {
            if (result && result.title) {
              const idx = updated.findIndex(c => c.id === result.chunkId);
              if (idx >= 0) {
                updated[idx].title = result.title;
              }
            }
          });
          return updated;
        });
      }
    } catch (err) {
      setError('Failed to generate titles with AI');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
      <NekoColumn minimal style={{ flex: 3, display: 'flex', backgroundColor: 'var(--neko-main-color)' }}>
        <NekoBlock className="primary"
          title={`Sections (${enabledCount}/${editableChunks.length})`}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
            {editableChunks.map((chunk) => (
              <ChunkItem
                key={chunk.id}
                chunk={chunk}
                viewMode={viewMode}
                onToggle={toggleChunk}
                onUpdateTitle={updateChunkTitle}
                onGenerateTitle={generateSingleTitle}
                busy={busy}
                colors={colors}
              />
            ))}
          </div>
        </NekoBlock>
      </NekoColumn>

      <NekoColumn minimal style={{ flex: 1, marginLeft: 10, backgroundColor: 'var(--neko-main-color)' }}>

        {(!pdfData?.detectedHeadings?.length || chunkingType === 'tokens') && (
          <>
            <DensityControl density={chunkingDensity} onDensityChange={handleDensityChange} busy={busy} />
            <NekoSpacer tiny />
          </>
        )}

        {pdfData?.detectedHeadings?.length > 0 && (
          <>
            <NekoBlock className="primary" title="Chunking Type">
              <NekoSelect
                value={chunkingType}
                onChange={handleChunkingTypeChange}
                disabled={busy}
                style={{ width: '100%' }}
              >
                <NekoOption value="tokens" label="By Tokens - Split based on token count" />
                <NekoOption value="chapters" label={`By Chapters - Use ${pdfData.detectedHeadings.length} detected chapters`} />
              </NekoSelect>
            </NekoBlock>
            <NekoSpacer tiny />
          </>
        )}

        <NekoBlock className="primary" title="AI Title Generation">
          <NekoButton
            fullWidth
            className="secondary"
            onClick={generateAllTitles}
            disabled={enabledCount === 0}
            isBusy={busy}
            style={{ height: 50, fontSize: 16 }}>
            <AiIcon icon="wand" style={{ marginRight: 8, width: 16, height: 16 }} />
            Auto-Generate All Titles
          </NekoButton>
        </NekoBlock>

        <NekoSpacer tiny />

        <NekoBlock className="primary" title="View Mode">
          <NekoSelect value={viewMode} onChange={setViewMode} style={{ flex: 1 }}>
            <NekoOption value="compact" label="Compact" />
            <NekoOption value="detailed" label="Detailed" />
          </NekoSelect>
        </NekoBlock>

        <NekoSpacer tiny />

        <NekoBlock className="primary" title="Information">
          <p>
            Each section will become a separate embedding in your knowledge base.
          </p>
        </NekoBlock>
      </NekoColumn>
    </div>
  );
};

export default OptimizeStep;