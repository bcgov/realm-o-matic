import React from 'react';
import 'jest-dom/extend-expect';
import { render } from 'react-testing-library';
import { BrowserRouter as Router } from 'react-router-dom';
import { TEST_IDS } from '../src/constants/ui';
import { Home } from '../src/containers/Home';

describe('Home Component', () => {
  const defaultProps = {
    authentication: {
      isAuthenticated: true,
      email: '123@email.com',
      userId: '123',
      errorMessage: null,
    },
    idps: null,
    getIdpsStarted: false,
    getIdps: () => {},
  };

  it('has link to create a new request', async () => {
    const { getByTestId, container } = render(
      <Router>
        <Home {...defaultProps} />
      </Router>
    );

    expect(getByTestId(TEST_IDS.APP.NEW_REQUEST)).toHaveTextContent('Start Request');
    expect(container.firstChild).toMatchSnapshot();
  });
});
