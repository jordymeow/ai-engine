// Previous: 0.1.0
// Current: 1.3.93

import Styled from "styled-components";

const ResultsContainer = Styled.div`
  margin-bottom: 5px;
`;

const Result = Styled.div`
  margin-top: 5px;
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  background: #dbf2ff;

  &:hover {
    background: #037cba;
    color: white;
  }
`;

export { ResultsContainer, Result };