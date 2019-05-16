import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';
import styled from '@emotion/styled';
import { TEST_IDS } from '../../constants/ui';

const StyledLoader = styled(Loader)`
  font-size: 1rem;
  padding: 0;
`;

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
  authentication: PropTypes.object.isRequired,
};

export default SpinLoader;
