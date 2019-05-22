import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import implicitAuthManager from '../utils/auth';
import { authenticateFailed, authenticateSuccess } from '../actions';
import { Auth, Home, Restricted, NewRequest } from '../containers';
import { LoginRoute } from '../components/Auth/LoginRoute';
import { Layout } from './UI';

export class App extends Component {
  componentDidMount = () => {
    console.log(implicitAuthManager.config);
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
          <Route path="/Request/new" component={NewRequest} />
          {/* TODO: use it as /request/:id to make a unique page for redirecting ? */}
          {/* <Route path="/Request/:id" component={Request} /> */}
          <Route path="/home" component={Home} />
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
