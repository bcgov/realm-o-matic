import React from 'react';
import { render } from 'react-testing-library';
import { App } from '../src/components/App';
import { ACCESS_CONTROL } from '../src/constants/auth';

jest.mock('../src/components/UI/Layout.js', () => () => <div />);

describe('App Component', () => {
  const defaultProps = {
    authentication: {
      isAuthenticated: true,
    },
    authorization: {
      authCode: ACCESS_CONTROL.REVIEWER_ROLE,
    },
    getRequests: {},
    newRequest: {},
  };

  it('renders without crashing', () => {
    const { container } = render(<App {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });
});
