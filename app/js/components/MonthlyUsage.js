// Previous: 2.6.9
// Current: 2.8.3

const { useState, useMemo } = wp.element;

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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const UsageDetails = ({ month, usageData }) => {
  if (usageData[month].length === 0) {
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
          return (
            <tr key={index}>
              <td style={{ paddingRight: 10 }}>{data.name === 'Unknown Model' ? `⚠️ ${data.rawName}` : data.name}</td>
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

const MonthlyUsage = ({ options }) => {
  const { models, getModel, calculatePrice } = useModels(options, null, true);
  const ai_models_usage = options?.ai_models_usage;
  const { colors } = useNekoColors();

  const [groupBy, setGroupBy] = useState('model');
  const [metric, setMetric] = useState('tokens');

  const calculateUsageData = () => {
    const usageData = {};

    Object.keys(ai_models_usage).forEach((month) => {
      const monthUsage = ai_models_usage[month];
      if (!usageData[month]) usageData[month] = [];

      const modelUsageMap = {};

      Object.keys(monthUsage).forEach((model) => {
        const modelUsage = monthUsage[model];
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
        const name = modelObj ? modelObj.rawName : 'Unknown Model';
        const rawName = model;

        if (!modelUsageMap[name]) {
          modelUsageMap[name] = {
            name,
            rawName,
            units: 0,
            price: 0,
            isImage,
            isAudio,
            family: modelObj ? modelObj.family : null,
          };
        }

        modelUsageMap[name].units += isImage ? outUnits : inUnits + outUnits;
        modelUsageMap[name].price += price;
      });

      usageData[month] = Object.values(modelUsageMap);
      usageData[month].sort((a, b) => b.price - a.price);
    });

    return usageData;
  };

  const usageData = useMemo(calculateUsageData, [ai_models_usage, models]);

  const chartData = useMemo(() => {
    const labels = Object.keys(usageData);
    const datasets = [];
    const fixedColors = [colors.blue, colors.green, colors.yellow, colors.orange, colors.red, colors.purple];

    if (groupBy === 'model') {
      models.forEach((model, index) => {
        const modelName = model.rawName;
        const data = labels.map((month) => {
          const monthData = usageData[month]?.find((data) => data.name === modelName || data.rawName === modelName);
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
        const monthData = usageData[month]?.filter((data) => data.name === 'Unknown Model');
        return monthData.reduce((acc, curr) => acc + (metric === 'tokens' ? Math.max(curr.units, 1) : Math.max(curr.price, 0.01)), 0);
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
        const monthData = usageData[month];
        monthData.forEach((data) => {
          const familyName = data.family;
          if (familyName) {
            if (!familyData[familyName]) {
              familyData[familyName] = Array(labels.length).fill(0);
            }
            const value = metric === 'tokens'
              ? Math.max(data.units, 1)
              : Math.max(data.price, 0.01);
            const monthIndex = labels.indexOf(month);
            familyData[familyName][monthIndex] += value;
          }
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
  }, [usageData, models, groupBy, metric, colors]);

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
        <div style={{ fontStyle: 'italic' }}>
          No data available.
        </div>
      )}
      {ai_models_usage && Object.keys(ai_models_usage).length > 0 && (
        <>
          <NekoQuickLinks name="groupBy" value={`${groupBy}-${metric}`} onChange={(value) => {
            const [newGroupBy, newMetric] = value.split('-');
            setGroupBy(newGroupBy);
            setMetric(newMetric);
          }}>
            <NekoLink title="Units by Model" value="model-tokens" />
            <NekoLink title="Price by Model" value="model-price" />
            <NekoLink title="Units by Family" value="family-tokens" />
            <NekoLink title="Price by Family" value="family-price" />
          </NekoQuickLinks>

          <NekoSpacer size="medium" />

          <Bar options={chartOptions} data={chartData} />

          <NekoSpacer size="medium" />

          <NekoAccordions keepState="monthlyUsageCategories">
            {Object.keys(usageData).reverse().map((month, index) => (
              <NekoAccordion key={index} title={`🗓️ ${month} (${usageData[month].reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}$)`}>
                <UsageDetails month={month} usageData={usageData} />
              </NekoAccordion>
            ))}
          </NekoAccordions>
        </>
      )}
    </>
  );
};

export default MonthlyUsage;