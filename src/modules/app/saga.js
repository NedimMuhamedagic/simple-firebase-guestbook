// @flow
import type { Saga } from 'redux-saga';
import {
  call,
  takeLatest,
} from 'redux-saga/effects';

import { APP } from './actions';

function* watchAppInit(): Generator<*, *, *> {
  yield takeLatest(APP.INIT, onAppInit);
}

function* onAppInit({ payload }: { payload: boolean }): Saga<void> {
  if (payload === true) {
    yield call(connectToFirebase);
  }
}

function* connectToFirebase(): Generator<*, *, *> {
  console.log( 'App init' ); // eslint-disable-line
}

export default [
  watchAppInit,
];
