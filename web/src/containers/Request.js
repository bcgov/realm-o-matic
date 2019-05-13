import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Survey from 'survey-react';
import 'survey-react/survey.css';
import styled from '@emotion/styled';
import { TEST_IDS } from '../constants/ui';
import { formJson } from '../constants/form';
import { newRequest } from '../actionCreators';
import { randomRealmId } from '../utils/requestHelpers';

const StyledForm = styled.div`
  text-align: left;

  .form-body {
    border-top: 2px solid #003366 !important;
  }

  .BC-Gov-PrimaryButton {
    background-color: #003366 !important;
    font-size: 1em !important;
    border-radius: 4px !important;
  }

  .BC-Gov-SecondaryButton {
    font-size: 1em !important;
    background: none !important;
    border-radius: 4px !important;
    border: 1px solid #003366 !important;
    color: #003366 !important;
  }

  .form-title {
    font-size: 1.5em !important;
  }

  .sv_progress_bar {
    background-color: #003366 !important;
  }
`;

const StyledMessage = styled.div`
  padding: 10px;
  color: #003366;
`;

const surveyCss = {
  body: 'sv_body form-body',
  pageTitle: 'sv_page_title form-title',
  navigation: {
    complete: 'btn sv_complete_btn BC-Gov-PrimaryButton',
    prev: 'btn sv_prev_btn BC-Gov-SecondaryButton',
    next: 'btn sv_next_btn BC-Gov-SecondaryButton',
    start: 'btn sv_start_btn BC-Gov-PrimaryButton',
  },
};

export class Request extends Component {
  static displayName = '[Component Request]';

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        realmId: null,
        requesterEmail: null,
        requesterIDIR: null,
      },
      displayMode: 'write',
    };
  }

  // Setup the prefill info:
  // TODO: should be another action to prefill
  componentWillMount = () => {
    this.setState({
      formData: {
        realmId: randomRealmId(8),
        requesterEmail: 'this.props.email',
        requesterIDIR: 'this.props.userId',
      },
    });
  };

  render() {
    const { newRequestStarted, requestId, errorMessage, newRequest } = this.props;
    // setup survey form:
    const survey = new Survey.Model(formJson);
    survey.data = this.state.formData;
    survey.mode = this.state.displayMode;

    const onComplete = result => {
      // TODO: window.scrollTo(0, 0);
      this.setState({ formData: result.data, displayMode: 'display' });
      newRequest(result.data);
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
        <StyledForm data-testid={TEST_IDS.REQUEST.FORM}>
          <Survey.Survey model={survey} css={surveyCss} onComplete={onComplete} />
        </StyledForm>
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
