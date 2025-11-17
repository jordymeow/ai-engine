# Chroma Embeddings Implementation - Current Flow Analysis

## Current Flow (AI Engine Embeddings)

### 1. Adding Vectors (`vectors_add`)
**File:** `premium/embeddings.php:998-1112`

```
1. Content is provided
2. Create Meow_MWAI_Query_Embed with content
3. Check if env has ai_embeddings_override:
   - If YES: Use env['ai_embeddings_env'], env['ai_embeddings_model'], env['ai_embeddings_dimensions']
   - If NO: Use default AI environment for embeddings
4. Run query through core->run_query() → generates embeddings
5. Call filter 'mwai_embeddings_add_vector' → vector DB adapter stores it
6. Store metadata (dbId, model, dimensions) in local DB
```

### 2. Searching with Vectors (`context_search`)
**File:** `premium/embeddings.php:757-896`

```
1. Build search query from conversation
2. Check if OpenAI Vector Store:
   - If YES: Pass text query directly (no embedding generation)
   - If NO: Continue to step 3
3. Create Meow_MWAI_Query_Embed with search text
4. Check if env has ai_embeddings_override:
   - If YES: Use env['ai_embeddings_env'], env['ai_embeddings_model'], env['ai_embeddings_dimensions']
   - If NO: Use default AI environment for embeddings
5. Run query through core->run_query() → generates query embeddings
6. Call query_db() with embeddings → calls filter 'mwai_embeddings_query_vectors'
7. Vector DB adapter performs similarity search
8. Return matching vectors with scores
```

## Required Changes for Chroma Cloud Embeddings

### New Field in Environment Config

Add to embeddings environment (constants/init.php and frontend):
```php
'embeddings_source' => 'chroma-cloud' // or 'ai-engine'
'chroma_embedding_model' => 'Qwen/Qwen3-Embedding-0.6B'
```

### Default Values
- **New environments**: `embeddings_source` = `'chroma-cloud'`, `chroma_embedding_model` = `'Qwen/Qwen3-Embedding-0.6B'`
- **Existing environments**: If `embeddings_source` not set → treat as `'ai-engine'` (backward compatibility)

### UI Changes (Environments.js)

**Add Embedding Source Dropdown in Advanced Section:**
```jsx
<NekoSettings title="Embedding Model">
  <NekoSelect value={env.embeddings_source || 'ai-engine'}>
    <NekoOption value="chroma-cloud" label="Chroma Cloud (Qwen3)" />
    <NekoOption value="ai-engine" label="AI Engine" />
  </NekoSelect>
  <description>
    Automatically use Chroma Cloud's embedding model (Qwen3).
    Choose "AI Engine" to use your configured AI environments.
  </description>
</NekoSettings>

// Only show AI Environment section if embeddings_source === 'ai-engine'
{env.embeddings_source === 'ai-engine' && (
  <NekoAccordion title="AI Environment">
    {/* Existing ai_embeddings_override section */}
  </NekoAccordion>
)}
```

### Backend Changes

#### 1. Chroma Addon - Add Embedding Generation
**File:** `premium/addons/chroma.php`

```php
/**
 * Generate embeddings using Chroma Cloud's API
 * @param string $text Text to embed
 * @param string $model Model identifier (e.g., 'Qwen/Qwen3-Embedding-0.6B')
 * @return array Embedding vector
 */
private function generate_embedding($text, $model = 'Qwen/Qwen3-Embedding-0.6B') {
    $url = 'https://embed.trychroma.com/v1/embeddings';

    $body = json_encode([
        'model' => $model,
        'input' => $text
    ]);

    $response = wp_remote_post($url, [
        'headers' => [
            'X-Chroma-Token' => $this->apiKey,
            'Content-Type' => 'application/json'
        ],
        'body' => $body,
        'timeout' => 30
    ]);

    if (is_wp_error($response)) {
        throw new Exception('Chroma embedding failed: ' . $response->get_error_message());
    }

    $data = json_decode(wp_remote_retrieve_body($response), true);

    if (!isset($data['data'][0]['embedding'])) {
        throw new Exception('Invalid embedding response from Chroma');
    }

    return $data['data'][0]['embedding'];
}
```

