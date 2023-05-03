// Previous: 1.6.59
// Current: 1.6.64

const { useMemo, useState, useEffect } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { nekoFetch } from '@neko-ui';
import { NekoTable, NekoPaging, NekoBlock, NekoButton } from '@neko-ui';
import { tableDateTimeFormatter, tableUserIPFormatter, useModels } from '@app/helpers';

import { apiUrl, restNonce, options } from '@app/settings';
import i18n from '../../../i18n';

const logsColumns = [
  { accessor: 'id', visible: false },
  { accessor: 'time', title: 'Time', width: '80px', sortable: true },
  { accessor: 'env',  title: 'Env', width: '90px',
    filters: {
      type: 'checkbox',
      options: [
        { value: 'chatbot', label: 'Chatbot' },
        { value: 'form', label: 'Form' },
        { value: 'playground', label: 'Playground' }
      ]
    },
  },
  { accessor: 'user', title: 'User', width: '85px',
    filters: {
      type: 'text',
      description: "Type an User ID, or an IP."
    }
  },
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
  const { getModelName } = useModels(options);
  const [ filters, setFilters ] = useState(() => {
    return logsColumns.filter(v => v.filters).map(v => {
      return { accessor: v.accessor, value: [] }
    });
  });
  const [ logsQueryParams, setLogsQueryParams ] = useState({
    filters: filters, sort: { accessor: 'time', by: 'desc' }, page: 1, limit: 20
  });
  const { isFetching: isFetchingLogs, data: logsData } = useQuery({
    queryKey: ['logs', logsQueryParams], queryFn: () => retrieveLogs(logsQueryParams),
    keepPreviousData: true
  });

  useEffect(() => {
    setLogsQueryParams({ ...logsQueryParams, filters: filters });
  }, [filters]);

  const logsTotal = useMemo(() => {
    return logsData?.total || 0;
  }, [logsData]);

  const logsRows = useMemo(() => {
    if (!logsData?.logs) { return []; }
    return logsData?.logs.sort((a, b) => b.created_at - a.created_at).map(x => {
      let time = tableDateTimeFormatter(x.time);
      let user = tableUserIPFormatter(x.userId, x.ip);

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
        time: time
      }
    })
  }, [logsData]);

  return (<>
    <NekoBlock className="primary" title={i18n.COMMON.QUERIES} action={
      <NekoButton className="secondary" style={{ marginLeft: 5 }} disabled={isFetchingLogs}
        onClick={() => {
          queryClient.invalidateQueries({ queryKey: ['logs'] });
      }}>Refresh</NekoButton>
    }>

      <NekoTable busy={isFetchingLogs}
        onSelectRow={id => { setSelectedLogIds([id]) }}
        onSelect={ids => { setSelectedLogIds([ ...selectedLogIds, ...ids  ]) }}
        onUnselect={ids => { setSelectedLogIds([ ...selectedLogIds?.filter(x => !ids.includes(x)) ]) }}
        selectedItems={selectedLogIds}
        sort={logsQueryParams.sort} onSortChange={(accessor, by) => {
          setLogsQueryParams({ ...logsQueryParams, sort: { accessor, by } });
        }}
        filters={filters}
        onFilterChange={(accessor, value) => {
          const freshFilters = [
            ...filters.filter(x => x.accessor !== accessor),
            { accessor, value }
          ];
          setFilters(freshFilters);
        }}
        data={logsRows} columns={logsColumns} 
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, marginBottom: -5 }}>
        <div>
        </div>
        <div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <NekoPaging currentPage={logsQueryParams.page} limit={logsQueryParams.limit}
              total={logsTotal} onClick={page => { 
                setLogsQueryParams({ ...logsQueryParams, page });
              }}
            />
          </div>
        </div>
      </div>
    </NekoBlock>

  </>);
}

export default QueriesExplorer;