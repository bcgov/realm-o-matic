// eslint-disable-next-line
const { ImplicitAuthManager } = jest.requireActual('@bcgov/common-web-utils');

class ImplicitAuthManagerMocked {
  constructor() {
    this.config = {
      baseURL: 'https://test.com',
      realmName: 'testRealm',
      clientId: 'testClient',
      kcIDPHint: null,
    };
  }
  // eslint-disable-next-line
  getSSOLoginURI() {
    return this.config.kcIDPHint ? `LOGINURI/${this.config.kcIDPHint}` : 'LOGINURI';
  }
  // eslint-disable-next-line
  getSSOLogoutURI() {
    return 'LOGOUTURI';
  }
  // eslint-disable-next-line
  handleOnPageLoad() {
    return undefined;
  }

  // eslint-disable-next-line
  registerHooks() {
    return undefined;
  }
}

module.exports = { ImplicitAuthManager: ImplicitAuthManagerMocked };
