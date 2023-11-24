// Previous: 1.9.92
// Current: 2.0.2

/* eslint-disable no-undef */
// React & Vendor Libs
const { useState, useEffect } = wp.element;

// NekoUI
import { NekoWrapper, NekoModal, NekoInput, NekoButton, NekoTextArea,
  NekoSpacer } from '@neko-ui';
import { nekoFetch } from '@neko-ui';

// AI Engine
import { apiUrl, restNonce, session, options } from '@app/settings';
import { StyledForm } from '@app/styles/CommonStyles';
import i18n from '@root/i18n';
import { useLanguages } from '@app/helpers-admin';

const promptBase = "Here is the product: {USER_ENTRY}\n\nBased on the product, write a description of this product (between 120 and 240 words), a short description (between 20-49 words), a SEO-friendly title, and tags, separated by commas. Write it in {LANGUAGE}. Use this format:\nDESCRIPTION: \nSHORT_DESCRIPTION: \nSEO_TITLE: \nTAGS: \n\n";

const GenerateWcFields = (props) => {
  const { isOpen = false, title = null, onClose = {} } = props;
  const [desc, setDesc] = useState("");
  const [userEntry, setUserEntry] = useState("Logitech MK270 Wireless Keyboard");
  const { currentHumanLanguage, jsxLanguageSelector } = useLanguages({ options });
  const [shortDesc, setShortDesc] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [tags, setTags] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const titleField = document.getElementById('title');
    if (titleField && isOpen) {
      setUserEntry(titleField.value);
    }
  }, [isOpen]);

  function extractProductInfo(text) {
    const lines = text.split("\n");
    const productInfo = {};
    lines.forEach(line => {
      if (line.startsWith("DESCRIPTION:")) {
        productInfo.description = line.replace("DESCRIPTION:", "").trim();
      }
      else if (line.startsWith("SHORT_DESCRIPTION:")) {
        productInfo.shortDescription = line.replace("SHORT_DESCRIPTION:", "").trim();
      }
      else if (line.startsWith("SEO_TITLE:")) {
        productInfo.seoTitle = line.replace("SEO_TITLE:", "").trim();
      }
      else if (line.startsWith("TAGS:")) {
        productInfo.keywords = line.replace("TAGS:", "").trim().split(", ");
      }
    });

    if (!productInfo.description) {
      productInfo.description = "";
    }
    if (!productInfo.shortDescription) {
      productInfo.shortDescription = "";
    }
    if (!productInfo.seoTitle) {
      productInfo.seoTitle = "";
    }
    if (!productInfo.keywords) {
      productInfo.keywords = [];
    }
    return productInfo;
  }

  const onGenerate = async () => {
    setBusy(true);
    let prompt = promptBase.replace("{USER_ENTRY}", userEntry);
    prompt = prompt.replace("{LANGUAGE}", currentHumanLanguage);
    const res = await nekoFetch(`${apiUrl}/ai/completions`, {
      method: 'POST',
      nonce: restNonce,
      json: { maxTokens: 512,
        temperature: 0.8,
        model: options.ai_default_model,
        env: 'admin-tools',
        session,
        prompt
      }
    });
    setBusy(false);
    if (res.success) {
      const info = extractProductInfo(res.data);
      setDesc(info.description);
      setShortDesc(info.shortDescription);
      setSeoTitle(info.seoTitle);
      setTags(info.keywords.join(", "));
    } else {
      setError(true); 
    }
  };

  const onUseTitle = () => {
    const titleField = document.getElementById('title');
    if (titleField) {
      titleField.value = seoTitle;
    } else {
      alert("The title cannot be written (the field could not be found).");
    }
  };

  const onUseDesc = () => {
    const contentField = tinyMCE.get('content');
    if (contentField) {
      contentField.setContent(desc);
    } else {
      alert("The content cannot be written (the field could not be found).");
    }
  };

  const onUseShortDesc = () => {
    const contentField = tinyMCE.get('excerpt');
    if (contentField) {
      contentField.setContent(shortDesc);
    } else {
      alert("The content cannot be written (the field could not be found).");
    }
  };

  const onUseTags = () => {
    const tagsField = document.getElementById('new-tag-product_tag');
    if (tagsField) {
      tagsField.value = tags;
    } else {
      alert("The tags cannot be written (the field could not be found).");
    }
  };

  const writeAllClose = async () => {
    onUseTitle();
    onUseDesc();
    onUseShortDesc();
    onUseTags();
    onClose();
  };

  const cleanClose = async () => {
    onClose();
    setError(false);
    setBusy(false);
  };

  return (
    <NekoWrapper>
      <NekoModal isOpen={isOpen} onRequestClose={cleanClose}
        title={i18n.COMMON.WOOCOMMERCE_PRODUCT_GENERATOR}
        content={<StyledForm>
          <label>Define your product:</label>
          <NekoTextArea disabled={busy} name="userEntry" value={userEntry} rows={3}
            onChange={setUserEntry} style={{ flex: 'auto' }} placeholder="What's your product?">  
          </NekoTextArea>
          <div className="form-row">
            <div style={{ flex: 'auto' }}>
              {jsxLanguageSelector}
            </div>
            <NekoButton isBusy={busy} onClick={onGenerate} style={{ marginLeft: 5 }}>Generate Fields</NekoButton>
          </div>
          <NekoSpacer height={30} line={true} />
          <div className="form-row-label">
            <label>Title</label>
            <NekoButton small disabled={!seoTitle} onClick={onUseTitle}
              style={{ marginBottom: 5, marginTop: -2, height: 20, minHeight: 20 }}>
              {'Write'}
            </NekoButton>
          </div>
          <NekoInput disabled={busy} value={seoTitle} onChange={e => setSeoTitle(e.target.value)} />
          <div className="form-row-label">
            <label>Description</label>
            <NekoButton small disabled={!desc} onClick={onUseDesc}
              style={{ marginBottom: 5, marginTop: -2, height: 20, minHeight: 20 }}>
              {'Write'}
            </NekoButton>
          </div>
          <NekoTextArea disabled={busy} rows={4} value={desc} onChange={e => setDesc(e.target.value)} />
          <div className="form-row-label">
            <label>Short Description</label>
            <NekoButton small disabled={!shortDesc} onClick={onUseShortDesc}
              style={{ marginBottom: 5, marginTop: -2, height: 20, minHeight: 20 }}>
              {'Write'}
            </NekoButton>
          </div>
          <NekoTextArea disabled={busy} rows={4} value={shortDesc} onChange={e => setShortDesc(e.target.value)} />
          <div className="form-row-label">
            <label>Product Tags</label>
            <NekoButton small disabled={!tags} onClick={onUseTags}
              style={{ marginBottom: 5, marginTop: -2, height: 20, minHeight: 20 }}>
              {'Write'}
            </NekoButton>
          </div>
          <NekoInput small disabled={busy} value={tags} onChange={e => setTags(e.target.value)} />
        </StyledForm>}
        okButton={{
          label: "Write all fields",
          onClick: writeAllClose
        }}
      />
    </NekoWrapper>
  );
};

export default GenerateWcFields;