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
import Tabs from '../components/tabs';
import Tab from '../components/tab';  
import withTheme from '../components/withTheme';
import placeholderImg from './placeholder.png';
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
`;

class Details extends Component {
  handleDeploy = async () => {
    const { context } = this.props;
    const { catalogCompiledJson: { AssetsYaml } } = this.props.data;
    const API = new metaAPI(context);

    await API.deployKube('123', 'uuid', 'release', AssetsYaml);
  }

  renderRequirements = () => {
    const { catalogCompiledJson: { Requirements} } = this.props.data;

    if (Requirements.dependencies.length > 0) {
      return (
        <React.Fragment>
          <Typography gutterBottom variant="h6">
            Dependencies
        </Typography>

          {Requirements.dependencies.map((dep, i) => (
            <Typography key={i} gutterBottom component="p">
              {dep.name}
            </Typography>
          ))}
        </React.Fragment>
      );
    }

    return null;
  }

  render() {
    const { catalogCompiledJson: { Chart, Readme, AssetsYaml }, catalogCompiledJson } = this.props.data;

    return (
      <ModalProvider>
        <ModalRoot />
        <Main>
          <Row center>
            <NavHeader>
              <IconButton
                component={Link}
                to="/"
              >
                <ArrowBack />
              </IconButton>
            </NavHeader>
            <Col flex={9} xs={12} sm={12}>
              <Row gutter={5}>
                <Col flex={12}>
                  <Header>
                    <Logo>
                      <Img src={Chart.icon || placeholderImg} />
                    </Logo>
                    <TitleSection>
                      <Typography gutterBottom variant="h4">
                        {Chart.name}
                      </Typography>

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
                      </ModalConsumer>


                    </TitleSection>
                  </Header>

                  <Tabs>
                    <Tab title="Details">
                      <Row gutter={10}>
                        <Col flex={6} xs={12} sm={12}>
                          <Summary>
                            <Typography gutterBottom variant="h6">
                              Version
                          </Typography>

                            <Typography gutterBottom component="p">
                              {Chart.version}
                            </Typography>

                            <Typography gutterBottom variant="h6">
                              Overview
                          </Typography>

                            <Typography gutterBottom component="p">
                              {Chart.description}
                            </Typography>
                          </Summary>

                          <Summary>
                            {this.renderRequirements()}
                          </Summary>
                        </Col>
                      </Row>
                    </Tab>

                    <Tab title="Readme">
                      <ReadmeSection>
                        <Typography component="p">
                          <div dangerouslySetInnerHTML={{ __html: Readme }} />
                        </Typography>
                      </ReadmeSection>
                    </Tab>

                    <Tab title="YAML">
                      <ReadmeSection>
                        <Code value={AssetsYaml} />
                      </ReadmeSection>
                    </Tab>
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
      Chart {
        name
        version
        appVersion
        description
        home
        engine
        icon
      }
      Assets {
        kind
        type
      }
      Readme
      Requirements {
        dependencies {
          name
        }
      }
      AssetsYaml
    }
  }
`

export default withTheme(withContext(Details));
