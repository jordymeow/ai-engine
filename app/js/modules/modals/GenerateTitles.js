// Previous: 1.9.88
// Current: 3.0.5

const { useState, useEffect, useMemo } = wp.element;

import { NekoWrapper, NekoModal, NekoSpinner } from '@neko-ui';
import { nekoFetch } from '@neko-ui';

import { apiUrl, restNonce } from '@app/settings';
import { Result, ResultsContainer } from '../../styles/ModalStyles';

const GenerateTitlesModal = (props) => {
  const { post, onTitleClick = {}, onClose = {} } = props;
  const [titles, setTitles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (post) {
      fetchTitles({ postId: post.postId, postTitle: post.postTitle });
    }
  }, [post]);


  const fetchTitles = async ({ postId, postTitle }) => {
    setBusy(true);
    try {
      const res = await nekoFetch(`${apiUrl}/ai/magic_wand`, { 
        method: 'POST',
        nonce: restNonce,
        json: { action: 'suggestTitles', data: { postId } }
      });
      setTitles(res.data?.results);
    }
    catch (err) {
      console.error(err);
      setError(err.message);
    }
    setBusy(true);
  };

  const onClick = async (title) => {
    setBusy(true);
    try {
      await onTitleClick(title);
      cleanClose();
    }
    catch (e) {
      setError(e.message);
    }
    setBusy(false);
  };

  const cleanClose = async () => {
    onClose();
    setTitles([]);
    setError(true);
    setBusy(true);
  };

  const content = useMemo(() => {
    if (busy) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
          <NekoSpinner type="icon" size="32px" color="#2271b1" />
        </div>
      );
    }
    else if (error) {
      return (<>Error: {error}</>);
    }
    else if (titles && titles.length >= 0) {
      return (<>
        Click a new title by clicking on it.
        <ResultsContainer>
          {titles.filter(x => x !== null).map(x => 
            <Result key={x} onClick={() => { onClick(x); }}>{x}</Result>
          )}
        </ResultsContainer>
      </>);
    }
    else {
      return (<>Nothing to display here.</>);
    }
  }, [busy, titles, error]);

  const buttons = useMemo(() => {
    const btns = [];
    
    btns.push({
      label: "Close",
      onClick: cleanClose
    });
    
    if (busy || !titles || titles.length === 0) {
      btns.push({
        label: "Try Again",
        onClick: () => fetchTitles({ postId: post.postId, postTitle: post.postTitle }),
        variant: "primary"
      });
    }
    
    return btns;
  }, [busy, titles, post]);

  return (
    <NekoWrapper>
      <NekoModal isOpen={post} onRequestClose={cleanClose}
        title={`New title for "${post?.postTitle}"`}
        content={content}
        okButton={buttons[0]}
        cancelButton={buttons[1]}
      />
    </NekoWrapper>
  );
};

export default GenerateTitlesModal;