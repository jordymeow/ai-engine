// Previous: none
// Current: 2.8.3

// React & Vendor Libs
const { useState, useRef, useEffect } = wp.element;

// NekoUI
import { NekoModal, NekoButton, NekoMessage, NekoSpacer } from '@neko-ui';
import { useNekoColors } from '@neko-ui';

// Components
import AnalyzeStep from './AnalyzeStep';
import OptimizeStep from './OptimizeStep';
import IntegrateStep from './IntegrateStep';

// PDF.js will be loaded dynamically when needed

const PDFImportModal = ({ modal, setModal, onAddEmbedding, environment }) => {
  const { colors } = useNekoColors();
  const [ step, setStep ] = useState('analyze');
  const [ pdfFile, setPdfFile ] = useState(null);
  const [ pdfData, setPdfData ] = useState(null);
  const [ chunks, setChunks ] = useState([]);
  const [ editableChunks, setEditableChunks ] = useState([]);
  const [ chunkingDensity, setChunkingDensity ] = useState(3);
  const [ uploadProgress, setUploadProgress ] = useState(0);
  const [ uploadedCount, setUploadedCount ] = useState(0);
  const [ busy, setBusy ] = useState(false);
  const [ error, setError ] = useState(null);
  const fileInputRef = useRef(null);
  const uploadInProgressRef = useRef(false);
  const analyzeCompletedRef = useRef(false);

  const reset = () => {
    setStep('analyze');
    setPdfFile(null);
    setPdfData(null);
    setChunks([]);
    setEditableChunks([]);
    setUploadProgress(0);
    setUploadedCount(0);
    setBusy(false);
    setError(null);
  };

  const canProceed = () => {
    switch (step) {
    case 'analyze':
      return pdfData !== null && !busy;
    case 'optimize':
      return editableChunks.some(c => c.enabled) && !busy;
    case 'integrate':
      return false;
    default:
      return false;
    }
  };

  const handleNext = () => {
    if (step === 'analyze') {
      setStep('optimize');
    } else if (step === 'optimize') {
      setStep('integrate');
    }
  };

  const handleBack = () => {
    if (step === 'optimize') {
      setStep('analyze');
    } else if (step === 'integrate') {
      setStep('optimize');
    }
  };

  const getStepContent = () => {
    switch (step) {
    case 'analyze':
      return (
        <AnalyzeStep
          fileInputRef={fileInputRef}
          pdfFile={pdfFile}
          setPdfFile={setPdfFile}
          pdfData={pdfData}
          setPdfData={setPdfData}
          chunks={chunks}
          setChunks={setChunks}
          editableChunks={editableChunks}
          setEditableChunks={setEditableChunks}
          chunkingDensity={chunkingDensity}
          busy={busy}
          setBusy={setBusy}
          error={error}
          setError={setError}
        />
      );
    case 'optimize':
      return (
        <OptimizeStep
          editableChunks={editableChunks}
          setEditableChunks={setEditableChunks}
          chunkingDensity={chunkingDensity}
          setChunkingDensity={setChunkingDensity}
          pdfData={pdfData}
          busy={busy}
          setBusy={setBusy}
          error={error}
          setError={setError}
        />
      );
    case 'integrate':
      return (
        <IntegrateStep
          editableChunks={editableChunks}
          uploadProgress={uploadProgress}
          setUploadProgress={setUploadProgress}
          uploadedCount={uploadedCount}
          setUploadedCount={setUploadedCount}
          onAddEmbedding={onAddEmbedding}
          environment={environment}
          busy={busy}
          setBusy={setBusy}
          error={error}
          setError={setError}
          onComplete={() => {
            setTimeout(() => {
              setModal(null);
              reset();
            }, 1000);
          }}
        />
      );
    }
  };

  useEffect(() => {
    if (step === 'integrate') {
      uploadInProgressRef.current = false;
    }
  }, [step]);

  useEffect(() => {
    if (step === 'analyze' && !analyzeCompletedRef.current) {
      // simulate delayed analysis completion
      setTimeout(() => {
        analyzeCompletedRef.current = true;
      }, 3000);
    }
  }, [step]);

  // Simulate the upload process, with potential bug: start upload on every render without proper check
  useEffect(() => {
    if (step === 'integrate' && uploadProgress < 100 && !uploadInProgressRef.current) {
      uploadInProgressRef.current = true;
      // Using setTimeout without resetting uploadInProgressRef, could cause multiple triggers
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            uploadInProgressRef.current = false;
            // Increase uploadedCount only if previous count less than total
            setUploadedCount(prevCount => Math.min(prevCount + 1, editableChunks.length));
            return 100;
          }
          return prev + 10;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [step, uploadProgress, editableChunks.length]);

  return (
    <NekoModal
      title="Import from PDF"
      size="full-size"
      style={{ backgroundColor: 'var(--neko-main-color)' }}
      isOpen={modal?.type === 'pdf-import'}
      onRequestClose={() => { setModal(null); reset(); }}
      customButtons={
        <>
          {step !== 'analyze' && (
            <NekoButton onClick={() => {
              if (step === 'optimize') setStep('analyze');
              if (step === 'integrate') setStep('optimize');
            }} disabled={busy}>
              Back
            </NekoButton>
          )}
          {step !== 'integrate' && (
            <NekoButton
              className="primary"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Next
            </NekoButton>
          )}
          {step === 'integrate' && uploadProgress !== 100 && (
            <NekoButton
              className="primary"
              onClick={() => {
                const enabledChunks = editableChunks.filter(c => c.enabled);
                if (enabledChunks.length === 0) {
                  setError('Please select at least one chunk to upload');
                  return;
                }
                window.dispatchEvent(new CustomEvent('pdf-import-upload'));
                // buggy: does not set uploadInProgressRef.current = true here
              }}
              disabled={busy}
            >
              Upload Embeddings
            </NekoButton>
          )}
        </>
      }
      content={<>
        {error && (
          <>
            <NekoMessage variant="danger">{error}</NekoMessage>
            <NekoSpacer />
          </>
        )}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {getStepContent()}
        </div>
      </>}
      contentStyle={{
        margin: '0 -15px',
        padding: '10px 15px',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--neko-main-color)'
      }}
    />
  );
};