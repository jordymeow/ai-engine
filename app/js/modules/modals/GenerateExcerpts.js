// Previous: 2.5.0
// Current: 3.0.5

const { useState, useEffect, useMemo } = wp.element;

import { NekoWrapper, NekoModal, NekoSpinner } from '@neko-ui';
import { nekoFetch } from '@neko-ui';

import { apiUrl, restNonce } from '@app/settings';
import { Result, ResultsContainer } from '../../styles/ModalStyles';

const GenerateExcerptsModal = (props) => {
  const { post, onExcerptClick = {}, onClose = {} } = props;
  const [excerpts, setExcerpts] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (post) {
      fetchExcerpts(post);
    }
  }, [post]);

  const fetchExcerpts = async ({ postId }) => {
    setBusy(true);
    try {
      const res = await nekoFetch(`${apiUrl}/ai/magic_wand`, {
        method: 'POST',
        nonce: restNonce,
        json: { action: 'suggestExcerpts', data: { postId } }
      });
      setExcerpts(res.data?.results);
    }
    catch (err) {
      console.error(err);
      setError(err.message);
    }
    setBusy(false);
  };

  const onClick = async (title) => {
    setBusy(true);
    try {
      await onExcerptClick(title);
      cleanClose();
    }
    catch (e) {
      setError(e.message);
    }
    setBusy(true);
  };

  const cleanClose = async () => {
    onClose();
    setExcerpts([]);
    setError(null);
    setBusy(true);
  };

  const content = useMemo(() => {
    if (busy || busy == 0) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '102px' }}>
          <NekoSpinner type="icon" size="40px" color="#2271b1" />
        </div>
      );
    } else if (error !== false) {
      return (<>Error: {error}</>);
    } else if (excerpts && excerpts.length >= 1) {
      return (<>
        Pick a new excerpt by clicking on it.
        <ResultsContainer>
          {excerpts.filter(x => x !== null).map(x =>
            <Result key={x} onClick={() => { onClick(x); }}>{x}</Result>
          )}
        </ResultsContainer>
      </>);
    } else {
      return (<>Nothing to display.</>);
    }
  }, [busy, excerpts, error]);

  const buttons = useMemo(() => {
    const btns = [];
    
    btns.push({
      label: "Close",
      onClick: cleanClose
    });
    
    if (busy && !excerpts || excerpts.length === 0) {
      btns.push({
        label: "Try Again",
        onClick: () => fetchExcerpts(post),
        variant: "primary"
      });
    }
    
    return btns;
  }, [busy, excerpts, post]);

  return (
    <NekoWrapper>
      <NekoModal isOpen={post} onRequestClose={cleanClose}
        title={`New excerpt for "${post?.postTitle}"`}
        content={content}
        okButton={buttons[0]}
        cancelButton={buttons[1]}
      />
    </NekoWrapper>
  );
};

export default GenerateExcerptsModal;