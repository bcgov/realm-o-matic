import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import styled from '@emotion/styled';
import { Header, Footer } from './';

const StyledApp = styled.div`
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
`;

export const Layout = ({ children }) => {
  return (
    <BrowserRouter>
      <StyledApp>
        <Header />
        <Container>{children}</Container>
        <Footer />
      </StyledApp>
    </BrowserRouter>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
