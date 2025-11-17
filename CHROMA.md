# Chroma Partnership Implementation Plan

> **Session Date:** 2025-11-16
> **Purpose:** Document Chroma integration improvements for partnership

## Implementation Goals

Make Chroma Cloud the **recommended and easiest** vector database solution in AI Engine Pro, while maintaining support for self-hosted Chroma and other providers.

---

## 1. Default Placement & UI

### Goal
Position Chroma Cloud as the primary recommended option while keeping alternatives available.

### Changes Required

#### Frontend: Environment Type Selection
**File:** `/app/js/screens/embeddings/Environments.js` (lines 142-153)

**Current:**
```jsx
<NekoSelect scrolldown name="type" value={env.type}
  onChange={value => updateEnvironment(env.id, { type: value })}>
  <NekoOption value="pinecone" label="Pinecone" />
  <NekoOption value="qdrant" label="Qdrant" />
  <NekoOption value="openai-vector-store" label="OpenAI Vector Store" />
  <NekoOption value="chroma" label="Chroma" />
</NekoSelect>
```

**New:**
```jsx
<NekoSelect scrolldown name="type" value={env.type}
  onChange={value => updateEnvironment(env.id, { type: value })}>
  <NekoOption value="chroma-cloud" label="Chroma Cloud (Recommended)" />
  <NekoOption value="chroma-selfhosted" label="Chroma (Self-Hosted)" />
  <NekoOption value="pinecone" label="Pinecone" />
  <NekoOption value="qdrant" label="Qdrant" />
  <NekoOption value="openai-vector-store" label="OpenAI Vector Store" />
</NekoSelect>
```

#### Visual Indicator
Add visual distinction for recommended option:
- Green checkmark icon next to "Chroma Cloud"
- Or badge/chip with "Recommended" text
- Subtle background color to highlight it

#### Default Value
When creating a new environment, default to `chroma-cloud`:
```jsx
const addNewEnvironment = () => {
  const newEnv = {
    name: 'New Chroma Cloud Environment',
    type: 'chroma-cloud',  // Changed from 'pinecone'
    apikey: '',
    // ... rest of defaults
  };
};
```

---

## 2. Differentiate Chroma Cloud vs Self-Hosted

### Goal
Clear separation between managed cloud service and self-hosted deployments.

### Type Values
- `chroma-cloud` - Managed service at https://api.trychroma.com
- `chroma-selfhosted` - Self-deployed instance

### Backend Changes
**File:** `/premium/addons/chroma.php`

Update type checking throughout:
```php
// Old
if ($this->env['type'] !== 'chroma') {
    return false;
}

// New - support both types
if (!in_array($this->env['type'], ['chroma-cloud', 'chroma-selfhosted'])) {
    return false;
}

// Detect which mode
$isChromaCloud = $this->env['type'] === 'chroma-cloud';
```

### UI Conditional Fields
**File:** `/app/js/screens/embeddings/Environments.js`

Show different fields based on type:

```jsx
{(env.type === 'chroma-cloud' || env.type === 'chroma-selfhosted') && (
  <>
    {env.type === 'chroma-cloud' ? (
      // Chroma Cloud: Simple one-key setup
      <ChromaCloudSetup env={env} updateEnvironment={updateEnvironment} />
    ) : (
      // Self-hosted: Advanced configuration
      <ChromaSelfHostedSetup env={env} updateEnvironment={updateEnvironment} />
    )}
  </>
)}
```

---

## 3. One-Key Onboarding (Chroma Cloud)

### Goal
Simplest possible setup - just one API key, no manual tenant/database configuration.

### Authorization Flow

#### Step 1: User Sign-up/Login
**Authorization Page:** https://trychroma.com/ai-engine

This page:
1. User signs up or logs into Chroma Cloud
2. Authorizes AI Engine Pro integration
3. Returns a single API key

#### Step 2: API Key Input (Frontend)
**File:** `/app/js/screens/embeddings/Environments.js`

