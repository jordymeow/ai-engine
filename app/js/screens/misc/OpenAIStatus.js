// Previous: 1.3.85
// Current: 1.5.3

// React & Vendor Libs
const { useMemo } = wp.element;
import Styled from "styled-components";

// NekoUI
import { NekoTypo } from '@neko-ui';

const StyledIncidents = Styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 290px;
  overflow: auto;
  box-sizing: border-box;
  padding: 15px;

  h3 {
    margin-top: 20px;
    padding-bottom: 5px;
    font-size: 14px;
    border-bottom: 1px solid black;
  }

  .description {
    border-radius: 5px;

    p {
      small {
        color: var(--neko-blue);
        font-size: 12px;
      }
    }

    p:first-child {
      margin-top: 0;
    }

    p:last-child {
      margin-bottom: 0;
    }
  }
`;

function getPSTLocalTimeDifference() {
  let now = new Date();
  let pst = new Date(now.toLocaleString('en-US', {timeZone: 'America/Los_Angeles'}));
  let offset = (now - pst) / 3600000;
  return offset.toFixed(0);
}

const OpenAIStatus = ({ incidents, isLoading }) => {
  const timeDiff = getPSTLocalTimeDifference();
  
  return (
    <StyledIncidents>
      <NekoTypo>
        Only the incidents which occured <b>less than a week ago</b> are displayed. The time difference between the PST time used by OpenAI and your local time is {timeDiff} hours.
      </NekoTypo>
        {!isLoading && !incidents.length && <p><i>Currently no incidents.</i></p>}
        {incidents && incidents.map(incident => (
          <div key={incident.guid}>
            <h3>{incident.date}: {incident.title}</h3>
            <div className="description" dangerouslySetInnerHTML={{ __html: incident.description }}></div>
          </div>
        ))}
    </StyledIncidents>
  );
};

export default OpenAIStatus;
