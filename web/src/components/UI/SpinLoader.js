import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';
import styled from '@emotion/styled';
import { TEST_IDS } from '../../constants/ui';

const StyledLoader = styled(Loader)`
  font-size: 15px !important;
  padding: 0;
`;

/**
 * Spin loader
 * @param {String} text the loading text to display
 */
export const SpinLoader = ({ text }) => {
  return (
    <StyledLoader
      active
      size="small"
      inline="centered"
      content={text}
      data-testid={TEST_IDS.APP.LOADER}
    />
  );
};

SpinLoader.propTypes = {
  text: PropTypes.string,
};

export default SpinLoader;
