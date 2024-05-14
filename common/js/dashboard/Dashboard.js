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
    <NekoTypo p style={{ lineHeight: '1.5', margin: '0 0 15px 0' }}>
      Hi! ☀️ Meow Apps isn't your typical plugin suite—it's a passion project led by me, <a target="_blank" href="https://jordymeow.com">Jordy Meow</a>, and a stellar team! 💕 Based in <a target="_blank" href="https://offbeatjapan.org">Japan</a>, we're all about making your WordPress experience smoother and speedier. Our plugins are all about boosting your site's performance and user-friendliness. Ready to level up your WordPress game? Check out <a href="http://meowapps.com" target="_blank">Meow Apps</a> and let's make magic happen! 🌴🙀
    </NekoTypo>
  </TabText>;

const jsxTextPerformance = 
  <TabText>
    <NekoTypo p>
      The <b>Empty Request Time</b> measures your installation's basic performance by showing the average time needed to process an empty request on your server. To see how disabling plugins affects the results, turn some off and run the test again. Aim for a time under 2,000 ms, but ideally, keep it below 500 ms. The <b>File Operation Time</b> creates a temporary 10MB file each time it runs. <b>The SQL Request Time</b> calculates the total number of posts. This process should be quick and have a similar duration to the Empty Request Time.
    </NekoTypo>
  </TabText>;

