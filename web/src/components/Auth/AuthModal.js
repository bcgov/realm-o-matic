import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'semantic-ui-react';
import { TEST_IDS, SSO_IDP } from '../../constants';

export const AuthModal = ({ isAuthenticated }) => {
  return (
    <Modal
      open={!isAuthenticated}
      closeOnEscape={false}
      closeOnDimmerClick={false}
      size="tiny"
      dimmer="blurring"
    >
      <Modal.Header>Login first</Modal.Header>
      <Modal.Content>
        <p>Please Login Before Proceeding</p>
      </Modal.Content>
      <Modal.Actions>
        <Link to={{ pathname: `/login/${SSO_IDP.GITHUB}` }}>
          <Button data-testid={TEST_IDS.APP.GITHUB_LOGIN}>GitHub</Button>
        </Link>
        <Link to={{ pathname: `/login/${SSO_IDP.IDIR}` }}>
          <Button data-testid={TEST_IDS.APP.IDIR_LOGIN}>IDIR</Button>
        </Link>
      </Modal.Actions>
    </Modal>
  );
};

AuthModal.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default AuthModal;
