import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import Scroll from 'react-scroll';
import { TEST_IDS } from '../constants/ui';
import { LoaderDimmer } from '../components/UI';
import { formJson, realmId } from '../constants/form';
import { newRequest } from '../actionCreators';
import { randomRealmId } from '../utils/requestHelpers';
import { RequestForm } from '../components/Request/RequestForm';

const StyledMessage = styled.div`
  padding: 10px;
  color: #003366;
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

    const initInfo = this.state.formData
      ? this.state.formData
      : {
          realmId: randomRealmId(realmId.digit),
          requesterEmail: userInfo.email,
          requesterIDIR: userId,
        };

    const message = requestId ? `Your request has been submitted as ${requestId}.` : errorMessage;

    const statusMessage = (
      <StyledMessage data-testid={TEST_IDS.REQUEST.MESSAGE}>{message}</StyledMessage>
    );

    return (
      <div>
        <LoaderDimmer text="Processing Reuqest..." idDim={newRequestStarted}>
          <h2>Realm Request Form</h2>
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
