import React, { memo } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexybox';
import { Link } from 'gatsby';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import placeholderImg from '../static/placeholder.png';

const Image = styled.img`
  width: 96px !important;
  height: 96px;
  display: flex;
  align-items: center;
  margin: auto;
  padding: 8px;
`;

const InlineCardItem = memo(({ node, onDeploy }) => (
  <Card elevation={1}>
    <Row alignItems="center">
      <Image src={node.meta.icon || placeholderImg} />
      <Col flex={9} xs={12}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" align="left" component={Link} to={node.fields.slug}>
            {node.meta.name}
          </Typography>    

          <Typography gutterBottom component="p" align="left">
            {node.meta.description}
          </Typography>
        </CardContent>
      </Col>

      <Col flex>
        <CardActions>
          <Row center>
            <Button
              component={Link}
              to={node.fields.slug}
              size="small"
              color="primary"
            >
              Details
            </Button>
            <Button
              onClick={() => onDeploy(node)}
              size="small"
              color="primary"
            >
              Deploy
            </Button> 
          </Row>
        </CardActions>
      </Col>

    </Row>
  </Card>
));

export default InlineCardItem;
