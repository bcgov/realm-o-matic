import React, { Component } from 'react';
import Helmet from 'react-helmet';
import logo from '../assets/logo.svg';
import styles from './App.module.css';

class App extends Component {
  render() {
    return (
      <div className={styles.app}>
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
        <header className={styles.appHeader}>
          <img src={logo} className={styles.appLogo} alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className={styles.appLink}
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
