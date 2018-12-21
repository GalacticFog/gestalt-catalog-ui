import React, { Component } from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import { Link } from "gatsby";
import { Row, Col } from 'react-flexybox';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { ModalProvider, ModalConsumer } from '../components/modalContext';
import ModalRoot from '../components/modalRoot';
import Deploy from '../components/deployModal';
import Main from '../components/main';
import NavHeader from '../components/navheader';
import Code from '../components/code';
import Swagger from '../components/swagger';
import Tabs from '../components/tabs';
import Tab from '../components/tab';  
import withTheme from '../components/withTheme';
import placeholderImg from '../static/placeholder.png';
import withContext from '../hocs/withContext';
import metaAPI from '../metaAPI';

const Header = styled.header`
  display: flex;
  align-items: center;
  height: 150px;
  width: 100%;
  padding-left: 8px;
`;

const TitleSection = styled.div`
  padding-left: 16px;
`;

const Summary = styled.div`
  padding: 8px;
  width: 100%;
`;

const Logo = styled.div`
  /* flex: 0 0 auto; */
  width: 128px;
`;

const Img = styled.img`
  margin: auto;
`;

const ReadmeSection = styled.div`
  padding: 8px;
  /* overflow-y: auto; */
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
        <React.Fragment>
          <Typography gutterBottom variant="h6">
            Dependencies
        </Typography>

          {requirements.dependencies.map((dep, i) => (
            <Typography key={i} gutterBottom component="p">
              {dep.name}
            </Typography>
          ))}
        </React.Fragment>
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
          <Row justifyContent="center" fill>
            <NavHeader>
              <IconButton
                component={Link}
                to="/"
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" color="inherit">
                Catalog Items
              </Typography>
            </NavHeader>
            
            <Col flex={10} xs={12} sm={12} md={12}>
              <Row gutter={10}>
                <Col flex={12}>
                  <Header>
                    <Logo>
                      <Img src={meta.icon || placeholderImg} />
                    </Logo>
                    <TitleSection>
                      <Typography gutterBottom variant="h4">
                        {meta.name}
                      </Typography>
                      
                      {deploy.enabled &&
                        <ModalConsumer>
                        {({ showModal }) => (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => showModal(Deploy, { node: catalogCompiledJson })}
                          >
                            Deploy
                          </Button>
                        )}
                      </ModalConsumer>}
                    </TitleSection>
                  </Header>

                  <Tabs>
                    <Tab title="Details">
                      <Row gutter={10}>
                        <Col flex={12}>
                          <Summary>
                            <Typography gutterBottom variant="h6">
                              Type
                            </Typography>

                            <Typography gutterBottom component="p">
                              {type}
                            </Typography>

                            <Typography gutterBottom variant="h6">
                              Version
                            </Typography>

                            <Typography gutterBottom component="p">
                              {meta.version}
                            </Typography>

                            <Typography gutterBottom variant="h6">
                              Overview
                          </Typography>

                            <Typography gutterBottom component="p">
                              {meta.description}
                            </Typography>
                          </Summary>

                          <Summary>
                            {this.renderrequirements()}
                          </Summary>
                        </Col>
                      </Row>
                    </Tab>

                    {readme
                      ?
                      <Tab title="Readme">
                      <ReadmeSection>
                        <Typography component="p">
                          <div dangerouslySetInnerHTML={{ __html: readme }} />
                        </Typography>
                      </ReadmeSection>
                      </Tab>
                      : <div />
                    }

                    {payload.data
                      ?
                      <Tab title={this.previewTitle()}>
                        {this.renderPreview()}
                      </Tab>
                      : <div />
                    }
                  </Tabs>
                </Col>
              </Row>
            </Col>
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
