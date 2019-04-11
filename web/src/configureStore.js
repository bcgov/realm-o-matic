// https://redux.js.org/recipes/configuring-your-store

import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './reducers';

// https://github.com/zalmoxisus/redux-devtools-extension#11-basic-store
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () => {
  const middleware = [thunk];
  if (process.env.NODE_ENV !== 'production') {
    middleware.push(logger);
  }

  return createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)));
};

export default configureStore;
