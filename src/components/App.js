// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { app as appActions } from '../modules/app/actions';

import logo from './logo.svg';
import './App.css';

type AppProps = {
  initApp: Function
};

class App extends Component<AppProps> {
  componentDidMount() {
    this.props.initApp( true );
  }

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

const mapDispatchToProps = (dispatch: Function): Object => {
  return {
    initApp: ( status: boolean ): Function => dispatch( appActions.initApp( status ) ),
  };
};

export default connect(null, mapDispatchToProps)(App);
