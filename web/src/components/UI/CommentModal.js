import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Modal, Button, TextArea } from 'semantic-ui-react';
import { TEST_IDS } from '../../constants/ui';

const StyledModal = styled(Modal)`
  &&& {
    width: 400px;
    text-align: center;
    padding: 10px 0;
  }
  .content {
    margin: 30px 10px;
  }
  .rejectionMessage {
    margin: 10px;
    width: 300px;
    height: 200px;
    border: 1px solid #036;
  }
  .ui.button {
    color: white;
    background-color: #036;
  }
  .hidden {
    display: none !important;
  }
`;

/**
 * Pop up modal for comment
 * @param {Boolean} openRejectionModal Open modal when reject
 * @param {Function} onModalClose Action when closing the modal
 * @param {Boolean} disabled Text field editable or not
 * @param {Function} onMessageChange Action when updating message
 * @param {String} message The content to display when not editing
 */
export const CommentModal = ({
  openRejectionModal,
  onModalClose,
  disabled,
  onMessageChange,
  message = '',
}) => {
  // Submit button to submit a rejection message. If only viewing, hide the button:
  const buttons = (
    <div>
      <Button onClick={() => onModalClose(false)}>Close</Button>
      <Button onClick={() => onModalClose(true)} className={disabled ? 'hidden' : null}>
        Submit
      </Button>
    </div>
  );

  const onCommentChange = (e, { value }) => onMessageChange(value);

  // The comment text area, either editable or display mode:
  const comment = (
    <TextArea
      placeholder="Reason for Rejection"
      className="rejectionMessage"
      value={message}
      onChange={onCommentChange}
      disabled={disabled}
    />
  );

  const options = {
    open: openRejectionModal,
    closeOnEscape: true,
    closeOnDimmerClick: false,
    size: 'tiny',
    dimmer: 'blurring',
    header: 'BCeID Rejection Message',
    content: comment,
    actions: buttons,
  };
  return <StyledModal data-testid={TEST_IDS.REQUEST.REJECT_MODAL} {...options} />;
};

CommentModal.propTypes = {
  openRejectionModal: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  message: PropTypes.string,
};

export default CommentModal;
