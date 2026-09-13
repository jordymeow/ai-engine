// Previous: none
// Current: 3.7.8

// useUsageSummary.js
//
// One place that turns `ai_models_usage_daily` into numbers a dashboard can
// speak about: the last N days as a series, this week vs last week, and the
// provider split. UsageWidget has its own richer aggregation (metric + view
// mode); this hook is the small, always-daily summary the Dashboard Pulse and
// similar surfaces need, so they do not each re-derive prices.

const { useMemo } = wp.element;
import { useModels } from '@app/helpers-admin';

const dayKey = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const emptyDay = (key) => ({ key, price: 0, queries: 0, tokens: 0, byProvider: {} });

export default function useUsageSummary(options, days = 14) {
  const { getModel, calculatePrice } = useModels(options, null, true);
  const daily = options?.ai_models_usage_daily;

  const modelToProvider = useMemo(() => {
    const map = {};
    (options?.ai_engines || []).forEach((engine) => {
      (engine.models || []).forEach((m) => { if (m.model) map[m.model] = engine.type; });
    });
    (options?.ai_models || []).forEach((m) => { if (m.model && m.type) map[m.model] = m.type; });
    return map;
  }, [options?.ai_engines, options?.ai_models]);

  return useMemo(() => {
    const series = [];
    for (let i = days - 1; i >= 0; i--) {
      const key = dayKey(i);
      const row = emptyDay(key);
      const usage = (daily && daily[key]) || {};
      Object.keys(usage).forEach((modelId) => {
        const u = usage[modelId] || {};
        const modelObj = getModel(modelId);
        const provider = modelToProvider[modelObj?.model] || modelToProvider[modelId] || 'unknown';
        const price = modelObj ? calculatePrice(modelId, u.prompt_tokens || 0, u.completion_tokens || 0) : 0;
        const queries = u.queries || 0;
        const tokens = (u.prompt_tokens || 0) + (u.completion_tokens || 0);
        row.price += price;
        row.queries += queries;
        row.tokens += tokens;
        row.byProvider[provider] = (row.byProvider[provider] || 0) + queries;
      });
      series.push(row);
    }
    const sum = (rows) => rows.reduce((acc, r) => ({
      price: acc.price + r.price,
      queries: acc.queries + r.queries,
      tokens: acc.tokens + r.tokens,
    }), { price: 0, queries: 0, tokens: 0 });
    const week = sum(series.slice(-7));
    const prevWeek = sum(series.slice(-14, -7));
    const providerQueries = {};
    series.slice(-7).forEach((r) => {
      Object.entries(r.byProvider).forEach(([p, q]) => { providerQueries[p] = (providerQueries[p] || 0) + q; });
    });
    const providers = Object.entries(providerQueries).sort((a, b) => b[1] - a[1]);
    const hasData = !!daily && Object.keys(daily).length > 0;
    const peak = Math.max(0, ...series.map(r => r.queries));
    return { series, week, prevWeek, providers, hasData, peak };
  }, [daily, days, getModel, calculatePrice, modelToProvider]);
}
