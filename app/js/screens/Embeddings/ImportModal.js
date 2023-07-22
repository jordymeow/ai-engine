// Previous: 1.8.6
// Current: 1.8.7

const { useState } = wp.element;

import { NekoButton, NekoModal, NekoSpacer, NekoProgress, NekoCheckbox, NekoCollapsableCategory } from '@neko-ui';
import { retrieveVectors } from '@app/helpers-admin';

const ImportModal = ({ modal, setModal, onAddEmbedding, onModifyEmbedding }) => {
  const [ busy, setBusy ] = useState(false);
  const [ total, setTotal ] = useState(0);
  const [ count, setCount ] = useState(0);
  const [ readyVectors, setReadyVectors ] = useState({ add: [], modify: [], same: [], total: 0, isReady: false });
  const importVectors = modal?.data ?? [];
  const [ embeddingBasedOn, setEmbeddingBasedOn ] = useState({ id: true, dbId: true, title: true, refId: true });

  const calculateDiff = async (currentVectors, importVectors) => {
    let addVectors = [];
    let modifyVectors = [];
    let sameVectors = [];
    console.log('Calculate Diff', { currentVectors, importVectors });
    for (const importVector of importVectors) {
      const cleanVector = {
        id: importVector.id ?? null, // If there is an ID, it means it already exists in the Local DB.
        type: importVector.type ?? 'manual',
        title: importVector.title ?? 'N/A',
        behavior: importVector.behavior ?? 'context',
        dbId: importVector.dbId ?? null, // If there is a dbId, it means it already exists in the Vector DB. 
        dbIndex: importVector.dbIndex ?? null,
        dbNS: importVector.dbNS ?? null,
        content: importVector.content ?? '',
        refId: importVector.refId ?? null,
      };

      let sameVector = currentVectors.find(x => {
        let same = false;
        if (embeddingBasedOn.id && x.id === cleanVector.id) {
          same = true;
        }
        if (embeddingBasedOn.dbId && x.dbId === cleanVector.dbId) {
          same = true;
        }
        if (embeddingBasedOn.title && x.title === cleanVector.title) {
          same = true;
        }
        if (embeddingBasedOn.refId && x.refId === cleanVector.refId) {
          same = true;
        }
        return same;
      });

      if (sameVector) {
        cleanVector.id = sameVector.id;
      }

      if (!currentVectors.find(x => x.id === cleanVector.id)) {
        delete cleanVector.id;
      }

      sameVector = currentVectors.find(x => x.id === cleanVector.id);

      if (cleanVector.title === "About Dogs") {
        console.log('Same Vector', { cleanVector, sameVector });
      }

      if (sameVector && cleanVector.content === sameVector.content && cleanVector.title === sameVector.title) {
        sameVectors.push(cleanVector);
      } else if (!!cleanVector.id) {
        modifyVectors.push(cleanVector);
      } else {
        addVectors.push(cleanVector);
      }
    }
    const totalCount = addVectors.length + modifyVectors.length;
    setReadyVectors({ add: addVectors, modify: modifyVectors, same: sameVectors, total: totalCount, isReady: true });
    console.log("Embeddings Diff", { add: addVectors, modify: modifyVectors, same: sameVectors, total: totalCount });
  }

  const runStepOne = async () => {
    try {
      let finished = false;
      let params = { page: 1, limit: 20 };
      let vectors = [];
      setBusy('stepOne');
      while (!finished) {
        const res = await retrieveVectors(params);
        if (res.vectors.length < 2) {
          finished = true;
        }
        setTotal(res.total);
        vectors = vectors.concat(res.vectors);
        setCount(vectors.length);
        params.page++;
      }
      await calculateDiff(vectors, importVectors);
    }
    catch (err) {
      console.log(err);
      alert("An error occured while retrieving your current embeddings. Check your console.");
    }
    finally {
      setBusy(false);
    }
  }

  const runStepTwo = async () => {
    try {
      setTotal(readyVectors.add.length + readyVectors.modify.length);
      setCount(0);
      setBusy('stepTwo');
      for (const vector of readyVectors.add) {
        await onAddEmbedding(vector, true);
        setCount(prev => prev + 1);
      }
      for (const vector of readyVectors.modify) {
        await onModifyEmbedding(vector, true);
        setCount(prev => prev + 1);
      }
      alert("All embeddings have been updated.");
      setReadyVectors({ add: [], modify: [], same: [], total: 0, isReady: false });
      onClosed();
    }
    catch (err) {
      console.log(err);
      alert("An error occured while updating embeddings. Check your console.");
    }
    finally {
      setBusy(false);
    }
  }

  const onClosed = () => {
    setModal(null);
    setBusy(false);
    setTotal(0);
    setCount(0);
    setReadyVectors({ add: [], modify: [], same: [], total: 0, isReady: false });
  }

  return (<>
    <NekoModal isOpen={modal?.type === 'import'} disabled={busy}
      title="Import Embeddings"
      ok={"Close"}
      onOkClick={onClosed}
      customButtons={<>
        <NekoButton onClick={runStepOne} disabled={busy}>Check Differences</NekoButton>
        <NekoButton onClick={runStepTwo} disabled={busy || readyVectors.total === 0}>Apply Changes</NekoButton>
      </>}
      content={<>
        <p>There are <b>{importVectors.length} embeddings</b> in the file.</p>
        <NekoSpacer />
        <NekoCollapsableCategory title={"1 - Check Differences"} />
        <p>
          Calculates the differences between the embeddings in your file and the ones currently registered in AI Engine. Based on that, the list of changes will be created. An embedding will be considered the same entry based on:
        </p>
        <NekoSpacer />
        <div style={{ display: 'flex' }}>
          <NekoCheckbox small label="ID" disabled={true} checked={embeddingBasedOn.id}
            onChange={() => setEmbeddingBasedOn({ ...embeddingBasedOn, id: !embeddingBasedOn.id })}
          />
          <div style={{ marginLeft: 15 }}>
            <NekoCheckbox small label="DB ID" disabled={true} checked={embeddingBasedOn.dbId}
              onChange={() => setEmbeddingBasedOn({ ...embeddingBasedOn, dbId: !embeddingBasedOn.dbId })}
            />
          </div>
          <div style={{ marginLeft: 15 }}>
            <NekoCheckbox small label="Title" disabled={false} checked={embeddingBasedOn.title}
              onChange={() => setEmbeddingBasedOn({ ...embeddingBasedOn, title: !embeddingBasedOn.title })}
            />
          </div>
          <div style={{ marginLeft: 15 }}>
            <NekoCheckbox small label="Post ID" disabled={false} checked={embeddingBasedOn.refId}
              onChange={() => setEmbeddingBasedOn({ ...embeddingBasedOn, refId: !embeddingBasedOn.refId })}
            />  
          </div>
        </div>
        {busy === 'stepOne' && <>
          <NekoSpacer />
          <NekoProgress busy={busy} style={{ flex: 'auto' }} value={count} max={total} />
        </>}
        <NekoSpacer />
        <NekoCollapsableCategory title={"2 - Apply Changes"} />
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
}

export default ImportModal;