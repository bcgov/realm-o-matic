import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import styled from '@emotion/styled';
import { FOOTER_LINKS } from '../../constants';

const StyledFooter = styled.footer`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #036;
  border-top: 2px solid #fcba19;
  color: #fff;
  font-size: 15px;
  padding: 10px 0;
  @media (max-width: 768px) {
    position: relative;
  }
`;

const columns = FOOTER_LINKS.map((link, index) => (
  <Grid.Column key={index} mobile={6} computer={2}>
    <a href={link.link}>{link.name}</a>
  </Grid.Column>
));

export const Footer = () => {
  return (
    <StyledFooter>
      <Container>
        <Grid>{columns}</Grid>
      </Container>
    </StyledFooter>
  );
};

export default Footer;
