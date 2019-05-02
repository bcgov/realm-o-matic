import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import { BrowserRouter } from 'react-router-dom';
// eslint-disable-next-line
import Portal from 'semantic-ui-react/dist/commonjs/addons/Portal/Portal';
import { AuthModal } from '../src/components/Auth/AuthModal';
import { TEST_IDS } from '../src/constants';

jest.mock('semantic-ui-react/dist/commonjs/addons/Portal/Portal', () => ({ children }) => children);

describe('AuthModal Component', () => {
  it('renders without crashing', () => {
    const { container, getByText, getByTestId } = render(
      <BrowserRouter>
        <AuthModal isAuthenticated={false} />
      </BrowserRouter>
    );

    getByText('Login first');
    expect(getByTestId(TEST_IDS.APP.GITHUB_LOGIN)).toHaveTextContent('GitHub');
    expect(getByTestId(TEST_IDS.APP.IDIR_LOGIN)).toHaveTextContent('IDIR');
    expect(container.firstChild).toMatchSnapshot();
  });

  it('redirect when clicking on the idp buttons', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <AuthModal isAuthenticated={false} />
      </BrowserRouter>
    );
    const githubButton = getByTestId(TEST_IDS.APP.GITHUB_LOGIN);

    fireEvent.click(githubButton);
    expect(window.location.href).toContain('/login/github');
  });
});
