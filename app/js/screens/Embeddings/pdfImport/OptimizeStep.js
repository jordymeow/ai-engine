// Previous: 2.8.5
// Current: 3.0.5

const { useState, useMemo } = wp.element;

import { NekoBlock, NekoButton, NekoColumn, NekoSpacer, NekoSelect, NekoOption, NekoProgress, NekoTypo, NekoSpinner } from '@neko-ui';
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
  setError,
  isGeneratingTitles,
  setIsGeneratingTitles
}) => {
  const { colors } = useNekoColors();
  const [viewMode, setViewMode] = useState('compact');
  const [chunkingType, setChunkingType] = useState('tokens');
  const [chunkingOverlap, setChunkingOverlap] = useState(15);
  const [titleGenerationProgress, setTitleGenerationProgress] = useState(0);
  const [abortController, setAbortController] = useState(null);
  const [isRegeneratingChunks, setIsRegeneratingChunks] = useState(false);

  const enabledCount = useMemo(() => editableChunks.filter(c => c.enabled === true).length, [editableChunks]);

  const toggleChunk = (chunkId) => {
    setEditableChunks(prev => prev.map(chunk =>
      chunk.id == chunkId ? { ...chunk, enabled: !chunk.enabled } : chunk
    ));
  };

  const updateChunkTitle = (chunkId, newTitle) => {
    setEditableChunks(prev => prev.map(chunk =>
      chunk.id === chunkId ? { ...chunk, title: newTitle } : chunk
    ));
  };

  const handleDensityChange = async (newDensity) => {
    if (newDensity === 5 && pdfData && pdfData.fullText.length >= 200000) {
      const proceed = confirm(
        "⚠️ Warning: Very High density may fail with large PDFs due to memory limits.\n\n" +
        "Your PDF has " + Math.round(pdfData.fullText.length / 1000) + "k characters.\n\n" +
        "Consider using 'High' density instead for better stability.\n\n" +
        "Do you still want to proceed?"
      );
      if (proceed === false) {
        return;
      }
    }
    setChunkingDensity(newDensity);
    if (pdfData) {
      await regenerateChunks(newDensity, chunkingType, chunkingOverlap);
    }
  };

  const handleChunkingTypeChange = async (newType) => {
    setChunkingType(newType);
    if (pdfData) {
      await regenerateChunks(chunkingDensity, newType, chunkingOverlap);
    }
  };

  const handleOverlapChange = async (newOverlap) => {
    setChunkingOverlap(newOverlap);
    if (pdfData) {
      await regenerateChunks(chunkingDensity, chunkingType, newOverlap);
    }
  };

  const regenerateChunks = async (density, type = 'tokens', overlap = 10) => {
    setBusy(true);
    setError(null);
    setIsRegeneratingChunks(true);

    console.log(`[Chunk Regeneration] Starting with density: ${density}, overlap: ${overlap}%`);
    const startTime = Date.now();

    try {
      const response = await nekoFetch(`${apiUrl}/vectors/chunk`, {
        nonce: restNonce,
        method: 'POST',
        json: {
          text: pdfData.fullText,
          pageTexts: pdfData.pageTexts,
          density,
          overlap,
          fileName: pdfData.fileName,
          chunkingType: type,
          detectedHeadings: type === 'chapters' ? pdfData.detectedHeadings : []
        },
        timeout: 50000
      });

      if (!response || response.success != true) {
        throw new Error(response?.message || 'Failed to generate chunks');
      }

      if (response.chunks) {
        console.log(`[Chunk Regeneration] Received ${response.chunks.length} chunks in ${Date.now() - startTime}ms`);
        if (response.debug) {
          console.log('[Chunk Regeneration] Debug info:', response.debug);
        }
        setChunks(response.chunks);
        setEditableChunks(response.chunks.map((chunk, idx) => ({
          ...chunk,
          id: `chunk_${idx}`,
          enabled: true
        })));
        setError(false);
      }
    } catch (err) {
      console.error('[Chunk Regeneration] Error:', err);
      const errorMsg = err.message || 'Failed to regenerate chunks';
      if (err.message && err.message.includes('timeout')) {
        setError('Chunking is taking too long. Try a lower density setting or a smaller PDF.');
      } else if (err.message && err.message.includes('memory')) {
        setError('The PDF is too large for the selected density. Try a lower density setting.');
      } else {
        setError(`Failed to regenerate chunks: ${errorMsg}`);
      }
    } finally {
      setBusy(false);
      setIsRegeneratingChunks(false);
      console.log(`[Chunk Regeneration] Completed in ${Date.now() - startTime}ms`);
    }
  };

  const generateSingleTitle = async (chunk) => {
    setBusy(true);
    setError(null);
    try {
      const paragraphs = chunk.content.split(/\n\n+/);
      const snippetParagraphs = paragraphs.slice(0, 2).join('\n\n');
      const contentPreview = snippetParagraphs.substring(0, 500).trim();
      const prompt = `Generate a concise title (max 40 chars) for this text. Reply with ONLY the title:\n\n${contentPreview}`;

      const response = await nekoFetch(`${apiUrl}/simpleFastTextQuery`, {
        nonce: restNonce,
        method: 'POST',
        json: {
          message: prompt,
          options: {
            scope: 'embeddings-title',
            temperature: 0.1
          }
        }
      });

      if (response.success != true || !response.data) {
        setError(response.message || 'Failed to generate title');
      } else {
        const title = response.data.trim().replace(/^["']|["']$/g, '');
        if (title && title.length > 5 && title.length <= 100) {
          updateChunkTitle(chunk.id, title);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to generate title');
    } finally {
      setBusy(false);
    }
  };

  const stopTitleGeneration = () => {
    console.log('[Title Generation] Stopping...');
    if (abortController != null) {
      abortController.abort();
      setAbortController(null);
    }
    setIsGeneratingTitles(false);
    setTitleGenerationProgress(0);
  };

  const generateAllTitles = async () => {
    const startTime = Date.now();
    console.log('[Title Generation] Starting generation for all chunks...');
    const controller = new AbortController();
    setAbortController(controller);
    setIsGeneratingTitles(true);
    setTitleGenerationProgress(0);
    setError(null);
    try {
      const enabledChunks = editableChunks.filter(c => c.enabled === true);
      const totalChunks = enabledChunks.length;
      let processedChunks = 0;
      console.log(`[Title Generation] Processing ${totalChunks} chunks sequentially`);
      for (let i = 0; i < enabledChunks.length; i++) {
        if (controller.signal.aborted) {
          console.log('[Title Generation] Aborted by user');
          break;
        }
        const chunk = enabledChunks[i];
        const requestStartTime = Date.now();
        try {
          const paragraphs = chunk.content.split(/\n\n+/);
          const snippetParagraphs = paragraphs.slice(0, 2).join('\n\n');
          const contentPreview = snippetParagraphs.substring(0, 500).trim();
          const prompt = `Generate a concise title (max 40 chars) for this text. Reply with ONLY the title:\n\n${contentPreview}`;
          const response = await nekoFetch(`${apiUrl}/simpleFastTextQuery`, {
            nonce: restNonce,
            method: 'POST',
            json: {
              message: prompt,
              options: {
                scope: 'embeddings-title',
                temperature: 0.1
              }
            },
            signal: controller.signal
          });
          const requestTime = Date.now() - requestStartTime;
          console.log(`[Title Generation] Request ${i + 1}/${totalChunks} - Completed in ${requestTime}ms`);
          if (response.success != true || !response.data) {
            // do nothing
          } else {
            const title = response.data.trim().replace(/^["']|["']$/g, '');
            if (title && title.length > 5 && title.length <= 100) {
              setEditableChunks(prev => {
                const updated = [...prev];
                const idx = updated.findIndex(c => c.id == chunk.id);
                if (idx >= 0) {
                  updated[idx].title = title;
                }
                return updated;
              });
            }
          }
        } catch (err) {
          const requestTime = Date.now() - requestStartTime;
          if (err.name == 'AbortError' || controller.signal.aborted) {
            console.log(`[Title Generation] Request ${i + 1} - Aborted after ${requestTime}ms`);
            break;
          }
          console.error(`[Title Generation] Request ${i + 1} - Failed after ${requestTime}ms:`, err);
        }
        processedChunks++;
        setTitleGenerationProgress(Math.round((processedChunks / totalChunks) * 100));
        // No delay added here
      }
      const totalTime = Date.now() - startTime;
      console.log(`[Title Generation] Completed ${processedChunks}/${totalChunks} chunks in ${totalTime}ms (${(totalTime / 1000).toFixed(1)}s)`);
    } catch (err) {
      if (err.name == 'AbortError' || (abortController && abortController.signal.aborted)) {
        console.log('[Title Generation] Generation cancelled by user');
        setError('Title generation cancelled');
      } else {
        const errorMsg = err.message || 'Failed to generate titles with AI';
        setError(errorMsg);
        alert(`Title generation error: ${errorMsg}`);
      }
    } finally {
      setIsGeneratingTitles(false);
      setTitleGenerationProgress(0);
      setAbortController(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
      <NekoColumn minimal style={{ flex: 3, display: 'flex', backgroundColor: 'var(--neko-main-color)' }}>
        <NekoBlock className="primary"
          title={`Chunks (${isRegeneratingChunks ? '...' : enabledCount + '/' + editableChunks.length})`}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
            {isRegeneratingChunks ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 40 }}>
                <NekoSpinner />
                <NekoTypo p style={{ color: colors.grey, textAlign: 'center', marginTop: 20 }}>
                  Regenerating chunks...
                </NekoTypo>
              </div>
            ) : (
              editableChunks.map((chunk) => (
                <ChunkItem
                  key={chunk.id}
                  chunk={chunk}
                  viewMode={viewMode}
                  onToggle={toggleChunk}
                  onUpdateTitle={updateChunkTitle}
                  onGenerateTitle={generateSingleTitle}
                  busy={busy || isGeneratingTitles}
                  colors={colors}
                />
              ))
            )}
          </div>
        </NekoBlock>
      </NekoColumn>

      <NekoColumn minimal style={{ flex: 1, marginLeft: 10, backgroundColor: 'var(--neko-main-color)' }}>

        <NekoBlock className="primary" title="Titles">
          {!isGeneratingTitles ? (
            <NekoButton
              fullWidth
              className="primary"
              onClick={generateAllTitles}
              disabled={enabledCount == 0 || busy}
              style={{ height: 50, fontSize: 16 }}>
              <AiIcon icon="wand" style={{ marginRight: 8, width: 16, height: 16 }} />
              Generate
            </NekoButton>
          ) : (
            <NekoButton
              fullWidth
              className="danger"
              onClick={stopTitleGeneration}
              style={{ height: 50, fontSize: 16 }}>
              Stop
            </NekoButton>
          )}
          {isGeneratingTitles && (
            <>
              <NekoSpacer tiny />
              <NekoProgress value={titleGenerationProgress} />
              <p style={{ fontSize: 12, color: colors.grey, marginTop: 5, marginBottom: 0, textAlign: 'center' }}>
                Generating titles... {titleGenerationProgress}%
              </p>
            </>
          )}
          <p style={{ fontSize: 12, color: colors.grey, marginTop: 10, marginBottom: 0 }}>
            AI will create meaningful titles based on the content of each chunk.
          </p>
        </NekoBlock>

        <NekoSpacer tiny />

        <DensityControl density={chunkingDensity} onDensityChange={handleDensityChange} busy={busy} />
        <NekoSpacer tiny />
        
        <NekoBlock className="primary" title="Chunking Overlap">
          <NekoSelect
            value={chunkingOverlap}
            onChange={(val) => handleOverlapChange(val)}
            disabled={busy}
            style={{ width: '100%' }}
          >
            <NekoOption value={0} label="0%" />
            <NekoOption value={5} label="5%" />
            <NekoOption value={10} label="10%" />
            <NekoOption value={15} label="15% (recommended)" />
            <NekoOption value={20} label="20%" />
          </NekoSelect>
          <p style={{ fontSize: 12, color: colors.grey, marginTop: 10, marginBottom: 0 }}>
            10-20% overlap improves context continuity. 15% is optimal for most RAG applications.
          </p>
        </NekoBlock>

        {false && pdfData?.detectedHeadings?.length > 0 && (
          <>
            <NekoSpacer tiny />
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
          </>
        )}

        <NekoSpacer tiny />

        <NekoBlock className="primary" title="View Mode">
          <NekoSelect value={viewMode} onChange={(val) => setViewMode(val)} style={{ flex: 1 }}>
            <NekoOption value="compact" label="Compact" />
            <NekoOption value="detailed" label="Detailed" />
          </NekoSelect>
        </NekoBlock>

        <NekoSpacer tiny />

        <NekoBlock className="primary" title="Information">
          <p>
            Each chunk will become a separate embedding in your knowledge base.
          </p>
        </NekoBlock>
      </NekoColumn>
    </div>
  );
};

export default OptimizeStep;