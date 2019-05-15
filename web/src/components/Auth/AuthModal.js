import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'semantic-ui-react';
import { SSO_IDP } from '../../constants/auth';
import { TEST_IDS } from '../../constants/ui';

export const AuthModal = ({ isAuthenticated }) => {
  return (
    <Modal
      open={!isAuthenticated}
      closeOnEscape={false}
      closeOnDimmerClick={false}
      size="tiny"
      dimmer="blurring"
      data-testid={TEST_IDS.AUTH.MODAL}
    >
      <Modal.Header>Login first</Modal.Header>
      <Modal.Content>
        <p>Please Login Before Proceeding</p>
      </Modal.Content>
      <Modal.Actions>
        <Link to={{ pathname: `/login/${SSO_IDP.GITHUB}` }}>
          <Button data-testid={TEST_IDS.AUTH.GITHUB_LOGIN}>GitHub</Button>
        </Link>
        <Link to={{ pathname: `/login/${SSO_IDP.IDIR}` }}>
          <Button data-testid={TEST_IDS.AUTH.IDIR_LOGIN}>IDIR</Button>
        </Link>
      </Modal.Actions>
    </Modal>
  );
};

AuthModal.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default AuthModal;
