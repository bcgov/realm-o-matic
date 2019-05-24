import React, { Component } from 'react';
import { render, cleanup } from 'react-testing-library';
import { BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../src/components/Auth';
import { ACCESS_CONTROL } from '../src/constants/auth';

// jest.mock('../src/containers/Auth.js', () => <h1>123</h1>);

afterEach(cleanup);

describe('ProtectedRoute Component', () => {
  class TestComponent extends Component {
    render() {
      return <h1>test content</h1>;
    }
  }

  it('render content when user has correct role', () => {
    const { container } = render(
      <BrowserRouter>
        <ProtectedRoute component={TestComponent} authCode={ACCESS_CONTROL.REQUESTER_ROLE} />
      </BrowserRouter>
    );
    expect(container).toMatchSnapshot();
  });

  // Issue with testing on redirec: Maximum update depth exceeded.
  it.skip('redirects without correct role', () => {
    const { container } = render(
      <BrowserRouter>
        <ProtectedRoute component={TestComponent} authCode={ACCESS_CONTROL.NO_ROLE} />
      </BrowserRouter>
    );
    expect(container).toMatchSnapshot();
  });
});
