// Previous: none
// Current: 0.4.8

// React & Vendor Libs
const { useState, useEffect, useMemo } = wp.element;
import Styled from "styled-components";

// NekoUI
import { NekoWrapper, NekoTypo, NekoColumn, NekoTheme } from '@neko-ui';

const StyledIncidents = Styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  width: 100%;
  margin-top: -20px;

  h3 {
    color: white;
  }

  .description {
    background: white;
    color: black;
    padding: 8px 10px;
    border-radius: 5px;

    p {
      small {
        color: ${NekoTheme.orange};
        font-size: 13px;
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
    <div style={{ padding: "0px 10px 10px 10px" }}>
      <NekoTypo p style={{ color: 'white' }}>
        Only the incidents which occured <b>less than a week ago</b> are displayed here. For your information, the time difference between the PST time used by OpenAI and your local time is {timeDiff} hours.
      </NekoTypo>
      <StyledIncidents>
        {isLoading && <div>Loading...</div>}
        {incidents && incidents.map(incident => (
          <div key={incident.guid}>
            <h3>⚠️ {incident.date}: {incident.title}</h3>
            <div className="description" dangerouslySetInnerHTML={{ __html: incident.description }}></div>
          </div>
        ))}
      </StyledIncidents>
    </div>
  );
};

export default OpenAIStatus;
