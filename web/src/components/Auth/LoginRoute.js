// eslint-disable-next-line
import React, { Component } from 'react';
import implicitAuthManager from '../../utils/auth';

export const LoginRoute = ({ match }) => {
  const idp = match.params.idp;
  if (idp) implicitAuthManager.config.kcIDPHint = idp;
  window.location = implicitAuthManager.getSSOLoginURI();
  return null;
};
