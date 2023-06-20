// Previous: 1.7.3
// Current: 1.7.7

// React & Vendor Libs
const { useState, useEffect } = wp.element;

// NekoUI
import { NekoSelect, NekoOption, NekoModal, NekoTextArea, NekoInput, NekoSpacer } from '@neko-ui';

// AI Engine
import i18n from '@root/i18n';

const AddModifyModal = ({ modal, busy, setModal, onAddEmbedding, onModifyEmbedding }) => {
  const [ embedding, setEmbedding ] = useState(false);
  const isBusy = busy;

  useEffect(() => {
    if (modal?.type === 'edit' || modal?.type === 'add') {
      setEmbedding(modal?.data || {});
    }
  }, [ modal ]);

  const onModifyClick = async () => {
    await onModifyEmbedding(embedding);
    setModal(null);
  }

  const onAddClick = async () => {
    await onAddEmbedding(embedding);
    setModal(null);
  }

  return (<>
    <NekoModal isOpen={modal?.type === 'edit' || modal?.type === 'add'}
      title={modal?.type === 'edit' ? i18n.COMMON.MODIFY_EMBEDDING : i18n.COMMON.ADD_EMBEDDING}
      onOkClick={() => { modal.type === 'edit' ? onModifyClick() : onAddClick() }}
      onRequestClose={() => setModal(null)}
      onCancelClick={() => setModal(null)}
      ok={modal?.type === 'edit' ? i18n.COMMON.MODIFY_EMBEDDING : i18n.COMMON.ADD_EMBEDDING}
      disabled={busy === 'addEmbedding'}
      content={<>
        <p>
          A custom embedding can be a sentence, a paragraph or a whole article. When an user input is made, the AI will search for the best embedding that matches the user input and will be able to reply with more accuracy.
        </p>
        <NekoSpacer />
        <label>Title:</label>
        <NekoSpacer />
        <NekoInput value={embedding?.title} 
          placeholder={`Title, like "My Website Information"`}
          description="This is for your convenience only, it's not used anywhere."
          onChange={value => setEmbedding({ ...embedding, title: value }) } />
        <NekoSpacer />
        <label>Content:</label>
        <NekoSpacer />
        <NekoTextArea value={embedding?.content} onChange={value => setEmbedding({ ...embedding, content: value }) } />
        <NekoSpacer />
        <label>Behavior:</label>
        <NekoSpacer />
        <NekoSelect scrolldown name="behavior" disabled={isBusy || true}
          value={embedding?.behavior} onChange={value => {
            setEmbedding({ ...embedding, behavior: value });
          }}>
          <NekoOption value="context" label="Context" />
          <NekoOption value="reply" label="Reply" />
        </NekoSelect>
        <NekoSpacer />
        <label>Type:</label>
        <NekoSpacer />
        <NekoSelect scrolldown name="type" disabled={isBusy || true}
          value={embedding?.type} onChange={value => {
            setEmbedding({ ...embedding, type: value });
          }}>
          <NekoOption value="manual" label="Manual" />
          <NekoOption value="post" label="Post (Whole)" />
          <NekoOption value="post-fragment" label="Post (Fragment)" />
        </NekoSelect>
        {(embedding?.type === 'post' || embedding?.type === 'post-fragment') && <>
          <NekoSpacer />
          <label>Post ID:</label>
          <NekoSpacer />
          <NekoInput value={embedding?.refId} 
            onChange={value => setEmbedding({ ...embedding, refId: value }) } />
        </>}
      </>}
    />

  </>);
}

export default AddModifyModal;