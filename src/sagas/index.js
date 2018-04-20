import { all, fork } from 'redux-saga/effects';

import appSagas from '../modules/app/saga';
import userSagas from '../modules/user/saga';

const sagas = [
  ...appSagas,
  ...userSagas,
];

/*
 * The entry point for all the sagas used in this application.
 */
export default function* root() {
  yield all(sagas.map(saga => fork(saga)));
}
