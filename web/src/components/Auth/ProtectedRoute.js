import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { ACCESS_CONTROL } from '../../constants/auth';

/**
 * Protected Route, redirect back to root page is not authorized for the content
 * https://medium.com/@leonardobrunolima/react-tips-how-to-protect-routes-for-unauthorized-access-with-react-router-v4-73c0d451e0a2
 * @param {Component} component the Component to render
 * @param {String} authCode the authorization code
 * @param {Object} rest the other objects passed in, e.g. the path of route
 */
export const ProtectedRoute = ({ component: Component, authCode, ...rest }) => {
  const isRoled =
    authCode === ACCESS_CONTROL.REQUESTER_ROLE || authCode === ACCESS_CONTROL.REVIEWER_ROLE;
  return (
    <Route {...rest} render={props => (isRoled ? <Component {...props} /> : <Redirect to="/" />)} />
  );
};

ProtectedRoute.propTypes = {
  authCode: PropTypes.string,
};

ProtectedRoute.defaultProps = {
  authCode: null,
};

export default ProtectedRoute;
