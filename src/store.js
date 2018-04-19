// @flow
import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import app from './modules/app/reducer';

export const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({
    app,
  }),
  applyMiddleware(sagaMiddleware)
);

export default store;
