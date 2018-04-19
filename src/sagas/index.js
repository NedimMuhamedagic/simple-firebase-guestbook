import { all, fork } from 'redux-saga/effects';

import appSagas from '../modules/app/saga';
import todoSagas from '../modules/todo/saga';

const sagas = [
  ...appSagas,
  ...todoSagas,
];

/*
 * The entry point for all the sagas used in this application.
 */
export default function* root() {
  yield all(sagas.map(saga => fork(saga)));
}
