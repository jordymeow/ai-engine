// Previous: none
// Current: 1.9.96

const { useMemo } = wp.element;

const TokensInfo = ({ model, maxTokens, ...rest }) => {

  const recommendedMaxTokens = useMemo(() => {
    console.log(model);
    if (!model) return null;
    const { maxContextualTokens, maxCompletionTokens, maxTokens } = model;
    if (maxCompletionTokens) {
      return maxCompletionTokens;
    }
    if (maxContextualTokens) {
      return maxContextualTokens / 2;
    }
    if (maxTokens) {
      return maxTokens / 2;
    }
    return null;
  }, [model]);

  return (
    <span {...rest}>
      {model?.maxContextualTokens && <>Contextual: {model?.maxContextualTokens}<br /></>}
      {model?.maxCompletionTokens && <>Completion: {model?.maxCompletionTokens}<br /></>}
      {recommendedMaxTokens && <>Recommended: <b
        style={{ color: maxTokens > recommendedMaxTokens ? 'red' : 'inherit' }}>
        {recommendedMaxTokens}
      </b><br /></>}
    </span>
  );
};

export default TokensInfo;