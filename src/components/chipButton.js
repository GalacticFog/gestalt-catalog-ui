import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import grey from '@material-ui/core/colors/grey';
import Typography from '@material-ui/core/Typography';

const ItemStyled = styled.div`
  position: relative;
  height: 32px;
  background-color: ${grey[300]};
  border-radius: 25px;
  margin: 5px;
  display: flex;
  align-items: center;
`;

const Tag = styled.div`
  padding: 8px 16px 9px 16px;
  display: flex;
  align-items: center;
  flex: 1;
  min-height: 32px;
`;

const Remove = styled.button`
  background-color: transparent;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0;
  border-radius: 50%;
  height: 32px;
  width: 32px;

  &:hover {
    cursor: pointer;
  }
`;

class ChipButton extends PureComponent {
  static propTypes = {
    item: PropTypes.string.isRequired,
    onClear: PropTypes.func,
  };

  static defaultProps = {
    onClear: null,
  };


  remove = () => {
    const { onClear, item } = this.props;
    
    if (onClear) {
      onClear(item);
    }
  }

  render() {
    return (
      <ItemStyled>
        <Tag>
          <Typography variant="caption">
            {this.props.item}
          </Typography>
        </Tag>
        <Remove onClick={this.remove}><CloseIcon fontSize="small" /></Remove>
      </ItemStyled>
    );
  }
}

export default ChipButton;
