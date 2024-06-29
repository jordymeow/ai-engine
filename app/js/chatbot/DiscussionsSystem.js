// Previous: 1.6.81
// Current: 2.4.5

import { DiscussionsContextProvider } from '@app/chatbot/DiscussionsContext';
import DiscussionsUI from '@app/chatbot/DiscussionsUI';

const DiscussionsSystem = (props) => {
  return (<DiscussionsContextProvider {...props}>
    <DiscussionsUI {...props} />
  </DiscussionsContextProvider>
  );
};

export default DiscussionsSystem;
