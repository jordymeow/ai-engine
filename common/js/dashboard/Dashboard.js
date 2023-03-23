// React & Vendor Libs
const { useState, useEffect } = wp.element;
import useSWR from 'swr';

// NekoUI
import { NekoTypo, NekoPage, NekoHeader, NekoWrapper, NekoTab, NekoTabs, NekoBlock, NekoButton,
  NekoColumn, NekoSettings, NekoCheckboxGroup, NekoCheckbox } from '@neko-ui';
import { nekoFetch, jsonFetcher } from '@neko-ui';

import { apiUrl, restUrl, pluginUrl, restNonce } from '@app/settings';
import { SpeedTester } from './SpeedTester';
import { TabText, StyledPluginBlock, StyledPluginImage, 
  StyledPhpErrorLogs, StyledPhpInfo } from './Dashboard.styled';

if ( !apiUrl || !restUrl || !pluginUrl ) {
  console.error("[@common/dashboard] apiUrl, restUrl and pluginUrl are mandatory.");
}

const CommonApiUrl = `${restUrl}/meow-common/v1`;

const jsxTextStory = 
  <TabText>
    <NekoTypo p>
      Meow Apps is a suite of plugins for photography, imaging, optimization, and SEO, run by <a target="_blank" href="https://jordymeow.com">Jordy Meow</a>, a photographer and developer in Japan. The goal is to improve and speed up your website. Learn more at <a href="http://meowapps.com" target="_blank">Meow Apps</a>.
    </NekoTypo>
  </TabText>;

const jsxTextPerformance = 
  <TabText>
    <NekoTypo p>
      ⭐️ The <b>Empty Request Time</b> helps you analyzing the raw performance of your install by giving you the average time it takes to run an empty request to your server. You can try to disable some plugins then start this again to see how it modifies the results. Keep it absolutely under 2,000 ms! That said, I recommend it to keep it below 500ms.
    </NekoTypo>
    <NekoTypo p>
      ⭐️ <b>File Operation Time</b> creates a temporary size of 10MB every time.
    </NekoTypo>
    <NekoTypo p>
      ⭐️ <b>SQL Request Time</b> counts the number of posts. Those two should be very fast, and almost the same as the <b>Empty Request Time</b>.
    </NekoTypo>
  </TabText>;

const jsxTextRecommendations = 
  <TabText>
    <NekoTypo p>
      Keep your WordPress install simple and efficient by using only necessary plugins and a reliable hosting service. Avoid trying to self-host unless you have professional experience. Follow best practices and stay up-to-date with the latest recommendations on the Meow Apps website.
      <ul>
        <li>💜 <a href="https://meowapps.com/tutorial-improve-seo-wordpress/" target="_blank">SEO Checklist &amp; Optimization</a></li>
        <li>💜 <a href="https://meowapps.com/tutorial-faster-wordpress-optimize/" target="_blank">Optimize your WordPress Speed</a></li>
        <li>💜 <a href="https://meowapps.com/tutorial-optimize-images-wordpress/" target="_blank">Optimize Images (CDN, and so on)</a></li>
        <li>💜 <a href="https://meowapps.com/tutorial-hosting-service-wordpress/" target="_blank">The Best Hosting Services for WordPress</a></li>
      </ul>
    </NekoTypo>
  </TabText>;

const swrAllSettingsKey = [`${CommonApiUrl}/all_settings/`, { headers: { 'X-WP-Nonce': restNonce } }];

