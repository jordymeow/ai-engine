// Previous: none
// Current: 2.9.7

const { useMemo } = wp.element;
import { useChatbotContext } from '@app/chatbot/ChatbotContext';
import { Trash2 } from 'lucide-react';

const MwaiFiles = () => {
  const { state, actions } = useChatbotContext();
  const { uploadedFiles, multiUpload } = state;
  const { removeUploadedFile } = actions;


  // Don't render if multiUpload is disabled or no files uploaded
  if (!multiUpload || uploadedFiles.length === 0) {
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
          {file.uploadProgress !== null && file.uploadProgress < 100 ? (
            <div className="mwai-file-progress">
              <div className="mwai-file-progress-bar" style={{ width: `${file.uploadProgress}%` }}></div>
            </div>
          ) : (
            <button 
              className="mwai-file-remove" 
              onClick={() => removeUploadedFile(index)}
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
      {uploadedFiles.map((file, index) => renderFilePreview(file, index))}
    </div>
  );
};

export default MwaiFiles;