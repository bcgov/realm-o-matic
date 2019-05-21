import React from 'react';
import 'jest-dom/extend-expect';
import { render } from 'react-testing-library';
import { BrowserRouter as Router } from 'react-router-dom';
import { TEST_IDS } from '../src/constants/ui';
import { Home } from '../src/containers/Home';

describe('Home Component', () => {
  const REQUESTS = [
    {
      number: '123',
      realm: { displayName: '123' },
      fileName: 'fewgfw123',
      state: 'open',
    },
    {
      number: '345',
      realm: { displayName: '345' },
      fileName: 'fewgfw123',
      state: 'closed',
    },
    {
      number: '777',
      realm: { displayName: '777' },
      fileName: 'fewgfw777',
      state: 'open',
    },
  ];

  const AUTH_PROPS_0 = {
    isAuthenticated: true,
    userInfo: {
      email: '123@email.com',
    },
    userId: '123',
    errorMessage: null,
  };

  const AUTH_PROPS_1 = {
    isAuthenticated: false,
    userInfo: {},
    userId: null,
    errorMessage: null,
  };

  const REQUEST_PROPS_0 = {
    requests: null,
    getRequestsStarted: true,
    errorMessage: null,
    getRequestsAction: () => {},
  };

  const REQUEST_PROPS_1 = {
    requests: REQUESTS,
    getRequestsStarted: false,
    errorMessage: null,
    getRequestsAction: () => {},
  };

  const REQUEST_PROPS_2 = {
    requests: [],
    getRequestsStarted: false,
    errorMessage: null,
    getRequestsAction: () => {},
  };

  it.skip('blocks when not authed', async () => {
    const { getByTestId } = render(
      <Router>
        <Home {...{ ...AUTH_PROPS_1, ...REQUEST_PROPS_0 }} />
      </Router>
    );

    expect(getByTestId(TEST_IDS.AUTH.MODAL)).not.toBeNull();
  });

  it('has link to create a new request', async () => {
    const { getByTestId, container } = render(
      <Router>
        <Home {...{ ...AUTH_PROPS_0, ...REQUEST_PROPS_0 }} />
      </Router>
    );

    expect(getByTestId(TEST_IDS.APP.NEW_REQUEST)).toHaveTextContent('Start Request');
    expect(container.firstChild).toMatchSnapshot();
  });

  it('displays in different request list cases', async () => {
    const { getByTestId, rerender } = render(
      <Router>
        <Home {...{ ...AUTH_PROPS_0, ...REQUEST_PROPS_0 }} />
      </Router>
    );

    expect(getByTestId(TEST_IDS.APP.LOADER)).not.toBeNull();

    rerender(
      <Router>
        <Home {...{ ...AUTH_PROPS_0, ...REQUEST_PROPS_1 }} />
      </Router>
    );

    expect(getByTestId(TEST_IDS.REQUEST.FORM_LIST)).not.toBeNull();

    rerender(
      <Router>
        <Home {...{ ...AUTH_PROPS_0, ...REQUEST_PROPS_2 }} />
      </Router>
    );

    expect(getByTestId(TEST_IDS.APP.EMPTY)).toHaveTextContent(
      'You do not have any realm requests yet, start a new request.'
    );
  });
});
