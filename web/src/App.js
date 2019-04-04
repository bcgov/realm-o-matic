import React, { Component } from 'react';
import Helmet from 'react-helmet';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Realm-o-Matic</title>
          <meta name="description" content="Self-service App for KeyCloak Realm Provosioning" />
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
