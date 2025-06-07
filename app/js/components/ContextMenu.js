// Previous: none
// Current: 2.8.3

const { useEffect, useRef, useState } = wp.element;
import { createPortal } from 'react-dom';
import { useClasses } from '@app/chatbot/helpers';

const ContextMenu = ({ isOpen, anchorEl, onClose, menuItems = [], className = '', theme, context }) => {
  const css = useClasses();
  const menuRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      const menuWidth = 120; // Approximate menu width
      const menuHeight = 80; // Approximate menu height
      
      let top = rect.bottom + 4;
      let left = rect.right - menuWidth;
      
      if (left < 0) left = rect.left;
      if (top + menuHeight > window.innerHeight) {
        top = rect.top - menuHeight - 4;
      }
      
      setPosition({ top, left });
    }
  }, [isOpen, anchorEl]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          anchorEl && !anchorEl.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose, anchorEl]);

  if (!isOpen) return null;

  const menuContent = (
    <div 
      ref={menuRef}
      className={css('mwai-context-menu-portal', {
        [`mwai-${theme?.themeId}-theme`]: theme?.themeId
      })}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 999999
      }}
    >
      <div 
        className={css('mwai-context-menu')}
        style={{
          minWidth: '120px',
          overflow: 'hidden'
        }}
      >
        {menuItems.map((item, index) => {
          if (item.type === 'separator') {
            return (
              <div 
                key={item.id || `separator-${index}`}
                className={css('mwai-menu-separator')}
                style={{
                  height: '1px',
                  margin: '4px 0',
                  background: 'var(--mwai-backgroundPrimaryColor, rgba(0,0,0,0.1))'
                }}
              />
            );
          }
          
          if (item.type === 'title') {
            return (
              <div 
                key={item.id || `title-${index}`}
                className={css('mwai-menu-title')}
                style={{
                  padding: '8px 12px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  opacity: 0.7,
                  textTransform: 'uppercase'
                }}
                dangerouslySetInnerHTML={item.html ? { __html: item.html } : undefined}
              >
                {!item.html && item.label}
              </div>
            );
          }
          
          const Icon = item.icon;
          
          if (item.html) {
            return (
              <div 
                key={item.id}
                className={css(item.className || 'mwai-menu-item')} 
                onClick={() => {
                  if (item.onClick) {
                    item.onClick(context);
                    onClose();
                  }
                }}
                style={item.style}
                dangerouslySetInnerHTML={{ __html: item.html }}
              />
            );
          }
          
          return (
            <div 
              key={item.id}
              className={css(item.className || 'mwai-menu-item')} 
              onClick={() => {
                if (item.onClick) {
                  item.onClick(context);
                  onClose();
                }
              }}
              style={item.style}
            >
              {Icon && <Icon size={14} />}
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return createPortal(menuContent, document.body);
};