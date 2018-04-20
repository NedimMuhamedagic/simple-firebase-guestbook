// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { app as appActions } from '../modules/app/actions';
import { en } from '../strings';

import Users from './Users/index.js';

type AppProps = {
  initApp: Function
};

class App extends Component<AppProps> {
  componentDidMount() {
    this.props.initApp({ loaded: true });
  }

  render(): ?React$Element<any> {
    return (
      <div className="App">
        <div className="App__details">
          <h2>{ en.APP.heading.intro }</h2>
          <h1>{ en.APP.heading.appName }</h1>
          <h2>{ en.APP.heading.postText }</h2>
        </div>
        <div className="App__content">
          <Users />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Function): Object => {
  return {
    initApp: ( status: boolean ): Function => dispatch( appActions.initApp( { loaded: status } ) ),
  };
};

export default connect(null, mapDispatchToProps)(App);
