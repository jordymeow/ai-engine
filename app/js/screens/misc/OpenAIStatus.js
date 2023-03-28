// Previous: 1.3.81
// Current: 1.3.85

// React & Vendor Libs
const { useState, useEffect, useMemo } = wp.element;
import Styled from "styled-components";

// NekoUI
import { NekoIcon, NekoTypo } from '@neko-ui';

const StyledIncidents = Styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  width: 100%;
  margin-top: -20px;

  h3 {
    font-size: 15px;
    color: white;
    padding-bottom: 10px;
    border-bottom: 1px solid white;
  }

  .description {
    color: white;
    border-radius: 5px;

    p {
      small {
        color: var(--neko-yellow);
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
  const accidentsPastDay = useMemo(() => incidents?.filter(x => {
    const incidentDate = new Date(x.date);
    return incidentDate > new Date(Date.now() - 24 * 60 * 60 * 1000);
  }).length, [incidents]);
  
  return (
    <div style={{ padding: "0px 10px 10px 10px" }}>
      <h2 style={{ color: 'white', fontFamily: '-apple-system,BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: 18, fontWeight: 'normal', display: 'flex' }}>
        <NekoIcon style={{ marginTop: -3, marginLeft: -2, marginRight: 5, float: 'left' }}
          width="24" icon={accidentsPastDay > 0 ? 'alert' : 'info-outline'}
          variant={accidentsPastDay > 0 ? 'warning' : ''} />
        Incidents (Open AI)
      </h2>
      <NekoTypo p style={{ color: 'white' }}>
        Only the incidents which occured <b>less than a week ago</b> are displayed. The time difference between the PST time used by OpenAI and your local time is {timeDiff} hours.
      </NekoTypo>
      <StyledIncidents>
        {isLoading && <div>Loading...</div>}
        {incidents && incidents.map(incident => (
          <div key={incident.guid}>
            <h3>{incident.date}: {incident.title}</h3>
            <div className="description" dangerouslySetInnerHTML={{ __html: incident.description }}></div>
          </div>
        ))}
      </StyledIncidents>
    </div>
  );
};

export default OpenAIStatus;
