// Previous: 2.6.9
// Current: 2.9.7

// React & Vendor Libs
const { useState, useMemo } = wp.element;
import Styled from "styled-components";

// NekoUI
import { NekoLogo, NekoTypo, NekoSpacer, NekoToolbar, NekoWrapper, NekoColumn,
  NekoButton, NekoContainer, NekoQuickLinks, NekoLink } from '@neko-ui';

import i18n from '@root/i18n';

const StyledAddonsContainer = Styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
`;

const Addons = ({ addons }) => {
  const initialFilter = addons.some(addon => addon.enabled) ? "enabled" : "all";
  const [filter, setFilter] = useState(initialFilter);

  const filteredAddons = useMemo(() => {
    if (filter === "enabled") {
      return addons.filter(addon => addon.enabled);
    } else if (filter === "disabled") {
      return addons.filter(addon => !addon.enabled);
    }
    return addons;
  }, [addons, filter]);

  return (<>
    <NekoToolbar>
      <NekoQuickLinks name="filter" value={filter} onChange={(value) => setFilter(value)}>
        <NekoLink title="All" value="all" />
        <NekoLink title="Enabled" value="enabled" />
        <NekoLink title="Disabled" value="disabled" />
      </NekoQuickLinks>
    </NekoToolbar>

    <NekoSpacer />

    <StyledAddonsContainer>
      {filteredAddons.map(addon => (
        <NekoContainer key={addon.id} style={{ marginBottom: 0, borderRadius: 8, overflow: 'auto' }} footer={
          <div style={{ display: 'flex', width: '100%', alignItems: 'center', marginLeft: 10, minHeight: 30 }}>
            <span style={{ fontSize: '12px', marginRight: 15, color: addon.enabled ? '#4CAF50' : '#666',
              textTransform: 'uppercase', fontWeight: 'bold' }}>
              {addon.enabled ? <label>Enabled</label> : <label>Disabled</label>}
            </span>
            <div style={{ flex: 'auto' }} />
            {addon.enabled && addon.settings_url && (
              <NekoButton className="primary" onClick={() => window.open(addon.settings_url, '_self')}>
                  Settings
              </NekoButton>
            )}
            {!addon.enabled && (
              <NekoButton className="primary" onClick={() => window.open(addon.install_url, '_blank')}>
                  Install
              </NekoButton>
            )}
          </div>
        }>
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ width: 32, marginTop: -5 }}><NekoLogo /></div>
            <NekoTypo h3 style={{ margin: 0, marginLeft: 8, fontWeight: 'bold' }}>{addon.name}</NekoTypo>
            <div style={{ marginLeft: 5, marginTop: 2, fontSize: 15, color: '#fec74c' }}>
              {// Based on addon.stars, display many ★}
                Array.from({ length: addon.stars }, (_, i) => (
                  <span key={i}>★</span>
                ))}
            </div>
          </div>
          <div className="addon-description">
            {addon.description}
          </div>
        </NekoContainer>
      ))}
    </StyledAddonsContainer>
  </>);
};

export default Addons;
