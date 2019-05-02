import React from 'react';
import { render } from 'react-testing-library';
import { App } from '../src/components/App';

jest.mock('../src/components/UI/Layout.js', () => () => <div />);

describe('App Component', () => {
  const defaultProps = {
    authentication: {
      isAuthenticated: true,
    },
  };

  it('renders without crashing', () => {
    const { container } = render(<App {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });
});
