// Previous: 2.4.5
// Current: 2.6.8

import { useChatbotContext } from "./ChatbotContext";
import { useClasses } from "./helpers";

// React & Vendor Libs
const { useState, useMemo, useRef } = wp.element;

const ChatUploadIcon = () => {
  const css = useClasses();
  const { state, actions } = useChatbotContext();
  const { uploadedFile, busy, imageUpload, fileUpload, fileSearch, draggingType } = state;
  const { onUploadFile } = actions;
  const [ isHovering, setIsHovering ] = useState(false);

  const fileInputRef = useRef();
  const hasUploadedFile = uploadedFile?.uploadedId;
  const uploadEnabled = imageUpload || fileSearch || fileUpload;

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  const resetUpload = () => onUploadFile(null);

  const handleClick = () => {
    if (uploadedFile?.localFile) {
      resetUpload();
      return;
    }
    if (!busy) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) onUploadFile(file);
  };

  const file = uploadedFile;

  const type = useMemo(() => {
    if (file?.localFile) {
      return file.localFile.type.startsWith('image/') ? 'image' : 'document';
    }
    return draggingType;
  }, [file, draggingType]);

  const imgClass = useMemo(() => {
    let status = 'idle';
    if (file?.uploadProgress) {
      status = 'up';
    }
    else if (draggingType) {
      status = 'add';
    }
    else if (isHovering && hasUploadedFile) {
      status = 'del';
    }
    else if (hasUploadedFile) {
      status = 'ok';
    }
    else if (isHovering && !hasUploadedFile) {
      status = 'add';
    }

    const typeClass = type ? type.toLowerCase() : 'idle';
    return `mwai-file-upload-icon mwai-${typeClass}-${status}`;
  }, [type, file, draggingType, isHovering, hasUploadedFile]);

  const uploadProgress = useMemo(() => {
    if (file?.uploadProgress) {
      if (file.uploadProgress > 99) {
        return 99;
      }
      return Math.round(file.uploadProgress);
    }
    return "";
  }, [file]);

  return uploadEnabled ? (
    <div disabled={busy} onClick={handleClick}
      onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
      className={css('mwai-file-upload', {
        'mwai-enabled': uploadedFile?.uploadedId,
        'mwai-busy': uploadedFile?.localFile && !uploadedFile?.uploadedId,
      })}
      style={{ cursor: busy ? 'default' : 'pointer' }}>
      <div className={imgClass}>
        <span className="mwai-file-upload-progress">
          {uploadProgress}
        </span>
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
    </div>
  ) : null;
};

export default ChatUploadIcon;