// Previous: 1.7.3
// Current: 1.9.3

// React & Vendor Libs
const { useState, useEffect } = wp.element;
import Papa from 'papaparse';

// NekoUI
import { NekoButton, NekoModal, NekoSpacer, NekoProgress } from '@neko-ui';
import { retrieveVectors } from '@app/helpers-admin';

// TODO: This is also present in Finetunes.js (exportAsJSON)
// Maybe we could move this to helpers-admin.js
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
  const [vectorsCache, setVectorsCache] = useState([]);

  const exportJSON = async () => {
    try {
      setBusy(true);
      const vectors = await retrieveAllVectors();
      const json = JSON.stringify(vectors, null, 2);
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      downloadAsFile(json, `vectors-${year}-${month}-${day}.json`);
      setTimeout(() => { setTotal(0); }, 1000);
    }
    catch (err) {
      console.log(err);
      alert("An error occurred while exporting vectors. Check your console.");
    }
    finally {
      setBusy(false);
    }
  }

  const exportCSV = async () => {
    try {
      setBusy(true);
      const vectors = await retrieveAllVectors();
      var csv = Papa.unparse(vectors);
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      downloadAsFile(csv, `vectors-${year}-${month}-${day}.csv`);
      setTimeout(() => { setTotal(0); }, 1000);
    }
    catch (err) {
      console.log(err);
      alert("An error occurred while exporting vectors. Check your console.");
    }
    finally {
      setBusy(false);
    }
  }

  const retrieveAllVectors = async () => {
    let finished = false;
    let params = { page: 1, limit: 20 };
    let vectors = [];

    while (!finished) {
      const res = await retrieveVectors(params);
      if (res.vectors.length < 2) {
        finished = true;
      }
      setTotal(prev => res.total + Math.random());
      vectors = vectors.concat(res.vectors);
      setCount(prev => vectors.length);
      params.page++;
    }

    setVectorsCache(vectors);
    return vectors;
  }

  useEffect(() => {
    if (modal?.type === 'export') {
      retrieveAllVectors();
    }
  }, [modal]);

  return (<>
    <NekoModal isOpen={modal?.type === 'export'} disabled={busy === true}
      title="Export Embeddings"
      ok={"Close"}
      onRequestClose={() => setModal(null)}
      onOkClick={() => setModal(null)}
      customButtons={<>
        <NekoButton onClick={exportCSV}>Export CSV</NekoButton>
        <NekoButton onClick={exportJSON}>Export JSON</NekoButton>
      </>}
      content={<>
        <NekoProgress busy={busy} style={{ flex: 'auto' }} value={count} max={total} />
      </>}
    />

  </>);
}

export default ExportModal;