import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Grid } from 'semantic-ui-react';
import styled from '@emotion/styled';
import { TEST_IDS } from '../../constants/ui';

const StyledFormHeader = styled.div`
  .hidden {
    display: none !important;
  }

  color: #036;

  margin-bottom: 10px;

  .column {
    margin-top: 15px !important;
  }

  .ui.positive.button {
    color: white;
    background-color: #036;
  }

  .ui.button {
    color: #036;
    background: none;
    border-radius: 4px;
    border: 1px solid #003366 !important;
  }
`;

/**
 * Generate header for form with actions
 * @param {String} title the title of form
 * @param {Boolean} hideAction if the action buttons should be hidden
 * @param {Boolean} hideRejectionViewButton if the rejection message buttons should be hidden
 * @param {Function} onApprove action on approval
 * @param {Function} onReject action on rejection
 * @param {Function} onViewRejection action on viewing rejection message
 */
export const FormHeader = ({
  title = 'Form',
  hideAction = true,
  onApprove,
  onReject,
  hideRejectionViewButton = true,
  onViewRejection,
}) => {
  return (
    <StyledFormHeader>
      <Grid>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={8} computer={3}>
            <Link to="/home" data-testid={TEST_IDS.REQUEST.CANCEL}>
              <Button>Back</Button>
            </Link>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={8} computer={9}>
            <h2>{title}</h2>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={8} computer={4}>
            <Button.Group className={hideAction ? 'hidden' : null}>
              <Button onClick={onReject} data-testid={TEST_IDS.REQUEST.REJECT}>
                Reject
              </Button>
              <Button.Or />
              <Button positive onClick={onApprove} data-testid={TEST_IDS.REQUEST.APPROVAL}>
                Approve
              </Button>
            </Button.Group>
            <Button
              className={hideRejectionViewButton ? 'hidden' : null}
              onClick={onViewRejection}
              data-testid={TEST_IDS.REQUEST.VIEW_REJECT}
            >
              Rejection Message
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </StyledFormHeader>
  );
};

FormHeader.propTypes = {
  title: PropTypes.object,
  hideAction: PropTypes.bool,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  onViewRejection: PropTypes.func,
};

export default FormHeader;
