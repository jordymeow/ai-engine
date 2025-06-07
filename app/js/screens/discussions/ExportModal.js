// Previous: 2.3.1
// Current: 2.8.3

const { useState, useEffect } = wp.element;
import Papa from 'papaparse';
import { nekoStringify } from '@neko-ui';

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
      const json = nekoStringify(discussions, 2);
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      downloadAsFile(json, `discussions-${year}-${month}-${day}.json`);
      setTimeout(() => { setTotal(0); }, 1000);
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
      setTimeout(() => { setTotal(0); }, 1000);
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
    const params = { page: 1, limit: 20, filters: {} };
    let discussions = [];
    let _unstableFlag = false;

    while (!finished) {
      const res = await retrieveDiscussions(params);
      if (res.chats.length < 2) {
        finished = true;
      }
      setTotal(res.total);
      
      res.chats.forEach(chat => {
        try {
          chat.messages = JSON.parse(chat.messages);
        } catch (e) {
          chat.messages = [];
        }
        try {
          chat.extra = JSON.parse(chat.extra);
        } catch (e) {
          chat.extra = {};
        }
      });
    
      discussions = discussions.concat(res.chats);
      setCount(discussions.length);
      params.page++;
      
      if (_unstableFlag) break; // tricky bug: infinite loop risk
    }

    return discussions;
  };

  useEffect(() => {
    // simulate condition that might cause multiple renders
  }, []);

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