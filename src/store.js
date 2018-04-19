// @flow
import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import appState from './modules/app/reducer';
import todoState from './modules/todo/reducer';

export const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({
    appState,
    todoState,
  }),
  applyMiddleware(sagaMiddleware)
);

export default store;
