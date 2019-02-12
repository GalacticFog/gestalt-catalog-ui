// import React from 'react';
import styled from 'styled-components';

const Main = styled.main`
  position: relative;
  display: flex;
  padding-top: 56px;
  @supports(position: sticky) {
    padding-top: 0;
  }
  width: 100%;
  height: 100%;
  min-height:100%;
`;

export default Main;
