// Previous: none
// Current: 1.1.9

import { useModels } from "../helpers";

// React & Vendor Libs
const { __ } = wp.i18n;
const { useMemo, useState } = wp.element;

const UsageDetails = ({ month, usageData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return <li>
    <strong style={{ marginLeft: 5, cursor: 'pointer' }} onClick={() => setIsExpanded(!isExpanded)}>
      🗓️ {month} ({usageData[month].totalPrice.toFixed(2)}$) 
      <span style={{ marginLeft: 5 }}>
        {isExpanded ? '🔽' : '🔼'}
      </span>
    </strong>
    <ul>
      {isExpanded && usageData[month].data.map((data, index) => {
        return (
          <li key={index} style={{ marginTop: 5, marginLeft: 18 }}>
            <strong>• {data.name}</strong>
            {data.isImage && `: ${data.usage} images`}
            {!data.isImage && `: ${data.usage} tokens`}
            {data.price > 0 && ` (${data.price.toFixed(4)}$)`}
          </li>
        );
      })}
    </ul>
  </li>;
}

const Usage = ({ options }) => {
  const { models, isFineTunedModel, getFamilyName, getModelName, getModel, calculatePrice } = useModels(options);
  const openai_usage = options?.openai_usage;
  const openai_models = options?.openai_models;

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
            let price = calculatePrice(model, modelUsage?.total_tokens || modelUsage?.images || 0);
            usageData[month].totalPrice += price;
            usageData[month].data.push({ 
              name: getModelName(model),
              isImage: modelObj.type === 'image',
              usage: modelObj.type === 'image' ? modelUsage.images : modelUsage.total_tokens,
              price: price
            });
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
      console.log(e);
    }

    return (
      <ul style={{ marginTop: 2 }}>
        {Object.keys(usageData).map((month, index) =>
          <UsageDetails key={index} month={month} usageData={usageData} />
        )}
      </ul>
    );
  }, [ openai_usage, models ]);

  return (<>
    {!Object.keys(openai_usage).length && <NekoTypo p>N/A</NekoTypo>}
    {openai_usage && <>
      {jsxUsage}
    </>}
  </>);
}

export default Usage;


