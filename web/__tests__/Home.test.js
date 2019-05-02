import React from 'react';
import 'jest-dom/extend-expect';
import { render, fireEvent } from 'react-testing-library';
import { TEST_IDS } from '../src/constants';
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

  it('provide list of idps', async () => {
    const { getByText, getByTestId, container, rerender } = render(<Home {...defaultProps} />);

    expect(getByTestId(TEST_IDS.APP.GET_IDPS)).toHaveTextContent('get idps');

    fireEvent.click(getByText('get idps'));

    rerender(<Home {...{ idps: ['abc', 'def'] }} />);

    getByText('abc');
    getByText('def');
    expect(container.firstChild).toMatchSnapshot();
  });
});
