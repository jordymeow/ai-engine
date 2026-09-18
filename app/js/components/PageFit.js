// Previous: none
// Current: 3.7.9

import { createGlobalStyle } from 'styled-components';

// The full height screens (Image Studio, Playground, Content Studio) fill the window like
// an app. WordPress reserves 65px under the content for its footer and NekoPage adds 24px
// net on top, which left a dead band under every one of them. The footer credit means
// nothing on these screens, so it goes, and the panels reach the bottom of the window.
// Applies only while one of those screens is mounted.
const AdminPageFit = createGlobalStyle`
  #wpbody-content { padding-bottom: 0; }
  #wpfooter { display: none; }
  .neko-page { padding-bottom: 0; margin-bottom: 0; }
`;

export default AdminPageFit;
