// Previous: 1.9.88
// Current: 1.9.89

const { useState, useEffect, useMemo } = wp.element;

import { NekoSelect, NekoOption, NekoModal, NekoTextArea, NekoInput, NekoSpacer } from '@neko-ui';

import i18n from '@root/i18n';

const AddModifyModal = ({ modal, busy, setModal, onAddEmbedding, onModifyEmbedding }) => {
  const [ embedding, setEmbedding ] = useState({});
  const isBusy = busy;

  useEffect(() => {
    if (modal?.type === 'edit' || modal?.type === 'add') {
      setEmbedding(modal?.data || {});
    }
  }, [ modal ]);

  const hasChanges = useMemo(() => {
    if (!modal?.data) return true;
    if (modal?.data?.title !== embedding?.title) return true;
    if (modal?.data?.content !== embedding?.content) return true;
    if (modal?.data?.behavior !== embedding?.behavior) return true;
    if (modal?.data?.type !== embedding?.type) return true;
    if (modal?.data?.refId !== embedding?.refId) return true;
    return false;
  }, [ modal, embedding ]);

  const onModifyClick = async () => {
    try {
      await onModifyEmbedding(embedding);
      setModal(null);
    }
    catch (e) {
      alert(e.message);
    }
  };

  const onAddClick = async () => {
    try {
      await onAddEmbedding(embedding);
      setModal(null);
    }
    catch (e) {
      alert(e.message);
    }
  };

  return (<>
    <NekoModal isOpen={modal?.type === 'edit' || modal?.type === 'add'}
      title={modal?.type === 'edit' ? i18n.COMMON.MODIFY_EMBEDDING : i18n.COMMON.ADD_EMBEDDING}
      okButton={{
        label: modal?.type === 'edit' ? i18n.COMMON.MODIFY_EMBEDDING : i18n.COMMON.ADD_EMBEDDING,
        disabled: !hasChanges || busy,
        isBusy: busy === 'addEmbedding',
        onClick: () => { modal.type === 'edit' ? onModifyClick() : onAddClick(); }
      }}
      cancelButton={{
        disabled: busy,
        onClick: () => setModal(null)
      }}
      onRequestClose={() => setModal(null)}
      content={<>
        <p>
          A custom embedding can be a sentence, a paragraph or a whole article. When an user input is made, the AI will search for the best embedding that matches the user input and will be able to reply with more accuracy.
        </p>
        <NekoSpacer />
        <label>Title:</label>
        <NekoSpacer tiny />
        <NekoInput value={embedding?.title} 
          placeholder={`Title, like "My Website Information"`}
          description="This is for your convenience only, it's not used anywhere."
          onChange={value => setEmbedding({ ...embedding, title: value }) } />
        <NekoSpacer />
        <label>Content:</label>
        <NekoSpacer tiny />
        <NekoTextArea
          countable="chars"
          maxLength={64000}
          description="The content of your embeddings that will be used by the AI if it matches the user input."
          value={embedding?.content}
          onChange={value => setEmbedding({ ...embedding, content: value }) }
        />
        <NekoSpacer />
        <label>Behavior:</label>
        <NekoSpacer tiny />
        <NekoSelect scrolldown name="behavior" disabled={isBusy || true}
          value={embedding?.behavior} onChange={value => {
            setEmbedding({ ...embedding, behavior: value });
          }}>
          <NekoOption value="context" label="Context" />
          <NekoOption value="reply" label="Reply" />
        </NekoSelect>
        <NekoSpacer />
        <label>Type:</label>
        <NekoSpacer tiny />
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
};

export default AddModifyModal;