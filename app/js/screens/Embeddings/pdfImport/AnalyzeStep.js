// Previous: none
// Current: 2.8.3

const { useState } = wp.element;

// NekoUI
import { NekoBlock, NekoButton, NekoTypo, NekoIcon } from '@neko-ui';
import { useNekoColors, nekoFetch } from '@neko-ui';

import { apiUrl, restNonce } from '@app/settings';

let pdfjsLib = null;
const loadPDFjs = async () => {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = window.location.origin + '/wp-content/plugins/ai-engine-pro/app/vendor/pdf.worker.min.js';
  }
  return pdfjsLib;
};

const AnalyzeStep = ({
  fileInputRef,
  pdfFile,
  setPdfFile,
  pdfData,
  setPdfData,
  chunks,
  setChunks,
  editableChunks,
  setEditableChunks,
  chunkingDensity,
  busy,
  setBusy,
  error,
  setError
}) => {
  const { colors } = useNekoColors();
  const [parseProgress, setParseProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.includes('pdf')) {
      setError('Please select a valid PDF file');
      return;
    }

    console.log('[PDF Import] File selected:', file.name, 'Size:', file.size);
    setPdfFile(file);
    setError(null);
    setBusy(true);

    try {
      console.log('[PDF Import] Starting PDF parsing...');
      const pdfjsLibrary = await loadPDFjs();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLibrary.getDocument({ data: arrayBuffer }).promise;
      console.log('[PDF Import] PDF loaded, pages:', pdf.numPages);

      let fullText = '';
      const pageTexts = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        console.log(`[PDF Import] Extracting text from page ${i}/${pdf.numPages}`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        pageTexts.push(pageText);
        fullText += pageText + '\n\n';

        setCurrentPage(i);
        setParseProgress((i / pdf.numPages) * 100);
      }

      const wordCount = fullText.split(/\s+/).filter(w => w.length > 0).length;
      console.log('[PDF Import] Text extraction complete. Words:', wordCount, 'Characters:', fullText.length);

      const pdfInfo = {
        numPages: pdf.numPages,
        wordCount,
        fullText,
        pageTexts,
        fileName: file.name
      };
      setPdfData(pdfInfo);

      await generateChunks(fullText, pageTexts, chunkingDensity, pdfInfo);

    } catch (err) {
      console.error('[PDF Import] PDF parsing error:', err);
      setError('Failed to parse PDF: ' + err.message);
    } finally {
      setBusy(false);
    }
  };

  const generateChunks = async (fullText, pageTexts, density, pdfInfo) => {
    setBusy(true);
    setError(null);

    console.log('[PDF Import] Starting chunking with density:', density);

    if (density === 5 && fullText.length > 10000) {
      const estimatedChunks = Math.ceil(fullText.length / 1000);
      console.log('[PDF Import] Very high density warning - estimated chunks:', estimatedChunks);
      if (estimatedChunks > 50) {
        setError(`Note: Very High density may create ${estimatedChunks}+ small chunks. This might take a moment...`);
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      console.log('[PDF Import] Sending chunking request to server...');
      const response = await nekoFetch(`${apiUrl}/vectors/chunk`, {
        nonce: restNonce,
        method: 'POST',
        json: {
          text: fullText,
          pageTexts,
          density,
          fileName: pdfInfo?.fileName || 'document.pdf'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.chunks) {
        console.log('[PDF Import] Received chunks:', response.chunks.length);
        setChunks(response.chunks);
        setEditableChunks(response.chunks.map((chunk, idx) => ({
          ...chunk,
          id: `chunk_${idx}`,
          enabled: true
        })));
        setError(null);
      }
    } catch (err) {
      console.error('[PDF Import] Chunking error:', err);
      if (err.name === 'AbortError') {
        setError('Chunking is taking too long. Try a lower density setting.');
      } else {
        setError('Failed to generate chunks: ' + err.message);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!pdfFile && !busy && (
          <NekoBlock className="primary" style={{ maxWidth: 400 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20 }}>
              <NekoTypo h3 style={{ marginBottom: 10 }}>Upload PDF Document</NekoTypo>
              <NekoTypo p style={{ color: colors.grey, marginBottom: 30, textAlign: 'center' }}>
                Select a PDF file to extract its content and create embeddings
              </NekoTypo>
              <NekoButton
                className="primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={busy}
                isBusy={busy}
                style={{ minWidth: 200 }}
              >
                <NekoIcon icon="upload" style={{ marginRight: 8 }} />
                Select PDF File
              </NekoButton>
            </div>
          </NekoBlock>
        )}

        {busy && !pdfData && (
          <NekoBlock className="primary" style={{ maxWidth: 400 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20 }}>
              <NekoTypo h3 style={{ marginBottom: 20 }}>Parsing PDF...</NekoTypo>
              <NekoTypo small style={{ color: colors.grey, textAlign: 'center' }}>
                Extracting text content from PDF pages...
              </NekoTypo>
            </div>
          </NekoBlock>
        )}

        {pdfData && !busy && (
          <NekoBlock className="primary" style={{ maxWidth: 400 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20 }}>
              <NekoIcon icon="check-circle" width={48} color={colors.green} style={{ marginBottom: 20 }} />
              <NekoTypo h3 style={{ marginBottom: 10 }}>PDF Analyzed Successfully</NekoTypo>
              <div style={{
                background: colors.lightGrey,
                padding: 20,
                marginBottom: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <NekoTypo h4>{pdfData.fileName}</NekoTypo>
                <NekoTypo small style={{ color: colors.grey, textAlign: 'center' }}>
                  {pdfData.numPages} pages • {pdfData.wordCount.toLocaleString()} words
                </NekoTypo>
              </div>
              <NekoButton className="secondary" onClick={() => fileInputRef.current?.click()} disabled={busy}>
                <NekoIcon icon="upload" style={{ marginRight: 8 }} />
                Choose Different PDF
              </NekoButton>
            </div>
          </NekoBlock>
        )}

        {pdfData && busy && (
          <NekoBlock className="primary" style={{ maxWidth: 400 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20 }}>
              <NekoTypo h3 style={{ marginBottom: 20 }}>Creating Sections</NekoTypo>
              <NekoTypo small style={{ color: colors.grey, textAlign: 'center' }}>
                Analyzing document structure and organizing content into chunks...
              </NekoTypo>
            </div>
          </NekoBlock>
        )}
      </div>
    </div>
  );
};

export default AnalyzeStep;