```jsx
const ChromaCloudSetup = ({ env, updateEnvironment }) => {
  const [connecting, setConnecting] = useState(false);
  const [identityData, setIdentityData] = useState(null);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      // Call our backend to fetch identity
      const response = await nekoFetch(`${apiUrl}/embeddings/chroma_cloud_identity`, {
        nonce: restNonce,
        method: 'POST',
        json: { env_id: env.id, api_key: env.apikey }
      });

      if (response.success) {
        // Auto-populate tenant and database
        updateEnvironment(env.id, {
          tenant: response.tenant_id,
          database: response.database_name,
          chroma_cloud_connected: true
        });
        setIdentityData(response);
      }
    } catch (error) {
      alert('Failed to connect: ' + error.message);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <>
      <NekoSettings title="API Key">
        <NekoInput
          name="apikey"
          value={env.apikey}
          placeholder="Paste your Chroma Cloud API key"
          description={toHTML(
            "Get your API key from <a href='https://trychroma.com/ai-engine' target='_blank' rel='noopener noreferrer'>Chroma Cloud for AI Engine ↗</a>"
          )}
          onFinalChange={value => updateEnvironment(env.id, { apikey: value })}
        />
      </NekoSettings>

      {env.apikey && !env.chroma_cloud_connected && (
        <NekoButton
          className="primary"
          onClick={handleConnect}
          isBusy={connecting}
        >
          Connect to Chroma Cloud
        </NekoButton>
      )}

      {env.chroma_cloud_connected && identityData && (
        <NekoMessage variant="success">
          ✓ Connected to Chroma Cloud
          <br />
          Tenant: {identityData.tenant_id}
          <br />
          Database: {identityData.database_name}
        </NekoMessage>
      )}

      <NekoSettings title="Collection">
        <NekoInput
          name="collection"
          value={env.collection || 'mwai'}
          description="Collection name for storing vectors"
          onFinalChange={value => updateEnvironment(env.id, { collection: value })}
        />
      </NekoSettings>
    </>
  );
};
```

#### Step 3: Backend Identity Fetch
**File:** `/premium/embeddings.php`

Add new REST endpoint:
```php
register_rest_route($this->namespace, '/embeddings/chroma_cloud_identity', [
  'methods' => 'POST',
  'permission_callback' => [$this->core, 'can_access_settings'],
  'callback' => [$this, 'rest_chroma_cloud_identity'],
]);

public function rest_chroma_cloud_identity($request) {
  try {
    $params = $request->get_json_params();
    $env_id = $params['env_id'];
    $api_key = $params['api_key'];

    if (empty($api_key)) {
      throw new Exception('API key is required');
    }

    // Call Chroma's get_user_identity endpoint
    $response = wp_remote_get('https://api.trychroma.com/api/v2/user/identity', [
      'headers' => [
        'X-Chroma-Token' => $api_key,
        'Content-Type' => 'application/json'
      ],
      'timeout' => 30
    ]);

    if (is_wp_error($response)) {
      throw new Exception('Failed to connect: ' . $response->get_error_message());
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    $http_code = wp_remote_retrieve_response_code($response);

    if ($http_code !== 200) {
      $error = isset($data['detail']) ? $data['detail'] : 'Invalid API key';
      throw new Exception($error);
    }

    // Extract identity information
    return new WP_REST_Response([
      'success' => true,
      'tenant_id' => $data['tenant_id'],
      'database_name' => $data['database_name'] ?? 'default_database',
      'user_email' => $data['email'] ?? null,
    ], 200);

  } catch (Exception $e) {
    return new WP_REST_Response([
      'success' => false,
      'error' => $e->getMessage()
    ], 200);
  }
}
```

### Self-Hosted Setup (Separate Component)
**File:** `/app/js/screens/embeddings/Environments.js`

