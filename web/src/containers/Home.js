import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Menu, Radio } from 'semantic-ui-react';
import styled from '@emotion/styled';
import { TEST_IDS } from '../constants/ui';
import { ACCESS_CONTROL } from '../constants/auth';
import { GITHUB_PR_STATUS } from '../constants/github';
import { RequestList } from '../components/Request/RequestList';
import { SpinLoader } from '../components/UI';
import { getRequestsAction } from '../actionCreators';

const StyledTableHeader = styled.div`
  color: #036;
  .text {
    display: flex;
    flex-flow: wrap;
  }
  h2 {
    line-height: 4rem;
    border-bottom: 1px solid #d4d4d4;
    margin-bottom: 1.5rem;
  }
  .ui.button {
    color: white;
    background-color: #036;
  }
  .hide {
    display: none !important;
  }
`;

export class Home extends Component {
  static displayName = '[Component Home]';

  constructor(props) {
    super(props);
    this.state = {
      showAllRequests: false,
    };
  }

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

    const toggleFilter = () => {
      this.setState({
        showAllRequests: !this.state.showAllRequests,
      });
    };

    if (isAuthenticated && authCode && !getRequestsStarted && !requests && !errorMessage) {
      const filter = authCode === ACCESS_CONTROL.REQUESTER_ROLE ? { userId } : null;
      getRequestsAction(filter);
    }

    let requestsList = null;
    let allowNewRequest = true;
    // Show only error message when error loading the list:
    if (errorMessage) {
      requestsList = errorMessage;
    } else if (requests === null || getRequestsStarted) {
      // Show indicator when loading:
      requestsList = <SpinLoader text="Loading requests..." />;
      allowNewRequest = false;
    } else if (requests.length === 0) {
      // Show instruction when no records exists:
      requestsList = (
        <p data-testid={TEST_IDS.APP.EMPTY}>
          You do not have any realm requests yet, start a new request.
        </p>
      );
    } else {
      // Show list of request records that match this user's role:
      const openRequests = requests.filter(request => request.prState === GITHUB_PR_STATUS.OPEN);
      const isAdmin = authCode === ACCESS_CONTROL.REVIEWER_ROLE;
      const filteredRequests = this.state.showAllRequests ? requests : openRequests;
      // Do not allow a Requester to have more than one open request at a same time:
      allowNewRequest = isAdmin || openRequests.length === 0;
      requestsList = (
        <RequestList requests={filteredRequests} isAdmin={isAdmin} history={this.props.history} />
      );
    }

    return (
      <StyledTableHeader>
        <h2>Welcome!</h2>
        <Menu text>
          <Menu.Item>
            <Link
              to="/Request/new"
              className={allowNewRequest ? null : 'hide'}
              data-testid={TEST_IDS.APP.NEW_REQUEST}
            >
              <Button>New Request</Button>
            </Link>
            <h4
              className={allowNewRequest ? 'hide' : null}
              data-testid={TEST_IDS.APP.HIDDEN_NEW_REQUEST}
            >
              You cannot create more requests until the current request is close.
            </h4>
          </Menu.Item>
          <Menu.Item position="right">
            <Radio toggle label="Show All" onChange={toggleFilter} />
          </Menu.Item>
        </Menu>
        <p>{errorMessage}</p>
        {requestsList}
      </StyledTableHeader>
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
