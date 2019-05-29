import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { TEST_IDS } from '../constants/ui';
import { ACCESS_CONTROL } from '../constants/auth';
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
      authCode,
    } = this.props;

    if (isAuthenticated && authCode && !getRequestsStarted && !requests && !errorMessage) {
      const filter = authCode === ACCESS_CONTROL.REQUESTER_ROLE ? { userId } : null;
      getRequestsAction(filter);
    }

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
      requestsList = (
        <RequestList
          requests={requests}
          isAdmin={authCode === ACCESS_CONTROL.REVIEWER_ROLE}
          history={this.props.history}
        />
      );
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
    // authorization:
    authCode: state.authorization.authCode,
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

Home.propTypes = {
  isAuthenticated: PropTypes.bool,
  userInfo: PropTypes.object,
  userId: PropTypes.string,
  authorizationStarted: PropTypes.bool,
  authCode: PropTypes.string,
  requests: PropTypes.array,
  getRequestsStarted: PropTypes.bool,
  errorMessage: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
