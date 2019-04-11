import React from 'react';
import { render, cleanup, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { App } from '../src/components/App';
import { TEST_IDS } from '../src/constants';

afterEach(cleanup);

describe('App Component', () => {
  const defaultProps = {
    isAuthenticated: true,
    email: '123@email.com',
    userId: '123',
    errorMessage: null,
    idps: null,
    getIdpsStarted: false,
    getIdps: () => {},
  };

  it('renders without crashing', () => {
    const { getByText, getByTestId, container } = render(<App />);

    getByText('Welcome!');
    expect(getByTestId(TEST_IDS.APP.LOGIG)).toHaveTextContent('sso login');
    expect(container.firstChild).toMatchSnapshot();
  });

  it('displays after logged in', () => {
    const { getByTestId, container } = render(<App {...defaultProps} />);

    expect(getByTestId(TEST_IDS.APP.GET_IDPS)).toHaveTextContent('get idps');
    expect(container.firstChild).toMatchSnapshot();
  });

  it('provide list of idps', async () => {
    const { getByText, getByTestId, container, rerender } = render(<App {...defaultProps} />);

    expect(getByTestId(TEST_IDS.APP.GET_IDPS)).toHaveTextContent('get idps');

    fireEvent.click(getByText('get idps'));

    rerender(<App {...{ idps: ['abc', 'def'] }} />);

    getByText('abc');
    getByText('def');
    expect(container.firstChild).toMatchSnapshot();
  });
});
