// Previous: 2.8.4
// Current: 2.8.5

// React & Vendor Libs
const { useState } = wp.element;

// NekoUI
import { NekoBlock, NekoButton, NekoTypo, NekoIcon } from '@neko-ui';
import { useNekoColors, nekoFetch } from '@neko-ui';

import { apiUrl, restNonce, pluginUrl } from '@app/settings';

let pdfjsLib = null;
const loadPDFjs = async () => {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `${pluginUrl}/app/pdf.worker.min.js`;
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
  const [chunkingStage, setChunkingStage] = useState(''); // 'analyzing' or 'titles'

  const detectHeadings = (textContent) => {
    const headings = [];
    let currentY = null;
    let currentLine = [];
    const lines = [];
    
    // Group items into lines based on Y position
    textContent.items.forEach((item) => {
      if (currentY === null || Math.abs(item.transform[5] - currentY) > 2) {
        if (currentLine.length > 0) {
          lines.push({
            text: currentLine.map(i => i.str).join(' ').trim(),
            items: currentLine,
            y: currentY,
            height: currentLine[0]?.height || 0,
            fontName: currentLine[0]?.fontName || ''
          });
        }
        currentLine = [item];
        currentY = item.transform[5];
      } else {
        currentLine.push(item);
      }
    });
    
    // Add the last line
    if (currentLine.length > 0) {
      lines.push({
        text: currentLine.map(i => i.str).join(' ').trim(),
        items: currentLine,
        y: currentY,
        height: currentLine[0]?.height || 0,
        fontName: currentLine[0]?.fontName || ''
      });
    }
    
    const avgHeight = lines.reduce((sum, line) => sum + line.height, 0) / lines.length;

    lines.forEach((line, index) => {
      const text = line.text;
      const isLargerFont = line.height > avgHeight * 1.2;
      const isShortLine = text.split(' ').length <= 10;
      const isNumbered = /^(Chapter\s+\d+|CHAPTER\s+\d+|\d+\.|Part\s+\d+|Section\s+\d+)/i.test(text);
      const isAllCaps = text === text.toUpperCase() && text.length > 3;
      const hasColonEnd = text.endsWith(':');
      
      if (text.length > 3 && (
        (isLargerFont && isShortLine) ||
        isNumbered ||
        (isAllCaps && isShortLine) ||
        (hasColonEnd && isShortLine)
      )) {
        headings.push({
          text: text,
          pageIndex: 0,
          lineIndex: index,
          confidence: 
            (isLargerFont ? 0.3 : 0) + 
            (isNumbered ? 0.4 : 0) + 
            (isAllCaps ? 0.2 : 0) + 
            (hasColonEnd ? 0.1 : 0)
        });
      }
    });
    
    return headings.filter(h => h.confidence >= 0.3);
  };

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
      const detectedHeadings = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        console.log(`[PDF Import] Extracting text from page ${i}/${pdf.numPages}`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        const pageHeadings = detectHeadings(textContent);
        pageHeadings.forEach(heading => {
          heading.pageIndex = i - 1;
          detectedHeadings.push(heading);
        });
        
        const pageText = textContent.items.map(item => item.str).join(' ');
        pageTexts.push(pageText);
        fullText += pageText + '\n\n';

        setCurrentPage(i);
        setParseProgress((i / pdf.numPages) * 100);
      }

      const wordCount = fullText.split(/\s+/).filter(w => w.length > 0).length;
      console.log('[PDF Import] Text extraction complete. Words:', wordCount, 'Characters:', fullText.length);
      console.log('[PDF Import] Detected headings:', detectedHeadings.length);

      const pdfInfo = {
        numPages: pdf.numPages,
        wordCount,
        fullText,
        pageTexts,
        fileName: file.name,
        detectedHeadings: detectedHeadings.length >= 3 ? detectedHeadings : []
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
    setChunkingStage('analyzing');

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
      const baseTimeout = 30000;
      const sizeMultiplier = Math.ceil(fullText.length / 50000);
      const densityMultiplier = density >= 4 ? 2 : 1;
      const timeout = baseTimeout * sizeMultiplier * densityMultiplier;
      
      console.log('[PDF Import] Sending chunking request to server...');
      console.log('[PDF Import] Timeout set to:', timeout / 1000, 'seconds (size multiplier:', sizeMultiplier, ', density multiplier:', densityMultiplier, ')');

      setTimeout(() => {
        if (busy) {
          setChunkingStage('titles');
        }
      }, 3000);

      const timeoutId = setTimeout(() => controller.abort(), timeout);

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
        const estimatedTime = Math.ceil((baseTimeout * Math.ceil(fullText.length / 50000) * (density >= 4 ? 2 : 1)) / 1000);
        setError(`Processing is taking longer than expected (>${estimatedTime}s). This might be due to the PDF size or selected density. Try a lower density setting or split the PDF into smaller sections.`);
      } else {
        setError('Failed to generate chunks: ' + err.message);
      }
    } finally {
      setBusy(false);
      setChunkingStage('');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      flex: 1
    }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={busy}
      />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <NekoBlock className="primary" style={{ maxWidth: 400 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20 }}>
            <NekoTypo h3 style={{ marginBottom: 10 }}>Upload PDF Document</NekoTypo>
            <NekoTypo p style={{ color: colors.grey, textAlign: 'center', marginBottom: 10 }}>
              Select a PDF file to extract its content and create embeddings
            </NekoTypo>
            
            {/* Show Select PDF button only when no PDF is loaded */}
            {!pdfData && (
              <NekoButton
                className="primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={busy}
                isBusy={busy}
                style={{ height: 50, fontSize: 16, minWidth: 250 }}
              >
                <NekoIcon icon="upload" style={{ marginRight: 8 }} />
                Select PDF
              </NekoButton>
            )}

            {/* Status messages during processing */}
            {busy && (
              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <NekoTypo small style={{ color: colors.grey }}>
                  {!pdfData 
                    ? 'Parsing PDF pages...'
                    : chunkingStage === 'titles' 
                      ? 'Generating descriptive titles...'
                      : 'Creating sections...'}
                </NekoTypo>
                {chunkingDensity >= 4 && pdfData && (
                  <NekoTypo small style={{ color: colors.orange, marginTop: 10 }}>
                    High density setting may take longer
                  </NekoTypo>
                )}
              </div>
            )}

            {/* Results after processing */}
            {pdfData && !busy && chunks.length > 0 && (
              <>
                <div style={{
                  background: colors.lightGrey,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRadius: 8,
                  marginTop: 20,
                  marginBottom: 20,
                  width: '100%'
                }}>
                  <NekoIcon icon="check-circle" width={24} color={colors.green} style={{ marginBottom: 10 }} />
                  <NekoTypo h4 style={{ margin: 0 }}>{pdfData.fileName}</NekoTypo>
                  <NekoTypo small style={{ color: colors.grey, textAlign: 'center', margin: '4px 0' }}>
                    {pdfData.numPages} pages • {pdfData.wordCount.toLocaleString()} words
                  </NekoTypo>
                  <NekoTypo small style={{ color: colors.grey, margin: 0 }}>
                    {chunks.length} sections created
                  </NekoTypo>
                  {pdfData.detectedHeadings?.length > 0 && (
                    <NekoTypo small style={{ color: colors.primary, marginTop: 4 }}>
                      {pdfData.detectedHeadings.length} chapters detected
                    </NekoTypo>
                  )}
                </div>
                
                <NekoButton
                  className="primary"
                  onClick={() => window.dispatchEvent(new CustomEvent('pdf-import-continue'))}
                  style={{ height: 50, fontSize: 16, minWidth: 200 }}
                >
                  Continue
                </NekoButton>
              </>
            )}
          </div>
        </NekoBlock>
      </div>
    </div>
  );
};