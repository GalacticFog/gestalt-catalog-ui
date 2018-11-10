import React, { PureComponent } from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import { Row, Col } from 'react-flexybox';
import Typography from '@material-ui/core/Typography';

const SearchContainer = styled.div`
  background-color: #E5E5E5;
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  width: 100%;
  padding: 8px;
  border-radius: 50px;
`;

const SearchInputIcon = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 8px;
`;

const SearchInput = styled.input`
  width: 100%;
  outline: none;
  border: none;
  background-color: transparent;
`;

const SearchClose = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 38px;
`;

const SearchInputTypography = styled(Typography)`
  width: 100%;
`;

class Search extends PureComponent {
  state = {
    value: '',
  }

  onChange = (e) => {
    const { onChange } = this.props;
    const value = e.target.value;

    this.setState({ value });

    if (onChange) {
      onChange(value);
    }
  }
  
  handleClear = () => {
    const { onClear } = this.props;

    this.setState({ value: '' });

    if (onClear) {
      onClear();
    }
  }

  render() {
    const { value } = this.state;

    return (
      <Row>
        <Col flex={6} xs={12} sm={12}>
          <SearchContainer>
            <SearchInputIcon>
              <SearchIcon />
            </SearchInputIcon>
            <SearchInputTypography variant="body1">
              <SearchInput onChange={this.onChange} value={value} />
            </SearchInputTypography>
            <SearchClose>
              <IconButton onClick={this.handleClear}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </SearchClose>
          </SearchContainer>
        </Col>
      </Row>
    );
  }
}

export default Search;
