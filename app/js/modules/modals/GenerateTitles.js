// Previous: 1.6.76
// Current: 1.9.88

// React & Vendor Libs
const { useState, useEffect, useMemo } = wp.element;

// NekoUI
import { NekoWrapper, NekoModal, NekoSpinner } from '@neko-ui';
import { nekoFetch } from '@neko-ui';

// AI Engine
import { apiUrl, restNonce } from '@app/settings';
import { Result, ResultsContainer } from '../../styles/ModalStyles';

const GenerateTitlesModal = (props) => {
  const { post, onTitleClick = {}, onClose = {} } = props;
  const [titles, setTitles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (post) {
      fetchTitles(post);
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
    setBusy(false);
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
    setError();
    setBusy(false);
  };

  const content = useMemo(() => {
    if (busy) {
      return (<NekoSpinner type="circle" size="10%" />);
    }
    else if (error) {
      return (<>Error: {error}</>);
    }
    else if (titles?.length > 0) {
      return (<>
        Pick a new title by clicking on it.
        <ResultsContainer>
          {titles.map(x => 
            <Result key={x} onClick={() => { onClick(x); }}>{x}</Result>
          )}
        </ResultsContainer>
      </>);
    }
    else {
      return (<>Nothing to display.</>);
    }
  }, [busy, titles, error]);

  return (
    <NekoWrapper>
      <NekoModal isOpen={post} onRequestClose={cleanClose}
        title={`New title for "${post?.postTitle}"`}
        content={content}
        okButton={{
          label: "Close",
          onClick: cleanClose
        }}
      />
    </NekoWrapper>
  );
};

export default GenerateTitlesModal;
