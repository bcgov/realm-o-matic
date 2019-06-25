import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Menu, Container, Dropdown, Icon } from 'semantic-ui-react';
import styled from '@emotion/styled';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { APP_INFO } from '../../constants/ui';
import logo from '../../assets/bcgovlogo.svg';
import { TEST_IDS } from '../../constants/ui';

const StyledHeader = styled(Menu)`
  &&& {
    background: #036;
    border-bottom: 2px solid #fcba19;
    font-size: 18px;
  }
`;

const StyledItem = styled(Menu.Item)`
  &&& {
    font-size: 1rem;
    padding: 0;
    margin: 0;
  }
`;

const StyledImage = styled.img`
  padding: 0;
  margin: 5px 0 !important;
  width: 80px !important;
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

// TODO: fix mobile view
export const Header = ({ authentication }) => {
  const { isAuthenticated, userInfo } = authentication;

  const trigger = (
    <span>
      <Icon name="user" /> Account
    </span>
  );

  const authenticationState = {
    key: isAuthenticated ? 'signout' : 'signin',
    text: isAuthenticated ? 'Sign Out' : 'Sign In',
    as: Link,
    to: isAuthenticated ? '/logout' : '/login',
  };

  const options = [
    {
      key: 'user',
      text: (
        <span>
          Signed in as <strong>{userInfo ? userInfo.username : 'NONAME'}</strong>
        </span>
      ),
      disabled: true,
    },
    { key: 'requests', text: 'Requests', as: Link, to: '/home' },
    authenticationState,
  ];

  const AccountDropdown = (
    <Dropdown
      trigger={trigger}
      options={options}
      css={DropdownCss}
      data-testid={TEST_IDS.APP.ACCOUNT}
    />
  );

  return (
    <StyledHeader fixed="top">
      <Container>
        <StyledItem>
          <StyledImage src={logo} alt="logo" data-testid={TEST_IDS.APP.LOGO} />
        </StyledItem>
        <StyledItem>
          <Link to={{ pathname: '/' }} css={TextCss} data-testid={TEST_IDS.APP.NAME}>
            {APP_INFO.NAME}
          </Link>
        </StyledItem>
        <StyledItem position="right">{AccountDropdown}</StyledItem>
      </Container>
    </StyledHeader>
  );
};

Header.propTypes = {
  authentication: PropTypes.object.isRequired,
};

export default Header;
