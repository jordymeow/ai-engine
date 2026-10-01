// Previous: 3.5.4
// Current: 3.8.3

const { useMemo } = wp.element;
import { useChatbotContext } from '@app/chatbot/ChatbotContext';
import { Trash2 } from 'lucide-react';

const MwaiFiles = () => {
  const { state, actions } = useChatbotContext();
  const { uploadedFiles, uploadedFile, multiUpload } = state;
  const { removeUploadedFile, resetUploadedFile } = actions;

  // With Max Files at 1 the chatbot keeps its file in uploadedFile, not uploadedFiles.
  // It gets the same chip, so a one-file chatbot also shows what is attached before sending.
  const files = multiUpload ? uploadedFiles : ( uploadedFile?.localFile ? [uploadedFile] : [] );
  const removeFile = multiUpload ? removeUploadedFile : () => resetUploadedFile();

  if (files.length === 0) {
    return null;
  }

  const renderFilePreview = (file, index) => {
    const isImage = file.localFile?.type?.startsWith('image/');
    const fileName = file.localFile?.name || 'Unknown file';
    const fileSize = file.localFile?.size ? `${Math.round(file.localFile.size / 1024)}KB` : '';
    
    return (
      <div key={file.tempId || index} className="mwai-file-preview">
        <div className="mwai-file-content">
          {isImage && file.uploadedUrl ? (
            <img src={file.uploadedUrl} alt={fileName} className="mwai-file-thumbnail" />
          ) : (
            <div className="mwai-file-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
          )}
          <div className="mwai-file-info">
            <div className="mwai-file-name">{fileName}</div>
            {fileSize && <div className="mwai-file-size">{fileSize}</div>}
          </div>
          {/* uploadProgress stays a number until the server confirms the upload, so the
              chip keeps showing progress (instead of the trash icon) while the file is
              not actually usable yet. */}
          {file.uploadProgress !== null && file.uploadProgress !== undefined ? (
            <div className="mwai-file-progress">
              <div className="mwai-file-progress-bar" style={{ width: `${Math.min(file.uploadProgress, 100)}%` }}></div>
            </div>
          ) : (
            <button 
              className="mwai-file-remove" 
              onClick={() => removeFile(index)}
              aria-label="Remove file"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mwai-files">
      {files.map((file, index) => renderFilePreview(file, index))}
    </div>
  );
};

export default MwaiFiles;