import React, { Component } from 'react';
import { APP_INFO } from '../constants/ui';

export class Restricted extends Component {
  static displayName = '[Component LoginHint]';

  render() {
    return (
      <div>
        <h1>You do not have the correct permission to request a realm</h1>
        <p>
          Please contact the DevHub team for access <a href={APP_INFO.CONTACT_LINK}>here</a>.
        </p>
      </div>
    );
  }
}
