import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TabsStyle = styled.div`
  display: flex;
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 10px;

  @media (min-width: 0) and (max-width: 599px) {
    display: block;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

class Tabs extends Component {
  static propTypes = {
    defaultActiveTabIndex: PropTypes.number,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
  };

  static defaultProps = {
    defaultActiveTabIndex: 0,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeTabIndex: this.props.defaultActiveTabIndex
    };
  }

  handleTabClick = (tabIndex) => {
    this.setState(prevState => ({
      activeTabIndex: tabIndex === prevState.activeTabIndex ? this.props.defaultActiveTabIndex : tabIndex
    }));
  }

  // Encapsulate <Tabs/> component API as props for <Tab/> children
  renderChildrenWithTabsApiAsProps() {
    const { children } = this.props;
    return React.Children.map(React.Children.toArray(children), (child, index) => React.cloneElement(child, {
      onClick: this.handleTabClick,
      tabIndex: index,
      selected: index === this.state.activeTabIndex,
    }));
  }

  // Render current active tab content
  renderActiveTabContent() {
    const { children } = this.props;
    const filteredChildren = React.Children.toArray(children);
    const { activeTabIndex } = this.state;

    if (filteredChildren[activeTabIndex]) {
      return filteredChildren[activeTabIndex].props.children;
    }

    return null;
  }

  render() {
    return (
      <React.Fragment>
        <TabsStyle>
          {this.renderChildrenWithTabsApiAsProps()}
        </TabsStyle>
        <Content>
          {this.renderActiveTabContent()}
        </Content>
      </React.Fragment>
    );
  }
}

export default Tabs;
