// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';

import store, { sagaMiddleware } from './store';
import rootSaga from './sagas';

import App from './components/App';

sagaMiddleware.run(rootSaga);

class UserList extends Component<any> { // eslint-disable-line
  render(): Store {
    return (
      <Provider store={ store }>
        <App />
      </Provider>
    );
  }
}
export default UserList;
