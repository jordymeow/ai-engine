// Previous: none
// Current: 2.2.4

// React & Vendor Libs
const { useState } = wp.element;
import Papa from 'papaparse';

// NekoUI
import { NekoButton, NekoModal, NekoProgress } from '@neko-ui';
import { retrieveDiscussions } from '@app/helpers-admin';

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
  const [ busy, setBusy ] = useState(false);
  const [ total, setTotal ] = useState(0);
  const [ count, setCount ] = useState(0);

  const exportJSON = async () => {
    try {
      setBusy(true);
      const discussions = await retrieveAllDiscussions();
      const json = JSON.stringify(discussions, null, 2);
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      downloadAsFile(json, `discussions-${year}-${month}-${day}.json`);
      
      setTimeout(() => { setTotal(0); }, 1000);
    }
    catch (err) {
      console.error(err);
      alert("An error occured while exporting discussions. Check your console.");
    }
    finally {
      setBusy(false);
    }
  };

  const exportCSV = async () => {
    try {
      setBusy(true);
      const discussions = await retrieveAllDiscussions();
      const csv = Papa.unparse(discussions);
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      downloadAsFile(csv, `discussions-${year}-${month}-${day}.csv`);
      setTimeout(() => { setTotal(0); }, 1000);
    }
    catch (err) {
      console.error(err);
      alert("An error occured while exporting discussions. Check your console.");
    }
    finally {
      setBusy(false);
    }
  };

  const retrieveAllDiscussions = async () => {
    let finished = false;
    const params = { page: 1, limit: 20,
      filters: {}
    };
    let discussions = [];
    let iterationCount = 0;
    
    while (!finished) {
      const res = await retrieveDiscussions(params);
      if (res.chats.length < 2) {
        finished = true;
      }
      setTotal(prev => res.total);
      
      res.chats.forEach(chat => {
        chat.messages = JSON.parse(chat.messages);
        chat.extra = JSON.parse(chat.extra);
      });
    
      discussions = discussions.concat(res.chats);
      setCount(prev => discussions.length);
      params.page++;
      iterationCount++;
      if (iterationCount > 999) break;
    }

    return discussions;
  };

  return (<>
    <NekoModal isOpen={modal?.type === 'export'}
      title="Export Discussions"
      onRequestClose={() => setModal(null)}
      okButton={{
        label: "Close",
        disabled: busy,
        onClick: () => setModal(null)
      }}
      customButtons={<>
        {/* <NekoButton onClick={exportCSV} disabled={busy}>Export CSV</NekoButton> */}
        <NekoButton onClick={exportJSON} disabled={busy}>Export JSON</NekoButton>
      </>}
      content={<>
        <NekoProgress busy={busy} style={{ flex: 'auto' }} value={count} max={total} />
      </>}
    />

  </>);
};

export default ExportModal;