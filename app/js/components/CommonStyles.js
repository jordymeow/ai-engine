// Previous: none
// Current: 0.2.0

import Styled from "styled-components";
import { NekoTextArea, NekoHeader, NekoButton } from '@neko-ui';

const AiNekoHeader = ({ title = "Settings" }) => {
  return (
    <NekoHeader title={`AI Engine | ${title}`} subtitle='By Jordy Meow'>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <NekoButton className='header' icon=''
          onClick={() => location.href = 'edit.php?page=mwai_content_generator'}>
          Build Content
        </NekoButton>
        <NekoButton className='header' icon=''
          onClick={() => location.href = 'edit.php?page=mwai_image_generator'}>
          Build Images
        </NekoButton>
        <NekoButton className='header' icon=''
          onClick={() => location.href = 'tools.php?page=mwai_dashboard'}>
          Playground
        </NekoButton>
        <NekoButton className='header' icon='tools'
          onClick={() => location.href = 'admin.php?page=mwai_settings'}>
          Settings
        </NekoButton>
      </div>
    </NekoHeader>
  );
}

const StyledTitleWithButton = Styled.div`
  display: flex;
  justify-content: unset;
  align-items: center;
  justify-content: space-between;
  margin-top: -5px;

  h2 {
    margin: 0;
  }
`;

const StyledGallery = Styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));
  grid-gap: 10px;
  margin-top: 20px;

  img {
    width: 100%;
    height: 305px;
  }

  .empty-image {
    width: 100%;
    height: 305px;
    background-color: #f5f5f5;
  }
`;

const StyledTextField = Styled(NekoTextArea)`

  .neko-textarea {
    height: 76px;
    border: 1px solid #eaeaea !important;
    background: #fbfbfb !important;
    font-size: 15px !important;
  }
`;

export { AiNekoHeader, StyledTitleWithButton, StyledGallery, StyledTextField }