// Previous: 0.2.4
// Current: 0.2.5

const { useMemo, useEffect, useState } = wp.element;
import { NekoColumn, NekoMessageDanger } from '@neko-ui';
import { OpenAI_models } from './constants';

const OptionsCheck = ({ options }) => {
  const { openai_apikey } = options;
  const valid_key = openai_apikey && openai_apikey.length > 0;

  if (valid_key) {
    return null;
  }

  return (
    <NekoColumn>
      <NekoMessageDanger>
        To use the features of AI Engine, you need to have an OpenAI account and create an API Key. Visit the <a href="https://beta.openai.com/account/api-keys" target="_blank">OpenAI</a> website.
      </NekoMessageDanger>
    </NekoColumn>
  );
}

function cleanNumbering(text) {
  const lines = text.split('\n');
  const cleanedLines = lines.map(line => {
    line = line.replace(/^\d+\.\s/, '');
    if (line.startsWith('"')) {
      line = line.slice(1);
      if (line.endsWith('"')) {
        line = line.slice(0, -1);
      }
    }
    return line;
  });
  return cleanedLines.join('\n');
}

const useModels = (options) => {
  const [model, setModel] = useState(OpenAI_models[0].value);

  const models = useMemo(() => {
    let allModels = OpenAI_models;
    let extraModels = typeof options?.extra_models === 'string' ? options?.extra_models : "";
    let fineTunes = (options?.openai_finetunes && options?.openai_finetunes.length > 0) ? options?.openai_finetunes.filter(x => x.enabled) : [];
    if (fineTunes.length) {
      allModels = [ ...allModels, ...fineTunes.map(x => ({ id: x.model, name: x.suffix, description: "Fine-tuned" })) ];
    }
    extraModels = extraModels?.split(',').filter(x => x);
    if (extraModels.length) {
      allModels = [ ...allModels, ...extraModels.map(x => ({ id: x, name: x, description: "Extra" })) ];
    }
    return allModels;
  }, [options]);

  useEffect(() => {
    const defaultModel = models.find(x => x.name.includes('davinci'));
    if (defaultModel) {
      setModel(defaultModel.name);
    }
  }, [models]);

  return { model, models, setModel };
}

export { OptionsCheck, cleanNumbering, useModels };