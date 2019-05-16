import React from 'react';
import { LoginRoute } from '../src/components/Auth/LoginRoute';

describe('LoginRoute Component', () => {
  const paraWithIdp = {
    match: {
      params: {
        idp: 'testIdp',
      },
    },
  };

  const paraWithoutIdp = {
    match: {
      params: {},
    },
  };

  beforeEach(() => {
    window.location.assign = jest.fn();
  });

  afterEach(() => {
    window.location.assign.mockRestore();
  });

  it('sets the window location without idp', () => {
    expect(window.location.assign).not.toHaveBeenCalled();
    const redirect = LoginRoute(paraWithoutIdp);
    expect(redirect).toEqual(<div>Your are being redirected to KeyCloak login page...</div>);
    expect(window.location.assign).toBeCalledWith('LOGINURI');
  });

  it('sets the window location with idp', () => {
    expect(window.location.assign).not.toHaveBeenCalled();
    const redirect2 = LoginRoute(paraWithIdp);
    expect(redirect2).toEqual(<div>Your are being redirected to KeyCloak login page...</div>);
    expect(window.location.assign).toBeCalledWith('LOGINURI/testIdp');
  });
});