const jsxTextRecommendations = 
  <TabText>
    <NekoTypo p>
      Maintain a streamlined WordPress setup by using essential plugins and a dependable hosting provider. Refrain from self-hosting unless you're an expert. Go further by reading our tutorials:
      <ul>
        <li>⭐️ <a href="https://meowapps.com/tutorial-improve-seo-wordpress/" target="_blank">SEO Checklist &amp; Optimization</a></li>
        <li>⭐️ <a href="https://meowapps.com/tutorial-faster-wordpress-optimize/" target="_blank">Optimize your WordPress Speed</a></li>
        <li>⭐️ <a href="https://meowapps.com/tutorial-optimize-images-wordpress/" target="_blank">Optimize Images (CDN, and so on)</a></li>
        <li>⭐️ <a href="https://meowapps.com/tutorial-hosting-service-wordpress/" target="_blank">The Best Hosting Services for WordPress</a></li>
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
    setBusy('isLoadingErrorLogs');
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
          <NekoTabs keepTabOnReload={true}>
            <NekoTab title='Meow Apps'>

              {jsxTextStory}

              <NekoWrapper>
                <NekoColumn minimal>

                  <StyledPluginBlock title="AI Engine" className="primary">
                    <StyledPluginImage src='https://ps.w.org/ai-engine/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/ai-engine/'>
                        AI Engine
                      </a></h2>
                      <p className="plugin-actual-desc">
                        This is the ultimate AI plugin for WordPress. From a chatbot adapted to your needs to an AI that can write your content for you, API, REST, and more.
                      </p>
                      <p>
                        <div>Free Version: <a target='_blank' href='https://wordpress.org/plugins/ai-engine/'>WordPress.org</a></div>
                        <div>Pro Version: <a target='_blank' href='https://meowapps.com/ai-engine/'>Meow Apps</a></div>
                      </p>
                    </div>
                  </StyledPluginBlock>

                  <StyledPluginBlock title="Media Cleaner" className="primary">
                    <StyledPluginImage src='https://ps.w.org/media-cleaner/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/media-cleaner/'>Media Cleaner</a></h2>
                      <p className="plugin-actual-desc">
                        Is your Media Library bloated, your database heavy, and your website running slow? Media Cleaner will clean your Media Library from the media entries (and files) which aren't used in your website, as well as broken entries.
                      </p>
                      <p>
                        <div>Free Version: <a target='_blank' href='https://wordpress.org/plugins/media-cleaner/'>WordPress.org</a></div>
                        <div>Pro Version: <a target='_blank' href='https://meowapps.com/media-cleaner/'>Meow Apps</a></div>
                      </p>
                    </div>
                  </StyledPluginBlock>

                  <StyledPluginBlock title="Database Cleaner" className="primary">
                    <StyledPluginImage src='https://ps.w.org/database-cleaner/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/database-cleaner/'>Database Cleaner</a></h2>
                      <p className="plugin-actual-desc">
                        Not only does Database Cleaner have a user-friendly UI, but it's also equipped to handle large DBs, giving it an edge over other plugins. It's a must-have for any WordPress site.
                      </p>
                      <p>
                        <div>Free Version: <a target='_blank' href='https://wordpress.org/plugins/database-cleaner/'>WordPress.org</a></div>
                        <div>Pro Version: <a target='_blank' href='https://meowapps.com/database-cleaner/'>Meow Apps</a></div>
                      </p>
                    </div>
                  </StyledPluginBlock>

                  <StyledPluginBlock title="Media File Renamer" className="primary">
                    <StyledPluginImage src='https://ps.w.org/media-file-renamer/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/media-file-renamer/'>Media File Renamer</a></h2>
                      <p className="plugin-actual-desc">
                        Rename and move files directly from the dashboard, manually, automatically or via AI, either individually or in bulk. It's the best way to rename your files.
                      </p>
                      <p>
                        <div>Free Version: <a target='_blank' href='https://wordpress.org/plugins/media-file-renamer/'>WordPress.org</a></div>
                        <div>Pro Version: <a target='_blank' href='https://meowapps.com/media-file-renamer/'>Meow Apps</a></div>
                      </p>
                    </div>
                  </StyledPluginBlock>

                  <StyledPluginBlock title="Social Engine" className="primary">
                    <StyledPluginImage src='https://ps.w.org/social-engine/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/social-engine/'>Social Engine</a></h2>
                      <p className="plugin-actual-desc">
                        Effortlessly schedule and automate the perfect posts for all your networks. Unlimited capabilities and infinite className="plugin-actual-desc" extensibility, for free!
                      </p>
                      <p>
                        <div>Free Version: <a target='_blank' href='https://wordpress.org/plugins/social-engine/'>WordPress.org</a></div>
                        <div>Pro Version: <a target='_blank' href='https://meowapps.com/social-engine/'>Meow Apps</a></div>
                      </p>
                    </div>
                  </StyledPluginBlock>

                  <StyledPluginBlock title="Meow Analytics" className="primary">
                    <StyledPluginImage src='https://ps.w.org/meow-analytics/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/meow-analytics/'>Meow Analytics</a></h2>
                      <p className="plugin-actual-desc">
                        Google Analytics for your website. Simple and fast.
                      </p>
                      <p>
                        <div>Free Version: <a target='_blank' href='https://wordpress.org/plugins/meow-analytics/'>WordPress.org</a></div>
                        <div>Pro Version: <a target='_blank' href='https://meowapps.com/meow-analytics/'>Meow Apps</a></div>
                      </p>
                    </div>
                  </StyledPluginBlock>
                  
                </NekoColumn>

                <NekoColumn minimal>

                  <StyledPluginBlock title="Contact Form Block" className="primary">
                    <StyledPluginImage src='https://ps.w.org/seo-engine/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/seo-engine/'>SEO Engine</a></h2>
                      <p className="plugin-actual-desc">
                        Optimize your content for SEO and for the AI world, with AI assistants... while keeping everything simple and fast, as it should be! ✌️
                      </p>
                      <p>
                        <div>Free Version: <a target='_blank' href='https://wordpress.org/plugins/seo-engine/'>WordPress.org</a></div>
                        <div>Pro Version: <a target='_blank' href='https://meowapps.com/seo-engine/'>Meow Apps</a></div>
                      </p>
                    </div>
                  </StyledPluginBlock>

                  <StyledPluginBlock title="Meow Gallery" className="primary">
                    <StyledPluginImage src='https://ps.w.org/meow-gallery/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/meow-gallery/'>Meow Gallery</a></h2>
                      <p className="plugin-actual-desc">
                        Fast and beautiful galleries with many layouts. Forget the heavy and slow plugins, use the Meow Gallery for a better experience! 💕
                      </p>
                      <p>
                        <div>Free Version: <a target='_blank' href='https://wordpress.org/plugins/meow-gallery/'>WordPress.org</a></div>
                        <div>Pro Version: <a target='_blank' href='https://meowapps.com/meow-gallery/'>Meow Apps</a></div>
                      </p>
                    </div>
                  </StyledPluginBlock>

                  <StyledPluginBlock title="Meow Lightbox" className="primary">
                    <StyledPluginImage src='https://ps.w.org/meow-lightbox/assets/icon-256x256.gif' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/meow-lightbox/'>Meow Lightbox</a></h2>
                      <p className="plugin-actual-desc">
                        Sleek and performant lightbox with EXIF support.
                      </p>
                      <p>
                        <div>Free Version: <a target='_blank' href='https://wordpress.org/plugins/meow-lightbox/'>WordPress.org</a></div>
                        <div>Pro Version: <a target='_blank' href='https://meowapps.com/meow-lightbox/'>Meow Apps</a></div>
                      </p>
                    </div>
                  </StyledPluginBlock>

                  <StyledPluginBlock title="Perfect Images (Retina)" className="primary">
                    <StyledPluginImage src='https://ps.w.org/wp-retina-2x/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/wp-retina-2x/'>Perfect Images</a></h2>
                      <p className="plugin-actual-desc">
                        Manage, Optimize, Replace your images with Perfect Images.
                      </p>
                      <p>
                        <div>Free Version: <a target='_blank' href='https://wordpress.org/plugins/wp-retina-2x/'>WordPress.org</a></div>
                        <div>Pro Version: <a target='_blank' href='https://meowapps.com/wp-retina-2x/'>Meow Apps</a></div>
                      </p>
                    </div>
                  </StyledPluginBlock>

                  <StyledPluginBlock title="Photo Engine" className="primary">
                    <StyledPluginImage src='https://ps.w.org/wplr-sync/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/wplr-sync/'>Photo Engine</a></h2>
                      <p className="plugin-actual-desc">
                        Organize your photos in folders and collections. Synchronize with Lightroom. Simplify and speed up your workflow.
                      </p>
                      <p>
                        <div>Free Version: <a target='_blank' href='https://wordpress.org/plugins/wplr-sync/'>WordPress.org</a></div>
                        <div>Pro Version: <a target='_blank' href='https://meowapps.com/wplr-sync/'>Meow Apps</a></div>
                      </p>
                    </div>
                  </StyledPluginBlock>

                  <StyledPluginBlock title="Contact Form Block" className="primary">
                    <StyledPluginImage src='https://ps.w.org/contact-form-block/assets/icon-256x256.png' />
                    <div className="plugin-desc">
                      <h2><a target='_blank' href='https://wordpress.org/plugins/contact-form-block/'>Contact Form Block</a></h2>
                      <p className="plugin-actual-desc">
                        Need a very simple but straightforward contact form? This is the one you need. It's fast, simple, and efficient.
                      </p>
                      <p>
                        <div>Free Version: <a target='_blank' href='https://wordpress.org/plugins/contact-form-block/'>WordPress.org</a></div>
                        <div>Pro Version: <a target='_blank' href='https://meowapps.com/contact-form-block/'>Meow Apps</a></div>
                      </p>
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
                <NekoButton style={{ marginBottom: 10 }} color={'#ccb027'} onClick={loadErrorLogs}
                  disabled={busy} isBusy={busy === 'isLoadingErrorLogs'}>
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
                  If you don't see any errors, your host might not allow remote access to PHP error logs. Contact them for assistance, or look in your hosting control panel.
                </NekoTypo>
              </TabText>
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