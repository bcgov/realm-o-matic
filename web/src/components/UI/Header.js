import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Container, Dropdown } from 'semantic-ui-react';
import styled from '@emotion/styled';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { APP_INFO } from '../../constants';
import logo from '../../assets/bcgovlogo.svg';

const StyledHeader = styled(Menu)`
  &&& {
    background: #036;
    border-bottom: 2px solid #fcba19;
    font-size: 18px;
  }
`;

const StyledItem = styled(Menu.Item)`
  &&& {
    padding: 0;
    margin: 0;
  }
`;

const StyledImage = styled.img`
  padding: 0;
  margin: 5px 0;
`;

const DropdownCss = css`
  padding: 35px 0 !important;
  color: white !important;
`;

const TextCss = css`
  font-size: 22px;
  margin-left: 15px !important;
  color: white !important;
`;

export const Header = ({ authentication }) => {
  const authButtonText = authentication.isAuthenticated ? 'Logout' : 'Login';
  return (
    <StyledHeader fixed="top">
      <Container>
        <StyledItem>
          <Link to={{ pathname: '/' }}>
            <StyledImage src={logo} className="logo" alt="logo" width="80" />
          </Link>
        </StyledItem>
        <StyledItem css={TextCss}>{APP_INFO.NAME}</StyledItem>
        <StyledItem position="right">
          <Dropdown item simple text="Account" css={DropdownCss}>
            <Dropdown.Menu>
              <Dropdown.Item text={authButtonText} />
              <Dropdown.Item text="My Requests" />
            </Dropdown.Menu>
          </Dropdown>
        </StyledItem>
      </Container>
    </StyledHeader>
  );
};

Header.propTypes = {
  authentication: PropTypes.object.isRequired,
};

export default Header;
