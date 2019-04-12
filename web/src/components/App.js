import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, List } from 'semantic-ui-react';
import styled from '@emotion/styled';
import implicitAuthManager from '../utils/auth';
import { getIdps } from '../actionCreators';
import { authenticateFailed, authenticateSuccess } from '../actions';
import { TEST_IDS } from '../constants';

const StyledApp = styled.div`
  text-align: center;
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
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
    const onClick = () => {
      this.props.getIdps();
    };

    const onClickSSO = () => {
      window.location = implicitAuthManager.getSSOLoginURI();
    };

    const idps = this.props.idps ? this.props.idps : [];
    const buttons = !this.props.userId ? (
      <Button onClick={onClickSSO} data-testid={TEST_IDS.APP.LOGIG}>
        sso login
      </Button>
    ) : (
      <Button onClick={onClick} data-testid={TEST_IDS.APP.GET_IDPS}>
        get idps
      </Button>
    );

    return (
      <StyledApp>
        <p>Welcome!</p>
        {buttons}
        <p>{this.props.errorMessage}</p>
        <List items={idps} />
      </StyledApp>
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
