// Previous: none
// Current: 2.8.3

const { useEffect } = wp.element;

import { NekoBlock, NekoTypo, NekoIcon, NekoProgress } from '@neko-ui';
import { useNekoColors } from '@neko-ui';

const IntegrateStep = ({
  editableChunks,
  uploadProgress,
  setUploadProgress,
  uploadedCount,
  setUploadedCount,
  onAddEmbedding,
  environment,
  busy,
  setBusy,
  error,
  setError,
  onComplete
}) => {
  const { colors } = useNekoColors();
  const enabledChunks = editableChunks.filter(c => c.enabled);

  const handleUpload = async () => {
    if (enabledChunks.length === 0) {
      setError('Please select at least one chunk to upload');
      return;
    }

    setBusy(true);
    setUploadedCount(0);
    setError(null);

    try {
      for (let i = 0; i < enabledChunks.length; i++) {
        const chunk = enabledChunks[i];

        await onAddEmbedding({
          type: 'manual',
          title: chunk.title,
          content: chunk.content,
          envId: environment?.id,
          behavior: 'context'
        }, true);

        setUploadedCount(i);
        setUploadProgress(((i + 1) / enabledChunks.length) * 100);
      }

      onComplete();
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload embeddings: ' + err.message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    const handleUploadEvent = () => handleUpload();
    window.addEventListener('pdf-import-upload', handleUploadEvent);
    return () => window.removeEventListener('pdf-import-upload', handleUploadEvent);
  }, [enabledChunks]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <NekoBlock className="primary" style={{ maxWidth: 500 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20 }}>
            {uploadProgress === 0 && !busy && (
              <>
                <NekoIcon icon="database" width={48} color={colors.blue} style={{ marginBottom: 20 }} />
                <NekoTypo h3 style={{ marginBottom: 10 }}>Ready to Create Embeddings</NekoTypo>
                <NekoTypo p style={{ color: colors.grey, textAlign: 'center' }}>
                  {enabledChunks.length} sections will be processed and added to your knowledge base
                </NekoTypo>
              </>
            )}

            {(uploadProgress > 0 && uploadProgress < 100) && (
              <>
                <NekoTypo h3 style={{ marginBottom: 20 }}>Creating Embeddings...</NekoTypo>
                <NekoProgress
                  value={uploadProgress}
                  max={100}
                  style={{ marginBottom: 10 }}
                />
                <NekoTypo small style={{ color: colors.grey }}>
                  Processing section {uploadedCount} of {enabledChunks.length}
                </NekoTypo>
              </>
            )}

            {uploadProgress === 100 && (
              <>
                <NekoIcon icon="check-circle" width={48} color={colors.green} style={{ marginBottom: 20 }} />
                <NekoTypo h3 style={{ marginBottom: 10 }}>All Done!</NekoTypo>
                <NekoTypo p style={{ color: colors.grey, textAlign: 'center' }}>
                  Successfully created {enabledChunks.length} embeddings
                </NekoTypo>
              </>
            )}
          </div>
        </NekoBlock>
      </div>
    </div>
  );
};