import React, { Component } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Row, Col } from 'react-flexybox';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { graphql } from 'gatsby';
import { debounce, uniq } from 'lodash';
import Main from '../components/main';
import NavHeader from '../components/navheader';
import Card from '../components/card';
import Search from '../components/search';
import withTheme from '../components/withTheme';
import ChipButton from '../components/chipButton';
import SideBar from '../components/sidebar';
import { ModalProvider } from '../components/modalContext';
import ModalRoot from '../components/modalRoot';
import theme from '../theme';

const CatalogListing = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  /* margin-top: 12px; */
  width: 100%;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  color: #424242;

  &:not(:last-child) {
    padding-bottom: 16px;
  }
`;

const CategoryButton = styled.button`
  display: flex;
  height: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  padding: 0;
  height: 32px;
`;

const CategoryItem = styled.div`
  cursor: pointer;
  color: #616161;
`;

class Index extends Component {
  constructor(props) {
    super(props);

    const { data: { allCatalogCompiledJson } } = props;

    this.state = {
      items: allCatalogCompiledJson.edges,
      filterBy: '',
      searchText: '',
    }

    // TODO: fix debounce when search clear
    this.handleSearch = debounce(this.handleSearch, 300);
  } 
  
  handleTypeClick(type) {
    this.setState(state => {
      if (state.filterBy === type) {
        return { filterBy: '' };
      }

      return { filterBy: type };
    });
  }

  handleSearch = (searchText) => {
    this.setState(({ searchText }));
  }

  handleClearSearch = () => {
    this.setState(({ searchText: '' }));
  }
  
  clearFilter = () => {
    this.setState({ filterBy: '' });
  }

  renderCategories() {
    const { data: { allCatalogCompiledJson } } = this.props;
    const { filterBy } = this.state;
    const typeItems = allCatalogCompiledJson.edges.map(item => item.node.type);
    const types = uniq(typeItems);
    
    if (filterBy) {
      return (
        <ChipButton
          onClear={this.clearFilter}
          item={filterBy}
        >
          <Typography align="left">
            {filterBy}
          </Typography>
        </ChipButton>
      );
    }

    return types.map(type => (
      <CategoryButton
        key={type}
        onClick={() => this.handleTypeClick(type)}
      >
        <CategoryItem>
          <Typography color="inherit">
          {`${type} (${typeItems.filter(t => t === type).length})`}
          </Typography>
        </CategoryItem>
      </CategoryButton>
    ));
  }
  
  render() {
    const { data } = this.props;
    const { items, filterBy, searchText } = this.state;
    const storeItems = items
      .filter(item => { 
      return filterBy ? item.node.type === filterBy : item;
      })
      .filter(item => {
        return item.node.meta.name.toLowerCase()
          .includes(searchText.toLowerCase());
      });

    return (
      <MuiThemeProvider theme={theme}>
        <ModalProvider>
          <ModalRoot />
          <Main>   
            <NavHeader>
              <Typography variant="h6" color="inherit">
                {data.site.siteMetadata.title}
              </Typography>
            </NavHeader>
            <Row gutter={5} fill justifyContent="center">
              <SideBar>
                <Item>
                  <Typography variant="subtitle2" color="inherit">
                    Type
                  </Typography>
                </Item>

                <Item>
                  {this.renderCategories()}
                </Item>
              </SideBar>

              <CatalogListing>
                <Row gutter={12}>
                  <Col flex={6} xs={12} sm={12} md={12}>
                    <Search
                      onChange={this.handleSearch}
                      onClear={this.handleClearSearch}
                    />
                  </Col>
                </Row>

                <Row gutter={10} minColWidths={300}>
                  {storeItems.map(({ node }) => (
                    <Col flex={4} xs={12} sm={12} md={6} key={node.id}>
                      <Card
                        type={node.type}
                        node={node.meta}
                        slug={node.fields.slug}
                      />
                    </Col>
                  ))}
                </Row>
              </CatalogListing>
            </Row>
          </Main>
        </ModalProvider>
      </MuiThemeProvider>
    );
  }
}


export const query = graphql`
  query HomePageQuery {
    site {
      siteMetadata {
        title,
        description
      },
    }
    allCatalogCompiledJson {
      edges {
        node {
          fields {  
            slug
          }
          id
          type
          deploy {
            enabled
            type
            url
            method
            headers
          }
          payload {
            type
            render
            data
          }
          meta {
            name
            version
            description
            home
            icon
          }
        }
      }
    }
  }`

export default withTheme(Index);