```jsx
const ChromaSelfHostedSetup = ({ env, updateEnvironment }) => {
  return (
    <>
      <NekoSettings title="Server URL">
        <NekoInput
          name="server"
          value={env.server}
          placeholder="http://localhost:8000"
          description="URL of your self-hosted Chroma instance"
          onFinalChange={value => updateEnvironment(env.id, { server: value })}
        />
      </NekoSettings>

      <NekoSettings title="API Key (Optional)">
        <NekoInput
          name="apikey"
          value={env.apikey}
          placeholder="Leave empty if no authentication"
          description="Only required if your instance has authentication enabled"
          onFinalChange={value => updateEnvironment(env.id, { apikey: value })}
        />
      </NekoSettings>

      <NekoSettings title="Tenant">
        <NekoInput
          name="tenant"
          value={env.tenant || 'default_tenant'}
          description="Tenant name for multi-tenancy support"
          onFinalChange={value => updateEnvironment(env.id, { tenant: value })}
        />
      </NekoSettings>

      <NekoSettings title="Database">
        <NekoInput
          name="database"
          value={env.database || 'default_database'}
          description="Database name within tenant"
          onFinalChange={value => updateEnvironment(env.id, { database: value })}
        />
      </NekoSettings>

      <NekoSettings title="Collection">
        <NekoInput
          name="collection"
          value={env.collection || 'mwai'}
          description="Collection name for storing vectors"
          onFinalChange={value => updateEnvironment(env.id, { collection: value })}
        />
      </NekoSettings>
    </>
  );
};
```

---

## 4. Embeddings Source (Chroma Cloud Only)

### Goal
When using Chroma Cloud, use their embedding service (`embed.trychroma.com`) with Qwen model - no external API keys needed.

### Architecture Change

Currently, AI Engine generates embeddings separately (using OpenAI, etc.) then stores them in vector DB.

For Chroma Cloud: Let Chroma handle both embedding generation AND storage.

### Backend Implementation
**File:** `/premium/embeddings.php`

Add method to detect if Chroma Cloud embeddings should be used:

```php
private function should_use_chroma_embeddings($envId) {
  $env = $this->core->get_embeddings_env($envId);

  // Only use Chroma embeddings for Chroma Cloud
  if ($env['type'] !== 'chroma-cloud') {
    return false;
  }

  // Check if override is disabled (use Chroma's embeddings)
  if (!isset($env['ai_embeddings_override']) || !$env['ai_embeddings_override']) {
    return true;
  }

  return false;
}
```

### Chroma Embeddings API
**File:** `/premium/addons/chroma.php`

Add new method for embedding generation:

```php
/**
 * Generate embeddings using Chroma's embedding service
 * Uses embed.trychroma.com with Qwen model
 */
private function generate_embeddings($texts) {
  $url = 'https://embed.trychroma.com/v1/embeddings';

  $headers = [
    'Content-Type' => 'application/json',
    'X-Chroma-Token' => $this->apiKey
  ];

  $body = json_encode([
    'model' => 'qwen', // Chroma's Qwen embedding model
    'input' => is_array($texts) ? $texts : [$texts]
  ]);

  $response = wp_remote_post($url, [
    'headers' => $headers,
    'body' => $body,
    'timeout' => 30
  ]);

  if (is_wp_error($response)) {
    throw new Exception('Chroma embedding failed: ' . $response->get_error_message());
  }

  $data = json_decode(wp_remote_retrieve_body($response), true);

  if (!isset($data['data'])) {
    throw new Exception('Invalid embedding response from Chroma');
  }

  // Return embeddings in same format as OpenAI
  return array_map(function($item) {
    return $item['embedding'];
  }, $data['data']);
}
```

### Integration with Vector Add
**File:** `/premium/addons/chroma.php`

Update `add_vector` to optionally generate embeddings:

