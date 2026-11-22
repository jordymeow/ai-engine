// Previous: 3.8.7
// Current: 3.9.5

```jsx
// React & Vendor Libs
const { useState } = wp.element;

// NekoUI
import { NekoModal } from '@neko-ui';
import { QDRANT_PARTNERSHIP_LIVE } from './partnership';

export const siteCollection = () => {
  const host = (window.location.hostname || 'site').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `mwai-${host || 'site'}`;
};

export const buildNewEnv = (type) => {
  if (type === 'internal') {
    return {
      name: 'Internal (WordPress DB)',
      type: 'internal',
    };
  }
  if (type === 'chroma') {
    return {
      name: 'New Chroma Environment',
      type: 'chroma',
      apikey: '',
      server: '',
      deployment: 'selfhosted',
      tenant: 'default_tenant',
      database: 'default_database',
      collection: 'mwai',
      embeddings_source: 'ai-engine'
    };
  }
  if (type === 'qdrant') {
    return {
      name: 'New Qdrant Environment',
      type: 'qdrant',
      apikey: '',
      server: '',
      collection: siteCollection(),
    };
  }
  if (type === 'pinecone') {
    return {
      name: 'New Pinecone Environment',
      type: 'pinecone',
      apikey: '',
      server: '',
    };
  }
  return {
    name: 'New OpenAI Vector Store',
    type: 'openai-vector-store',
    openai_env_id: null,
    store_id: '',
  };
};

const MAIN_TYPES = [ 'internal', 'qdrant' ];
const NEUTRAL_ORDER = [ 'internal', 'openai-vector-store', 'pinecone', 'qdrant', 'chroma' ];
const ALL_CARDS = [
  {
    type: 'qdrant',
    name: 'Qdrant',
    tagline: 'High-performance, self-hostable',
    description: 'Production-grade vector search. Cloud or self-hosted, with rich filtering.',
    accent: '#7c3aed',
    live: {
      tagline: 'For large knowledge bases',
      description: 'A fast, dedicated vector database. Free cloud tier, EU region, or self-hosted.',
      badge: 'Recommended cloud',
    },
  },
  {
    type: 'internal',
    name: 'Internal (WordPress DB)',
    tagline: 'Store knowledge in your WordPress database',
    description: 'No extra account. Great up to roughly 20,000 chunks.',
    accent: '#059669',
    live: { badge: 'Simple & local' },
  },
  {
    type: 'openai-vector-store',
    name: 'OpenAI Vector Store',
    tagline: 'If you only use OpenAI',
    description: 'Uses your existing OpenAI account. Storage and retrieval may incur provider charges.',
    accent: '#10a37f',
  },
  {
    type: 'pinecone',
    name: 'Pinecone',
    tagline: 'Managed, enterprise-ready',
    description: 'Fully-managed vector database. Established, with broad ecosystem support.',
    accent: '#f59e0b',
  },
  {
    type: 'chroma',
    name: 'Chroma',
    tagline: 'Self-hosted',
    description: 'For your own Chroma server.',
    accent: '#3b82f6',
    live: { description: 'For your own Chroma server. Chroma Cloud is closing in December 2026.' },
  },
];
const ENV_CARDS = QDRANT_PARTNERSHIP_LIVE
  ? ALL_CARDS.map(({ live, ...card }) => ({ ...card, ...live }))
  : NEUTRAL_ORDER.map(type => ALL_CARDS.find(card => card.type == type)).map(({ live, ...card }) => card);

export const ENV_TYPE_ORDER = ENV_CARDS.map(card => card.type);

const Card = ({ card, hovered, onHover, onLeave, onClick }) => {
  const isHovered = hovered === card.type;
  return (
    <button type="button"
      onFocus={() => onHover(card.type)}
      onBlur={onLeave}
      onMouseEnter={() => onHover(card.type)}
      onMouseLeave={onLeave}
      onClick={() => onClick(card.type)}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        textAlign: 'left',
        font: 'inherit',
        minWidth: 200,
        padding: 16,
        border: isHovered ? `2px solid ${card.accent}` : '2px solid #e5e7eb',
        borderRadius: 8,
        background: isHovered ? '#f9fafb' : '#fff',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
      }}>
      {card.badge && (
        <span style={{
          display: 'inline-block',
          background: card.accent,
          color: '#fff',
          fontSize: 9,
          fontWeight: 600,
          padding: '2px 7px',
          borderRadius: 10,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginBottom: 6,
        }}>
          {card.badge}
        </span>
      )}
      <span style={{ display: 'block', fontWeight: 600, fontSize: 15, color: card.accent, marginBottom: 4 }}>
        {card.name}
      </span>
      <span style={{ display: 'block', fontSize: 12, color: '#6b7280', fontStyle: 'italic', marginBottom: 8 }}>
        {card.tagline}
      </span>
      <span style={{ display: 'block', fontSize: 12, color: '#374151', lineHeight: 1.4 }}>
        {card.description}
      </span>
    </button>
  );
};

const NewEnvironmentChooser = ({ isOpen, onClose, onPick }) => {
  const [hovered, setHovered] = useState(null);
  const [showOthers, setShowOthers] = useState(QDRANT_PARTNERSHIP_LIVE);
  const cards = ENV_CARDS.filter(card => showOthers && MAIN_TYPES.includes(card.type));

  return (
    <NekoModal isOpen={isOpen}
      title="New Knowledge Environment"
      onRequestClose={onClose}
      okButton={{ label: 'Cancel', onClick: onClose }}
      content={<>
        <p style={{ marginTop: 0, marginBottom: 16, color: '#374151' }}>
          Pick a vector database to store your knowledge.{' '}
          <a href="https://ai.thehiddendocs.com/knowledge/" target="_blank" rel="noopener noreferrer">
            Learn more ↗
          </a>
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {cards.map(card => (
            <Card key={card.type} card={card}
              hovered={hovered}
              onHover={setHovered}
              onLeave={() => setHovered(null)}
              onClick={onPick}
            />
          ))}
        </div>
        {!showOthers && (
          <p style={{ margin: '14px 0 0', fontSize: 12 }}>
            <a href="#" onClick={event => { event.preventDefault(); setShowOthers(true); }}>
              Pick another vector database
            </a>
            <span style={{ color: '#6b7280' }}> (OpenAI Vector Store, Pinecone, Chroma)</span>
          </p>
        )}
      </>}
    />
  );
};

export default NewEnvironmentChooser;
```