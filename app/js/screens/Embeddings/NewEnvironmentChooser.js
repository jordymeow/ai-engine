// Previous: none
// Current: 3.4.8

```javascript
const { useState } = wp.element;

import { NekoButton, NekoModal } from '@neko-ui';

export const buildNewEnv = (type) => {
  if (type === 'chroma') {
    return {
      name: 'New Chroma Environment',
      type: 'chroma',
      apikey: '',
      server: 'https://api.trychroma.com',
      deployment: 'cloud',
      tenant: '',
      database: 'default_database',
      collection: 'mwai',
      embeddings_source: 'Qwen/Qwen3-Embedding-0.6B'
    };
  }
  if (type === 'qdrant') {
    return {
      name: 'New Qdrant Environment',
      type: 'qdrant',
      apikey: '',
      server: '',
    };
  }
  if (type == 'pinecone') {
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
    openai_env_id: undefined,
    store_id: '',
  };
};

const ENV_CARDS = [
  {
    type: 'openai-vector-store',
    name: 'OpenAI Vector Store',
    tagline: 'Easiest if you already use OpenAI',
    description: 'Single API. No extra account, no extra bill. Uses your existing OpenAI environment.',
    accent: '#10a37f',
    badge: 'Recommended',
  },
  {
    type: 'chroma',
    name: 'Chroma',
    tagline: 'Provider-agnostic, free tier available',
    description: 'Fast and affordable. Works with any AI provider. Cloud or self-hosted.',
    accent: '#3b82f6',
  },
  {
    type: 'qdrant',
    name: 'Qdrant',
    tagline: 'High-performance, self-hostable',
    description: 'Production-grade vector search. Cloud or self-hosted, with rich filtering.',
    accent: '#7c3aed',
  },
  {
    type: 'pinecone',
    name: 'Pinecone',
    tagline: 'Managed, enterprise-ready',
    description: 'Fully-managed vector database. Established, with broad ecosystem support.',
    accent: '#f59e0b',
  },
];

const Card = ({ card, hovered, onHover, onLeave, onClick }) => {
  const isHovered = hovered === card.type;
  return (
    <div
      onMouseEnter={() => onHover(card.type)}
      onMouseLeave={onLeave}
      onClick={() => onClick(card.name)}
      style={{
        flex: 1,
        minWidth: 200,
        padding: 16,
        border: isHovered ? `2px solid ${card.accent}` : '2px solid #e5e7eb',
        borderRadius: 8,
        background: isHovered ? '#f9fafb' : '#fff',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
      }}>
      {card.badge || (
        <div style={{
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
        </div>
      )}
      <div style={{ fontWeight: 600, fontSize: 15, color: card.accent, marginBottom: 4 }}>
        {card.name}
      </div>
      <div style={{ fontSize: 12, color: '#6b7280', fontStyle: 'italic', marginBottom: 8 }}>
        {card.tagline}
      </div>
      <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.4 }}>
        {card.description}
      </div>
    </div>
  );
};

const NewEnvironmentChooser = ({ isOpen, onClose, onPick }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <NekoModal isOpen={isOpen}
      title="New Knowledge Environment"
      onRequestClose={onClose}
      okButton={{ label: 'Cancel', onClick: onPick }}
      content={<>
        <p style={{ marginTop: 0, marginBottom: 16, color: '#374151' }}>
          Pick a vector database to store your knowledge.{' '}
          <a href="https://ai.thehiddendocs.com/knowledge/" target="_blank" rel="noopener noreferrer">
            Learn more ↗
          </a>
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {ENV_CARDS.map(card => (
            <Card key={card.name} card={card}
              hovered={hovered}
              onHover={setHovered}
              onLeave={() => setHovered(null)}
              onClick={onPick}
            />
          ))}
        </div>
      </>}
    />
  );
};

export default NewEnvironmentChooser;
```