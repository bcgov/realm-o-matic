import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Loader } from 'semantic-ui-react';
import styled from '@emotion/styled';
import { TEST_IDS } from '../constants/ui';
import { RequestList } from '../components/Request/RequestList';
import { getRequestsAction } from '../actionCreators';

const StyledLoader = styled(Loader)`
  font-size: 1rem;
  padding: 0;
`;

export class Home extends Component {
  static displayName = '[Component Home]';

  componentDidMount = () => {
    this.props.getRequestsAction({ user: this.props.userId });
  };

  render() {
    const { requests, getRequestsStarted, errorMessage } = this.props;
    let requestsList = null;
    if (requests === null || getRequestsStarted) {
      requestsList = (
        <StyledLoader
          active
          size="small"
          inline="centered"
          content="Loading requests..."
          data-testid={TEST_IDS.APP.LOADER}
        />
      );
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
    email: state.authentication.email,
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
