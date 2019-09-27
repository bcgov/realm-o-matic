import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import Scroll from 'react-scroll';
import { TEST_IDS } from '../constants/ui';
import { LoaderDimmer } from '../components/UI';
import { formJson, realmId, KC_IDP_NAMES } from '../constants/form';
import { newRequest } from '../actionCreators';
import { randomRealmId } from '../utils/requestHelpers';
import { RequestForm } from '../components/Request/RequestForm';

const StyledMessage = styled.div`
  padding: ${props => (props.status === 'unknown' ? '0' : '10px')};
  margin: ${props => (props.status === 'unknown' ? '0' : '10px')};
  background-color: ${props => (props.status === 'failure' ? '#fcdfe2' : 'white')};
  color: ${props => (props.status === 'failure' ? '#ed5565' : '#003366')};
  border: 1px solid ${props => (props.status === 'failure' ? '#ed5565' : '#003366')};
`;

const StyledTitle = styled.h2`
  color: #036;
`;

export class NewRequest extends Component {
  static displayName = '[Component NewRequest]';

  constructor(props) {
    super(props);
    this.state = {
      formData: null,
      isDisplayMode: false,
    };
  }

  render() {
    const { userInfo, userId, newRequestStarted, requestId, errorMessage, newRequest } = this.props;
    const scroll = Scroll.animateScroll;

    const onComplete = result => {
      const newFormData = { ...result.data, ...{ requesterIDIR: userId } };
      this.setState({
        formData: newFormData,
        isDisplayMode: true,
      });
      // Scroll to top:
      scroll.scrollToTop();
      newRequest(newFormData);
    };

    // Pre-populate form data:
    // 1. fetch user email and ID from session
    // 2. assign random realm ID
    // 3. make IDIR a mandatory choice
    const initInfo = this.state.formData
      ? this.state.formData
      : {
          realmId: randomRealmId(realmId.digit),
          requesterEmail: userInfo.email,
          requesterIDIR: userId,
          idps: [KC_IDP_NAMES.IDIR],
        };

    // Notification message for success request and failure:
    let messageObject = {
      message: null,
      status: 'unknown',
    };
    if (requestId) {
      messageObject = {
        message: `Your request has been submitted as ${requestId}.`,
        status: 'success',
      };
    } else if (errorMessage) {
      messageObject = {
        message: errorMessage,
        status: 'failure',
      };
    }

    const statusMessage = (
      <StyledMessage data-testid={TEST_IDS.REQUEST.MESSAGE} status={messageObject.status}>
        {messageObject.message}
      </StyledMessage>
    );

    return (
      <div>
        <LoaderDimmer text="Processing Request..." idDim={newRequestStarted}>
          <StyledTitle>Realm Request Form</StyledTitle>
          {statusMessage}
          <RequestForm
            formModal={formJson}
            initialInfo={initInfo}
            isDisplayMode={this.state.isDisplayMode}
            onComplete={onComplete}
          />
        </LoaderDimmer>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.authentication.isAuthenticated,
    userInfo: state.authentication.userInfo,
    userId: state.authentication.userId,
    errorMessage: state.newRequest.errorMessage,
    requestId: state.newRequest.requestId,
    newRequestStarted: state.newRequest.newRequestStarted,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ newRequest }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewRequest);
