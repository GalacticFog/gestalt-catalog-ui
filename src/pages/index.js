import React, { Component } from 'react';
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
import { ModalProvider, ModalConsumer } from '../components/modalContext';
import ModalRoot from '../components/modalRoot';
import Deploy from '../components/deployModal';

const Cards = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;

const Item = styled.div`
  display: flex;
  align-items: center;

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

  handleCatClick(type) {
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
        onClick={() => this.handleCatClick(type)}
      >
        <Typography>
          {`${type} (${typeItems.length})`}
        </Typography>
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
        return item.node.Chart.name.toLowerCase()
          .includes(searchText.toLowerCase());
      });

    return (
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
                <Typography variant="subtitle2">
                  Type
                </Typography>
              </Item>

              <Item>
                {this.renderCategories()}
              </Item>
            </SideBar>

            <Cards>
              <Row gutter={5}>
                <Col flex={12}>
                  <Search
                    onChange={this.handleSearch}
                    onClear={this.handleClearSearch}
                  />
                </Col>
                {storeItems.map(({ node }) => (
                  <Col flex={2} xs={12} sm={6} md={3} key={node.id}>
                    <ModalConsumer>
                      {({ showModal }) => (
                        <Card node={node} onDeploy={() => showModal(Deploy, { node })} />
                      )}
                    </ModalConsumer>
                  </Col>
                ))}
              </Row>
            </Cards>
          </Row>
        </Main>
      </ModalProvider>
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
          Chart {
            name
            version
            appVersion
            description
            home
            engine
            icon
            keywords
          }
          Assets {
            kind
            type
          }
          AssetsYaml
        }
      }
    }
  }`

export default withTheme(Index);