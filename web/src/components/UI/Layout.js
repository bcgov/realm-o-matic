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

const StyledContainer = styled(Container)`
  margin-top: 100px;
  margin-bottom: 50px;
`;

export const Layout = ({ authentication, children }) => {
  return (
    <BrowserRouter>
      <StyledApp>
        <Header authentication={authentication} />
        <StyledContainer>{children}</StyledContainer>
        <Footer />
      </StyledApp>
    </BrowserRouter>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  authentication: PropTypes.object.isRequired,
};

export default Layout;
