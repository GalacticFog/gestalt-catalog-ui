import React, { Component } from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import { Link } from "gatsby";
import { Row, Col } from 'react-flexybox';
import Typography from '@material-ui/core/Typography';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import { ModalProvider, ModalConsumer } from '../components/modalContext';
import ModalRoot from '../components/modalRoot';
import Deploy from '../components/deployModal';
import Main from '../components/main';
import NavHeader from '../components/navheader';
import Code from '../components/code';
import Swagger from '../components/swagger';
import Tabs from '../components/tabs';
import Tab from '../components/tab';  
import withTheme from '../hocs/withTheme';
import placeholderImg from '../static/placeholder.png';
import withContext from '../hocs/withContext';
import metaAPI from '../metaAPI'; 

const Background = styled.header`
  width: 100%;
  border-bottom: 1px solid #E5E5E5;
  ${props => !props.noColor && 'background-color: #f5f5f5'};
`;

const Content = styled.div`
  padding: 8px;
  width: 100%;
  max-width: 1344px;
  margin: 0 auto;
`;

const Header = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  min-height: 250px;
  width: 100%;
`;

const TitleSection = styled.div`
  padding-left: 16px;
  width: 100%;
`;

const Summary = styled.div`
  padding: 16px;
  width: 100%;
`;

const Logo = styled.div`
  flex-shrink: 0;
  width: 128px;
  display: flex;
`;

const Img = styled.img`
  max-width: 128px;
  max-height: 128px;
  user-select: none;
`;

const ReadmeSection = styled.div`
  width: 100%;
  padding: 8px;
`;

const NoData = styled.div`
  font-size: 18px;
  color: #9e9e9e;
  width: 100%;
  text-align: center;
`;

const Divider = styled.hr`
  background-color: #eeeeee;
  height: 3px;
  padding: 0;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const DeploySection = styled.div`
  padding-top: 12px;
`;

class Details extends Component {
  handleDeploy = async () => {
    const { context } = this.props;
    const { catalogCompiledJson: { payload } } = this.props.data;
    const API = new metaAPI(context);

    await API.deployKube('123', 'uuid', 'release', payload.data);
  }

  renderrequirements = () => {
    const { catalogCompiledJson: { requirements} } = this.props.data;

    if (requirements.dependencies.length > 0) {
      return (
        requirements.dependencies.map((dep, i) => (
          <Typography key={i} gutterBottom variant="h6">
            {dep.name}
          </Typography>
        ))
      );
    }

    return null;
  }

  renderPreview() {
    const { catalogCompiledJson: { payload } } = this.props.data;

    switch (payload.render) {
      case 'swagger':
        return <Swagger value={JSON.parse(payload.data)} />;
      case 'code':
        return <Code value={payload.data} mode={payload.type} />;
      default:
        return null;
    }
  }

  previewTitle() {
    const { catalogCompiledJson: { payload } } = this.props.data;
    
    switch (payload.render) {
      case 'code':
        return payload.type;
      default:
        return payload.render;
    }
  }

  render() {
    const { catalogCompiledJson: { type, meta, readme, payload, deploy }, catalogCompiledJson } = this.props.data;

    return (
      <ModalProvider>
        <ModalRoot />
        <Main>
          <NavHeader>
            <Button 
              variant="flat" 
              // className={classes.button}
              component={Link}
              to="/"
            >
              <ArrowBack />
              Catalog Items
            </Button>
          </NavHeader>
    
          <Row>
            <Background>
              <Content>
                <Header>
                  <Logo>
                    <Img src={meta.icon || placeholderImg} />
                  </Logo>

                  <TitleSection>
                    <Typography variant="h4" inline>
                      {meta.name}
                    </Typography>
                    
                    {meta.version &&
                      <Typography gutterBottom variant="body1" component="div" inline>&nbsp;&nbsp;v{meta.version}</Typography>}
                    
                    <Typography gutterBottom variant="body1" component="div" >
                      {type}
                    </Typography>

                    <Divider />

                    <Typography gutterBottom variant="body1">
                      {meta.description}
                    </Typography>
                    
                    {deploy.enabled &&
                      <DeploySection>
                        <ModalConsumer>
                        {({ showModal }) => (
                          <Button
                            size="large"
                            variant="outlined"
                            color="primary"
                            onClick={() => showModal(Deploy, { node: catalogCompiledJson })}
                          >
                            Deploy
                          </Button>
                        )}
                        </ModalConsumer>
                      </DeploySection>}
                  </TitleSection>
                </Header>
              </Content>
            </Background>
            
            <Background noColor>
              <Content>
                <Tabs>
                  <Tab title="Readme">
                    <ReadmeSection>
                      <Typography component="div" variant="body2">
                        {readme
                          ? <div dangerouslySetInnerHTML={{ __html: readme }} />
                          : <NoData>Readme Unavailable</NoData>}
                      </Typography>
                    </ReadmeSection>
                  </Tab>

                  {payload.data
                    ? <Tab title={this.previewTitle()}>
                        {this.renderPreview()}
                      </Tab>
                    : <div />
                  }

                  <Tab title="Dependencies">
                    <Row gutter={10}>
                      <Col flex={12}>
                        <Summary>
                          {this.renderrequirements()}
                        </Summary>
                      </Col>
                    </Row>
                  </Tab>
                </Tabs>
              </Content>
            </Background>
          </Row>
        </Main>
      </ModalProvider>
    );
  }
}

export const query = graphql`
  query ($slug: String) {
    catalogCompiledJson(fields: {slug: {eq: $slug}}) {
      type
      meta {
        name
        version
        description
        home
        icon
      }
      readme
      requirements {
        dependencies {
          name
        }
      }
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
    }
  }
`

export default withTheme(withContext(Details));
