import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { ACCESS_CONTROL } from '../constants/auth';
import { SpinLoader } from '../components/UI';
import { AuthModal } from '../components/Auth/AuthModal';
import { authorizationAction } from '../actionCreators';

export class Auth extends Component {
  static displayName = '[Component Auth]';
  componentDidMount = () => {
    const {
      isAuthenticated,
      userInfo,
      userId,
      authorizationStarted,
      authCode,
      errorMessage,
      authorizationAction,
    } = this.props;
    if (isAuthenticated && !authorizationStarted && !authCode && !errorMessage) {
      authorizationAction(userId, userInfo.roles);
    }
  };
  render() {
    const { isAuthenticated, authorizationStarted, authCode, errorMessage } = this.props;

    let redirect = null;
    if (authCode === ACCESS_CONTROL.NO_ROLE) redirect = <Redirect to="/notAuthorized" />;
    else if (
      authCode === ACCESS_CONTROL.REQUESTER_ROLE ||
      authCode === ACCESS_CONTROL.REVIEWER_ROLE
    ) {
      redirect = <Redirect to="/home" />;
    }

    let content;
    if (!isAuthenticated) {
      content = <AuthModal isAuthenticated={isAuthenticated} />;
    } else {
      if (authorizationStarted) content = <SpinLoader text="Loading your user info..." />;
      else if (errorMessage) content = <p>{errorMessage}</p>;
      else content = redirect;
    }
    return <div>{content}</div>;
  }
}

const mapStateToProps = state => {
  return {
    // Authentication:
    isAuthenticated: state.authentication.isAuthenticated,
    userInfo: state.authentication.userInfo,
    userId: state.authentication.userId,
    // Authorization:
    authorizationStarted: state.authorization.authorizationStarted,
    authCode: state.authorization.authCode,
    errorMessage: state.authorization.errorMessage,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      authorizationAction,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
