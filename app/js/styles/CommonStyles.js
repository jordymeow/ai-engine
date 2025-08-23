// Previous: 2.8.2
// Current: 3.0.3

import Styled from "styled-components";
import { NekoHeader, NekoButton, NekoIcon } from '@neko-ui';
import { options as defaultOptions } from '@app/settings';
import i18n from "@root/i18n";
import AiIcon from "./AiIcon";

const AiNekoHeader = ({ title = i18n.COMMON.SETTINGS, options = defaultOptions }) => {
  const module_playground = options?.module_playground;
  const module_generator_content = options?.module_generator_content;
  const module_generator_images = options?.module_generator_images;

  return (
    <NekoHeader title="AI Engine" section={title} subtitle="By Meow Apps">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {module_generator_content && <NekoButton className='header'
          onClick={() => location.href = 'edit.php?page=mwai_content_generator'}>
          <AiIcon icon="wand" style={{ marginRight: 8 }} />
          {i18n.COMMON.CONTENT}
        </NekoButton>}
        {module_generator_images && <NekoButton className='header' icon=''
          onClick={() => location.href = 'edit.php?page=mwai_images_generator'}>
          <AiIcon icon="wand" style={{ marginRight: 8 }} />
          {i18n.COMMON.IMAGES}
        </NekoButton>}
        {module_playground && <NekoButton className='header' icon=''
          onClick={() => location.href = 'tools.php?page=mwai_dashboard'}>
          <AiIcon icon="wand" style={{ marginRight: 8 }} />
          {i18n.COMMON.PLAYGROUND}
        </NekoButton>}
        <NekoButton className='header' icon='tools'
          onClick={() => location.href = 'admin.php?page=mwai_settings'}>
        </NekoButton>
      </div>
    </NekoHeader>
  );
}

const AiButton = Styled(NekoButton)`
`;

const StyledTitleWithButton = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 2px 0;

  h2 {
    margin: 7px 0 0 0;
    padding: 0;
  }
`;

const StyledGallery = Styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));
  grid-template-rows: repeat(auto-fit, minmax(30%, 1fr));
  grid-gap: 10px;
  margin-top: 20px;

  img, div {
    width: 100%;
    cursor: pointer;
  }
  .image-wrapper {
    position: relative;
  }
  .delete-icon {
    display: block;
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(0,0,0,0.7);
    color: #fff;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }
  .image-wrapper:hover .delete-icon {
    display: flex;
  }
  .media-label {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.4);
    color: #eee;
    text-align: right;
    font-size: 12px;
    padding: 2px 0;
    text-decoration: underline;
    cursor: pointer;
  }
  .empty-image {
    width: 100%;
    padding-bottom: 105%;
    background-color: #eaeaea;
  }
`;

export { AiButton, AiNekoHeader, StyledTitleWithButton, StyledGallery }