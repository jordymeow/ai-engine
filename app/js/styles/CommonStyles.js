// Previous: 0.8.2
// Current: 0.8.6

import Styled from "styled-components";
import { NekoHeader, NekoButton } from '@neko-ui';
import { options as defaultOptions } from '@app/settings';

const AiNekoHeader = ({ title = "Settings", options = defaultOptions }) => {
  const module_playground = options?.module_playground;
  const module_generator_content = options?.module_generator_content;
  const module_generator_images = options?.module_generator_images;

  return (
    <NekoHeader title={`AI Engine | ${title}`} subtitle='By Jordy Meow'>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {module_generator_content && <NekoButton className='header' icon=''
          onClick={() => location.href = 'edit.php?page=mwai_content_generator'}>
          Build Content
        </NekoButton>}
        {module_generator_images && <NekoButton className='header' icon=''
          onClick={() => location.href = 'edit.php?page=mwai_image_generator'}>
          Build Images
        </NekoButton>}
        {module_playground && <NekoButton className='header' icon=''
          onClick={() => location.href = 'tools.php?page=mwai_dashboard'}>
          Playground
        </NekoButton>}
        <NekoButton className='header' icon='tools'
          onClick={() => location.href = 'admin.php?page=mwai_settings'}>
          Settings
        </NekoButton>
      </div>
    </NekoHeader>
  );
}

const AiButton = Styled(NekoButton)`
`;

const StyledTitleWithButton = Styled.div`
  display: flex;
  justify-content: unset;
  align-items: center;
  justify-content: space-between;
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
  .empty-image {
    width: 100%;
    padding-bottom: 100%;
    background-color: #f5f5f5;
  }
`;

const StyledForm = Styled.div`

  label {
    margin-bottom: 5px;
    display: block;
  }

  .nui-button {
    margin-bottom: 5px;
  }

  .neko-textarea {
    margin-bottom: 5px;
  }

  .neko-input {
    margin-bottom: 5px;
  }

  .form-row {
    display: flex;
    .nui-button, .neko-textarea, .neko-input {
      margin: 0;
    }
  }

  .form-row-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

export { AiButton, AiNekoHeader, StyledTitleWithButton, StyledGallery, StyledForm }