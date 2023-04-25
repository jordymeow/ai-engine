// Previous: 1.5.3
// Current: 1.6.5

const { useMemo, useState, useEffect } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { nekoFetch } from '@neko-ui';
import { NekoQuickLinks, NekoLink, NekoTable, NekoPaging, NekoButton } from '@neko-ui';
import { tableDateTimeFormatter, tableUserIPFormatter, useModels } from '@app/helpers';

import { apiUrl, restNonce, options } from '@app/settings';

const logsColumns = [
  { accessor: 'id', visible: false },
  { accessor: 'time', title: 'Time', width: '80px', sortable: true },
  { accessor: 'env',  title: 'Env', width: '90px' },
  { accessor: 'user', title: 'User', width: '85px' },
  { accessor: 'model', title: 'Model' },
  { accessor: 'units', title: 'Units', width: '65px', align: 'right', sortable: true },
  { accessor: 'price', title: 'Price', width: '85px', align: 'right', sortable: true }
];

const retrieveLogs = async (logsQueryParams) => {
  logsQueryParams.offset = (logsQueryParams.page - 1) * logsQueryParams.limit;
  const res = await nekoFetch(`${apiUrl}/logs`, { nonce: restNonce, method: 'POST', json: logsQueryParams });
  return res ? { total: res.total, logs: res.logs } : { total: 0, logs: [] };
}

const QueriesExplorer = ({ setSelectedLogIds, selectedLogIds }) => {
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
      setLogsQueryParams({ ...logsQueryParams, filters: null });
    } else {
      setLogsQueryParams({ ...logsQueryParams, filters: { env: currentTab } });
    }
  }, [currentTab]);

  const logsTotal = useMemo(() => {
    return logsData?.total || 0;
  }, [logsData]);

  const logsRows = useMemo(() => {
    if (!logsData?.logs) { return []; }
    return logsData.logs.slice().sort((a, b) => b.created_at - a.created_at).map(x => {
      let time = tableDateTimeFormatter(x.time);
      let user = tableUserIPFormatter(x.user, x.ip);

      const simplifiedPrice = Math.round(x.price * 1000) / 1000;
      let jsxSimplifiedPrice = <>{`∞`}</>;
      if (x.price >= 0.001) {
        jsxSimplifiedPrice = <b>${simplifiedPrice.toFixed(3)}</b>;
      }
      if (x.price >= 0.01) {
        jsxSimplifiedPrice = <b>${simplifiedPrice.toFixed(2)}</b>;
      }
      if (x.price >= 0.10) {
        jsxSimplifiedPrice = <b style={{ color: 'red' }}>${simplifiedPrice.toFixed(2)}</b>;
      }

      return {
        id: x.id,
        env: <div>{x.env}<br /><small>{x.session}</small></div>,
        user: user,
        model: <div><span title={x.model}>{getModelName(x.model)}</span><br /><small>{x.apiSrv} (key: {x.apiOwn})</small></div>,
        units: <div style={{ textAlign: 'right' }}>{x.units}<br /><small>{x.type}</small></div>,
        price: <>{jsxSimplifiedPrice}<br /><small>${x.price}</small></>,
        time: time,
      }
    })
  }, [logsData]);

  return (<>

    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
      <NekoQuickLinks value={currentTab} onChange={value => {
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
            total={logsTotal} onClick={page => { 
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

    <NekoTable busy={isFetchingLogs}
      onSelectRow={id => { setSelectedLogIds([id]) }}
      onSelect={ids => { setSelectedLogIds([ ...selectedLogIds, ...ids  ]) }}
      onUnselect={ids => { setSelectedLogIds([ ...selectedLogIds?.filter(x => !ids.includes(x)) ]) }}
      selectedItems={selectedLogIds}
      sort={logsQueryParams.sort} onSortChange={(accessor, by) => {
        setLogsQueryParams(prev => ({ ...prev, sort: { accessor, by } }));
      }}
      data={logsRows} columns={logsColumns} 
    />
  </>);
}

export default QueriesExplorer;