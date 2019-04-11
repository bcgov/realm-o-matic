import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, List } from 'semantic-ui-react';
import implicitAuthManager from '../utils/auth';
import styles from './App.module.css';
import { getIdps } from '../actionCreators';
import { authenticateFailed, authenticateSuccess } from '../actions';

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
    const onClick = () => {
      this.props.getIdps();
    };

    const onClickSSO = () => {
      window.location = implicitAuthManager.getSSOLoginURI();
    };

    const idps = this.props.idps ? this.props.idps : [];
    const buttons = !this.props.userId ? (
      <Button onClick={onClickSSO}>sso login</Button>
    ) : (
      <Button onClick={onClick}>get idps</Button>
    );

    return (
      <div className={styles.app}>
        <p>Welcome!</p>
        {buttons}
        <p>{this.props.errorMessage}</p>
        <List items={idps} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.authentication.isAuthenticated,
    email: state.authentication.email,
    userId: state.authentication.userId,
    errorMessage: state.getIdps.errorMessage,
    idps: state.getIdps.idps,
    getIdpsStarted: state.getIdps.getIdpsStarted,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      login: () => dispatch(authenticateSuccess()),
      logout: () => dispatch(authenticateFailed()),
      getIdps,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
