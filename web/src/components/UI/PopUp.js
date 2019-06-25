import React from 'react';
import PropTypes from 'prop-types';
import { Popup, Icon } from 'semantic-ui-react';
import { TEST_IDS } from '../../constants/ui';

/**
 * Popup with color and text
 * @param {Object} status the status of the form
 */
export const PopUp = ({ status }) => {
  return (
    <Popup
      content={`Status: ${status.text}`}
      trigger={
        <Icon.Group>
          <Icon name="circle" size="tiny" color={status.color} data-testid={TEST_IDS.APP.POPUP} />
        </Icon.Group>
      }
    />
  );
};

PopUp.propTypes = {
  status: PropTypes.object,
};

export default PopUp;
