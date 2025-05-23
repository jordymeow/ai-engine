// Previous: 2.7.3
// Current: 2.8.2

const { useMemo, useState, useEffect } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { nekoFetch } from '@neko-ui';
import {
  NekoTable,
  NekoPaging,
  NekoBlock,
  NekoButton,
  NekoMessage
} from '@neko-ui';
import {
  tableDateTimeFormatter,
  tableUserIPFormatter,
  useModels
} from '@app/helpers-admin';

import { apiUrl, restNonce, options } from '@app/settings';
import i18n from '@root/i18n';

const logsColumns = [
  { accessor: 'id', visible: false },
  { accessor: 'time', title: 'Time', width: '80px', sortable: true },
  {
    accessor: 'user',
    title: 'User',
    width: '85px',
    filters: {
      type: 'text',
      description: 'Type a User ID, or an IP.'
    }
  },
  {
    accessor: 'scope',
    title: 'Scope',
    width: '90px',
    filters: {
      type: 'checkbox',
      options: [
        { value: 'chatbot', label: 'Chatbot' },
        { value: 'form', label: 'Form' },
        { value: 'playground', label: 'Playground' }
      ]
    }
  },
  { accessor: 'model', title: 'Model' },
  { accessor: 'units', title: 'Units', width: '65px', align: 'right', sortable: true },
  { accessor: 'price', title: 'Price', width: '85px', align: 'right', sortable: true }
];

const retrieveLogs = async (logsQueryParams) => {
  logsQueryParams.offset = (logsQueryParams.page - 1) * logsQueryParams.limit;
  const res = await nekoFetch(`${apiUrl}/system/logs/list`, {
    nonce: restNonce,
    method: 'POST',
    json: logsQueryParams
  });
  return res ? { total: res.total, logs: res.logs } : { total: 0, logs: [] };
};

const deleteLogs = async (logIds = []) => {
  const res = await nekoFetch(`${apiUrl}/system/logs/delete`, {
    nonce: restNonce,
    method: 'POST',
    json: { logIds }
  });
  return res;
};

