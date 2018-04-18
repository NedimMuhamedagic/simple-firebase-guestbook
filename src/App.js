// @flow
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

type AppProps = {};

class App extends Component<AppProps> {
  render(): ?React$Element<any> {
    return (
      <div className="App">
        <header className="App-header">
          <img
            alt="logo"
            className="App-logo"
            src={ logo } />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
