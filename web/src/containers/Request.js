import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import Scroll from 'react-scroll';
import { TEST_IDS } from '../constants/ui';
import { formJson } from '../constants/form';
import { newRequest } from '../actionCreators';
import { randomRealmId } from '../utils/requestHelpers';
import { RequestForm } from '../components/RequestForm';

const StyledMessage = styled.div`
  padding: 10px;
  color: #003366;
`;

export class Request extends Component {
  static displayName = '[Component Request]';

  constructor(props) {
    super(props);
    this.state = {
      formData: null,
      isDisplayMode: false,
    };
  }

  render() {
    const { email, userId, newRequestStarted, requestId, errorMessage, newRequest } = this.props;
    const scroll = Scroll.animateScroll;

    const onComplete = result => {
      this.setState({
        formData: result.data,
        isDisplayMode: true,
      });
      // Scroll to top:
      scroll.scrollToTop();
      newRequest(result.data);
    };

    const initInfo = this.state.formData
      ? this.state.formData
      : {
          realmId: randomRealmId(8),
          requesterEmail: email,
          // TODO: use idir username instead of id
          requesterIDIR: userId,
        };

    const message = requestId ? `Your request has been submitted as ${requestId}.` : errorMessage;

    const statusMessage = (
      <StyledMessage data-testid={TEST_IDS.REQUEST.MESSAGE}>
        {newRequestStarted ? 'Processing...' : message}
      </StyledMessage>
    );

    return (
      <div>
        {statusMessage}
        <h2>Realm Request Form</h2>
        <RequestForm
          formModal={formJson}
          initialInfo={initInfo}
          isDisplayMode={this.state.isDisplayMode}
          onComplete={onComplete}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.authentication.isAuthenticated,
    email: state.authentication.email,
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
)(Request);