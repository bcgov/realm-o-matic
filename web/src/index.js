import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import 'semantic-ui/dist/semantic.min.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
// eslint-disable-next-line
import typography from './utils/typography';
import configureStore from './configureStore';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Realm-o-Matic</title>
      <meta name="description" content="Self-service KeyCloak Realm Provosioner" />
      <meta name="twitter:author" content="ShellyXueHan" />
      <meta name="twitter:description" content="Self-service KeyCloak Realm Provosioner" />
      <meta name="og:author" content="ShellyXueHan" />
      <meta name="og:description" content="Self-service KeyCloak Realm Provosioner" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
    </Helmet>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.register();
