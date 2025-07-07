// React & Vendor Libs
const { useState, useEffect } = wp.element;

// NekoUI
import { NekoButton, NekoTypo, NekoGauge } from '@neko-ui';
import { nekoFetch } from '@neko-ui';

// From Main Plugin
import { restUrl, restNonce } from '@app/settings';

// Common
import { TabText } from './Dashboard.styled';
const CommonApiUrl = `${restUrl}/meow-common/v1`;

const SpeedTester = ({ request, title, max }) => {
  const [ runRequests, setRunRequests ] = useState(false);
  const [ results, setResults ] = useState([]);
  const resultsTotal = results.length > 0 ? results.reduce(function(a, b) { return a + b; }) : 0;
  const resultsAverage = results.length > 0 ? Math.ceil(resultsTotal / results.length) : 0;
  const isInitializing = !results.length && runRequests;

  useEffect(() => {
    if (!runRequests) {
      return;
    }
    setTimeout(async () => {
      const start = new Date().getTime();
      await nekoFetch(`${CommonApiUrl}/${request}`, {
        method: 'POST',
        nonce: restNonce
      });
      const end = new Date().getTime();
      const time = end - start;
      setResults(x => [ ...x, time ]);
    }, 1000);
  }, [results]);

  const toggleRequestsProcess = () => {
    if (!runRequests) {
      setResults([]);
    }
    setRunRequests(!runRequests);
  };

  return (
    <TabText style={{ width: 200, textAlign: 'center' }}>
      <NekoTypo h2 style={{ color: 'white' }}>{title}</NekoTypo>
      <NekoGauge size={200} value={isInitializing ? max : resultsAverage} max={max}>
        <span style={{ fontSize: 20 }}>{isInitializing ? 'START' : resultsAverage + ' ms'}</span>
        <span style={{ fontSize: 12 }}>{isInitializing ? 'YOUR ENGINE' : results.length + ' requests'}</span>
      </NekoGauge>
      <NekoButton style={{ width: '100%', marginTop: 10 }} color={runRequests ? '#cc3627' : '#ccb027'}
        onClick={toggleRequestsProcess}>
        {runRequests ? 'Stop' : 'Start'}
      </NekoButton>
    </TabText>
  );
};

export { SpeedTester };