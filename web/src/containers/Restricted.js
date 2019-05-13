import React, { Component } from 'react';

export class Restricted extends Component {
  static displayName = '[Component LoginHint]';

  render() {
    return (
      <div>
        <h1>You do not have the correct permission to request a realm</h1>
        <p>Please contact the DevHub team for access.</p>
      </div>
    );
  }
}
