// Previous: none
// Current: 3.8.1

// NekoUI
import { NekoInput, NekoAccordion, NekoSelect, NekoOption, NekoColorPicker } from '@neko-ui';

import i18n from '@root/i18n';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";

// The defaults live in themes/sass/glass.scss. A setting is only sent once it has been changed,
// so an untouched Glass keeps following the stylesheet.
const LIGHTS = [
  { id: 'glassHue1', label: 'Light 1', fallback: '#7c5cff' },
  { id: 'glassHue2', label: 'Light 2', fallback: '#22c8ee' },
  { id: 'glassHue3', label: 'Light 3', fallback: '#ff6fb5' },
  { id: 'glassHue4', label: 'Light 4', fallback: '#ffb45e' },
];

const GlassTheme = (props) => {
  const { settings, onUpdateSettings } = props;

  return (<>
    <StyledBuilderForm>
      <p style={{ margin: '0 0 15px 0', opacity: 0.8, fontSize: '13px', lineHeight: 1.5 }}>
        Coloured light under frosted glass, dark by default. Four lights drift under the window:
        change them and the glow, the ring around the avatar and the launcher all follow.
      </p>
      <NekoAccordion title={i18n.COMMON.STYLE} isCollapsed={false} />

      <div className="mwai-builder-row">
        <div className="mwai-builder-col">
          <label>Mode:</label>
          <NekoSelect scrolldown id="glassMode" name="glassMode"
            value={settings?.glassMode ?? 'night'} onChange={onUpdateSettings}>
            <NekoOption value="night" label="Night" />
            <NekoOption value="light" label="Light" />
            <NekoOption value="auto" label="Follow the visitor's device" />
          </NekoSelect>
        </div>
      </div>

      <div className="mwai-builder-row">
        {LIGHTS.map(light => (
          <div className="mwai-builder-col" key={light.id}>
            <label>{light.label}:</label>
            <div style={{ display: 'flex' }}>
              <NekoInput id={light.id} name={light.id} style={{ flex: 1 }}
                value={settings?.[light.id] ?? light.fallback}
                onBlur={onUpdateSettings}
                onEnter={onUpdateSettings}
              />
              <NekoColorPicker id={light.id} name={light.id}
                value={settings?.[light.id] ?? light.fallback}
                onChange={onUpdateSettings}
              />
            </div>
          </div>
        ))}
      </div>
    </StyledBuilderForm>
  </>);
};

export default GlassTheme;
