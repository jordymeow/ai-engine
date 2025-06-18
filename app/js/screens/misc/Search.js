// Previous: 2.8.3
// Current: 2.8.4

const { useState, useMemo, useEffect } = wp.element;
import { restUrl, restNonce } from '@app/settings';

import { NekoWrapper, NekoBlock, NekoSpacer, NekoColumn, NekoInput, NekoSelect, NekoOption, NekoButton, NekoTable, NekoMessage, NekoTextArea, NekoTabs, NekoTab } from '@neko-ui';
import { nekoFetch } from '@neko-ui';
import i18n from '@root/i18n';

const Search = ({ options, updateOption, busy: settingsBusy }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [multiResults, setMultiResults] = useState(null);
  const [busy, setBusy] = useState(false);

  const embeddingsEnabled = options?.module_embeddings;
  const embeddingsEnvs = options?.embeddings_envs || [];

  const onSearchWithMethod = async (searchMethod) => {
    setBusy(true);
    setResults(null);
    setMultiResults(null);

    try {
      const payload = {
        search: query,
        method: searchMethod,
        ...(searchMethod === 'embeddings' && options?.search_frontend_env_id && { envId: options.search_frontend_env_id }),
        ...(searchMethod === 'keywords' && options?.search_website_context && { websiteContext: options.search_website_context })
      };

      const res = await nekoFetch(`${restUrl}/mwai-ui/v1/search`, {
        method: 'POST',
        nonce: restNonce,
        json: payload
      });
      setResults(res);
    } catch (error) {
      console.error('Search error:', error);
      setResults({
        success: false,
        message: error.message || 'An error occurred during search'
      });
    } finally {
      setBusy(false);
    }
  };

  const onMultiSearchClick = async () => {
    setBusy(true);
    setResults(null);
    setMultiResults(null);

    const methods = ['wordpress', 'keywords', 'embeddings'];
    const searchResults = {};

    try {
      for (const searchMethod of methods) {
        try {
          const payload = {
            search: query,
            method: searchMethod,
            ...(searchMethod === 'embeddings' && options?.search_frontend_env_id && { envId: options.search_frontend_env_id }),
            ...(searchMethod === 'keywords' && options?.search_website_context && { websiteContext: options.search_website_context })
          };

          const res = await nekoFetch(`${restUrl}/mwai-ui/v1/search`, {
            method: 'POST',
            nonce: restNonce,
            json: payload
          });
          searchResults[searchMethod] = res;
        } catch (error) {
          console.error(`${searchMethod} search error:`, error);
          searchResults[searchMethod] = {
            success: false,
            message: error.message || `An error occurred during ${searchMethod} search`
          };
        }
      }
      setMultiResults(searchResults);
    } finally {
      setBusy(false);
    }
  };

  const resultsData = useMemo(() => {
    if (!results?.results) return [];
    return results.results.map(post => ({
      id: post.id,
      title: post.title || 'Untitled',
      excerpt: post.excerpt || 'No excerpt available',
      score: post.score ? `${(post.score * 100).toFixed(0)}%` : null,
      foundWith: post.found_with || null
    }));
  }, [results]);

  const resultsColumns = useMemo(() => {
    const cols = [
      { accessor: 'title', title: 'Title', width: '200px' },
      { accessor: 'excerpt', title: 'Excerpt', width: '100%' }
    ];

    if (results?.method === 'embeddings') {
      cols[1].width = '100%'; 
      cols.push({ accessor: 'score', title: 'Score', width: '80px' });
    } else if (results?.method === 'keywords') {
      cols[1].width = '50%'; 
      cols.push({ accessor: 'score', title: 'Score', width: '80px' });
      cols.push({ accessor: 'foundWith', title: 'Found with', width: '50%' });
    }
    return cols;
  }, [results?.method]);

  const debugInfo = useMemo(() => {
    if (!results?.debug) return null;

    if (results?.method === 'embeddings') {
      return (
        <div style={{ marginTop: 10, padding: 10, background: '#f0f0f0', borderRadius: 4, fontSize: 12 }}>
          <strong>Debug Info:</strong>
          <div>Total vectors found: {results.debug.total_vectors}</div>
          <div>Filtered posts: {results.debug.filtered_posts}</div>
          <div>Min score threshold: {results.debug.min_score}</div>
          {results.debug.sample_vectors && (
            <details style={{ marginTop: 5 }}>
              <summary>Sample vectors (first 5)</summary>
              <pre style={{ fontSize: 11, marginTop: 5 }}>
                {JSON.stringify(results.debug.sample_vectors, null, 2)}
              </pre>
            </details>
          )}
        </div>
      );
    } else {
      return (
        <div style={{ marginTop: 10, padding: 10, background: '#f0f0f0', borderRadius: 4, fontSize: 12 }}>
          {results.debug.keyword_tiers && (
            <>
              <strong>Keyword Tiers Generated:</strong>
              <div style={{ marginLeft: 10, marginTop: 5 }}>
                <div><strong>Exact:</strong> {results.debug.keyword_tiers.exact?.join(', ')}</div>
                <div><strong>Contextual:</strong> {results.debug.keyword_tiers.contextual?.join(', ')}</div>
                <div><strong>General:</strong> {results.debug.keyword_tiers.general?.join(', ')}</div>
              </div>
              <div style={{ marginTop: 10 }}>
                <strong>Progressive Search ({results.debug.total_searches} attempts):</strong>
              </div>
            </>
          )}
          {results.debug.searches && (
            <details style={{ marginTop: 5 }}>
              <summary>View search attempts</summary>
              <div style={{ marginTop: 5, fontSize: 11 }}>
                {results.debug.searches.map((search, index) => (
                  <div key={index} style={{ marginBottom: 3 }}>
                    {search.attempt}. "{search.keywords}" (score: {search.score}%) → {search.found} posts
                  </div>
                ))}
              </div>
            </details>
          )}
          {results.debug.total_searches && (
            <div style={{ marginTop: 5, color: '#666' }}>
              {results.results.length >= 3
                ? `Stopped after finding ${results.results.length} results`
                : `Completed ${results.debug.total_searches} searches`
              }
            </div>
          )}
        </div>
      );
    }
  }, [results]);

  const formatResultsForMethod = (methodResults, methodName) => {
    if (!methodResults?.results) return [];
    return methodResults.results.map(post => ({
      id: post.id,
      title: post.title || 'Untitled',
      excerpt: post.excerpt || 'No excerpt available',
      score: post.score ? `${(post.score * 100).toFixed(0)}%` : null,
      foundWith: post.found_with || null
    }));
  };

  const getColumnsForMethod = (methodName) => {
    const cols = [
      { accessor: 'title', title: 'Title', width: '200px' },
      { accessor: 'excerpt', title: 'Excerpt', width: '100%' }
    ];

    if (methodName === 'embeddings') {
      cols[1].width = '100%'; 
      cols.push({ accessor: 'score', title: 'Score', width: '80px' });
    } else if (methodName === 'keywords') {
      cols[1].width = '50%'; 
      cols.push({ accessor: 'score', title: 'Score', width: '80px' });
      cols.push({ accessor: 'foundWith', title: 'Found with', width: '50%' });
    }
    return cols;
  };

  const getDebugInfoForMethod = (methodResults, methodName) => {
    if (!methodResults?.debug) return null;
    if (methodName === 'embeddings') {
      return (
        <div style={{ marginTop: 10, padding: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 4, fontSize: 12 }}>
          <strong>Debug Info:</strong>
          <div>Total vectors found: {methodResults.debug.total_vectors}</div>
          <div>Filtered posts: {methodResults.debug.filtered_posts}</div>
          <div>Min score threshold: {methodResults.debug.min_score}</div>
          {methodResults.debug.sample_vectors && (
            <details style={{ marginTop: 5 }}>
              <summary>Sample vectors (first 5)</summary>
              <pre style={{ fontSize: 11, marginTop: 5 }}>
                {JSON.stringify(methodResults.debug.sample_vectors, null, 2)}
              </pre>
            </details>
          )}
        </div>
      );
    } else if (methodName === 'keywords') {
      return (
        <div style={{ marginTop: 10, padding: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 4, fontSize: 12 }}>
          {methodResults.debug.keyword_tiers && (
            <>
              <strong>Keyword Tiers Generated:</strong>
              <div style={{ marginLeft: 10, marginTop: 5 }}>
                <div><strong>Exact:</strong> {methodResults.debug.keyword_tiers.exact?.join(', ')}</div>
                <div><strong>Contextual:</strong> {methodResults.debug.keyword_tiers.contextual?.join(', ')}</div>
                <div><strong>General:</strong> {methodResults.debug.keyword_tiers.general?.join(', ')}</div>
              </div>
              <div style={{ marginTop: 10 }}>
                <strong>Progressive Search ({methodResults.debug.total_searches} attempts):</strong>
              </div>
            </>
          )}
          {methodResults.debug.searches && (
            <details style={{ marginTop: 5 }}>
              <summary>View search attempts</summary>
              <div style={{ marginTop: 5, fontSize: 11 }}>
                {methodResults.debug.searches.map((search, index) => (
                  <div key={index} style={{ marginBottom: 3 }}>
                    {search.attempt}. "{search.keywords}" (score: {search.score}%) → {search.found} posts
                  </div>
                ))}
              </div>
            </details>
          )}
          {methodResults.debug.total_searches && (
            <div style={{ marginTop: 5 }}>
              {methodResults.results.length >= 3
                ? `Stopped after finding ${methodResults.results.length} results`
                : `Completed ${methodResults.debug.total_searches} searches`
              }
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <NekoWrapper>
      <NekoColumn minimal style={{ flex: 2 }}>
        <NekoBlock title="Search Test" className="primary">
          <div style={{ marginBottom: 15 }}>
            <NekoInput
              name="query"
              value={query}
              onChange={setQuery}
              onEnter={() => onSearchWithMethod(options?.search_frontend_method || 'wordpress')}
              placeholder="Enter your search query..."
              disabled={busy}
              fullWidth
            />
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <NekoButton
              className="primary"
              onClick={() => onSearchWithMethod(options?.search_frontend_method || 'wordpress')}
              disabled={!query || busy}
              isBusy={busy}
              style={{ flex: 1 }}
            >
              Search
            </NekoButton>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <NekoButton
              className="secondary"
              onClick={() => onSearchWithMethod('wordpress')}
              disabled={!query || busy}
              style={{ flex: 1 }}
            >
              WordPress
            </NekoButton>
            <NekoButton
              className="secondary"
              onClick={() => onSearchWithMethod('keywords')}
              disabled={!query || busy}
              style={{ flex: 1 }}
            >
              AI Keywords
            </NekoButton>
            <NekoButton
              className="secondary"
              onClick={() => onSearchWithMethod('embeddings')}
              disabled={!query || busy || (!embeddingsEnabled || embeddingsEnvs.length === 0)}
              style={{ flex: 1 }}
            >
              Embeddings
            </NekoButton>
            <NekoButton
              className="secondary"
              onClick={onMultiSearchClick}
              disabled={!query || busy}
              style={{ flex: 1 }}
            >
              Multi-Method
            </NekoButton>
          </div>
        </NekoBlock>

        {results && (
          <NekoBlock title="Results" className="primary">
            {results.success === false && (
              <NekoMessage variant="danger">
                {results.message}
                {results.debug && (
                  <div style={{ marginTop: 5, fontSize: 12 }}>
                    Debug: {results.debug}
                  </div>
                )}
              </NekoMessage>
            )}

            {results.success && (
              <>
                {resultsData.length > 0 ? (
                  <NekoTable
                    data={resultsData}
                    columns={resultsColumns}
                    onSelectRow={(id) => {
                      const url = `${window.location.origin}/?p=${id}`;
                      window.open(url, '_blank');
                    }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: 20, color: '#666' }}>
                    No results found for your search query.
                  </div>
                )}
              </>
            )}
          </NekoBlock>
        )}

        {results && results.success && debugInfo && results.method !== 'wordpress' && (
          <NekoBlock title="Search Debugging" className="primary">
            {debugInfo}
          </NekoBlock>
        )}

        {multiResults && !results && (
          <NekoTabs inversed title="Search Results" style={{ padding: 8 }}>
            {Object.entries(multiResults).map(([methodName, methodResults]) => {
              const formattedResults = formatResultsForMethod(methodResults, methodName);
              const columns = getColumnsForMethod(methodName);
              const debugInfoMethod = getDebugInfoForMethod(methodResults, methodName);

              const methodLabel = methodName === 'wordpress' ? 'WordPress' :
                methodName === 'keywords' ? 'AI Keywords' : 'Embeddings';

              return (
                <NekoTab key={methodName} title={methodLabel} inversed>
                  {methodResults.success === false && (
                    <NekoMessage variant="danger">
                      {methodResults.message}
                      {methodResults.debug && (
                        <div style={{ marginTop: 5, fontSize: 12 }}>
                          Debug: {methodResults.debug}
                        </div>
                      )}
                    </NekoMessage>
                  )}

                  {methodResults.success && (
                    <>
                      {formattedResults.length > 0 ? (
                        <NekoTable
                          data={formattedResults}
                          columns={columns}
                          onSelectRow={(id) => {
                            const url = `${window.location.origin}/?p=${id}`;
                            window.open(url, '_blank');
                          }}
                        />
                      ) : (
                        <div style={{ textAlign: 'center', padding: 20 }}>
                          No results found for your search query.
                        </div>
                      )}

                      {debugInfoMethod && (
                        <>
                          <NekoSpacer />
                          <div>
                            <strong>Search Debugging:</strong>
                            {debugInfoMethod}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </NekoTab>
              );
            })}
          </NekoTabs>
        )}
      </NekoColumn>

      <NekoColumn minimal style={{ flex: 1 }}>
        <NekoBlock title="Search Method" className="primary" busy={settingsBusy}>
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
              Frontend Search Method
            </label>
            <NekoSelect
              name="search_frontend_method"
              value={options?.search_frontend_method || 'wordpress'}
              onChange={updateOption}
              fullWidth
            >
              <NekoOption value="wordpress" label="WordPress" />
              <NekoOption value="keywords" label="AI Keywords" />
              <NekoOption value="embeddings" label="Embeddings" />
            </NekoSelect>
          </div>

          <div style={{ padding: 10, background: '#f9f9f9', borderRadius: 4, fontSize: 13 }}>
            <strong>Frontend Search:</strong>
            <p style={{ margin: '5px 0' }}>
              This controls how search widgets and blocks work on your website frontend.
              The method selected above will be used for all frontend searches.
            </p>
            <p style={{ margin: '5px 0' }}>
              Use the buttons above to test different methods before applying them to the frontend.
            </p>
          </div>
        </NekoBlock>

        <NekoTabs inversed title="Settings" style={{ marginTop: 10, padding: 8 }} busy={settingsBusy}>
          <NekoTab title="WordPress" inversed>
            <div style={{ padding: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 4, fontSize: 13 }}>
              <strong>WordPress Method:</strong>
              <p style={{ margin: '5px 0' }}>
                Uses the standard WordPress search functionality without any AI enhancements.
                This searches for exact matches of your query in post titles and content.
              </p>
              <p style={{ margin: '5px 0' }}>
                Results are ordered by relevance as determined by WordPress's built-in search algorithm.
              </p>
            </div>
          </NekoTab>

          <NekoTab title="AI Keywords" inversed>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                Website Context
              </label>
              <NekoTextArea
                name="search_website_context"
                value={options?.search_website_context || 'This is a website with useful information and content.'}
                onBlur={updateOption}
                rows={3}
                fullWidth
                description="Describe what your website is about to help AI generate better search keywords."
              />
            </div>

            <div style={{ padding: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 4, fontSize: 13 }}>
              <strong>AI Keywords Method:</strong>
              <p style={{ margin: '5px 0' }}>
                Uses a smart progressive search algorithm optimized for WordPress search.
                Searches progressively from high to low precision using simple words that authors actually write in posts.
              </p>
            </div>
          </NekoTab>

          <NekoTab title="Embeddings" inversed>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                Embeddings Environment
              </label>
              {!embeddingsEnabled ? (
                <NekoMessage variant="warning" style={{ fontSize: 13 }}>
                  The Embeddings module is not enabled. Please enable it in the Settings under Modules.
                </NekoMessage>
              ) : embeddingsEnvs.length > 0 ? (
                <NekoSelect
                  name="search_frontend_env_id"
                  value={options?.search_frontend_env_id || ''}
                  onChange={updateOption}
                  fullWidth
                  placeholder="Select environment..."
                >
                  {embeddingsEnvs.map(env => (
                    <NekoOption key={env.id} value={env.id} label={env.name} />
                  ))}
                </NekoSelect>
              ) : (
                <NekoMessage variant="info" style={{ fontSize: 13 }}>
                  No embeddings environments configured. Please configure one in the Knowledge tab.
                </NekoMessage>
              )}
            </div>

            <div style={{ padding: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 4, fontSize: 13 }}>
              <strong>Embeddings Method:</strong>
              <p style={{ margin: '5px 0' }}>
                Your search query will be converted into embeddings and compared against
                your indexed content for semantic similarity. This provides more intelligent
                results based on meaning rather than exact keyword matches.
              </p>
              <p style={{ margin: '5px 0' }}>
                Make sure you have content indexed in your selected embeddings environment.
              </p>
            </div>
          </NekoTab>
        </NekoTabs>
      </NekoColumn>
    </NekoWrapper>
  );
};

export default Search;