const Dashboard = () => {
  const [ fatalError, setFatalError ] = useState(false);

  const { data: swrSettings, mutate: mutateSwrSettings, error: swrError } = useSWR(swrAllSettingsKey, jsonFetcher);
  const settings = swrSettings?.data;
  const hide_meowapps = settings?.meowapps_hide_meowapps;
  const force_sslverify = settings?.force_sslverify;
  const [ busy, setBusy ] = useState(false);
  const [ phpErrorLogs, setPhpErrorLogs ] = useState([]);
  const [ phpInfo, setPhpInfo ] = useState("");

  // Handle SWR errors
  useEffect(() => {
    if (swrError && !fatalError) {
      setFatalError(true);
      console.error('Error from UseSWR', swrError.message);
    }
  }, [swrError]);

  useEffect(() => {
    let info = document.getElementById('meow-common-phpinfo');
    setPhpInfo(info.innerHTML);
  }, []);

  const updateOption = async (value, id) => {
    let newSettingsData = { ...swrSettings.data };
    newSettingsData[id] = value;
    console.log({ value, id, newSettingsData });
    mutateSwrSettings({ ...swrSettings, data: newSettingsData }, false);
    setBusy(true);
    const res = await nekoFetch(`${CommonApiUrl}/update_option`, { 
      method: 'POST',
      nonce: restNonce,
      json: { name: id, value }
    });
    setBusy(false);
    if (!res.success) {
      alert(res.message);
    }
    mutateSwrSettings();
  }

  const loadErrorLogs = async () => {
    setBusy(true);
    const res = await nekoFetch(`${CommonApiUrl}/error_logs`, {
      method: 'POST',
      nonce: restNonce
    });
    let fresh = res && res.data ? res.data : [];
    setPhpErrorLogs(fresh.reverse());
    setBusy(false);
  }

  const jsxHideMeowApps = 
  <NekoSettings title="Main Menu">
    <NekoCheckboxGroup max="1">
      <NekoCheckbox name="meowapps_hide_meowapps" label="Hide (Not Recommended)" description={<NekoTypo p>This will hide the Meow Apps Menu (on the left side) and everything it contains. You can re-enable it through though an option that will be added in Settings &rarr; General.</NekoTypo>} value="1" disabled={busy} checked={hide_meowapps} onChange={updateOption} />
    </NekoCheckboxGroup>
  </NekoSettings>;


  const jsxForceSSLVerify = 
    <NekoSettings title="SSL Verify">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="force_sslverify" label="Force (Not Recommended)" description={<NekoTypo p>This will enforce the usage of SSL when checking the license or updating the plugin.</NekoTypo>} value="1" disabled={busy} checked={force_sslverify} onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  return (
    <NekoPage showRestError={fatalError}>

      <NekoHeader title='The Dashboard'>
      </NekoHeader>

      <NekoWrapper>

        <NekoColumn full>
          
          {/* TAB FOR ADVANCED SETTINGS */}
          <NekoTabs>
            <NekoTab title='Meow Apps'>

              {jsxTextStory}

              <NekoWrapper>
                <NekoColumn minimal>

                  <StyledPluginBlock title="AI Engine" className="primary">
                    <StyledPluginImage
                      src='https://ps.w.org/ai-engine/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/ai-engine/'>
                        AI Engine
                      </a></h2>
                      <p>GPT for WordPress. ChatGPT chatbot, image & content generator, finetune/train models, etc. Ultra customizable, extensible, sleek UI. You will love it!</p>
                    </div>
                  </StyledPluginBlock>

                  <StyledPluginBlock title="Media Cleaner" className="primary">
                    <StyledPluginImage
                      src='https://ps.w.org/media-cleaner/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/media-cleaner/'>Media Cleaner</a></h2>
                      <p>Clean your WordPress! Eliminate unused and broken media files. For a faster, and better website.</p>
                    </div>
                  </StyledPluginBlock>

                  <StyledPluginBlock title="Database Cleaner" className="primary">
                    <StyledPluginImage
                      src='https://ps.w.org/database-cleaner/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/database-cleaner/'>Database Cleaner</a></h2>
                      <p>Not only does Database Cleaner have a user-friendly UI, but it's also equipped to handle large DBs, giving it an edge over other plugins.</p>
                    </div>
                  </StyledPluginBlock>

                  <StyledPluginBlock title="Media File Renamer" className="primary">
                    <StyledPluginImage
                      src='https://ps.w.org/media-file-renamer/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/media-file-renamer/'>Media File Renamer</a></h2>
                      <p>Rename and move files directly from the dashboard, manually, automatically or via AI, either individually or in bulk.</p>
                    </div>
                  </StyledPluginBlock>

                  <StyledPluginBlock title="Social Engine" className="primary">
                    <StyledPluginImage
                      src='https://ps.w.org/social-engine/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/social-engine/'>Social Engine</a></h2>
                      <p>Effortlessly schedule and automate the perfect posts for all your networks. Unlimited capabilities and infinite extensibility, for free!</p>
                    </div>
                  </StyledPluginBlock>

                  <StyledPluginBlock title="Meow Analytics" className="primary">
                    <StyledPluginImage
                      src='https://ps.w.org/meow-analytics/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/meow-analytics/'>Meow Analytics</a></h2>
                      <p>Google Analytics for your website.</p>
                    </div>
                  </StyledPluginBlock>
                  
                </NekoColumn>

                <NekoColumn minimal>

                <StyledPluginBlock title="Photo Engine" className="primary">
                    <StyledPluginImage
                      src='https://ps.w.org/wplr-sync/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/wplr-sync/'>Photo Engine</a></h2>
                      <p>Organize your photos in folders and collections.<br />Synchronize with Lightroom.</p>
                    </div>
                  </StyledPluginBlock>

                  <StyledPluginBlock title="Meow Gallery" className="primary">
                    <StyledPluginImage
                      src='https://ps.w.org/meow-gallery/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/meow-gallery/'>Meow Gallery</a></h2>
                      <p>Fast and beautiful gallery with many layouts.</p>
                    </div>
                  </StyledPluginBlock>

                  <StyledPluginBlock title="Meow Lightbox" className="primary">
                    <StyledPluginImage
                      src='https://ps.w.org/meow-lightbox/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/meow-lightbox/'>Meow Lightbox</a></h2>
                      <p>Sleek and performant lightbox with EXIF support.</p>
                    </div>
                  </StyledPluginBlock>

                  <StyledPluginBlock title="Perfect Images (Retina)" className="primary">
                    <StyledPluginImage
                      src='https://ps.w.org/wp-retina-2x/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/wp-retina-2x/'>Perfect Images</a></h2>
                      <p>Manage, Optimize, Replace your images with Perfect Images.</p>
                    </div>
                  </StyledPluginBlock>

                  <StyledPluginBlock title="Contact Form Block" className="primary">
                    <StyledPluginImage
                      src='https://ps.w.org/contact-form-block/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/contact-form-block/'>Contact Form Block</a></h2>
                      <p>Simple and straightforward contact form, in one block.</p>
                    </div>
                  </StyledPluginBlock>

                  <StyledPluginBlock title="Contact Form Block" className="primary">
                    <StyledPluginImage
                      src='https://ps.w.org/seo-kiss/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/seo-kiss/'>SEO Kiss (Keep It Simple Stupid SEO)</a></h2>
                      <p>Optimize your content for SEO. Keep everything simple and fast.</p>
                    </div>
                  </StyledPluginBlock>

                </NekoColumn>

              </NekoWrapper>
            </NekoTab>
          
            <NekoTab title="Performance">
              {jsxTextPerformance}
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 25 }}>
                <SpeedTester title="Empty Request Time" request="empty_request" max={2500} />
                <SpeedTester title="File Operation Time" request="file_operation" max={2600} />
                <SpeedTester title="SQL Request Time" request="sql_request" max={2800} />
              </div>
              {jsxTextRecommendations} 
            </NekoTab>

            <NekoTab title="PHP Info">
              <StyledPhpInfo dangerouslySetInnerHTML={{ __html: phpInfo }} />
            </NekoTab>

            <NekoTab title="PHP Error Logs">
              <TabText>
                <NekoButton style={{ marginBottom: 10 }} color={'#ccb027'} onClick={loadErrorLogs}>
                  Load PHP Error Logs
                </NekoButton>
                <StyledPhpErrorLogs>
                  {phpErrorLogs.map(x => <li class={`log-${x.type}`}>
                    <span class='log-type'>{x.type}</span>
                    <span class='log-date'>{x.date}</span>
                    <span class='log-content'>{x.content}</span>
                  </li>)}
                </StyledPhpErrorLogs>
                <NekoTypo p>
                  If nothing appears after loading, it might be that your hosting service does not allow you to access the PHP error logs directly from here. Please contact them directly.
                </NekoTypo>
              </TabText>
              {/* {jsxPhpErrorLogs}
              <StyledPhpErrorLogs dangerouslySetInnerHTML={{ __html: phpErrorLogs }} />
              <StyledPhpInfo dangerouslySetInnerHTML={{ __html: phpInfo }} /> */}
            </NekoTab>

            <NekoTab title="Settings">
              <NekoBlock title="Settings" className="primary">
                {jsxHideMeowApps}
                {jsxForceSSLVerify}
              </NekoBlock>
            </NekoTab>
          
          </NekoTabs>

        </NekoColumn>

      </NekoWrapper>
    </NekoPage>
  );
};

export { Dashboard };