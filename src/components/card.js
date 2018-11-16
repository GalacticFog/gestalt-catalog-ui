import React, { memo }  from 'react';
import styled from 'styled-components';
import { Row } from 'react-flexybox';
import { Link } from 'gatsby';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import placeholderImg from '../pages/placeholder.png';

const CardMediaStyle = styled(CardMedia)`
  margin: auto;
  padding: 10px;
  width: 96px !important;
  height: 96px;
`;

const CardItem = memo(({ node }) => (
  <Card elevation={1}>
    <CardMediaStyle
      component="img"
      image={node.Chart.icon || placeholderImg}
      title={node.Chart.name}
    />
    <CardActionArea component={Link} to={node.fields.slug}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2" align="center">
          {node.Chart.name}
        </Typography>
      </CardContent>
    </CardActionArea>

    <CardActions>
      <Row center>
        <Button
          component={Link}
          to={node.fields.slug}
          size="small"
          color="primary"
        >
          Deploy
        </Button>
        <Button
          component={Link}
          to={node.fields.slug}
          size="small"
          color="primary"
        >
          Details
        </Button>
      </Row>
    </CardActions>
  </Card>
));

export default CardItem;
