import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import styled from '@emotion/styled';
import implicitAuthManager from '../utils/auth';
import { authenticateFailed, authenticateSuccess } from '../actions';
import { Header } from './UI/Header';
import Footer from './UI/Footer';
import { Home, LoginHint } from '../containers';
import { LoginRoute } from '../components/Auth/LoginRoute';
import { AuthModal } from '../components/Auth/AuthModal';

const StyledApp = styled.div`
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
`;

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
      <StyledApp>
        <Header isAuthenticated={this.props.isAuthenticated} />
        <AuthModal isAuthenticated={this.props.isAuthenticated} />
        <Switch>
          <Route path="/notAuthorized" component={LoginHint} />
          <Route path="/login/:idp" component={LoginRoute} />
          <Route path="/" component={Home} />
        </Switch>
        <Footer />
      </StyledApp>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.authentication.isAuthenticated,
    email: state.authentication.email,
    userId: state.authentication.userId,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
