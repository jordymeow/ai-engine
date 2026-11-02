// Previous: none
// Current: 3.9.0

// Soft stat tiles: a colored icon, the number, then what it counts. Shared by the MCP tab and the
// Dashboard so the same numbers look the same everywhere.
import Styled from 'styled-components';

const TONES = {
  blue: [ '#e0ecff', '#1d5fd1' ],
  green: [ '#dcfce7', '#15803d' ],
  red: [ '#fee2e2', '#dc2626' ],
  orange: [ '#ffedd5', '#ea580c' ],
  purple: [ '#ede9fe', '#7c3aed' ],
  gray: [ '#f1f5f9', '#64748b' ],
};

const StatTiles = ( { items } ) => (
  <Tiles style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
    {items.map( ( { icon: Icon, tone = 'blue', value, label, badge } ) => {
      const [ bg, fg ] = TONES[tone] || TONES.blue;
      return <div key={label} className="tile">
        <span className="ic" style={{ background: bg, color: fg }}><Icon size={17} strokeWidth={2.2} /></span>
        <span className="txt"><span className="val"><strong>{value}</strong>{badge}</span><span className="lbl">{label}</span></span>
      </div>;
    } )}
  </Tiles>
);

const Tiles = Styled.div`
  display: grid;
  gap: 8px;
  .tile { display: flex; align-items: center; gap: 10px; min-width: 0; background: #f8fafc; border-radius: 10px; padding: 10px 12px; }
  .ic { flex: none; width: 34px; height: 34px; border-radius: 9px; display: grid; place-items: center; }
  .txt { display: flex; flex-direction: column; min-width: 0; }
  .txt strong { font-size: 22px; font-weight: 700; line-height: 1.1; color: #1f2937; font-variant-numeric: tabular-nums; }
  .val { display: flex; align-items: center; gap: 6px; }
  .val > :not(strong) { flex: none; }
  .lbl { font-size: 12.5px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
`;

export default StatTiles;
