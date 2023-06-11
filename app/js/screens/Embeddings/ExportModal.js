// Previous: none
// Current: 1.7.3

// React & Vendor Libs
const { useState } = wp.element;
import Papa from 'papaparse';

// NekoUI
import { NekoButton, NekoModal, NekoSpacer, NekoProgress } from '@neko-ui';
import { retrieveVectors } from '@app/helpers-admin';

function downloadCSV(csvContent, fileName) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const ExportModal = ({ modal, setModal }) => {
  const [busy, setBusy] = useState(false);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);

  const retrieveAllVectors = async () => {
    try {
      let finished = false;
      let params = { page: 1, limit: 20 };
      let vectors = [];
      setBusy(true);
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
      var csv = Papa.unparse(vectors);
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      downloadCSV(csv, `vectors-${year}-${month}-${day}.csv`);
      // To make it more natural to the user, we wait a second before resetting the progress bar.
      setTimeout(() => {
        setTotal(0);
      }, 1000);
    }
    catch (err) {
      console.log(err);
      alert("An error occured while exporting vectors. Check your console.");
    }
    finally {
      setBusy(false);
    }
  }

  return (<>
    <NekoModal isOpen={modal?.type === 'export'} disabled={busy === 'addEmbedding'}
      title="Export Embeddings"
      ok={"Close"} onOkClick={() => setModal(null)}
      customButtons={<NekoButton onClick={retrieveAllVectors}>Export to CSV</NekoButton>}
      content={<>
        <NekoProgress busy={busy} style={{ flex: 'auto' }} value={count} max={total} />
      </>}
    />

  </>);
}

export default ExportModal;