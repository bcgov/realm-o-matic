const axios = {
  get: jest.fn(() => new Promise(() => {})),
  create: () => axios,
  defaults: {
    adapter: {},
  },
};

export default axios;
