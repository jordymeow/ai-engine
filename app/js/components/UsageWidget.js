// Previous: none
// Current: 2.8.5

const { useState, useMemo, Fragment } = wp.element;

import { useModels } from '@app/helpers-admin';
import { Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useNekoColors } from '@neko-ui';
import {
  NekoSpacer,
  NekoQuickLinks,
  NekoLink,
  NekoAccordions,
  NekoAccordion,
} from '@neko-ui';
import i18n from "@root/i18n";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const UsageDetails = ({ month, usageData, groupBy }) => {
  if (usageData[month]?.length === 0) {
    return (
      <div style={{ width: 'calc(100% - 36px)', margin: '5px 18px 0px 18px', fontStyle: 'italic' }}>
        No data available.
      </div>
    );
  }

  return (
    <table style={{ width: 'calc(100% - 36px)', margin: '5px 18px 0px 18px', borderCollapse: 'collapse' }}>
      <tbody>
        {usageData[month].map((data, index) => {
          const dataType = data.isImage ? 'images' : data.isAudio ? 'seconds' : 'tokens';
          const formattedUnits = data.units.toLocaleString();
          
          if (groupBy === 'family' && data.models && data.models.length > 0) {
            return (
              <Fragment key={index}>
                <tr style={{ fontWeight: 'bold' }}>
                  <td style={{ paddingRight: 10 }}>{data.name}</td>
                  <td style={{ textAlign: 'right', paddingRight: 10 }}>{formattedUnits}</td>
                  <td style={{ paddingRight: 10 }}>{dataType}</td>
                  <td style={{ textAlign: 'right' }}>{data.price > 0 ? `${data.price.toFixed(4)}$` : '-'}</td>
                </tr>
                {data.models.map((model, modelIndex) => (
                  <tr key={`${index}-${modelIndex}`} style={{ fontSize: '0.9em', opacity: 0.8 }}>
                    <td style={{ paddingRight: 10, paddingLeft: 20 }}>↳ {model.modelId || model.rawName}</td>
                    <td style={{ textAlign: 'right', paddingRight: 10 }}>{model.units.toLocaleString()}</td>
                    <td style={{ paddingRight: 10 }}>{model.isImage ? 'images' : model.isAudio ? 'seconds' : 'tokens'}</td>
                    <td style={{ textAlign: 'right' }}>{model.price > 0 ? `${model.price.toFixed(4)}$` : '-'}</td>
                  </tr>
                ))}
              </Fragment>
            );
          }
          
          const displayLabel = data.name === 'Unknown Model' 
            ? `⚠️ ${data.rawName}` 
            : groupBy === 'model' && data.modelId
              ? data.modelId
              : data.name;
              
          return (
            <tr key={index}>
              <td style={{ paddingRight: 10 }}>{displayLabel}</td>
              <td style={{ textAlign: 'right', paddingRight: 10 }}>{formattedUnits}</td>
              <td style={{ paddingRight: 10 }}>{dataType}</td>
              <td style={{ textAlign: 'right' }}>{data.price > 0 ? `${data.price.toFixed(4)}$` : '-'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const UsageWidget = ({ options }) => {
  const { models, getModel, calculatePrice } = useModels(options, null, true);
  const ai_models_usage = options?.ai_models_usage;
  const ai_models_usage_daily = options?.ai_models_usage_daily;
  const { colors } = useNekoColors();

  const [groupBy, setGroupBy] = useState('family');
  const [metric, setMetric] = useState('price');
  const [viewMode, setViewMode] = useState('daily'); // 'monthly' or 'daily'
  
  // Debug logging (commented out for production)
  // console.log('=== Usage Widget Debug ===');
  // console.log('Current date/time:', new Date().toString());
  // console.log('Current timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
  // console.log('Monthly usage data:', ai_models_usage);
  // console.log('Daily usage data:', ai_models_usage_daily);
  // console.log('View mode:', viewMode);

  const calculateUsageData = () => {
    const usageData = {};
    const sourceData = viewMode === 'daily' ? (ai_models_usage_daily || {}) : (ai_models_usage || {});

    Object.keys(sourceData).forEach((period) => {
      const periodUsage = sourceData[period];
      if (!usageData[period]) usageData[period] = [];

      const usageMap = {};

      Object.keys(periodUsage).forEach((model) => {
        const modelUsage = periodUsage[model];
        const modelObj = getModel(model);

        let inUnits = null;
        let outUnits = null;
        let isAudio = false;
        let isImage = false;

        if (modelObj) {
          if (modelObj.type === 'image') {
            outUnits = modelUsage?.images || 0;
            isImage = true;
          } else if (modelObj.type === 'second') {
            outUnits = modelUsage?.seconds || 0;
            isAudio = true;
          } else {
            inUnits = modelUsage?.prompt_tokens || 0;
            outUnits = modelUsage?.completion_tokens || 0;
          }
        } else {
          inUnits = modelUsage?.prompt_tokens || 0;
          outUnits = modelUsage?.completion_tokens || 0;
        }

        const price = modelObj ? calculatePrice(model, inUnits, outUnits) : 0;
        const units = isImage ? outUnits : inUnits + outUnits;

        const groupKey = groupBy === 'family' && modelObj?.family 
          ? modelObj.family 
          : model;

        const displayName = groupBy === 'family' && modelObj?.family
          ? modelObj.family
          : (modelObj ? modelObj.rawName : 'Unknown Model');

        if (!usageMap[groupKey]) {
          usageMap[groupKey] = {
            name: displayName,
            rawName: model,
            modelId: model,
            units: 0,
            price: 0,
            isImage,
            isAudio,
            family: modelObj ? modelObj.family : null,
            models: [],
          };
        }

        usageMap[groupKey].units += units;
        usageMap[groupKey].price += price;
        
        if (groupBy === 'family' && modelObj?.family) {
          usageMap[groupKey].models.push({
            name: modelObj.rawName,
            rawName: model,
            modelId: model,
            units,
            price,
            isImage,
            isAudio,
          });
        }
      });

      usageData[period] = Object.values(usageMap);
      usageData[period].sort((a, b) => b.price - a.price);
    });

    return usageData;
  };

  const usageData = useMemo(calculateUsageData, [ai_models_usage, ai_models_usage_daily, models, viewMode, groupBy]);

  const fullRangeUsageData = useMemo(() => {
    const now = new Date();
    const fullData = {};
    
    if (viewMode === 'daily') {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        fullData[dateKey] = usageData[dateKey] || [];
      }
    } else {
      const months = Object.keys(usageData).sort();
      let earliestDate = now;
      
      if (months.length > 0) {
        const [year, month] = months[0].split('-');
        earliestDate = new Date(year, month - 1, 1);
      }
      
      const elevenMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      const startDate = earliestDate < elevenMonthsAgo ? earliestDate : elevenMonthsAgo;
      
      const currentDate = new Date(startDate);
      
      while (
        currentDate.getFullYear() < now.getFullYear() || 
        (currentDate.getFullYear() === now.getFullYear() && currentDate.getMonth() <= now.getMonth())
      ) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const monthKey = `${year}-${month}`;
        fullData[monthKey] = usageData[monthKey] || [];
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }
    return fullData;
  }, [usageData, viewMode]);

  const chartData = useMemo(() => {
    const labels = Object.keys(fullRangeUsageData).sort();
    const datasets = [];
    const fixedColors = [colors.blue, colors.green, colors.yellow, colors.orange, colors.red, colors.purple];

    if (groupBy === 'model') {
      models.forEach((model, index) => {
        const modelId = model.model;
        const modelName = model.rawName;
        const data = labels.map((month) => {
          const monthData = fullRangeUsageData[month]?.find((d) => d.modelId === modelId || d.rawName === modelId);
          return metric === 'tokens'
            ? monthData ? Math.max(monthData.units, 1) : 0
            : monthData ? Math.max(monthData.price, 0.01) : 0;
        });

        if (data.some((value) => value > 0)) {
          datasets.push({
            label: modelName,
            data,
            backgroundColor: fixedColors[index % fixedColors.length],
          });
        }
      });

      const unknownModels = labels.map((month) => {
        const monthData = fullRangeUsageData[month]?.filter((d) => d.name === 'Unknown Model');
        return monthData.reduce(
          (acc, curr) => acc + (metric === 'tokens' ? Math.max(curr.units, 1) : Math.max(curr.price, 0.01)),
          0
        );
      });

      if (unknownModels.some((value) => value > 0)) {
        datasets.push({
          label: 'Unknown Model',
          data: unknownModels,
          backgroundColor: 'rgba(128, 128, 128, 0.5)',
        });
      }
    } else if (groupBy === 'family') {
      const familyData = {};

      labels.forEach((month) => {
        const monthData = fullRangeUsageData[month] || [];
        monthData.forEach((data) => {
          const familyName = data.name;
          if (!familyData[familyName]) {
            familyData[familyName] = Array(labels.length).fill(0);
          }
          const value = metric === 'tokens'
            ? Math.max(data.units, 1)
            : Math.max(data.price, 0.01);
          const monthIndex = labels.indexOf(month);
          familyData[familyName][monthIndex] += value;
        });
      });

      Object.keys(familyData).forEach((familyName, index) => {
        datasets.push({
          label: familyName,
          data: familyData[familyName],
          backgroundColor: fixedColors[index % fixedColors.length],
        });
      });
    }

    return {
      labels,
      datasets,
    };
  }, [fullRangeUsageData, models, groupBy, metric, colors]);

  const simplifiedLegendData = useMemo(() => {
    const legendCounts = {};
    chartData.datasets.forEach((dataset) => {
      const label = dataset.label;
      if (!legendCounts[label]) legendCounts[label] = 0;
      dataset.data.forEach((value) => {
        legendCounts[label] += value;
      });
    });

    const topLabels = Object.entries(legendCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([label]) => label);

    return chartData.datasets.filter((dataset) => topLabels.includes(dataset.label));
  }, [chartData]);

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          filter: (legendItem) => simplifiedLegendData.some((dataset) => dataset.label === legendItem.text),
        },
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <>
      {ai_models_usage && Object.keys(ai_models_usage).length === 0 && (
        <div style={{ fontStyle: 'italic' }}>No data available.</div>
      )}
      {ai_models_usage && Object.keys(ai_models_usage).length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <NekoQuickLinks name="metric" value={metric} onChange={setMetric}>
                <NekoLink title="Price" value="price" />
                <NekoLink title="Units" value="tokens" />
              </NekoQuickLinks>
              
              <NekoQuickLinks name="groupBy" value={groupBy} onChange={setGroupBy}>
                <NekoLink title="Family" value="family" />
                <NekoLink title="Model" value="model" />
              </NekoQuickLinks>
            </div>
            
            <NekoQuickLinks name="viewMode" value={viewMode} onChange={setViewMode}>
              <NekoLink title="Daily" value="daily" />
              <NekoLink title="Monthly" value="monthly" />
            </NekoQuickLinks>
          </div>

          <NekoSpacer size="medium" />

          <Bar options={chartOptions} data={chartData} />

          <NekoSpacer size="medium" />

          <NekoAccordions keepState="monthlyUsageCategories">
            {Object.keys(fullRangeUsageData)
              .sort()
              .reverse()
              .filter(period => {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const currentMonthKey = `${year}-${month}`;
                const currentDayKey = now.toISOString().split('T')[0];
                
                if (viewMode === 'monthly' && period === currentMonthKey) {
                  return true;
                }
                if (viewMode === 'daily' && period === currentDayKey) {
                  return true;
                }
                return fullRangeUsageData[period].length > 0;
              })
              .map((period, index) => {
                const periodData = fullRangeUsageData[period] || [];
                const totalPrice = periodData.reduce((acc, curr) => acc + curr.price, 0).toFixed(2);
                const isDaily = viewMode === 'daily';
                const icon = isDaily ? '📅' : '🗓️';
                let displayPeriod = period;
                if (isDaily) {
                  const date = new Date(period + 'T00:00:00');
                  displayPeriod = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                }
                return (
                  <NekoAccordion key={index} title={`${icon} ${displayPeriod} (${totalPrice}$)`}>
                    <UsageDetails month={period} usageData={fullRangeUsageData} groupBy={groupBy} />
                  </NekoAccordion>
                );
              })}
          </NekoAccordions>

          <NekoSpacer size="medium" />

          <div style={{ fontSize: 'var(--neko-small-font-size)', color: 'var(--neko-gray-60)' }}>
            {i18n.COMMON.USAGE_ESTIMATES_NOTE}
          </div>
        </>
      )}
    </>
  );
};

export default UsageWidget;