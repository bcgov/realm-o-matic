const axios = {
  get: jest.fn(() => new Promise(() => {})),
  create: () => axios,
  defaults: {
    adapter: {},
  },
  interceptors: {
    request: {
      use: () => {},
    },
  },
};

export default axios;
