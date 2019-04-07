import React, { Component } from 'react';
import Helmet from 'react-helmet';
import typography from './utils/typography';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Realm-o-Matic</title>
          <meta name="description" content="Self-service KeyCloak Realm Provosioner" />
          <meta name="twitter:author" content="ShellyXueHan" />
          <meta name="twitter:description" content="Self-service KeyCloak Realm Provosioner"
          />
          <meta name="og:author" content="ShellyXueHan" />
          <meta name="og:description" content="Self-service KeyCloak Realm Provosioner"
          />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        </Helmet>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            hello!!1
          </a>
        </header>
      </div>
    );
  }
}

export default App;
