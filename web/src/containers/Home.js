import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { TEST_IDS } from '../constants/ui';
import { RequestList } from '../components/Request/RequestList';
import { SpinLoader } from '../components/UI';
import { getRequestsAction } from '../actionCreators';

export class Home extends Component {
  static displayName = '[Component Home]';

  render() {
    const {
      isAuthenticated,
      userId,
      requests,
      getRequestsStarted,
      errorMessage,
      getRequestsAction,
    } = this.props;
    if (isAuthenticated && !getRequestsStarted && !requests && !errorMessage)
      getRequestsAction({ user: userId });

    let requestsList = null;
    if (errorMessage) requestsList = errorMessage;
    else if (requests === null || getRequestsStarted) {
      requestsList = <SpinLoader text="Loading requests..." />;
    } else if (requests.length === 0) {
      requestsList = (
        <p data-testid={TEST_IDS.APP.EMPTY}>
          You do not have any realm requests yet, start a new request.
        </p>
      );
    } else {
      requestsList = <RequestList requests={requests} />;
    }

    return (
      <div>
        <h2>Welcome!</h2>
        <Link to="/Request/new" data-testid={TEST_IDS.APP.NEW_REQUEST}>
          <Button data-testid="startRequest">Start Request</Button>
        </Link>
        <p>{errorMessage}</p>
        {requestsList}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.authentication.isAuthenticated,
    userInfo: state.authentication.userInfo,
    userId: state.authentication.userId,
    // get Requests:
    errorMessage: state.getRequests.errorMessage,
    requests: state.getRequests.requests,
    getRequestsStarted: state.getRequests.getRequestsStarted,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getRequestsAction,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
