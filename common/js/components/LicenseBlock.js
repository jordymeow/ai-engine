/* eslint-disable no-undef */
// React & Vendor Libs
const { useState, useEffect } = wp.element;

// NekoUI
import { NekoButton, NekoTypo, NekoBlock, NekoInput,
  NekoMessage, NekoModal } from '@neko-ui';
import { nekoFetch } from '@neko-ui';

// From Main Plugin
import { restUrl, prefix, isPro, isRegistered, restNonce } from '@app/settings';

const CommonApiUrl = `${restUrl}/meow-licenser/${prefix}/v1`;

const LicenseBlock = () => {
  const [ busy, setBusy ] = useState(false);
  const [ meowMode, setMeowMode ] = useState(false);
  const [ currentModal, setCurrentModal ] = useState(null);
  const [ license, setLicense ] = useState(null);
  const [ serialKey, setSerialKey ] = useState('');
  const isOverridenLicense = isRegistered && (!license || license.license !== 'valid');

  const checkLicense = async () => {
    if (!isPro) {
      return;
    }
    setBusy(true);
    try {
      const res = await nekoFetch(`${CommonApiUrl}/get_license`, {
        method: 'POST',
        nonce: restNonce
      });
      setLicense(res.data);
      if (res.data.key) {
        setSerialKey(res.data.key);
      }
    }
    catch (err) {
      alert('Error while checking the license. Check your console for more information.');
      console.error(err);
    }
    setBusy(false);
  };

  const removeLicense = async () => {
    setBusy(true);
    try {
      const res = await nekoFetch(`${CommonApiUrl}/set_license`, {
        method: 'POST',
        nonce: restNonce,
        json: { serialKey: null }
      });
      if (res.success) {
        setSerialKey('');
        setLicense(null);
        setCurrentModal('licenseRemoved');
      }
    }
    catch (err) {
      alert('Error while removing the license. Check your console for more information.');
      console.error(err);
    }
    setBusy(false);
  };

  const forceLicense = async () => {
    setBusy(true);
    try {
      const res = await nekoFetch(`${CommonApiUrl}/set_license`, {
        method: 'POST',
        nonce: restNonce,
        json: {
          serialKey,
          override: true
        }
      });
      if (res.success) {
        setLicense(res.data);
        if (res.data && !res.data.issue) {
          setCurrentModal('licenseAdded');
        }
      }
    }
    catch (err) {
      alert('Error while forcing the license. Check your console for more information.');
      console.error(err);
    }
    setBusy(false);
  };

  const validateLicense = async () => {
    if ( serialKey === 'MEOW_OVERRIDE' ) {
      setMeowMode(true);
      setLicense(null);
      setSerialKey("");
      return;
    }
    setBusy(true);
    try {
      const res = await nekoFetch(`${CommonApiUrl}/set_license`, {
        method: 'POST',
        nonce: restNonce,
        json: { serialKey }
      });
      if (res.success) {
        setLicense(res.data);
        if (res.data && !res.data.issue) {
          setCurrentModal('licenseAdded');
        }
      }
    }
    catch (err) {
      alert('Error while validating the license. Check your console for more information.');
      console.error(err);
    }
    setBusy(false);
  };

  useEffect(() => { checkLicense(); }, []);

  const licenseTextStatus = isOverridenLicense ? 'Forced License' : isRegistered ? 'Enabled' : 'Disabled';

  const success = isOverridenLicense || (license && license.license === 'valid');
  let message = 'Your license is active. Thanks a lot for your support :)';
  if ( isOverridenLicense ) {
    message = 'This license has been force-enabled for you.';
    if (license && license.check_url ) {
      message = <><span>{message}</span><br /><small>To check your license status, please click <a target="_blank" href={license.check_url + '&cache=' + (Math.random() * (642000))} rel="noreferrer">here</a>.</small></>;
    }
  }
  if (!success) {
    if (!license) {
      message = 'Unknown error :(';
    }
    else if (license.issue === 'no_activations_left') {
      message = <span>There are no activations left for this license. You can visit your account at <a target='_blank' rel="noreferrer" href='https://meowapps.com'>Meow Apps</a>, unregister a site, and click on <i>Retry to validate</i>.</span>;
    }
    else if (license.issue === 'expired') {
      message = <span>Your license has expired. You can get another license or renew the current one by visiting your account at <a target='_blank' rel="noreferrer" href='https://meowapps.com'>Meow Apps</a>.</span>;
    }
    else if (license.issue === 'missing') {
      message = 'This license does not exist.';
    }
    else if (license.issue === 'disabled') {
      message = 'This license has been disabled.';
    }
    else if (license.issue === 'item_name_mismatch') {
      message = 'This license seems to be for a different plugin... isn\'t it? :)';
    }
    else if (license.issue === 'forced') {
      message = 'ABC';
    }
    else {
      message = <span>There is an unknown error related to the system or this serial key. Really sorry about this! Make sure your security plugins and systems are off temporarily. If you are still experiencing an issue, please <a target='_blank' rel="noreferrer" href='https://meowapps.com/contact/'>contact us</a>.</span>;
      console.error({ license });
    }
  }

  const jsxNonPro =
    <NekoBlock title="Pro Version (Not Installed)" className="primary">
      You will find more information about the Pro Version <a target='_blank' rel="noreferrer" href={`https://meowapps.com`}>here</a>. If you actually bought the Pro Version already, please remove the current plugin and download the Pro Version from your account at <a target='_blank' rel="noreferrer" href='https://meowapps.com/'>Meow Apps</a>.
    </NekoBlock>;

  const jsxProVersion =
    <NekoBlock title={`Pro Version (${licenseTextStatus})`} busy={busy} className="primary">

      {!isOverridenLicense && !(license && license.key === serialKey) && <>
        <div style={{ marginBottom: 10 }}>License Key:</div>
        <NekoInput id="mfrh_pro_serial" name="mfrh_pro_serial" disabled={busy} value={serialKey}
          onChange={(txt) => setSerialKey(txt)} placeholder="Type your license key..." />
        <NekoTypo p>Insert your serial key above. If you don&apos;t have one yet, you can get one <a href="https://meowapps.com">here</a>. If there was an error during the validation, try the <i>Retry</i> to <i>validate</i> button.
        </NekoTypo>
      </>}

      {license && !success && <NekoMessage variant="danger">{message}</NekoMessage>}
      {(isOverridenLicense || license) && success && <NekoMessage variant="success">{message}</NekoMessage>}

      <div style={{ marginTop: 15, display: 'flex', justifyContent: 'end' }}>
        {license && !success && <NekoButton className="secondary" disabled={busy || !serialKey}
          onClick={validateLicense}>Retry to validate
        </NekoButton>}
        {license && license.key === serialKey && <NekoButton className="secondary" disabled={busy || !serialKey}
          onClick={removeLicense}>Remove License
        </NekoButton>}
        <NekoButton disabled={busy || !serialKey || (license && license.key === serialKey)}
          onClick={validateLicense}>Validate License</NekoButton>
        {meowMode && !success && <NekoButton disabled={busy || !serialKey || (license && license.key === serialKey)}
          onClick={forceLicense} className="danger">Force License</NekoButton>}
      </div>

      <NekoModal
        isOpen={currentModal === 'licenseAdded'}
        title="Thank you :)"
        content="The Pro features have been enabled. This page should be now reloaded."
        okButton={{
          label: "Reload",
          onClick: () => location.reload()
        }}
      />

      <NekoModal
        isOpen={currentModal === 'licenseRemoved'}
        title="Goodbye :("
        content="The Pro features have been disabled. This page should be now reloaded."
        okButton={{
          label: "Reload",
          onClick: () => location.reload()
        }}
      />

    </NekoBlock>;

  return (isPro ? jsxProVersion : jsxNonPro);
};

export { LicenseBlock };
