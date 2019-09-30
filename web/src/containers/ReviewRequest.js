import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { FormHeader, LoaderDimmer, PopUp, CommentModal } from '../components/UI';
import { TEST_IDS } from '../constants/ui';
import { ACCESS_CONTROL } from '../constants/auth';
import { formJson } from '../constants/form';
import { REQUEST_STATUS, getPrStatus } from '../constants/github';
import { getRecordAction, approveRequestAction } from '../actionCreators';
import { RequestForm } from '../components/Request/RequestForm';

const StyledMessage = styled.div`
  display: ${props => (props.status === 'unknown' ? 'none' : 'block')};
  padding: 10px;
  margin: 10px;
  background-color: ${props => (props.status === 'failure' ? '#fcdfe2' : 'white')};
  color: ${props => (props.status === 'failure' ? '#ed5565' : '#003366')};
  border: 1px solid ${props => (props.status === 'failure' ? '#ed5565' : '#003366')};
`;

export class ReviewRequest extends Component {
  static displayName = '[Component ReviewRequest]';

  constructor(props) {
    super(props);
    this.state = {
      recordStatus: REQUEST_STATUS.UNKNOWN,
      openRejectionModal: false,
      rejectionMessage: '',
    };
  }

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
      approveRequestAction,
      approveRequestStarted,
      approveRequestCompleted,
      approveRequestError,
    } = this.props;

    // Button actions
    // Reviewer approving:
    const onApprove = () => {
      approveRequestAction(recordInfo.number, true);
    };

    // Reviewer rejecting, trigger rejection message modal:
    const onReject = () => {
      this.setState({
        openRejectionModal: true,
      });
    };

    // Requester viewing rejection message:
    const onViewRejection = () => {
      const rejectionMessage = recordInfo.prComments
        ? recordInfo.prComments[0]
        : 'No message provided, please contact the IDIM team at idim.consulting@gov.bc.ca for details.';
      this.setState({
        openRejectionModal: true,
        rejectionMessage: rejectionMessage,
      });
    };

    // When closing the modal, either have action to submit the message or cancel:
    const onModalClose = (submit = false) => {
      if (submit) {
        this.setState({
          recordStatus: REQUEST_STATUS.REJECT,
        });
        approveRequestAction(recordInfo.number, false, this.state.rejectionMessage);
      }
      this.setState({
        openRejectionModal: false,
      });
    };

    // Get text input:
    const onMessageChange = (data = null) => {
      this.setState({
        rejectionMessage: data,
      });
    };

    // Component for rejection message as a modal:
    const rejectionComment = (
      <CommentModal
        openRejectionModal={this.state.openRejectionModal}
        onModalClose={onModalClose}
        disabled={this.state.recordStatus === REQUEST_STATUS.REJECT}
        onMessageChange={onMessageChange}
        message={this.state.rejectionMessage}
      />
    );

    // Decide on the status of the request:
    if (recordInfo) {
      const currRecordInfo = getPrStatus(
        recordInfo.prState,
        recordInfo.prMerged,
        recordInfo.labels
      );
      if (this.state.recordStatus !== currRecordInfo) {
        this.setState({
          recordStatus: currRecordInfo,
        });
      }
    }

    // TODO: make a component for this:
    // Display error messages, record fetching error with higher priority then approval error:
    let messageObject = {
      message: null,
      status: 'unknown',
    };

    if (approveRequestCompleted) {
      messageObject = {
        message: 'BCeID request decision has been submitted.',
        status: 'success',
      };
    } else if (getRecordError || approveRequestError) {
      messageObject = {
        message: getRecordError || approveRequestError,
        status: 'failure',
      };
    }

    const statusMessage = (
      <StyledMessage data-testid={TEST_IDS.REQUEST.MESSAGE} status={messageObject.status}>
        {messageObject.message}
      </StyledMessage>
    );

    // Form content:
    const content = recordInfo ? (
      <RequestForm
        formModal={formJson}
        initialInfo={recordInfo.prContent}
        isDisplayMode={true}
        onComplete={() => {}}
      />
    ) : null;

    // Set form title with status popup:
    const title = (
      <div>
        Realm Request Record
        <PopUp status={this.state.recordStatus} />
      </div>
    );

    // Set the header with approval/rejection buttons, or view rejection message button:
    const actionHeader = (
      <FormHeader
        title={title}
        hideAction={
          authCode !== ACCESS_CONTROL.REVIEWER_ROLE ||
          this.state.recordStatus !== REQUEST_STATUS.PENDING ||
          approveRequestCompleted ||
          approveRequestStarted
        }
        onApprove={onApprove}
        onReject={onReject}
        hideRejectionViewButton={this.state.recordStatus !== REQUEST_STATUS.REJECT}
        onViewRejection={onViewRejection}
      />
    );

    return (
      <div>
        <LoaderDimmer text="Loading Request..." idDim={getRecordStarted}>
          {actionHeader}
          {rejectionComment}
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