#### 2. Embeddings.php - Modify vectors_add
**File:** `premium/embeddings.php:998-1112`

```php
public function vectors_add($vector = [], $status = 'processing', $localOnly = false) {
    // ... existing code ...

    if (!$localOnly) {
        if (!$hasContent) {
            return true;
        }
        $vector['id'] = $this->wpdb->insert_id;

        $env = $this->core->get_embeddings_env($envId);

        try {
            // NEW: Check if using Chroma Cloud embeddings
            $useChromaEmbeddings = isset($env['embeddings_source']) &&
                                    $env['embeddings_source'] === 'chroma-cloud' &&
                                    $env['type'] === 'chroma';

            if ($useChromaEmbeddings) {
                // Use Chroma Cloud for embedding generation
                $model = $env['chroma_embedding_model'] ?? 'Qwen/Qwen3-Embedding-0.6B';

                // Call Chroma addon to generate embedding
                $embeddingVector = apply_filters('mwai_chroma_generate_embedding', null, $vector['content'], $model, $envId);

                if (!$embeddingVector) {
                    throw new Exception('Failed to generate embedding using Chroma Cloud');
                }

                $vector['embedding'] = $embeddingVector;
                $vector['model'] = $model;
                $vector['dimensions'] = count($embeddingVector);
            } else {
                // EXISTING: Use AI Engine for embedding generation
                $queryEmbed = new Meow_MWAI_Query_Embed($vector['content']);
                $queryEmbed->set_scope('admin-tools');

                $override = isset($env['ai_embeddings_override']) && $env['ai_embeddings_override'] === true;
                if ($override) {
                    $queryEmbed->set_env_id($env['ai_embeddings_env']);
                    $queryEmbed->set_model($env['ai_embeddings_model']);
                    if (!empty($env['ai_embeddings_dimensions'])) {
                        $queryEmbed->set_dimensions($env['ai_embeddings_dimensions']);
                    }
                }

                $reply = $this->core->run_query($queryEmbed);
                $vector['embedding'] = $reply->result;
                $vector['model'] = $queryEmbed->model;
                $vector['dimensions'] = count($reply->result);
            }

            // Store in vector DB (same for both paths)
            $dbId = apply_filters('mwai_embeddings_add_vector', false, $vector, [
                'envId' => $envId,
            ]);

            // ... rest of existing code ...
        }
        catch (Exception $e) {
            // ... existing error handling ...
        }
    }

    // ... rest of existing code ...
}
```

#### 3. Embeddings.php - Modify context_search
**File:** `premium/embeddings.php:757-896`

