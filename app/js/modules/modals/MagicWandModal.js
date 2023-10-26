// Previous: 1.3.93
// Current: 1.9.91

// React & Vendor Libs
const { useState, useEffect, useMemo } = wp.element;

// NekoUI
import { NekoUI, NekoWrapper, NekoModal, NekoSpinner } from '@neko-ui';

// AI Engine
import { Result, ResultsContainer } from '../../styles/ModalStyles';

const MagicWandModal = (props) => {
  const { isOpen = false, title, error, results, busy = false, onClick = () => {} } = props;

  const createHash = (str) => {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  const content = useMemo(() => {
    if (busy) {
      return (<NekoSpinner type="circle" size="10%" />);
    }
    else if (error) {
      return (<>Error: {error}</>);
    }
    else if (results?.length > 0) {
      return (<>
        Pick one of those results:
        <ResultsContainer>
          {results.map(x => 
            <Result key={createHash(x)} onClick={() => { onClick(x) }}>{x}</Result>
          )}
        </ResultsContainer>
      </>);
    }
    else {
      return (<>Nothing to display.</>);
    }
  }, [results, error]);

  return (
    <NekoUI>
      <NekoWrapper>
        <NekoModal
          isOpen={isOpen}
          title={title ?? "Results"}
          content={content}
          onRequestClose={() => onClick()}
          okButton={{
            label: "Close",
            onClick: () => onClick()
          }}
        />
      </NekoWrapper>
    </NekoUI>
  );
};

export default MagicWandModal;