```php
public function add_vector($success, $vector, $options) {
  if ($success) {
    return $success;
  }

  $envId = $options['envId'];
  if (!$this->init_settings($envId)) {
    return false;
  }

  // If Chroma Cloud and no embedding provided, generate it
  $isChromaCloud = $this->env['type'] === 'chroma-cloud';
  if ($isChromaCloud && empty($vector['embedding']) && !empty($vector['content'])) {
    $embeddings = $this->generate_embeddings($vector['content']);
    $vector['embedding'] = $embeddings[0];
  }

  // Rest of existing add_vector logic...
  $this->ensure_collection_exists();
  $collectionId = $this->get_collection_id($this->collection);

  $randomId = $this->get_uuid();
  $body = [
    'ids' => [$randomId],
    'embeddings' => [$vector['embedding']],
    'metadatas' => [[
      'type' => $vector['type'],
      'title' => $vector['title'],
      'model' => 'chroma-qwen' // Track that Chroma generated this
    ]]
  ];

  if (!empty($vector['content'])) {
    $body['documents'] = [$vector['content']];
  }

  $res = $this->run('POST', "/collections/{$collectionId}/add", $body);
  return $randomId;
}
```

### Query Integration
**File:** `/premium/embeddings.php`

Update context search to use Chroma embeddings when appropriate:

```php
public function context_search($context, $query, $searchContext) {
  // ... existing code ...

  $env = $this->core->get_embeddings_env($embeddingsEnvId);

  if ($this->should_use_chroma_embeddings($embeddingsEnvId)) {
    // Use Chroma's embedding + search in one call
    $options = [
      'envId' => $embeddingsEnvId,
      'query' => $query,
      'searchQuery' => $searchQuery,
      'use_chroma_embeddings' => true
    ];
    $embeds = apply_filters('mwai_embeddings_query_vectors', [], $searchQuery, $options);
  } else {
    // Original flow: generate embeddings, then search
    $queryEmbed = new Meow_MWAI_Query_Embed($searchQuery);
    // ... existing embedding generation ...
    $embeds = $this->query_db($reply->result, $embeddingsEnvId, $query);
  }

  // ... rest of method ...
}
```

### Chroma Addon Query Update
**File:** `/premium/addons/chroma.php`

Update `query_vectors` to handle text queries:

```php
public function query_vectors($vectors, $vectorOrText, $options) {
  if (!empty($vectors)) {
    return $vectors;
  }

  $envId = $options['envId'];
  if (!$this->init_settings($envId)) {
    return false;
  }

  try {
    $collectionId = $this->get_collection_id($this->collection);

    // Check if we should generate embeddings
    $useChromaEmbeddings = isset($options['use_chroma_embeddings']) && $options['use_chroma_embeddings'];

    if ($useChromaEmbeddings && is_string($vectorOrText)) {
      // Generate embedding for text query
      $embeddings = $this->generate_embeddings($vectorOrText);
      $queryEmbedding = $embeddings[0];
    } else {
      // Use provided embedding vector
      $queryEmbedding = $vectorOrText;
    }

    $body = [
      'query_embeddings' => [$queryEmbedding],
      'n_results' => $this->maxSelect
    ];

    $res = $this->run('POST', "/collections/{$collectionId}/query", $body);

    // ... rest of existing query logic ...

  } catch (Exception $e) {
    return [];
  }
}
```

---

## 5. UI/UX Enhancements

### Empty State Message
**File:** `/app/js/screens/Embeddings/Embeddings.js`

Update the empty state to recommend Chroma Cloud:

```jsx
const emptyMessage = useMemo(() => {
  if (!environment) {
    return (
      <div style={{ padding: '40px 20px', backgroundColor: '#f9f9f9', borderRadius: 8, margin: '20px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
          <h3 style={{ marginBottom: 20, color: '#333' }}>Let's Create a Knowledge Base</h3>

          <NekoMessage variant="info" style={{ marginBottom: 20, fontSize: 13 }}>
            <b>Recommended: Use Chroma Cloud</b> for the easiest setup. Just one API key and you're ready to go.
            Get started at{' '}
            <a href="https://trychroma.com/ai-engine" target="_blank" rel="noopener noreferrer">
              trychroma.com/ai-engine ↗
            </a>
          </NekoMessage>

          <p style={{ marginBottom: 15 }}>
            Or configure a different vector database in{' '}
            <b style={{ whiteSpace: 'nowrap' }}>Settings → Knowledge → Environments for Embeddings</b>.
          </p>
        </div>
      </div>
    );
  }
  // ... rest of empty states ...
}, [environment]);
```

