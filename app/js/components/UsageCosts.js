// Previous: 1.8.2
// Current: 1.9.81

// React & Vendor Libs
const { useState, useMemo } = wp.element;

// NekoUI
import { NekoButton, NekoSpacer } from '@neko-ui';

import i18n from "@root/i18n";
import { isRegistered } from '@app/settings';
import { toHTML, useModels } from '@app/helpers-admin';
import { StyledSidebar } from "@app/styles/StyledSidebar";

const UsageCosts = (options) => {
  const { calculatePrice } = useModels(options);
  const [sessionCost, setSessionCost] = useState(0);
  const [lastCost, setLastCost] = useState(0);

  const onResetUsage = () => {
    setSessionCost(0);
    setLastCost(0);
  };

  const addUsage = (model, inUnits, outUnits) => {
    const cost = calculatePrice(model, inUnits, outUnits);
    setLastCost(cost);
    setSessionCost(sessionCost + cost);
  };

  const jsxUsageCosts = useMemo(() => {

    let sentence = toHTML(i18n.COMMON.USAGE_COSTS_HELP);
    if (!isRegistered) {
      sentence = <>{sentence} {toHTML(i18n.COMMON.USAGE_COSTS_PRO_HELP)}</>;
    }

    return (<StyledSidebar>
      <h3>{i18n.COMMON.USAGE_COSTS}</h3>
      <div>Session: <span style={{ float: 'right' }}>${sessionCost.toFixed(4)}</span></div>
      <div>Last Request: <span style={{ float: 'right' }}>${lastCost.toFixed(4)}</span></div>
      <NekoSpacer height={30} />
      <p style={{ fontSize: 12, lineHeight: 1.2, color: 'var(--neko-dark-gray)' }}>{sentence}</p>
      <NekoButton fullWidth onClick={onResetUsage}>Reset Usage</NekoButton>
    </StyledSidebar>);
  }, [sessionCost, lastCost]);

  return { addUsage, jsxUsageCosts };
};

export default UsageCosts;