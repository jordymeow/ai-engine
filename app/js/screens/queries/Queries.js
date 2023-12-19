// Previous: 2.0.5
// Current: 2.0.9

const { useMemo, useState, useEffect } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { nekoFetch } from '@neko-ui';
import { NekoTable, NekoPaging, NekoBlock, NekoButton } from '@neko-ui';
import { tableDateTimeFormatter, tableUserIPFormatter, useModels } from '@app/helpers-admin';

import { apiUrl, restNonce, options } from '@app/settings';
import i18n from '@root/i18n';

const logsColumns = [
  { accessor: 'id', visible: false },
  { accessor: 'time', title: 'Time', width: '80px', sortable: true },
  { accessor: 'scope',  title: 'Scope', width: '90px',
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
  const res = await nekoFetch(`${apiUrl}/system/logs/list`, { nonce: restNonce, method: 'POST', json: logsQueryParams });
  return res ? { total: res.total, logs: res.logs } : { total: 0, logs: [] };
};

const deleteLogs = async (logIds = []) => {
  const res = await nekoFetch(`${apiUrl}/system/logs/delete`, { nonce: restNonce, method: 'POST', json: { logIds } });
  return res;
};

const Queries = ({ setSelectedLogIds, selectedLogIds }) => {
  const queryClient = useQueryClient();
  const [ busyAction, setBusyAction ] = useState(false);
  const { getModelName } = useModels(options, null, true);
  const [ filters, setFilters ] = useState(() => {
    return logsColumns.filter(v => v.filters).map(v => {
      return { accessor: v.accessor, value: [] };
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
    setLogsQueryParams(prev => ({ ...prev, filters: filters }));
  }, [filters]);

  const logsTotal = useMemo(() => {
    return logsData?.total || 0;
  }, [logsData]);

  const logsRows = useMemo(() => {
    if (!logsData?.logs) { return []; }
    return logsData?.logs.sort((a, b) => b.created_at - a.created_at).map(x => {
      const time = tableDateTimeFormatter(x.time);
      const user = tableUserIPFormatter(x.userId, x.ip);
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

      const envName = options?.ai_envs?.find(v => v.id === x.envId)?.name || x.envId;

      let model = <div>
        <span title={x.model}>{getModelName(x.model)}{x.mode === 'assistant' && <i> (Assistant)</i>}</span><br />
        <small>{envName}</small>
      </div>;

      return {
        id: x.id,
        scope: <div>{x.scope}<br /><small>{x.session}</small></div>,
        user: user,
        model: model,
        units: <div style={{ textAlign: 'right' }}>{x.units}<br /><small>{x.type}</small></div>,
        price: <>{jsxSimplifiedPrice}<br /><small>${x.price}</small></>,
        time: time
      };
    });
  }, [logsData]);

  const onDeleteSelectedLogs = async () => {
    setBusyAction(true);
    if (!selectedLogIds.length) {
      if (!window.confirm(i18n.ALERTS.ARE_YOU_SURE)) { 
        setBusyAction(false);
        return;
      }
      await deleteLogs();
    }
    else {
      await deleteLogs(selectedLogIds);
      setSelectedLogIds([]);
    }
    await queryClient.invalidateQueries({ queryKey: ['logs'] });
    await queryClient.refetchQueries({ queryKey: ['logs'] });
    setBusyAction(false);
  };

  return (<>
    <NekoBlock className="primary" title={i18n.COMMON.QUERIES} action={<>
      <div>
        <NekoButton className="secondary" style={{ marginLeft: 5 }} disabled={isFetchingLogs}
          onClick={async () => {
            await queryClient.invalidateQueries({ queryKey: ['logs'] });
            queryClient.refetchQueries({ queryKey: ['logs'] });
          }}>{i18n.COMMON.REFRESH}</NekoButton>
        {selectedLogIds.length > 0 && <>
          <NekoButton className="danger" disabled={false}
            onClick={onDeleteSelectedLogs}>
            {i18n.COMMON.DELETE}
          </NekoButton>
        </>}
      </div>
    </>}>

      <NekoTable busy={isFetchingLogs || busyAction}
        onSelectRow={id => { setSelectedLogIds([id]); }}
        onSelect={ids => { setSelectedLogIds([ ...selectedLogIds, ...ids  ]); }}
        onUnselect={ids => { setSelectedLogIds([ ...selectedLogIds?.filter(x => !ids.includes(x)) ]); }}
        selectedItems={selectedLogIds}
        sort={logsQueryParams.sort} onSortChange={(accessor, by) => {
          setLogsQueryParams(prev => ({ ...prev, sort: { accessor, by } }));
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
        <NekoButton className="danger" disabled={selectedLogIds.length}
          onClick={onDeleteSelectedLogs}>
          {i18n.COMMON.DELETE_ALL}
        </NekoButton>
        <div style={{ flex: 'auto' }} />
        <NekoPaging currentPage={logsQueryParams.page} limit={logsQueryParams.limit}
          total={logsTotal} onClick={page => { 
            setLogsQueryParams(prev => ({ ...prev, page }));
          }}
        />
      </div>
    </NekoBlock>

  </>);
};

export default Queries;