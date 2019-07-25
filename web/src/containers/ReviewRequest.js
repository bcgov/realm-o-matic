import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { FormHeader, LoaderDimmer, PopUp } from '../components/UI';
import { TEST_IDS } from '../constants/ui';
import { ACCESS_CONTROL } from '../constants/auth';
import { formJson } from '../constants/form';
import { PR_STATUS, getPrStatus } from '../constants/github';
import { getRecordAction, approveRequestAction } from '../actionCreators';
import { RequestForm } from '../components/Request/RequestForm';

const StyledMessage = styled.div`
  margin: 15px;
  color: #003366;
`;

export class ReviewRequest extends Component {
  static displayName = '[Component ReviewRequest]';

  componentWillMount = () => {
    // fetch the record
    this.props.getRecordAction(this.props.match.params.id);
  };

  render() {
    const {
      authCode,
      recordInfo,
      getRecordStarted,
      getRecordError,
      approveRequestStarted,
      approveRequestCompleted,
    } = this.props;
    // Button actions:
    const onApprove = () => {
      approveRequestAction(recordInfo.number, true);
    };

    const onReject = () => {
      // TODO: pop up modal for reason
      approveRequestAction(recordInfo.number, false);
    };

    // message for fetching record:
    const message = recordInfo ? null : getRecordError;

    const statusMessage = (
      <StyledMessage data-testid={TEST_IDS.REQUEST.MESSAGE}>{message}</StyledMessage>
    );

    const content = recordInfo ? (
      <RequestForm
        formModal={formJson}
        initialInfo={recordInfo.prContent}
        isDisplayMode={true}
        onComplete={() => {}}
      />
    ) : null;

    const recordStatus = recordInfo
      ? getPrStatus(recordInfo.prState, recordInfo.prMerged, recordInfo.labels)
      : PR_STATUS.UNKNOWN;

    const title = (
      <div>
        Realm Request Record
        <PopUp status={recordStatus} />
      </div>
    );

    const actionHeader = (
      <FormHeader
        title={title}
        hideAction={
          authCode !== ACCESS_CONTROL.REVIEWER_ROLE ||
          recordStatus !== PR_STATUS.OPEN ||
          approveRequestCompleted ||
          approveRequestStarted
        }
        onApprove={onApprove}
        onReject={onReject}
      />
    );

    return (
      <div>
        <LoaderDimmer text="Loading Reuqest..." idDim={getRecordStarted}>
          {actionHeader}
          {statusMessage}
          {content}
        </LoaderDimmer>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authCode: state.authorization.authCode,
    // get record details:
    getRecordError: state.getRecord.errorMessage,
    recordInfo: state.getRecord.recordInfo,
    getRecordStarted: state.getRecord.getRecordStarted,
    // Set approval for request:
    approveRequestError: state.approveRequest.errorMessage,
    approveRequestStarted: state.approveRequest.approveRequestStarted,
    approveRequestCompleted: state.approveRequest.approveRequestCompleted,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getRecordAction, approveRequestAction }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewRequest);
