import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'semantic-ui-react';
import { SSO_IDP } from '../../constants/auth';
import { TEST_IDS } from '../../constants/ui';

const StyledModal = styled(Modal)`
  &&& {
    width: 400px;
    text-align: center;
    padding: 10px 0;
  }
  .content {
    margin: 30px 0;
  }
  .ui.button {
    color: white;
    background-color: #036;
  }
`;

export const AuthModal = ({ isAuthenticated }) => {
  const buttons = (
    <Button.Group onActionClick={null}>
      <Link to={{ pathname: `/login/${SSO_IDP.GITHUB}` }}>
        <Button data-testid={TEST_IDS.AUTH.GITHUB_LOGIN}>GitHub</Button>
      </Link>
      <Button.Or />
      <Link to={{ pathname: `/login/${SSO_IDP.IDIR}` }}>
        <Button data-testid={TEST_IDS.AUTH.IDIR_LOGIN}>IDIR</Button>
      </Link>
    </Button.Group>
  );

  const options = {
    open: !isAuthenticated,
    closeOnEscape: false,
    closeOnDimmerClick: false,
    size: 'tiny',
    dimmer: 'blurring',
    header: 'Welcome to Realm-o-Matic',
    content: 'Please login with one of the following options before proceeding to the app.',
    actions: buttons,
  };
  return <StyledModal data-testid={TEST_IDS.AUTH.MODAL} {...options} />;
};

AuthModal.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default AuthModal;
