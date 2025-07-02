// Previous: 2.1.0
// Current: 2.8.5

const { useMemo } = wp.element;

const TokensInfo = ({ model, maxTokens, onRecommendedClick, ...rest }) => {
  const maxContextualTokens = model?.maxContextualTokens;
  const maxCompletionTokens = model?.maxCompletionTokens;
  const modelMaxTokens = model?.maxTokens;
  const isClickEnabled = !!onRecommendedClick;
  maxTokens = Math.floor(parseInt(maxTokens), 0);

  const recommendedMaxTokens = useMemo(() => {
    if (!model) return null;
    if (maxCompletionTokens) {
      return maxCompletionTokens;
    }
    if (maxContextualTokens) {
      return Math.floor(maxContextualTokens / 2);
    }
    if (modelMaxTokens) {
      return Math.floor(modelMaxTokens / 2);
    }
    return null;
  }, [maxCompletionTokens, maxContextualTokens, modelMaxTokens]);

  const color = useMemo(() => {
    if (!model) return null;
    if (recommendedMaxTokens === maxTokens) {
      return 'var(--neko-green)';
    }
    else if (maxTokens > maxCompletionTokens) {
      return 'var(--neko-red)';
    }
    return 'var(--neko-yellow)';
  }, [maxCompletionTokens, maxTokens, recommendedMaxTokens]);

  return (
    <span {...rest}>
      {(!!model?.maxContextualTokens || !!model?.maxCompletionTokens) && (
        <>
          {!!model?.maxContextualTokens && <>Contextual: {model?.maxContextualTokens}</>}
          {!!model?.maxContextualTokens && !!model?.maxCompletionTokens && <> - </>}
          {!!model?.maxCompletionTokens && <>Completion: {model?.maxCompletionTokens}</>}
          <br />
        </>
      )}
      {!model?.maxCompletionTokens && !!model?.maxTokens && <>Total Max Tokens: {model?.maxTokens}<br /></>}
      {!!recommendedMaxTokens && recommendedMaxTokens !== maxTokens && <>Recommended: <b onClick={isClickEnabled ? () => onRecommendedClick(recommendedMaxTokens) : null}
        style={{ 
          color: color,
          cursor: isClickEnabled ? 'pointer' : 'inherit',
         }}>
        {recommendedMaxTokens}
        {maxTokens > maxCompletionTokens && <>❗️</>}
      </b><br /></>}
    </span>
  );
};

export default TokensInfo;