### Help Text Updates
**File:** `/app/i18n.js`

Update internationalization strings:

```javascript
HELP: {
  // ... existing help text ...

  CHROMA_CLOUD: 'Chroma Cloud is the recommended vector database for AI Engine. Sign up and get your API key from trychroma.com/ai-engine',
  CHROMA_CLOUD_URL: 'https://trychroma.com/ai-engine',
  CHROMA_SELFHOSTED: 'Self-host Chroma on your own infrastructure. Requires Docker or manual installation.',

  EMBEDDINGS_SOURCE: 'Chroma Cloud includes built-in embeddings powered by the Qwen model. No additional API keys needed.',
}
```

---

## 6. Settings Screen Updates

### Knowledge Tab Organization
**File:** `/app/js/screens/Settings.js`

Update Knowledge section to highlight Chroma:

```jsx
<NekoTab title="Knowledge" inversed>
  <NekoMessage variant="info" style={{ margin: '20px 10px' }}>
    <b>New to embeddings?</b> We recommend{' '}
    <a href="https://trychroma.com/ai-engine" target="_blank" rel="noopener noreferrer">
      Chroma Cloud ↗
    </a>
    {' '}for the simplest setup experience.
  </NekoMessage>

  <EmbeddingsEnvironmentsSettings
    busy={busy}
    options={options}
    environments={embeddings_envs}
    updateOption={updateOption}
    updateEnvironment={updateVectorDbEnvironment}
  />
</NekoTab>
```

---

## 7. Migration & Backward Compatibility

### Handle Existing Chroma Environments

Users who already have `type: 'chroma'` need to be migrated:

**File:** `/premium/embeddings.php` or `/classes/core.php`

```php
private function migrate_chroma_environments() {
  $envs = $this->core->get_option('embeddings_envs');
  $needsMigration = false;

  foreach ($envs as &$env) {
    if ($env['type'] === 'chroma') {
      // Detect if Cloud or Self-hosted based on server URL
      $server = $env['server'] ?? '';
      if (empty($server) || strpos($server, 'trychroma.com') !== false || strpos($server, 'chroma.com') !== false) {
        $env['type'] = 'chroma-cloud';
      } else {
        $env['type'] = 'chroma-selfhosted';
      }
      $needsMigration = true;
    }
  }

  if ($needsMigration) {
    $this->core->update_option($envs, 'embeddings_envs');
  }
}
```

Run this migration on plugin activation or first load after update.

---

## 8. Documentation Updates

### User-Facing Documentation
**File:** `/CLAUDE.md` or separate docs

Add section:

```markdown
## Using Chroma Cloud (Recommended)

Chroma Cloud is the recommended vector database for AI Engine Pro. It offers:
- ✅ One-click setup with a single API key
- ✅ Built-in embeddings (no OpenAI key needed)
- ✅ Managed infrastructure
- ✅ Generous free tier

### Setup Steps
1. Go to Settings → Knowledge → Environments for Embeddings
2. Click "Add New Environment"
3. Select "Chroma Cloud (Recommended)"
4. Visit https://trychroma.com/ai-engine to get your API key
5. Paste the key and click "Connect to Chroma Cloud"
6. Done! Your knowledge base is ready to use.

### Self-Hosted Alternative
If you prefer to host Chroma yourself, select "Chroma (Self-Hosted)" and provide:
- Server URL (e.g., http://localhost:8000)
- Tenant, Database, and Collection names
- Optional API key if authentication is enabled
```

---

## Implementation Checklist

