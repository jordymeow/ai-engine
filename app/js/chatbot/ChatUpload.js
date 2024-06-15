// Previous: 2.3.5
// Current: 2.3.9

// React & Vendor Libs
const { useState, useMemo, useImperativeHandle, useRef } = wp.element;

const ChatUpload = React.forwardRef(({ onUploadFile, uploadedFile, draggedType,
  disabled, style, modCss, ...rest }, ref) => {
  const fileInputRef = useRef();
  const [isHovering, setIsHovering] = useState(false);
  const hasUploadedFile = uploadedFile?.uploadedId;

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  const handleExternalFile = (file) => onUploadFile(file);
  const resetUpload = () => onUploadFile(null);
  useImperativeHandle(ref, () => ({ handleExternalFile }));

  const handleClick = () => {
    if (uploadedFile?.localFile) {
      resetUpload();
      return;
    }
    if (!disabled) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) onUploadFile(file);
  };

  // Mock uploadedFile for testing
  // const mockUploadedFile = {
  //   localFile: { type: 'image/png' },
  //   uploadedId: '123',
  //   uploadProgress: 83.39
  // };
  const file = uploadedFile;

  const type = useMemo(() => {
    if (file?.localFile) {
      return file.localFile.type.startsWith('image/') ? 'image' : 'document';
    }
    return draggedType;
  }, [file, draggedType]);

  const imgClass = useMemo(() => {
    let status = 'idle';
    if (file?.uploadProgress) {
      status = 'up';
    }
    else if (draggedType) {
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
    return modCss(['mwai-file-upload-icon', `mwai-${typeClass}-${status}`]);
  }, [type, file, draggedType, isHovering, hasUploadedFile, modCss]);

  // Calculate the UploadProgress Value
  const uploadProgress = useMemo(() => {
    if (file?.uploadProgress) {
      if (file.uploadProgress > 99) {
        return 99;
      }
      return Math.round(file.uploadProgress);
    }
    return "";
  }, [file]);
  
  return (
    <div disabled={disabled} onClick={handleClick}
      onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
      style={{ cursor: disabled ? 'default' : 'pointer', ...style }} {...rest}>
      <div className={imgClass}>
        <span className="mwai-file-upload-progress">
          {uploadProgress}
        </span>
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
    </div>
  );
});

export default ChatUpload;
