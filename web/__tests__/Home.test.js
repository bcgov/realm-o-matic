import React from 'react';
import 'jest-dom/extend-expect';
import { render } from 'react-testing-library';
import { BrowserRouter as Router } from 'react-router-dom';
import { TEST_IDS } from '../src/constants/ui';
import { Home } from '../src/containers/Home';
import { ACCESS_CONTROL } from '../src/constants/auth';

describe('Home Component', () => {
  const REQUESTS = [
    {
      number: '123',
      realmName: 'realm 1',
      state: 'open',
      prContent: {
        realmId: 'fewgfw123',
        requester: {
          email: '1@email.com',
        },
      },
    },
    {
      number: '345',
      realmName: 'realm 2',
      state: 'closed',
      prContent: {
        realmId: 'fewgfw345',
        requester: {
          email: '1@email.com',
        },
      },
    },
    {
      number: '777',
      realmName: 'realm 3',
      state: 'open',
      prContent: {
        realmId: 'fewgfw777',
        requester: {
          email: '1@email.com',
        },
      },
    },
  ];

  const AUTH_PROPS_0 = {
    isAuthenticated: true,
    userInfo: {
      email: '123@email.com',
    },
    userId: '123',
    errorMessage: null,
    authCode: ACCESS_CONTROL.REVIEWER_ROLE,
  };

  const AUTH_PROPS_1 = {
    isAuthenticated: true,
    userInfo: {
      email: '123@email.com',
    },
    userId: '123',
    errorMessage: null,
    authCode: ACCESS_CONTROL.REQUESTER_ROLE,
  };

  const AUTH_PROPS_3 = {
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

  it.skip('blocks when not authorized', () => {
    const { getByTestId } = render(
      <Router>
        <Home {...{ ...AUTH_PROPS_3, ...REQUEST_PROPS_0 }} />
      </Router>
    );

    expect(getByTestId(TEST_IDS.AUTH.MODAL)).not.toBeNull();
  });

  it('has link to create a new request for reviewer', () => {
    const { getByTestId, container } = render(
      <Router>
        <Home {...{ ...AUTH_PROPS_0, ...REQUEST_PROPS_1 }} />
      </Router>
    );

    expect(getByTestId(TEST_IDS.APP.NEW_REQUEST)).toHaveTextContent('New Request');
    expect(container.firstChild).toMatchSnapshot();
  });

  it('has link to create a new request for Requester when no open record exists', () => {
    const { getByTestId, container } = render(
      <Router>
        <Home {...{ ...AUTH_PROPS_1, ...REQUEST_PROPS_2 }} />
      </Router>
    );

    expect(getByTestId(TEST_IDS.APP.NEW_REQUEST)).toHaveTextContent('New Request');
    expect(container.firstChild).toMatchSnapshot();
  });

  it('hide the link to create a new request for Requester when open record exists', () => {
    const { getByTestId, container } = render(
      <Router>
        <Home {...{ ...AUTH_PROPS_1, ...REQUEST_PROPS_1 }} />
      </Router>
    );

    expect(getByTestId(TEST_IDS.APP.HIDDEN_NEW_REQUEST)).toHaveTextContent(
      'You cannot create more requests until the current request is close.'
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  // TODO: create test for RequestList
  it('displays in different request list cases', () => {
    // loading records:
    const { getByTestId, rerender } = render(
      <Router>
        <Home {...{ ...AUTH_PROPS_0, ...REQUEST_PROPS_0 }} />
      </Router>
    );

    expect(getByTestId(TEST_IDS.APP.LOADER)).not.toBeNull();

    // show list of records:
    rerender(
      <Router>
        <Home {...{ ...AUTH_PROPS_0, ...REQUEST_PROPS_1 }} />
      </Router>
    );

    expect(getByTestId(TEST_IDS.REQUEST.FORM_LIST)).not.toBeNull();

    // show message saying no records found:
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
