// Previous: none
// Current: 2.3.5

const { useState, useEffect, useMemo, useImperativeHandle, useRef } = wp.element;

// AI Engine
import { useChatbotContext } from "./ChatbotContext";

const ChatUpload = React.forwardRef(({ onUploadFile, uploadedFile, draggedType,
    disabled, style, modCss, ...rest }, ref) => {
  const { state } = useChatbotContext();
  const { pluginUrl } = state;
  const fileInputRef = useRef();
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  const handleExternalFile = (file) => onUploadFile(file);
  const resetUpload = () => onUploadFile(null);

  const svgImages = useMemo(() => {
    return {
      idle: `${pluginUrl}/images/idle.svg`,
      idleAdd: `${pluginUrl}/images/idle-add.svg`,
      document: `${pluginUrl}/images/document.svg`,
      documentAdd: `${pluginUrl}/images/document-add.svg`,
      documentDel: `${pluginUrl}/images/document-del.svg`,
      documentOk: `${pluginUrl}/images/document-ok.svg`,
      documentUp: `${pluginUrl}/images/document-up.svg`,
      image: `${pluginUrl}/images/image.svg`,
      imageAdd: `${pluginUrl}/images/image-add.svg`,
      imageDel: `${pluginUrl}/images/image-del.svg`,
      imageOk: `${pluginUrl}/images/image-ok.svg`,
      imageUp: `${pluginUrl}/images/image-up.svg`
    };
  }, [pluginUrl]);

  // Preload images after 2 seconds
  useEffect(() => {
    const preloadTimeout = setTimeout(() => {
      const preloadedImages = [];
      Object.values(svgImages).forEach(src => {
        const img = new Image();
        img.src = src;
        preloadedImages.push(img);
      });
    }, 2000);
    return () => clearTimeout(preloadTimeout);
  }, [svgImages]);

  const type = useMemo(() => {
    if (uploadedFile?.localFile) {
      return uploadedFile.localFile.type.startsWith('image/') ? 'image' : 'document';
    }
    return draggedType;
  }, [uploadedFile, draggedType]);

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

  const hasUploadedFile = uploadedFile?.uploadedId;

  const status = useMemo(() => {
    if (uploadedFile?.uploadProgress) return 'Up';
    if (draggedType) return 'Add';
    if (isHovering && hasUploadedFile) return 'Del';
    if (hasUploadedFile) return 'Ok';
    if (isHovering && !hasUploadedFile) return 'Add';
    return 'Idle';
  }, [uploadedFile, draggedType, isHovering]);

  const svgImg = useMemo(() => {
    if (!type) {
      return svgImages[status === 'Add' ? 'idleAdd' : 'idle'];
    }
    return svgImages[`${type}${status}`] || svgImages['idle'];
  }, [type, status]);

  const imgClass = useMemo(() => {
    if (!type) {
      return modCss(`mwai-idle-${status.toLowerCase()}`);
    }
    return modCss(`mwai-${type.toLowerCase()}-${status.toLowerCase()}`);
  }, [type, status]);

  return (
    <div disabled={disabled} onClick={handleClick}
      onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
      style={{ cursor: disabled ? 'default' : 'pointer', ...style }} {...rest}>
      <img src={svgImg} alt="Upload a Document or an Image" className={imgClass} />
      <span>{uploadedFile?.uploadProgress && `${Math.round(uploadedFile.uploadProgress)}`}</span>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
    </div>
  );
});

export default ChatUpload;