```php
public function context_search($context, $query, $options = []) {
    // ... existing code to line 834 ...

    $env = $this->core->get_embeddings_env($embeddingsEnvId);

    // Check if this is an OpenAI Vector Store environment
    if (isset($env['type']) && $env['type'] === 'openai-vector-store') {
        // ... existing OpenAI Vector Store code ...
    } else {
        // NEW: Check if using Chroma Cloud embeddings
        $useChromaEmbeddings = isset($env['embeddings_source']) &&
                                $env['embeddings_source'] === 'chroma-cloud' &&
                                $env['type'] === 'chroma';

        if ($useChromaEmbeddings) {
            // Use Chroma Cloud for embedding generation
            $model = $env['chroma_embedding_model'] ?? 'Qwen/Qwen3-Embedding-0.6B';

            // Call Chroma addon to generate query embedding
            $queryEmbedding = apply_filters('mwai_chroma_generate_embedding', null, $searchQuery, $model, $embeddingsEnvId);

            if (!$queryEmbedding) {
                return null;
            }

            $embeds = $this->query_db($queryEmbedding, $embeddingsEnvId, $query);
        } else {
            // EXISTING: Generate embeddings using AI Engine
            $queryEmbed = new Meow_MWAI_Query_Embed($searchQuery);

            // Set scope from original query if available
            if ($query instanceof Meow_MWAI_Query_Text && !empty($query->scope)) {
                $queryEmbed->set_scope($query->scope);
            }

            $override = isset($env['ai_embeddings_override']) && $env['ai_embeddings_override'] === true;
            if ($override) {
                $queryEmbed->set_env_id($env['ai_embeddings_env']);
                $queryEmbed->set_model($env['ai_embeddings_model']);
                if (!empty($env['ai_embeddings_dimensions'])) {
                    $queryEmbed->set_dimensions($env['ai_embeddings_dimensions']);
                }
            }

            $reply = $this->core->run_query($queryEmbed);
            if (empty($reply->result)) {
                return null;
            }
            $embeds = $this->query_db($reply->result, $embeddingsEnvId, $query);
        }
    }

    // ... rest of existing code (processing $embeds) ...
}
```

#### 4. Chroma Addon - Add Filter Handler
**File:** `premium/addons/chroma.php`

```php
class MeowPro_MWAI_Addons_Chroma {
    // ... existing code ...

    function __construct($core) {
        $this->core = $core;

        // Existing filters
        add_filter('mwai_embeddings_list_vectors', [$this, 'list_vectors'], 10, 2);
        add_filter('mwai_embeddings_add_vector', [$this, 'add_vector'], 10, 3);
        add_filter('mwai_embeddings_get_vector', [$this, 'get_vector'], 10, 4);
        add_filter('mwai_embeddings_query_vectors', [$this, 'query_vectors'], 10, 4);
        add_filter('mwai_embeddings_delete_vectors', [$this, 'delete_vectors'], 10, 2);

        // NEW: Add embedding generation filter
        add_filter('mwai_chroma_generate_embedding', [$this, 'generate_embedding_handler'], 10, 4);
    }

    /**
     * Filter handler for generating embeddings
     */
    public function generate_embedding_handler($result, $text, $model, $envId) {
        if ($result) {
            return $result; // Already handled
        }

        if (!$this->init_settings($envId)) {
            return false;
        }

        // Only handle if this is a Chroma environment
        if ($this->env['type'] !== 'chroma') {
            return false;
        }

        return $this->generate_embedding($text, $model);
    }
}
```

## Summary of Implementation

### Constants (Default Values)
```php
// constants/init.php
'embeddings_envs' => [
    [
        'name' => 'Chroma',
        'type' => 'chroma',
        'apikey' => '',
        'server' => 'https://api.trychroma.com',
        'deployment' => 'cloud',
        'tenant' => '',
        'database' => 'default_database',
        'collection' => 'mwai',
        'embeddings_source' => 'chroma-cloud',  // NEW
        'chroma_embedding_model' => 'Qwen/Qwen3-Embedding-0.6B'  // NEW
    ]
]
```

### UI Flow
1. User sees "Embedding Model" dropdown in Advanced section (Chroma only)
2. Default: "Chroma Cloud (Qwen3)"
3. Alternative: "AI Engine" (shows existing AI Environment override section)
4. AI Environment section only visible when "AI Engine" is selected

### Backend Flow
1. When adding/searching vectors:
   - Check `env['embeddings_source']`
   - If `'chroma-cloud'` → Call Chroma embedding API
   - If `'ai-engine'` or not set → Use existing AI Engine flow
2. Chroma addon handles embedding generation via new filter
3. Rest of flow (storing, querying) remains the same

### Backward Compatibility
- Existing environments: No `embeddings_source` field → defaults to `'ai-engine'`
- Existing behavior unchanged for current users
- New Chroma environments: Default to Chroma Cloud embeddings
