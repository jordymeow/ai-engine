// Previous: 0.0.3
// Current: 0.3.5

// React & Vendor Libs
const { useState, useEffect, useMemo } = wp.element;

// NekoUI
import { NekoWrapper, NekoModal, NekoSpinner } from '@neko-ui';
import { nekoFetch } from '@neko-ui';

// AI Engine
import { apiUrl, restNonce } from '@app/settings';
import { Result, ResultsContainer } from './ModalStyles';

const GenerateExcerptsModal = (props) => {
  const { post, onExcerptClick = {}, onClose = {} } = props;
  const [excerpts, setExcerpts] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (post) {
      fetchExcerpts(post);
    }
  }, [post])


  const fetchExcerpts = async ({ postId }) => {
    setBusy(true);
    const res = await nekoFetch(`${apiUrl}/make_excerpts`, {
      method: 'POST',
      nonce: restNonce,
      json: { postId }
    });
    if (res.success) {
      setExcerpts(res.data);
    }
    setBusy(false);
  }

  const onClick = async (title) => {
    setBusy(true);
    try {
      await onExcerptClick(title);
      cleanClose();
    }
    catch (e) {
      setError(e.message);
    }
    setBusy(false);
  }

  const cleanClose = async () => {
    onClose();
    setExcerpts([]);
    setError();
    setBusy(false);
  }

  const content = useMemo(() => {
    if (busy) {
      return (<NekoSpinner type="circle" size="10%" />);
    }
    else if (error) {
      return (<>Error: {error}</>);
    }
    else if (excerpts?.length > 0) {
      return (<>
        Pick a new excerpt by clicking on it.
        <ResultsContainer>
          {excerpts.map(x => 
            <Result key={x} onClick={() => { onClick(x) }}>{x}</Result>
          )}
        </ResultsContainer>
      </>);
    }
    else {
      return (<>Nothing to display.</>);
    }
  }, [busy, excerpts, error]);

  return (
    <NekoWrapper>
      <NekoModal isOpen={post} onRequestClose={cleanClose}
        title={`New excerpt for "${post?.postTitle}"`}
        content={content}
        ok="Close"
        onOkClick={cleanClose}
      />
    </NekoWrapper>
  );
};

export default GenerateExcerptsModal;
