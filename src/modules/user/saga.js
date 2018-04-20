// @flow
import {
  buffers,
  eventChannel,
  type Saga,
} from 'redux-saga';

import {
  call,
  cancelled,
  fork,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';

import { userDB, updateRootDB } from '../../utils/firebase';
import { USER, user as userActions } from './actions';
import { app as appActions } from '../app/actions';
import { APP } from '../app/actions';
import { BUFFER_SLIDING_AMT, LOCAL_STORAGE_KEY } from '../../utils/constants';

export const userListeners = {};

const getUsers = (state: Object): Object => state.userState.users;

function* watchAddUser(): Generator<*, *, *> {
  yield takeLatest(USER.ADD_USER, onAddUser);
}

function* watchFetchUsers(): Generator<*, *, *> {
  yield takeLatest(APP.INIT, getUsersAndCreateListeners);
}

function* watchUpdateUser(): Generator<*, *, *> {
  yield takeLatest(USER.UPDATE_USER, onUpdateUser);
}

function* watchDeleteUser(): Generator<*, *, *> {
  yield takeLatest(USER.DELETE_USER, onDeleteUser);
}

function* onAddUser({ payload }: { payload: string }): Saga<void> {
  const newUserKey = userDB.getNextKey();
  const newUser = {
    name: payload,
    key: newUserKey,
    timestamp: Date.now(),
  };

  const updates = {
    [`users/${ newUserKey }`]: newUser,
  };
  yield call(updateRootDB, { args: updates });
  yield put(appActions.clearFormField('newUser'));
  localStorage.setItem(LOCAL_STORAGE_KEY, newUserKey);
  yield put(appActions.setAssignedUser(newUserKey));
}

function* getUsersAndCreateListeners(): any {
  // TODO: [@nmuhamedagic]:
  // I'm currently limiting this to 100 users and
  // should probably add some sort of way to get
  // all users
  const users = yield userDB.last(100);

  if (users) {
    const userList = Object.keys(users);
    for (let i = 0; i < userList.length; i++) {
      yield fork(createUserListener, userList[i]);
    }
  }

  const channel = yield call(createUserListeners);

  try {
    while (true) {
      const { meta, payload: { key: userId } } = yield take(channel);
      if (meta === 'add') {
        yield fork(createUserListener, userId);
      } else if (meta === 'remove') {
        const savedUserId = localStorage.getItem(LOCAL_STORAGE_KEY);
        if ( userId === savedUserId ) {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          yield put(appActions.setAssignedUser(''));
        }
        yield put(userActions.onDeleteSuccess(userId));
      }
    }
  } finally {
    if (yield cancelled()) {
      channel && channel.close();
    }
  }
}

function createUserListeners(): any {
  return eventChannel(
    (emitter: any): any =>
      userDB.createListeners(
        {
          startAt: 0,
        },
        emitter
      ),
    buffers.sliding(BUFFER_SLIDING_AMT)
  );
}

export function* createUserListener(
  userId: string
): any {
  const channel = eventChannel(
    (emitter: any): any => userDB.watch(userId, emitter),
    buffers.sliding(BUFFER_SLIDING_AMT)
  );
  userListeners[userId] = channel;

  try {
    while (true) {
      const { payload } = yield take(channel);
      if ( payload ) {
        yield put(userActions.setUser( payload ));
      }
    }
  } finally {
    if (yield cancelled()) {
      channel && channel.close();
      userListeners[userId] = null;
    }
  }
}

function* onUpdateUser({ payload }: { payload: Object }): any {
  const { userId, name } = payload;
  const users = yield select(getUsers);
  const currentUser = users[userId];
  if ( !!name ) currentUser.name = name;
  if ( currentUser ) {
    const updates = {
      [`${userId}`]: currentUser,
    };
    userDB.update(null, updates);
  }
}

function* onDeleteUser({ payload }: { payload: Object }): any {
  if ( payload ) {
    yield userDB.delete(payload);
  }
}

export default [
  watchAddUser,
  watchFetchUsers,
  watchUpdateUser,
  watchDeleteUser,
];
