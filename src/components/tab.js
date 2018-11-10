import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import blue from '@material-ui/core/colors/blue';
import Typography from '@material-ui/core/Typography';

const TabStyle = styled.div`
  cursor: pointer;
  border-bottom: 2px solid ${props => (props.active ? `${blue[500]}` : 'transparent')};
`;

const TabTitle = styled.div`
  display: flex;
  align-items: center;
  height: 42px;
  padding-left: 24px;
  padding-right: 24px;
  white-space: nowrap;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 13px;
  color: blue;
  user-select: none;
`;

const Tab = ({ title, selected, tabIndex, onClick }) => {
  const click = (event) => {
    event.preventDefault();
    if (!selected) {
      onClick(tabIndex);
    }
  };

  return (
    <TabStyle active={selected}>
      <TabTitle onClick={click}>
        <Typography variant="subtitle2">
          {title}
      </Typography>
      </TabTitle>
    </TabStyle>
  );
};

Tab.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
  selected: PropTypes.bool,
};

Tab.defaultProps = {
  tabIndex: 0,
  selected: false,
  onClick: () => { }
};

export default Tab;
