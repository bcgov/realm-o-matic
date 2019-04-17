import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import implicitAuthManager from '../utils/auth';
import { authenticateFailed, authenticateSuccess } from '../actions';
import { Home, LoginHint } from '../containers';
import { LoginRoute } from '../components/Auth/LoginRoute';
import { AuthModal } from '../components/Auth/AuthModal';
import { Layout } from './UI';

export class App extends Component {
  componentDidMount = () => {
    implicitAuthManager.registerHooks({
      onAuthenticateSuccess: () => this.props.login(),
      onAuthenticateFail: () => this.props.logout(),
    });
    // don't call function if on localhost
    if (!window.location.host.match(/localhost/)) {
      implicitAuthManager.handleOnPageLoad();
    }
    try {
      const iamId = implicitAuthManager.idToken.data.sub;
      const token = implicitAuthManager.idToken.bearer;
    } catch (err) {
      console.log('---implicitAuthManager----not logged in');
    }
  };

  render() {
    return (
      <Layout authentication={this.props.authentication}>
        <AuthModal isAuthenticated={this.props.authentication.isAuthenticated} />
        <Switch>
          <Route path="/notAuthorized" component={LoginHint} />
          <Route path="/login/:idp" component={LoginRoute} />
          <Route path="/" component={Home} />
        </Switch>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    authentication: state.authentication,
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
