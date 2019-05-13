import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import implicitAuthManager from '../utils/auth';
import { authenticateFailed, authenticateSuccess } from '../actions';
import { Home, Restricted, Request } from '../containers';
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
  };

  render() {
    return (
      <Layout authentication={this.props.authentication}>
        <AuthModal isAuthenticated={this.props.authentication.isAuthenticated} />
        <Switch>
          <Route path="/notAuthorized" component={Restricted} />
          <Route path="/login/:idp" component={LoginRoute} />
          <Route path="/request" component={Request} />
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
