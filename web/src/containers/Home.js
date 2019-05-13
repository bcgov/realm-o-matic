import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, List } from 'semantic-ui-react';
import { TEST_IDS } from '../constants/ui';
import { getIdps } from '../actionCreators';

export class Home extends Component {
  static displayName = '[Component Home]';

  render() {
    const idps = this.props.idps ? this.props.idps : [];

    return (
      <div>
        <p>Welcome!</p>
        <Link to="/request" data-testid={TEST_IDS.APP.NEW_REQUEST}>
          <Button data-testid="startRequest">Start Request</Button>
        </Link>
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
