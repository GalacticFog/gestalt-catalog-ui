import React, { PureComponent } from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

const SearchContainer = styled.div`
  background-color: #eeeeee;
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
      <SearchContainer>
        <SearchInputIcon>
          <SearchIcon />
        </SearchInputIcon>
        <SearchInput onChange={this.onChange} value={value} />
        <SearchClose>
          <IconButton onClick={this.handleClear} aria-label="Search" disableRipple>
            <CloseIcon fontSize="small" />
          </IconButton>
        </SearchClose>
      </SearchContainer>
    );
  }
}

export default Search;
