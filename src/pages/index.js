import React, { PureComponent } from 'react';
import { Row, Col } from 'react-flexybox';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { graphql } from 'gatsby';
import { debounce, uniq, orderBy } from 'lodash';
import Main from '../components/main';
import NavHeader from '../components/navheader';
import Card from '../components/card';
import Search from '../components/search';
import withTheme from '../hocs/withTheme';
import ChipButton from '../components/chipButton';
import SideBar from '../components/sidebar';
import { ModalProvider } from '../components/modalContext';
import ModalRoot from '../components/modalRoot';
import grey from '@material-ui/core/colors/grey';

const CatalogListing = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  /* margin-top: 12px; */
  width: 100%;
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
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  align-items: center;
  flex: 1;
  min-height: 32px;

  &:hover {
    cursor: pointer;
    background-color: ${grey[300]};
    border-radius: 25px;
  } 
`;

class Index extends PureComponent {
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

  componentDidMount() {
    // Always ensure cards scroll to top on reload
    setTimeout(() => { 
      window.scrollTo(0, 0);
    }, 0);
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
          <Typography>
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
    
    const sortedStoreItems = orderBy(storeItems, ['node.meta.name'], 'asc');

    return (
      <ModalProvider>
        <ModalRoot />
        <NavHeader>
          <Typography variant="h6">
            {data.site.siteMetadata.title}
          </Typography>
        </NavHeader>
        <Main>   
          <Row gutter={5} fill justifyContent="center">
            <SideBar>
              <Typography variant="subtitle2" gutterBottom>
                Filter by type
              </Typography>

              {this.renderCategories()}
            </SideBar>

            <CatalogListing>
              <Row gutter={10} paddingTop="10px">
                <Col flex={6} xs={12} sm={12} md={12}>
                  <Search
                    onChange={this.handleSearch}
                    onClear={this.handleClearSearch}
                  />
                </Col>
              </Row>

              <Row gutter={10} minColWidths={300}>
                {sortedStoreItems.map(({ node }) => (
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