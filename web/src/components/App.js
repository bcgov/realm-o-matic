import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import implicitAuthManager from '../utils/auth';
import { authenticateFailed, authenticateSuccess } from '../actions';
import { Auth, Home, Restricted, NewRequest, ReviewRequest } from '../containers';
import { LoginRoute, ProtectedRoute } from './Auth';
import { Layout } from './UI';

export class App extends Component {
  componentWillMount = () => {
    implicitAuthManager.registerHooks({
      onAuthenticateSuccess: () => this.props.login(),
      onAuthenticateFail: () => this.props.logout(),
    });
    // don't call function if on localhost
    if (!window.location.host.match(/localhost/)) {
      implicitAuthManager.handleOnPageLoad();
    }
  };

  render() {
    return (
      <Layout authentication={this.props.authentication}>
        <Switch>
          <Route path="/notAuthorized" component={Restricted} />
          <Route path="/login/:idp" component={LoginRoute} />
          <ProtectedRoute
            path="/Request/new"
            component={NewRequest}
            authCode={this.props.authorization.authCode}
          />
          <Route path="/Request/:id" component={ReviewRequest} />
          <ProtectedRoute
            path="/home"
            component={Home}
            authCode={this.props.authorization.authCode}
          />
          <Route
            path="/logout"
            component={() => {
              this.props.logout();
              // Not logging out from the IDP for other application in use:
              // window.location = implicitAuthManager.getSSOLogoutURI();
              return <Redirect to="/" />;
            }}
          />
          <Route path="/" component={Auth} />
        </Switch>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    authentication: state.authentication,
    getRequests: state.getRequests,
    authorization: state.authorization,
    newRequest: state.newRequest,
    getRecord: state.getRecord,
    approveRequest: state.approveRequest,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      login: () => dispatch(authenticateSuccess()),
      logout: () => dispatch(authenticateFailed()),
    },
    dispatch
  );
};

App.propTypes = {
  authentication: PropTypes.object.isRequired,
  authorization: PropTypes.object.isRequired,
  getRequests: PropTypes.object.isRequired,
  newRequest: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
