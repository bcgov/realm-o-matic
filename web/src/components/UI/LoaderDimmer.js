import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Segment } from 'semantic-ui-react';
import { SpinLoader } from './SpinLoader';

/**
 * Page dimmer with a spin loader
 * @param {String} text the text to pass to loader
 * @param {Boolean} idDim if true then show dimmer
 */
export const LoaderDimmer = ({ text, idDim, children }) => {
  return (
    <Segment>
      <Dimmer active={idDim} page blurring="true">
        <SpinLoader text={text} />
      </Dimmer>
      {children}
    </Segment>
  );
};

LoaderDimmer.propTypes = {
  text: PropTypes.string,
  idDim: PropTypes.bool,
  children: PropTypes.node,
};

export default LoaderDimmer;
