// Previous: 1.1.0
// Current: 1.1.8

const { useMemo, useState, useEffect } = wp.element;

import { apiUrl, restNonce, options } from '@app/settings';

import { NekoQuickLinks, NekoLink, NekoTable, NekoPaging, NekoButton } from '@neko-ui';
import { nekoFetch } from '@neko-ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useModels } from '../helpers';

const logsColumns = [
  { accessor: 'id', title: 'ID', width: '50px' },
  { accessor: 'env',  title: 'Env', width: '80px' },
  { accessor: 'ip', title: 'IP', width: '85px' },
  { accessor: 'userId', title: 'User', width: '45px' },
  { accessor: 'model', title: 'Model', width: '160px' },
  { accessor: 'units', title: 'Units', width: '65px', align: 'right', sortable: true },
  { accessor: 'type', title: 'Type', width: '50px' },
  { accessor: 'price', title: 'Price', width: '75px', align: 'right', sortable: true },
  { accessor: 'time', title: 'Time', width: '200px', sortable: true }
];

const retrieveLogs = async (logsQueryParams) => {
  logsQueryParams.offset = (logsQueryParams.page - 1) * logsQueryParams.limit;
  const res = await nekoFetch(`${apiUrl}/logs`, { nonce: restNonce, method: 'POST', json: logsQueryParams });
  return res ? { total: res.total, logs: res.logs } : { total: 0, logs: [] };
}

const LogsExplorer = () => {
  const queryClient = useQueryClient();
  const [ logsQueryParams, setLogsQueryParams ] = useState({
    filters: null, sort: { accessor: 'time', by: 'desc' }, page: 1, limit: 20
  });
  const { isFetching: isFetchingLogs, data: logsData } = useQuery({
    queryKey: ['logs', logsQueryParams], queryFn: () => retrieveLogs(logsQueryParams),
    keepPreviousData: true
  });
  const [ currentTab, setCurrentTab ] = useState('all');
  const { getModelName } = useModels(options);

  useEffect(() => {
    if (currentTab === 'all') {
      setLogsQueryParams(prev => ({ ...prev, filters: null }));
    } else {
      setLogsQueryParams(prev => ({ ...prev, filters: { env: currentTab } }));
    }
  }, [currentTab]);

  const logsTotal = useMemo(() => {
    return logsData?.total ?? 0;
  }, [logsData]);

  const logsRows = useMemo(() => {
    if (!logsData?.logs) { return []; }
    return logsData.logs.slice().sort((a, b) => b.created_at - a.created_at).map(x => {
      let time = new Date(x.time);
      time = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
      let formattedTime = time.toLocaleDateString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      return {
        id: x.id,
        env: x.env,
        ip: x.ip,
        userId: x.userId ? <a target="_blank" rel="noopener" href={`/wp-admin/user-edit.php?user_id=${x.userId}`}>{x.userId}</a> : '-',
        model: <span title={x.model}>{getModelName(x.model)}</span>,
        units: x.units,
        type: x.type,
        price: <>${x.price}</>,
        time: formattedTime,
      }
    });
  }, [logsData, getModelName]);

  return (<>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
      <NekoQuickLinks value={currentTab} onChange={(value) => {
          setCurrentTab(value);
          setLogsQueryParams(prev => ({ ...prev, page: 1 }));
        }}>
        <NekoLink title="All" value='all' />
        <NekoLink title="Chatbot" value='chatbot' />
        <NekoLink title="Form" value='form' />
        <NekoLink title="Playground" value='playground' />
      </NekoQuickLinks>
      <div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <NekoPaging currentPage={logsQueryParams.page} limit={logsQueryParams.limit}
            total={logsTotal} onClick={(page) => { 
              setLogsQueryParams(prev => ({ ...prev, page }));
            }}
          />
          <NekoButton className="primary" style={{ marginLeft: 5 }} disabled={isFetchingLogs}
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['logs'] });
          }}>Refresh</NekoButton>
        </div>
      </div>
    </div>

    <NekoTable alternateRowColor busy={isFetchingLogs}
      sort={logsQueryParams.sort} onSortChange={(accessor, by) => {
        setLogsQueryParams(prev => ({ ...prev, sort: { accessor, by } }));
      }}
      data={logsRows} columns={logsColumns} 
    />
  </>);
}

export default LogsExplorer;