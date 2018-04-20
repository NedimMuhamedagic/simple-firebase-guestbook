// @flow
import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import appState from './modules/app/reducer';
import userState from './modules/user/reducer';

export const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({
    appState,
    userState,
  }),
  applyMiddleware(sagaMiddleware)
);

export default store;
