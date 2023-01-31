// Previous: 0.3.5
// Current: 0.5.8

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
  .empty-image {
    width: 100%;
    padding-bottom: 100%;
    background-color: #f5f5f5;
  }
`;

const StyledTextField = Styled(NekoTextArea)`
  height: 76px;
  border: 1px solid #eaeaea !important;
  background: #fbfbfb !important;
  font-size: 15px !important;
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
    border: 1px solid #eaeaea !important;
    background: #fbfbfb !important;
    margin-bottom: 5px;
  }

  .neko-input {
    border: 1px solid #eaeaea !important;
    background: #fbfbfb !important;
    margin-bottom: 5px;
  }

  .form-row {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
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

export { AiButton, AiNekoHeader, StyledTitleWithButton, StyledGallery, StyledTextField, StyledForm }