// Previous: none
// Current: 1.3.90

// React & Vendor Libs
const { useState } = wp.element;
import { apiUrl, restNonce, session, options } from '@app/settings';

// NekoUI
import { NekoWrapper, NekoBlock, NekoSpacer, NekoColumn, NekoTextArea, NekoTypo,
  NekoButton, NekoSelect, NekoOption, NekoTabs, NekoTab } from '@neko-ui';
import { nekoFetch } from '@neko-ui';

const Chatbot = () => {
  const [busy, setBusy] = useState(false);

  return (<>
    <NekoWrapper>
      <NekoColumn minimal>
        <NekoBlock title="Preview" className="primary">
        </NekoBlock>
      </NekoColumn>
    </NekoWrapper>
  </>);
};

export default Chatbot;
