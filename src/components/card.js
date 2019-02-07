import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { navigate } from 'gatsby';
import grey from '@material-ui/core/colors/grey';
import lightBlue from '@material-ui/core/colors/lightBlue';
import { truncate } from '../util';
import placeholderImg from '../static//placeholder.png';

const CardStyle = styled.div`
  border: 1px solid transparent;
  border-radius: 4px;
  box-shadow: 1px 1px 5px ${grey[300]};;
  height: 165px;
  transition: 0.3s;
  padding: 16px;
  background-color: white;

  &:hover {
    cursor: pointer;
    box-shadow: 4px 6px 6px ${grey[300]}; 
    border: 1px solid ${lightBlue[500]};
  }
`;

const CardContent = styled.div`
  display: flex;
  width: 100%;
`;

const Icon = styled.div`
  flex-shrink: 0;
  width: 33.33333%;
  text-align: center;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
`;

const Img = styled.img`
  margin: 6px;
  width: 96px;
  height: 96px;
  user-select: none;
`;

const Header = styled.div`
  display: block;
  flex-shrink: 1;
  padding: 16px 16px 16px 48px;
  width: 100%;
`;

const Description = styled.div`
  @media (min-width: 0) and (max-width: 599px) {
    display: none;
  }
`;

const Card = ({ type, node, slug }) => (
  <CardStyle onClick={() => navigate(slug)}>
    <CardContent>
      <Icon>
        <Img src={node.icon || placeholderImg} alt={node.name} />
      </Icon>

      <Header>
        <Typography gutterBottom variant="h6">
          {truncate(node.name, 40)}
        </Typography>
        <Typography gutterBottom variant="caption">
          {type}
        </Typography>
        <Description>
          <Typography gutterBottom variant="body2">
            {truncate(node.description, 65)}
          </Typography>
        </Description>
      </Header>
    </CardContent>
  </CardStyle>
);

export default Card;