const Queries = ({
  selectedLogIds,
  setSelectedLogIds,
  onDataFetched
}) => {
  const queryClient = useQueryClient();
  const [busyAction, setBusyAction] = useState(false);
  const { getModelName } = useModels(options, null, true);

  const [filters, setFilters] = useState(() =>
    logsColumns
      .filter((v) => v.filters)
      .map((v) => {
        return { accessor: v.accessor, value: [] };
      })
  );

  const [logsQueryParams, setLogsQueryParams] = useState(() => ({
    filters,
    sort: { accessor: 'time', by: 'desc' },
    page: 1,
    limit: 20
  }));

  const {
    isFetching: isFetchingLogs,
    data: logsData,
    error: logsError
  } = useQuery({
    queryKey: ['logs', logsQueryParams],
    queryFn: () => retrieveLogs(logsQueryParams)
  });

  useEffect(() => {
    setLogsQueryParams((prev) => ({ ...prev, filters }));
  }, [filters]);

  useEffect(() => {
    if (logsData?.logs && onDataFetched) {
      onDataFetched(logsData.logs);
    }
  }, [logsData?.logs, onDataFetched]);

  const logsTotal = useMemo(() => logsData?.total || 0, [logsData]);

  const logsRows = useMemo(() => {
    if (!logsData?.logs) {
      return [];
    }
    return logsData.logs
      .sort((a, b) => b.created_at - a.created_at)
      .map((x) => {
        const time = tableDateTimeFormatter(x.time);
        const user = tableUserIPFormatter(x.userId, x.ip);

        let simplifiedPrice = Math.round(x.price * 1000) / 1000;
        let jsxSimplifiedPrice = <>∞</>;
        if (x.price >= 0.1) {
          jsxSimplifiedPrice = (
            <b style={{ color: 'red' }}>${simplifiedPrice.toFixed(2)}</b>
          );
        } else if (x.price >= 0.01) {
          jsxSimplifiedPrice = <b>${simplifiedPrice.toFixed(2)}</b>;
        } else if (x.price >= 0.001) {
          jsxSimplifiedPrice = <b>${simplifiedPrice.toFixed(3)}</b>;
        }

        const envName =
          options?.ai_envs?.find((v) => v.id === x.envId)?.name || x.envId;

        const model = (
          <div>
            <span title={x.model}>
              {getModelName(x.model)}
              {x.mode === 'assistant' && <i> (Assistant)</i>}
            </span>
            <br />
            <small>{envName}</small>
          </div>
        );

        return {
          id: x.id,
          scope: (
            <div>
              {x.scope}
              <br />
              <small>{x.session}</small>
            </div>
          ),
          user,
          model,
          units: (
            <div style={{ textAlign: 'right' }}>
              {x.units}
              <br />
              <small>{x.type}</small>
            </div>
          ),
          price: (
            <>
              {jsxSimplifiedPrice}
              <br />
              <small>${x.price}</small>
            </>
          ),
          time: <div style={{ textAlign: 'right' }}>{time}</div>
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
    } else {
      await deleteLogs(selectedLogIds);
      setSelectedLogIds([]);
    }
    await queryClient.invalidateQueries({ queryKey: ['logs'] });
    queryClient.refetchQueries({ queryKey: ['logs'] });
    setBusyAction(false);
  };

  const emptyMessage = useMemo(() => {
    if (logsError?.message) {
      return (
        <NekoMessage variant="danger" style={{ margin: '5px 5px' }}>
          <b>{logsError.message}</b>
          <br />
          <small>
            Check your Console Logs and PHP Error Logs for more information.
          </small>
        </NekoMessage>
      );
    }
    return null;
  }, [logsError]);

  return (
    <>
      <NekoBlock
        className="primary"
        title={i18n.COMMON.QUERY_LOGS}
        action={
          <div>
            <NekoButton
              className="secondary"
              style={{ marginLeft: 5 }}
              disabled={isFetchingLogs}
              onClick={async () => {
                await queryClient.invalidateQueries({ queryKey: ['logs'] });
                queryClient.refetchQueries({ queryKey: ['logs'] });
              }}
            >
              {i18n.COMMON.REFRESH}
            </NekoButton>
            {selectedLogIds.length > 0 && (
              <NekoButton className="danger" onClick={onDeleteSelectedLogs}>
                {i18n.COMMON.DELETE}
              </NekoButton>
            )}
          </div>
        }
      >
        <NekoTable
          busy={isFetchingLogs || busyAction}
          onSelectRow={(id) => {
            if (selectedLogIds.includes(id)) {
              setSelectedLogIds((prev) => prev.filter((x) => x !== id));
            } else {
              setSelectedLogIds([...selectedLogIds, id]);
            }
          }}
          onSelect={(ids) => {
            setSelectedLogIds([...new Set([...selectedLogIds, ...ids])]);
          }}
          onUnselect={(ids) => {
            setSelectedLogIds(selectedLogIds.filter((x) => !ids.includes(x)));
          }}
          selectedItems={selectedLogIds}
          sort={logsQueryParams.sort}
          onSortChange={(accessor, by) => {
            setLogsQueryParams({ ...logsQueryParams, sort: { accessor, by } });
          }}
          emptyMessage={emptyMessage}
          filters={filters}
          onFilterChange={(accessor, value) => {
            const freshFilters = [
              ...filters.filter((x) => x.accessor !== accessor),
              { accessor, value }
            ];
            setFilters(freshFilters);
          }}
          data={logsRows}
          columns={logsColumns}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 10,
            marginBottom: -5
          }}
        >
          <NekoButton
            className="danger"
            disabled={selectedLogIds.length > 0}
            onClick={onDeleteSelectedLogs}
          >
            {i18n.COMMON.DELETE_ALL}
          </NekoButton>
          <div style={{ flex: 'auto' }} />
          <NekoPaging
            currentPage={logsQueryParams.page}
            limit={logsQueryParams.limit}
            onCurrentPageChanged={(page) =>
              setLogsQueryParams({ ...logsQueryParams, page })
            }
            total={logsTotal}
            onClick={(page) =>
              setLogsQueryParams({ ...logsQueryParams, page })
            }
          />
        </div>
      </NekoBlock>

      <NekoBlock className="primary" title="Information">
        <p>
          <b>Prices and tokens counts aren't accurate in many cases.</b>
        </p>
        <p>
          For more information, check this:{' '}
          <a
            href="https://www.notion.so/meowarts/Cost-Usage-Calculation-d5ce4917d77f4939b232b20d0082368a?pvs=4"
            target="_blank"
            rel="noreferrer"
          >
            Cost &amp; Usage Calculation
          </a>
          . You are also always welcome to discuss about it in the{' '}
          <a href="https://discord.gg/bHDGh38" target="_blank" rel="noreferrer">
            Discord Server
          </a>
          .
        </p>
      </NekoBlock>
    </>
  );
};

export default Queries;