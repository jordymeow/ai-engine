// Previous: 2.4.5
// Current: 3.8.1

import { DiscussionsContextProvider } from '@app/chatbot/DiscussionsContext';
import DiscussionsUI from '@app/chatbot/DiscussionsUI';

import { registerTexts } from '@app/chatbot/texts';

const DiscussionsSystem = (props) => {
  registerTexts(props.system?.texts);
  return (<DiscussionsContextProvider {...props}>
    <DiscussionsUI {...props} />
  </DiscussionsContextProvider>
  );
};

export default DiscussionsSystem;
