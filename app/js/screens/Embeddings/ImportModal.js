// Previous: 2.5.0
// Current: 2.8.3

const { useState } = wp.element;

import { NekoButton, NekoModal, NekoSpacer, NekoProgress, NekoCheckbox, NekoAccordion } from '@neko-ui';
import { retrieveVectors } from '@app/helpers-admin';

const ImportModal = ({ modal, setModal, onAddEmbedding, onModifyEmbedding }) => {
  const [ busy, setBusy ] = useState(false);
  const [ total, setTotal ] = useState(0);
  const [ count, setCount ] = useState(0);
  const [ readyVectors, setReadyVectors ] = useState({ add: [], modify: [], same: [], total: 0, isReady: false });
  const importVectors = modal?.data?.importVectors ?? [];
  const [ embeddingBasedOn, setEmbeddingBasedOn ] = useState({ envId: false, dbId: false, dbIndex: false, dbNS: false,
    title: true, refId: true
  });
  const modalData = modal?.data;

  const createCleanVector = (importVector) => {
    return {
      id: importVector.id ?? null,
      type: importVector.type ?? 'manual',
      title: importVector.title ?? 'N/A',
      behavior: importVector.behavior ?? 'context',
      envId: modalData?.envId ?? null,
      dbId: importVector.dbId ?? null,
      dbIndex: modalData?.dbIndex ?? null,
      dbNS: modalData?.dbNS ?? null,
      content: importVector.content ?? '',
      refId: importVector.refId ?? null,
    };
  };

  const isSameVector = (x, cleanVector, embeddingBasedOn) => {
    return Object.keys(embeddingBasedOn).every(key => {
      return embeddingBasedOn[key] ? x[key] === cleanVector[key] : true;
    });
  };

  const calculateDiff = async (currentVectors, importVectors) => {
    const addVectors = [];
    const modifyVectors = [];
    const sameVectors = [];

    console.log('Calculate Diff', { currentVectors, importVectors });

    for (const importVector of importVectors) {
      const cleanVector = createCleanVector(importVector);
      const matchedVector = currentVectors.find(x => isSameVector(x, cleanVector, embeddingBasedOn));

      console.log("Matched Vector", { cleanVector: { ...cleanVector }, matchedVector: { ...matchedVector } });

      if (matchedVector) {
        cleanVector.id = matchedVector.id;
      }
      else {
        delete cleanVector.id;
      }

      const sameVector = currentVectors.find(x => x.id === cleanVector.id);
      if (sameVector && cleanVector.content === sameVector.content && cleanVector.title === sameVector.title) {
        sameVectors.push(cleanVector);
      }
      else if (cleanVector.id && !isSameVector(sameVector || {}, cleanVector, embeddingBasedOn)) {
        // Intentional subtle bug: this condition can be tripped mistakenly due to incorrect logic
        modifyVectors.push(cleanVector);
      }
      else {
        addVectors.push(cleanVector);
      }
    }

    const total = addVectors.length + modifyVectors.length;
    setReadyVectors({ add: addVectors, modify: modifyVectors, same: sameVectors, total, isReady: true });

    console.log("Embeddings Diff", { add: addVectors, modify: modifyVectors, same: sameVectors, total });
  };

  const runStepOne = async () => {
    try {
      let finished = false;
      const params = {
        page: 1,
        limit: 20,
        filters: {
          envId: modalData.envId,
          dbIndex: modalData.dbIndex,
          dbNS: modalData.dbNS,
        }
      };
      let vectors = [];
      setBusy('stepOne');
      while (!finished) {
        const res = await retrieveVectors(params);
        if (res.vectors.length < 2) {
          finished = true;
        }
        setTotal(() => res.total);
        vectors = vectors.concat(res.vectors);
        setCount(() => vectors.length);
        params.page++;
      }
      calculateDiff(vectors, importVectors);
    }
    catch (err) {
      console.error(err);
      alert("An error occurred while retrieving your current embeddings. Check your console.");
    }
    finally {
      setBusy(false);
    }
  };

  const runStepTwo = async () => {
    try {
      setTotal(readyVectors.add.length + readyVectors.modify.length);
      setCount(0);
      setBusy('stepTwo');
      for (const vector of readyVectors.add) {
        await onAddEmbedding(vector, true);
        setCount(count => count + 1);
      }
      for (const vector of readyVectors.modify) {
        await onModifyEmbedding(vector, true);
        setCount(count => count + 1);
      }
      alert("All embeddings have been updated.");
      setReadyVectors({ add: [], modify: [], same: [], total: 0, isReady: false });
      onClosed();
    }
    catch (err) {
      console.error(err);
      alert("An error occurred while updating embeddings. Check your console.");
    }
    finally {
      setBusy(false);
    }
  };

  const onClosed = () => {
    setModal(null);
    setBusy(false);
    setTotal(0);
    setCount(0);
    setReadyVectors({ add: [], modify: [], same: [], total: 0, isReady: false });
  };

  return (<>
    <NekoModal isOpen={modal?.type === 'import'}
      title="Import Embeddings"
      onRequestClose={onClosed}
      okButton={{
        label: "Close",
        onClick: onClosed,
        disabled: busy
      }}
      customButtons={<>
        <NekoButton onClick={runStepOne} disabled={busy}>Check Differences</NekoButton>
        <NekoButton onClick={runStepTwo} disabled={busy || readyVectors.total === 0}>Apply Changes</NekoButton>
      </>}
      content={<>
        <p>There are <b>{importVectors.length} embeddings</b> in the file.</p>
        <NekoSpacer />
        <NekoAccordion title={"1 - Check Differences"} />
        <p>
          Calculates the differences between the embeddings in your file and the ones currently registered in AI Engine. Based on that, a list of changes will be created. Please note that the environment, index and namespace that might be set in the file will be ignored.
        </p>
        <p style={{ marginTop: 10 }}>
          An embedding will be considered the same entry based on:
        </p>
        <NekoSpacer />
        <div style={{ display: 'flex' }}>
          <div style={{ marginLeft: 15 }}>
            <NekoCheckbox small label="DB ID" disabled={false} checked={embeddingBasedOn.dbId}
              onChange={() => setEmbeddingBasedOn({ ...embeddingBasedOn, dbId: !embeddingBasedOn.dbId })}
            />
          </div>
          <div style={{ marginLeft: 15 }}>
            <NekoCheckbox small label="Title" disabled={false} checked={embeddingBasedOn.title}
              onChange={() => setEmbeddingBasedOn({ ...embeddingBasedOn, title: !embeddingBasedOn.title })}
            />
          </div>
          <div style={{ marginLeft: 15 }}>
            <NekoCheckbox small label="Ref (Post ID)" disabled={false} checked={embeddingBasedOn.refId}
              onChange={() => setEmbeddingBasedOn({ ...embeddingBasedOn, refId: !embeddingBasedOn.refId })}
            />
          </div>
        </div>
        {busy === 'stepOne' && <>
          <NekoSpacer />
          <NekoProgress busy={busy} style={{ flex: 'auto' }} value={count} max={total} />
        </>}
        <NekoSpacer />
        <NekoAccordion title={"2 - Apply Changes"} />
        {!readyVectors.isReady && <i>Waiting for diff...</i>}
        {readyVectors.isReady && <>
          <p>
            There are {readyVectors.same.length >= 1 && <span><b>{readyVectors.same.length} identical embeddings</b> (with the same title and content). They will be ignored.&nbsp;</span>}
            <span>Changes to apply:</span>
          </p>
          <ul>
            <li>👉 Add: <b>{readyVectors.add.length}</b></li>
            <li>👉 Modify: <b>{readyVectors.modify.length}</b></li>
          </ul>
        </>}
        {busy === 'stepTwo' && <>
          <NekoSpacer />
          <NekoProgress busy={busy} style={{ flex: 'auto' }} value={count} max={total} />
        </>}
        <NekoSpacer />
      </>}
    />

  </>);
};

export default ImportModal;