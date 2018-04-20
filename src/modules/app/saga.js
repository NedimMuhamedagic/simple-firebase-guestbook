// @flow
import {
  type Saga,
} from 'redux-saga';
import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';

import { fireclass } from '../../firebase';
import { updateRootDB } from '../../utils/firebase';
import { LOCAL_STORAGE_KEY } from '../../utils/constants';

import { APP, app as appActions } from './actions';

function* watchAppInit(): Generator<*, *, *> {
  yield takeLatest(APP.INIT, onAppInit);
}

function* onAppInit({ payload }: { payload: Object }): Saga<void> {
  if (payload.loaded === true) {
    yield call(connectToFirebase);
    const assignedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (assignedUser) {
      yield put(appActions.setAssignedUser(assignedUser));
    }
  }
}

function* connectToFirebase(): Generator<*, *, *> {
  const updates = {
    'app/lastLaunch': fireclass.database.ServerValue.TIMESTAMP,
  };
  yield call(updateRootDB, { args: updates });
}

export default [
  watchAppInit,
];
