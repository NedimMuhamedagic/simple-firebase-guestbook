// @flow
import {
  buffers,
  eventChannel,
  type Saga,
} from 'redux-saga';
import {
  take,
} from 'redux-saga/effects';
import moment from 'moment';

import { fireclass } from '../../firebase';
import { appDB, updateRootDB } from '../../utils/firebase';

import {
  call,
  takeLatest,
} from 'redux-saga/effects';

import { APP } from './actions';

export const BUFFER_SLIDING_AMT = 10;

let channel;
let unixToday = moment()
  .startOf('day')
  .unix();

function* watchAppInit(): Generator<*, *, *> {
  yield takeLatest(APP.INIT, onAppInit);
  yield takeLatest(APP.INIT, fetchSettings);
}

function* onAppInit({ payload }: { payload: boolean }): Saga<void> {
  if (payload === true) {
    yield call(connectToFirebase);
  }
}

function* connectToFirebase(): Generator<*, *, *> {
  const updates = {
    'app/lastLaunch': fireclass.database.ServerValue.TIMESTAMP,
  };
  yield call(updateRootDB, { args: updates });
}

function* fetchSettings(): Generator<*, *, *> {
  const currentToday = moment()
    .startOf('day')
    .unix();

  if (unixToday !== currentToday || !channel) {
    unixToday = currentToday;
    channel && channel.close();

    channel = eventChannel(
      (emitter: any): any =>
        appDB.watchAtProp(
          {
            propName: 'lastLaunch',
          },
          emitter
        ),
      buffers.sliding(BUFFER_SLIDING_AMT)
    );

    while (true) {
      const appData = yield take(channel);
      console.log( appData )
    }
  }
}

export default [
  watchAppInit,
];
