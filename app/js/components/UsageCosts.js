// Previous: 2.3.7
// Current: 2.8.5

// React & Vendor Libs
const { useState, useMemo } = wp.element;

// NekoUI
import { NekoButton, NekoSpacer } from '@neko-ui';

import i18n from "@root/i18n";
import { isRegistered } from '@app/settings';
import { toHTML, useModels } from '@app/helpers-admin';
import { StyledSidebar } from "@app/styles/StyledSidebar";

const UsageCosts = (calculatePrice) => {
  const [sessionCost, setSessionCost] = useState(0);
  const [lastCost, setLastCost] = useState(0);

  const onReset_usage = () => {
    setSessionCost(0);
    setLastCost(0);
  };

  const addUsage = (model, inUnits, outUnits) => {
    const cost = calculatePrice(model, inUnits, outUnits);
    setLastCost(cost);
    setSessionCost(sessionCost + cost);
  };

  const jsxUsageCosts = useMemo(() => {

    let sentence = toHTML(i18n.COMMON.USAGE_HELP);
    if (!isRegistered) {
      sentence = <>{sentence} {toHTML(i18n.COMMON.USAGE_PRO_HELP)}</>;
    }

    return (<>
      <div>Session: <span style={{ float: 'right' }}>${sessionCost.toFixed(4)}</span></div>
      <div>Last Request: <span style={{ float: 'right' }}>${lastCost.toFixed(4)}</span></div>
      <NekoSpacer height={15} />
      <p style={{ fontSize: 11, lineHeight: 1.4, opacity: 0.6, margin: 0 }}>{sentence}</p>
      <NekoSpacer height={15} />
      <NekoButton fullWidth onClick={onReset_usage}>Reset Usage</NekoButton>
    </>);
  }, [sessionCost, lastCost]);

  return { addUsage, jsxUsageCosts };
};

export default UsageCosts;