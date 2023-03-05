// Previous: none
// Current: 1.2.2

// React & Vendor Libs
const { useState, useMemo } = wp.element;

// NekoUI
import { NekoButton, NekoSpacer } from '@neko-ui';

import i18n from "../../i18n";
import { useModels } from '../helpers';
import { StyledSidebar } from "../styles/StyledSidebar";

const UsageCosts = (options) => {
  const { calculatePrice } = useModels(options);
  const [sessionCost, setSessionCost] = useState(0);
  const [lastCost, setLastCost] = useState(0);

  const onResetUsage = () => {
    setSessionCost(0);
    setLastCost(0);
  }

  const addUsage = (model, units) => {
    const cost = calculatePrice(model, units);
    setLastCost(cost);
    setSessionCost(sessionCost + cost);
  }

  const jsxUsageCosts = useMemo(() => {
    return (<StyledSidebar>
      <h3>{i18n.COMMON.USAGE_COSTS}</h3>
      <p>{i18n.HELP.USAGE_COST}</p>
      <div>Session: <span style={{ float: 'right' }}>${sessionCost.toFixed(4)}</span></div>
      <div>Last Request: <span style={{ float: 'right' }}>${lastCost.toFixed(4)}</span></div>
      <NekoSpacer height={30} />
      <NekoButton fullWidth onClick={onResetUsage}>Reset Usage</NekoButton>
    </StyledSidebar>)
  }, [sessionCost, lastCost]);

  return { addUsage, jsxUsageCosts };
}

export default UsageCosts;