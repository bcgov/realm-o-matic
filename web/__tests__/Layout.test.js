import React from 'react';
import { render } from 'react-testing-library';
import { Layout } from '../src/components/UI/Layout';

jest.mock('../src/components/UI/Header.js', () => () => <div />);
jest.mock('../src/components/UI/Footer.js', () => () => <div />);

describe('Layout Component', () => {
  const children = <div />;
  const authed = {
    isAuthenticated: true,
  };

  it('renders without crashing', () => {
    const { container } = render(<Layout authentication={authed}>{children}</Layout>);
    expect(container).toMatchSnapshot();
  });
});
