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
  user-select: none;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #424242;
`;

const Header = styled(Typography)`
  display: block;
  flex-shrink: 1;
  padding: 16px 16px 16px 48px;
  width: 100%;
`;

const Description = styled(Typography)`
  overflow: visible;
  height: 48px;
  flex-grow: 0;
  color: #9e9e9e;
  line-height: 1.5;

  @media (min-width: 0) and (max-width: 400px) {
    display: none;
  }
`;

const Caption = styled(Typography)`
  color: #bdbdbd;
`;

const Card = ({ type, node, slug }) => (
  <CardStyle onClick={() => navigate(slug)}>
    <CardContent>
      <Icon>
        <Img src={node.icon || placeholderImg} alt={node.name} />
      </Icon>

      <Header>
        <Title gutterBottom>
          {truncate(node.name, 40)}
        </Title>

        <Caption gutterBottom variant="caption">
          {type} 
        </Caption>

        <Description gutterBottom variant="body2">
          {truncate(node.description, 65)}
        </Description>
      </Header>
    </CardContent>
  </CardStyle>
);

export default Card;