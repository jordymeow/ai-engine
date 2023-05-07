// Previous: 1.2.2
// Current: 1.6.72

import { NekoTypo } from '@neko-ui';
import { useModels } from "../helpers";

// React & Vendor Libs
const { __ } = wp.i18n;
const { useMemo, useState } = wp.element;

const UsageDetails = ({ month, usageData }) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [isExpanded, setIsExpanded] = useState(currentMonth == month);
  
  return <li>
    <strong style={{ marginLeft: 5, cursor: 'pointer' }} onClick={() => setIsExpanded(!isExpanded)}>
      🗓️ {month} ({usageData[month].totalPrice.toFixed(2)}$) 
      <span style={{ marginLeft: 5 }}>
        {isExpanded ? '🔽' : '🔼'}
      </span>
    </strong>
    <ul>
      {isExpanded && usageData[month].data.map((data, index) => {
        let dataType = data.isImage ? 'images' : data.isAudio ? 'seconds' : 'tokens';
        return (
          <li key={index} style={{ marginTop: 5, marginLeft: 18 }}>
            <strong>• {data.name}</strong>
            {`: ${data.usage} ${dataType}`}
            {data.price > 0 && ` (${data.price.toFixed(4)}$)`}
          </li>
        );
      })}
    </ul>
  </li>;
}

const MonthlyUsage = ({ options }) => {
  const { models, getModelName, getModel, calculatePrice } = useModels(options);
  const openai_usage = options?.openai_usage;

  const jsxUsage = useMemo(() => {
    let usageData = {};
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      Object.keys(openai_usage).forEach((month) => {
        const monthUsage = openai_usage[month];
        if (!usageData[month]) usageData[month] = { totalPrice: 0, data: [] }
        Object.keys(monthUsage).forEach((model) => {
          const modelUsage = monthUsage[model];
          const modelObj = getModel(model);
          if (modelObj) {
            let usage = null;
            let isAudio = false;
            let isImage = false;
            if (modelObj.type === 'image') {
              usage = modelUsage?.images || 0;
              isImage = true;
            }
            else if (modelObj.type === 'second') {
              usage = modelUsage?.seconds || 0;
              isAudio = true;
            }
            else {
              usage = modelUsage?.total_tokens || 0;
            }
            let price = calculatePrice(model, usage);
            usageData[month].totalPrice += price;
            usageData[month].data.push({ name: getModelName(model), isImage, isAudio, usage, price });
          }
          else if (month === currentMonth) {
            // Only show this error for the current month.
            console.warn(`Cannot find price for model ${model}.`);
          }
        });
      });
      
      Object.keys(usageData).forEach((month) => {
        usageData[month].data.sort((a, b) => b.price - a.price);
      });
    }
    catch (e) {
      console.error(e);
    }

    return (
      <ul style={{ marginLeft: -7, marginTop: 10, marginBottom: 0, paddingBottom: 0 }}>
        {Object.keys(usageData).reverse().map((month, index) =>
          <UsageDetails key={index} month={month} usageData={usageData} />
        )}
      </ul>
    );
  }, [ openai_usage, models ]);

  return (<>
    {!!openai_usage && !!Object.keys(openai_usage).length && jsxUsage}
  </>);
}

export default MonthlyUsage;


