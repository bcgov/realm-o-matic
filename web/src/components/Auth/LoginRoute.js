// eslint-disable-next-line
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import implicitAuthManager from '../../utils/auth';

export const LoginRoute = ({ match }) => {
  const idp = match.params.idp;
  if (idp) implicitAuthManager.config.kcIDPHint = idp;
  window.location.assign(implicitAuthManager.getSSOLoginURI());
  return <div>Your are being redirected to KeyCloak login page...</div>;
};

LoginRoute.propTypes = {
  match: PropTypes.object.isRequired,
};