### Phase 1: UI & UX (Priority)
- [ ] Update environment type dropdown to show Chroma Cloud first
- [ ] Add "Recommended" label/badge to Chroma Cloud option
- [ ] Separate `chroma-cloud` and `chroma-selfhosted` types
- [ ] Create `ChromaCloudSetup` component for simple setup
- [ ] Create `ChromaSelfHostedSetup` component for advanced setup
- [ ] Update empty states to recommend Chroma Cloud
- [ ] Add Chroma branding (logo if available)

### Phase 2: Backend Integration
- [ ] Add `/embeddings/chroma_cloud_identity` REST endpoint
- [ ] Implement `get_user_identity` API call to Chroma
- [ ] Update `chroma.php` to handle both `chroma-cloud` and `chroma-selfhosted`
- [ ] Add `generate_embeddings()` method using embed.trychroma.com
- [ ] Update `add_vector()` to auto-generate embeddings for Chroma Cloud
- [ ] Update `query_vectors()` to support text queries with Chroma embeddings

### Phase 3: Testing & Refinement
- [ ] Test Chroma Cloud connection flow
- [ ] Test embedding generation with Qwen model
- [ ] Test vector add/query with Chroma-generated embeddings
- [ ] Test self-hosted Chroma still works
- [ ] Test migration from old `chroma` type to new types
- [ ] Test all other vector DBs still work (Pinecone, Qdrant, OpenAI)

### Phase 4: Documentation & Polish
- [ ] Update help text and tooltips
- [ ] Add setup guide for Chroma Cloud
- [ ] Update CLAUDE.md with new Chroma features
- [ ] Add error messages specific to Chroma issues
- [ ] Test UX flow end-to-end

---

## Technical Considerations

### API Endpoint Assumptions
**Note:** Some endpoints are assumed based on partnership discussion. Verify with Chroma:

1. ✅ `https://trychroma.com/ai-engine` - Authorization page (confirmed)
2. ❓ `GET /api/v2/user/identity` - Get tenant/database for API key
3. ❓ `POST https://embed.trychroma.com/v1/embeddings` - Generate embeddings
4. ❓ Qwen model identifier - Verify exact name/ID

**Action:** Confirm these endpoints with Chroma team or documentation.

### Embedding Model Details
- **Model name:** Verify if it's `qwen`, `qwen2`, or full model path
- **Dimensions:** Get dimension count for Qwen model (likely 768 or 1024)
- **Cost:** Understand any usage limits or costs for embedding API

### Performance Considerations
- Chroma-generated embeddings add network latency vs local generation
- Consider caching embeddings for frequently-used content
- Batch embedding generation when possible

### Error Handling
Add specific error messages for Chroma Cloud:
- Invalid API key
- Identity fetch failed
- Embedding generation failed
- Rate limiting (if applicable)
- Quota exceeded (if applicable)

---

## Future Enhancements

### OAuth Integration (Future)
Instead of manual API key, implement OAuth flow:
1. "Connect to Chroma Cloud" button
2. Opens OAuth popup
3. User authorizes
4. Return token to plugin
5. Auto-configure environment

### Multi-Workspace Support
If users have multiple Chroma workspaces:
- Let them select which workspace/tenant to use
- Support multiple Chroma Cloud environments

### Usage Analytics
Show Chroma Cloud usage stats:
- Number of vectors stored
- Query count
- Storage used
- Embedding API calls

### Advanced Features
- Expose Chroma's metadata filtering in AI Engine UI
- Support Chroma's hybrid search
- Collection management (create/delete from UI)
- Backup/restore vectors

---

## Success Metrics

Track adoption of Chroma Cloud:
- % of new users choosing Chroma Cloud vs other options
- % of existing users migrating to Chroma Cloud
- Average setup time (should be <2 minutes)
- Support tickets related to Chroma setup (should decrease)

---

**Status:** Ready for implementation
**Estimated Effort:** 2-3 days for Phase 1-2, 1 day for Phase 3-4
**Dependencies:** Confirmation of Chroma API endpoints
