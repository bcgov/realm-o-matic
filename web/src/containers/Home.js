import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, List } from 'semantic-ui-react';
import { TEST_IDS } from '../constants';
import { getIdps } from '../actionCreators';

export class Home extends Component {
  static displayName = '[Component Home]';

  render() {
    const onClick = () => {
      this.props.getIdps();
    };

    const idps = this.props.idps ? this.props.idps : [];

    return (
      <div>
        <p>Welcome!</p>
        <Button onClick={onClick} data-testid={TEST_IDS.APP.GET_IDPS}>
          get idps
        </Button>
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
      getIdps,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
