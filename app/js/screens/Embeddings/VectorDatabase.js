// Previous: none
// Current: 1.1.7

const ENTRY_TYPES = {
  MANUAL: 'manual',
  POST_CONTENT: 'postContent',
  POST_FRAGMENT: 'postFragment'
}

const { useState, useMemo, useRef, useEffect } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { NekoButton, NekoSelect, NekoOption, NekoProgress, NekoModal, NekoTextArea, NekoInput,
  NekoQuickLinks, NekoLink, NekoTable, NekoPaging, NekoContainer, NekoSpacer } from '@neko-ui';
import { nekoFetch, useNekoTasks } from '@neko-ui';
import { apiUrl, restNonce, session } from '@app/settings';

const vectorsColumns = [
  { accessor: 'id', title: 'ID', width: '120px' },
  { accessor: 'vectorId', title: 'PostID', sortable: true, width: '120px' },
  { accessor: 'createdOn', title: 'Date', sortable: true, width: '80px' },
  { accessor: 'updatedOn', title: 'Date', sortable: true, width: '80px' },
  { accessor: 'actions', title: '' }
];

const defaultAddEmbedding = {
  title: '',
  content: '',
  entryType: ENTRY_TYPES.MANUAL
}

const retrieveVectors = async (vectorParams) => {
  vectorParams.offset = (vectorParams.page - 1) * vectorParams.limit;
  const res = await nekoFetch(`${apiUrl}/vectors`, { nonce: restNonce, method: 'POST', json: vectorParams });
  return res ? { total: res.total, vectors: res.vectors } : { total: 0, vectors: [] };
}

const VectorDatabase = () => {
  const queryClient = useQueryClient();
  const [ busy, setBusy ] = useState(false);
  const [ modal, setModal ] = useState(null);
  const [ vectorParams, setVectorsQueryParams ] = useState({
    filters: null, sort: { accessor: 'time', by: 'desc' }, page: 1, limit: 20
  });
  const { isFetching: isFetchingVectors, data: vectorsData } = useQuery({
    queryKey: ['vectors', vectorParams], queryFn: () => retrieveVectors(vectorParams),
    keepPreviousData: true
  });
  const [ currentTab, setCurrentTab ] = useState('all');

  const onAddEmbedding = () => {
    //setAddModal(false);
  }

  useEffect(() => {
    if (currentTab === 'all') {
      setVectorsQueryParams(prev => ({ ...prev, filters: null }));
    } else {
      setVectorsQueryParams(prev => ({ ...prev, filters: { env: currentTab } }));
    }
  }, [currentTab]);

  const vectorsTotal = useMemo(() => {
    return vectorsData?.total || 0;
  }, [vectorsData]);

  const vectorsRows = useMemo(() => {
    if (!vectorsData?.vectors) { return []; }
    return vectorsData.vectors.slice().sort((a, b) => b.created_at - a.created_at).map(x => {
      let time = new Date(x.time);
      time = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
      let formattedTime = time.toLocaleDateString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      return {
        id: x.id,
        env: x.env,
        units: x.units,
        type: x.type,
        price: <>${x.price}</>,
        time: formattedTime,
        // actions:  <NekoButton className="danger" rounded icon="trash"
        //   disabled={x.status !== 'succeeded'}
        //   onClick={() => deleteFineTune(currentModel)}>
        // </NekoButton>
      }
    })
  }, [vectorsData]);

  return (<>
    <NekoContainer style={{ margin: 10 }} contentStyle={{ padding: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <NekoButton className="primary" onClick={() => setModal(defaultAddEmbedding)}>Add New</NekoButton>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <NekoPaging currentPage={vectorParams.page} limit={vectorParams.limit}
            total={vectorsTotal} onClick={page => { 
              setVectorsQueryParams(prev => ({ ...prev, page }));
            }}
          />
          <NekoButton className="primary" style={{ marginLeft: 5 }} disabled={isFetchingVectors}
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['vectors'] });
          }}>Refresh</NekoButton>
        </div>
      </div>

      <NekoTable alternateRowColor busy={isFetchingVectors}
        sort={vectorParams.sort} onSortChange={(accessor, by) => {
          setVectorsQueryParams(prev => ({ ...prev, sort: { accessor, by } }));
        }}
        data={vectorsRows} columns={vectorsColumns} 
      />
    </NekoContainer>

    <NekoModal isOpen={Boolean(modal)}
        title="Add Embedding"
        onOkClick={onAddEmbedding}
        onRequestClose={() => setModal(null)}
        onCancelClick={() => setModal(null)}
        ok="Add Embedding"
        disabled={busy === 'addEmbedding'}
        content={<>
          <p>
            A custom embedding can be a sentence, a paragraph or a whole article. When an user input is made, the AI will search for the best embedding that matches the user input and will be able to answer with more accuracy.
          </p>
          <NekoSpacer height={30} />
          <label>Title:</label>
          <NekoSpacer />
          <NekoInput value={modal?.title} onChange={value => setModal(prev => ({ ...prev, title: value })) } />
          <NekoSpacer />
          <label>Content:</label>
          <NekoSpacer />
          <NekoTextArea value={modal?.content} onChange={value => setModal(prev => ({ ...prev, content: value })) } />
        </>
        }
      />
  </>);
}

export default VectorDatabase;