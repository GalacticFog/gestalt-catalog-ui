import React from 'react';
import styled from 'styled-components';

const FormStyle = styled.form`
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  ${props => props.disabled && 'pointer-events: none'};
  ${props => props.disabled && 'opacity: 0.4'};
`;

const Form = props => <FormStyle {...props} />;

export default Form;
