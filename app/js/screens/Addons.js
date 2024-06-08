// Previous: none
// Current: 2.3.8

// React & Vendor Libs
const { useState, useEffect, useMemo } = wp.element;
import Styled from "styled-components";

// NekoUI
import { NekoPage, NekoWrapper, NekoTypo, NekoSpacer,
  NekoButton, NekoContainer, NekoQuickLinks, NekoLink } from '@neko-ui';

import { AiNekoHeader } from "@app/styles/CommonStyles";
import i18n from '@root/i18n';

const StyledAddonsContainer = Styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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

  return (
    <NekoPage nekoErrors={[]}>

      <AiNekoHeader title={i18n.COMMON.ADDONS} />

      <NekoWrapper>

        <div style={{ display: 'flex', flexDirection: 'column', margin: 20 }}>

          <NekoQuickLinks name="filter" value={filter} onChange={(value) => setFilter(value)}>
            <NekoLink title="All" value="all" />
            <NekoLink title="Enabled" value="enabled" />
            <NekoLink title="Disabled" value="disabled" />
          </NekoQuickLinks>

          <NekoSpacer />

          <StyledAddonsContainer>
            {filteredAddons.map(addon => (
              <NekoContainer key={addon.id} footer={<>
                  <span style={{ fontSize: '10px', color: '#666', marginRight: 10 }}>
                    {addon.enabled ? <label>Enabled</label> : <label>Not Enabled</label>}
                  </span>
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
                </>
              }>
                <NekoTypo h3>{addon.name}</NekoTypo>
                <div className="addon-description">
                  {addon.description}
                </div>
              </NekoContainer>
            ))}
          </StyledAddonsContainer>

        </div>

      </NekoWrapper>
      
    </NekoPage> 
  );
};

export default Addons;
