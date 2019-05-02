import React from 'react';
import { render } from 'react-testing-library';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../src/components/UI/Header';
import { TEST_IDS } from '../src/constants';

describe('Header Component', () => {
  const authed = {
    isAuthenticated: true,
  };

  it('renders without crashing', () => {
    const { container, getByTestId } = render(
      <BrowserRouter>
        <Header authentication={authed} />
      </BrowserRouter>
    );

    expect(getByTestId(TEST_IDS.APP.LOGIN)).toHaveTextContent('Logout');
    getByTestId(TEST_IDS.APP.LOGO);
    expect(container).toMatchSnapshot();
  });
});
