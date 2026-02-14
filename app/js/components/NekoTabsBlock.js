// Previous: none
// Current: 3.3.7

/**
 * NekoTabsBlock
 *
 * Wrapper for NekoTabs used as top-level settings sections (like NekoBlock).
 * NekoBlock (with className="primary") has built-in padding: 8px and
 * margin-bottom: 15px, but NekoTabs has neither. This wrapper ensures
 * consistent spacing and width when NekoTabs sits alongside NekoBlock
 * sections on settings pages.
 */

const NekoTabsBlock = ({ children, style, ...rest }) => {
  return (
    <div style={{ padding: 8, marginBottom: 15, ...style }} {...rest}>
      {children}
    </div>
  );
};

export default NekoTabsBlock;
