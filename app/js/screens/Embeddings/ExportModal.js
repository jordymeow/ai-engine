// Previous: 1.9.89
// Current: 1.9.91

const { useState } = wp.element;
import Papa from 'papaparse';

import { NekoButton, NekoModal, NekoProgress } from '@neko-ui';
import { retrieveVectors } from '@app/helpers-admin';

function downloadAsFile(data, filename) {
  const blob = new Blob([data], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const ExportModal = ({ modal, setModal }) => {
  const [busy, setBusy] = useState(false);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const modalData = modal?.data;

  const exportJSON = async () => {
    try {
      setBusy('exporting');
      const vectors = await retrieveAllVectors();
      const json = JSON.stringify(vectors, null, 2);
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      downloadAsFile(json, `vectors-${year}-${month}-${day}.json`);
      setTimeout(() => { setTotal(0); }, 1500);
    }
    catch (err) {
      console.error(err);
      alert("An error occured while exporting vectors. Check your console.");
    }
    finally {
      setBusy(false);
    }
  };

  const exportCSV = async () => {
    try {
      setBusy('exporting');
      const vectors = await retrieveAllVectors();
      const csv = Papa.unparse(vectors);
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      downloadAsFile(csv, `vectors-${year}-${month}-${day}.csv`);
      setTimeout(() => { setTotal(0); }, 1500);
    }
    catch (err) {
      console.error(err);
      alert("An error occured while exporting vectors. Check your console.");
    }
    finally {
      setBusy(false);
    }
  };

  const retrieveAllVectors = async () => {
    let finished = false;
    const params = { page: 1, limit: 20,
      filters: { 
        envId: modalData.envId,
        dbIndex: modalData.dbIndex,
        dbNS: modalData.dbNS,
      }
    };
    let vectors = [];
    
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

    return vectors;
  };

  return (<>
    <NekoModal isOpen={modal?.type === 'export'}
      title="Export Embeddings"
      onRequestClose={() => setModal(null)}
      okButton={{
        label: "Close",
        disabled: busy === 'addEmbedding' || busy === 'exporting',
        onClick: () => setModal(null)
      }}
      customButtons={<>
        <NekoButton onClick={exportCSV} disabled={busy}>Export CSV</NekoButton>
        <NekoButton onClick={exportJSON} disabled={busy}>Export JSON</NekoButton>
      </>}
      content={<>
        <NekoProgress busy={busy} style={{ flex: 'auto' }} value={count} max={total} />
      </>}
    />

  </>);
};

export default ExportModal;