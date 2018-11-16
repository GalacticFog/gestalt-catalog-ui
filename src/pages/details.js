import React from "react";
import { graphql } from "gatsby";
import styled from 'styled-components';
import { Link } from "gatsby";
import { Row, Col } from 'react-flexybox';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Main from '../components/main';
import NavHeader from '../components/navheader';
import Code from '../components/code';
import Tabs from '../components/tabs';
import Tab from '../components/tab';
import withTheme from '../components/withTheme';
import placeholderImg from '../components/placeholder';

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

const Details = ({ data }) => {
  const { catalogCompiledJson: { Chart, Readme, Requirements, AssetsYaml } } = data;

  const renderRequirements = () => {
    if (Requirements.dependencies.length > 0) {
      return (
        <React.Fragment>
          <Typography gutterBottom variant="h6">
            Dependencies
        </Typography>

          {Requirements.dependencies.map(dep => (
            <Typography gutterBottom component="p">
              {dep.name}
            </Typography>
          ))}
        </React.Fragment>
      );
    }

    return null;
  }

  return (
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

                  <Button
                    variant="contained"
                    color="primary"
                  >
                    Deploy
                  </Button>
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
                        {renderRequirements()}
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
                    <Code value={AssetsYaml}/>
                  </ReadmeSection>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Col>
      </Row>
    </Main>
  );
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

export default withTheme(Details);
