import React from 'react';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import Typography from '@material-ui/core/Typography';
import { truncate } from '../util';
import placeholderImg from '../static//placeholder.png';

const CardStyle = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 3px;
  box-shadow: 1px 1px 5px #eee;
  min-height: 165px;
  transition: 0.3s;
  padding: 16px;
  background-color: #fbfbfb;

  &:hover {
    cursor: pointer;
    box-shadow: 2px 2px 4px #eee; 
    border: 1px solid #03a9f4;
  }
`;

const CardContent = styled.div`
  display: flex;
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
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #424242;
`;

const Header = styled.div`
  display: block;
  flex-shrink: 1;
  padding: 16px 16px 16px 48px;
  width: 100%;
`;

const Description = styled.div`
  overflow: visible;
  height: 48px;
  flex-grow: 0;
  color: #9e9e9e;

  @media (min-width: 0) and (max-width: 400px) {
    display: none;
  }
`;

const Caption = styled.div`
  color: #bdbdbd;
`;

const Card = ({ type, node, slug }) => (
  <CardStyle onClick={() => navigate(slug)}>
    <CardContent>
      <Icon>
        <Img src={node.icon || placeholderImg} alt={node.name} />
      </Icon>

      <Header>
        <Typography gutterBottom>
          <Title>
            {truncate(node.name, 40)}
          </Title>
        </Typography>  

        <Typography gutterBottom variant="caption">
          <Caption>
            {type}
          </Caption>
        </Typography>  

        <Typography gutterBottom variant="body2">
          <Description>
            {truncate(node.description, 65)}
          </Description>
          </Typography>
      </Header>
    </CardContent>
  </CardStyle>
);

export default Card;