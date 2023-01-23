// Previous: 0.3.5
// Current: 0.3.6

import { useState, useEffect } from "react";
import Styled from "styled-components";
import { NekoButton, NekoPage, NekoSelect, NekoOption, NekoModal, NekoInput,
  NekoContainer, NekoWrapper, NekoColumn, NekoTypo } from '@neko-ui';

const StyledSidebar = Styled.div`
  background: white;
  padding: 15px;
  border-radius: 5px;

  h2 {
    margin-bottom: 8px;
  }
  
  h3:first-child {
    margin-top: 0;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  label {
    margin-top: 10px;
  }

  li {
    margin-bottom: 10px;
    border: 1px solid #e5e5e5;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  li.active {
    background: #037cba;
    color: white;
    border-color: #037cba;
  }

  .information {
    color: #a3a3a3;
    margin-top: 5px;
    font-size: 12px;
    line-height: 100%;
  }
`;

const StyledNekoInput = Styled(NekoInput)`
  flex: auto !important;

  input {
    height: 50px !important;
    font-size: 14px !important;
    font-family: monospace !important;
    padding: 20px 20px 20px 45px !important;
    border-color: #333d4e !important;
    background: #333d4e !important;
    color: white !important;
  }
`;

const StyledBuilderForm = Styled.div`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 3px;
  }

  .mwai-builder-row {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .mwai-builder-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-right: 5px;
  }

  .mwai-builder-col:last-child {
    margin-right: 0;
  }

  pre {
    white-space: pre-wrap;
    background: #d4f0ff;
    color: #037cba;
    padding: 10px;
    font-size: 13px;
    font-weight: bold;
    margin: 20px 0;
  }

  .neko-spacer {
    margin-bottom: 0 !important;
  }

  .neko-input {
    border: 1.5px solid #eaeaea !important;
    background: #fbfbfb !important;
  }

  .nui-select-option {
    border: 1.5px solid #eaeaea !important;
    background: #fbfbfb !important;
  }

  .nui-checkbox {
    margin: -6px 0px -2px 0px;
  }
`;

export { StyledSidebar, StyledNekoInput, StyledBuilderForm };

/* Main component with subtle bugs */

function DebuggableComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("John");
  const [items, setItems] = useState(["Apple", "Banana", "Cherry"]);
  const [selectedItem, setSelectedItem] = useState("Banana");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [globalFlag, setGlobalFlag] = useState(true);

  useEffect(() => {
    if (count > 10) {
      alert("Count exceeded 10");
    }
  }, [count]);

  useEffect(() => {
    if (name.length > 5) {
      setName(name.substring(0, 5));
    }
  }, [name]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleAddItem = () => {
    setItems([...items, inputValue]);
    setInputValue("");
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (e.target.value === "trigger") {
      setGlobalFlag(false);
    }
  };

  return (
    <NekoPage>
      <StyledSidebar>
        <h2>Debugging Panel</h2>
        <h3>Counter: {count}</h3>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <h3>Name: {name}</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <ul>
          {items.map((item, index) => (
            <li
              key={index}
              className={item === selectedItem ? "active" : ""}
              onClick={() => handleItemClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
        <div style={{ marginTop: "10px" }}>
          <input
            placeholder="Add item"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button onClick={handleAddItem}>Add</button>
        </div>
        <button onClick={toggleModal}>Open Modal</button>
        {isModalOpen && (
          <NekoModal onClose={toggleModal}>
            <h2>Modal Content</h2>
            <p>If input is 'trigger', globalFlag turns false, which may cause issues.</p>
          </NekoModal>
        )}
      </StyledSidebar>
      <NekoContainer style={{ marginLeft: "20px" }}>
        <StyledBuilderForm>
          <label>Sample Input</label>
          <NekoInput className="neko-input" />
          <div className="mwai-builder-row">
            <div className="mwai-builder-col">
              <label>Column 1</label>
              <NekoSelect>
                {items.map((item, index) => (
                  <NekoOption key={index} value={item}>{item}</NekoOption>
                ))}
              </NekoSelect>
            </div>
            <div className="mwai-builder-col">
              <label>Column 2</label>
              <NekoInput />
            </div>
          </div>
          <pre>Some code snippet here</pre>
          <button onClick={() => setCount(prev => prev + 1)}>Button with side effect</button>
        </StyledBuilderForm>
        <div style={{ marginTop: "20px" }}>
          <NekoTypo>
            This is a typo component. Changes in globalFlag: {String(globalFlag)}
          </NekoTypo>
        </div>
      </NekoContainer>
    </NekoPage>
  );
}