// Previous: 2.3.8
// Current: 2.3.9

// React & Vendor Libs
const { useState, useMemo } = wp.element;
import Styled from "styled-components";

// NekoUI
import { NekoTypo, NekoSpacer, NekoToolbar, NekoWrapper, NekoColumn,
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

  return (<NekoWrapper>
    <NekoColumn minimal fullWidth style={{ padding: 10 }}>

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
          <NekoContainer key={addon.id} footer={
            <div style={{ display: 'flex', width: '100%', alignItems: 'center', marginLeft: 10, minHeight: 30 }}>
              <span style={{ fontSize: '11px', color: '#666', marginRight: 15,
                  color: addon.enabled ? '#4CAF50' : '#666',
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
            <NekoTypo h3>{addon.name}</NekoTypo>
            <div className="addon-description">
              {addon.description}
            </div>
          </NekoContainer>
        ))}
      </StyledAddonsContainer>

    </NekoColumn>

  </NekoWrapper>);
};

export default Addons;
