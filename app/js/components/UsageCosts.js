// Previous: 2.9.7
// Current: 3.0.7

// React & Vendor Libs
const { useState, useMemo } = wp.element;

// NekoUI
import { NekoButton, NekoSpacer } from '@neko-ui';

import i18n from "@root/i18n";
import { isRegistered } from '@app/settings';
import { toHTML, useModels, formatWithLink } from '@app/helpers-admin';
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
      const proHelp = formatWithLink(
        i18n.COMMON.USAGE_PRO_HELP,
        i18n.COMMON.USAGE_PRO_HELP_URL,
        i18n.COMMON.USAGE_PRO_HELP_LINK_TEXT
      );
      sentence = <>{sentence} {proHelp}</>;
    }

    return (<>
      <div>{i18n.COMMON.SESSION}: <span style={{ float: 'right' }}>${sessionCost.toFixed(4)}</span></div>
      <div>{i18n.COMMON.LAST_REQUEST}: <span style={{ float: 'right' }}>${lastCost.toFixed(4)}</span></div>
      <NekoSpacer height={15} />
      <p style={{ fontSize: 11, lineHeight: 1.4, opacity: 0.6, margin: 0 }}>{sentence}</p>
      <NekoSpacer height={15} />
      <NekoButton fullWidth onClick={onReset_usage}>{i18n.COMMON.RESET_USAGE}</NekoButton>
    </>);
  }, [sessionCost, lastCost]);

  return { addUsage, jsxUsageCosts };
};

export default UsageCosts;