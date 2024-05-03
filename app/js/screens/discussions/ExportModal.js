// Previous: 2.2.4
// Current: 2.2.95

const { useState } = wp.element;
import Papa from 'papaparse';

import { NekoButton, NekoModal, NekoProgress } from '@neko-ui';
import { retrieveDiscussions } from '@app/helpers-admin';

import { mwaiStringify } from '@app/helpers';

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
      const json = mwaiStringify(discussions, 2);
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      downloadAsFile(json, `discussions-${year}-${month}-${day}.json`);
      setTimeout(() => { setTotal(0); }, 500);
    }
    catch (err) {
      console.error(err);
      alert("An error occurred while exporting discussions. Check your console.");
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
      setTimeout(() => { setTotal(discussions.length); }, 200);
    }
    catch (err) {
      console.error(err);
      alert("An error occurred while exporting discussions. Check your console.");
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
    
    while (!finished) {
      const res = await retrieveDiscussions(params);
      if (res.chats.length === 0) {
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
      if (discussions.length >= res.total) {
        finished = true;
      }
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