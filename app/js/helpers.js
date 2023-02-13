// Previous: 0.8.1
// Current: 0.9.83

const { useMemo, useEffect, useState, useRef } = wp.element;
import { NekoColumn, NekoMessageDanger } from '@neko-ui';
import { OpenAI_models } from './constants';

const OptionsCheck = ({ options }) => {
  const { openai_apikey } = options;
  const valid_key = openai_apikey && openai_apikey.length > 0;

  if (valid_key) {
    return null;
  }

  return (
    <>
      <NekoMessageDanger style={{ marginTop: 0, marginBottom: 25 }}>
        To use the features of AI Engine, you need to have an OpenAI account and create an API Key. Visit the <a href="https://beta.openai.com/account/api-keys" target="_blank">OpenAI</a> website.
      </NekoMessageDanger>
    </>
  );
}

function cleanSections(text) {
  if (!text) {
    return text;
  }
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
    let fineTunes = (options?.openai_finetunes && options?.openai_finetunes.length > 0) ?
      options?.openai_finetunes.filter(x => x.enabled && x.model) : [];
    if (fineTunes.length) {
      allModels = [ ...allModels, ...fineTunes.map(x => {
        const splitted = x.model.split(':');
        return { 
          id: x.model, name: x.suffix, short: 'fn-' + splitted[0],
          description: "Finetuned", finetuned: true
        }
      })];
    }
    extraModels = extraModels?.split(',').filter(x => x);
    if (extraModels.length) {
      allModels = [ ...allModels, ...extraModels.map(x => ({ id: x, name: x, description: "Extra" })) ];
    }
    return allModels;
  }, [options]);

  const isFineTunedModel = (id) => {
    return !!models.find(x => x.id === id && x.finetuned);
  }

  useEffect(() => {
    const defaultModel = models.find(x => x.name.includes('davinci'));
    if (defaultModel) {
      setModel(defaultModel.name);
    }
  }, [models]);

  return { model, models, setModel, isFineTunedModel };
}

export { OptionsCheck, cleanSections, useModels };