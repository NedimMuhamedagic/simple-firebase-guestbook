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
  take,
  takeLatest,
} from 'redux-saga/effects';

import { todoDB, updateRootDB } from '../../utils/firebase';
import { TODO, todo as todoActions } from './actions';
import { APP } from '../app/actions';
import { BUFFER_SLIDING_AMT } from '../../utils/constants';

export const todoListeners = {};

function* watchAddTodo(): Generator<*, *, *> {
  yield takeLatest(TODO.ADD_TODO, onAddTodo);
}

function* watchFetchTodos(): Generator<*, *, *> {
  yield takeLatest(APP.INIT, getTodosAndCreateListeners);
}

function* onAddTodo({ payload }: { payload: string }): Saga<void> {
  const newTodoKey = todoDB.getNextKey();
  const newTodo = {
    content: payload,
    timestamp: Date.now(),
  };

  const updates = {
    [`todos/${ newTodoKey }`]: newTodo,
  };
  yield call(updateRootDB, { args: updates });
  yield put(todoActions.clearFormField());
}

function* getTodosAndCreateListeners(): any {
  // shouldCallOnFetchSuccess = true;

  // TODO: [@nmuhamedagic]:
  // I'm currently limiting this to 100 todos and
  // should probably add some sort of way to get
  // all todos
  const todos = yield todoDB.last(100);

  if (todos) {
    const todoList = Object.keys(todos);
    for (let i = 0; i < todoList.length; i++) {
      yield fork(createTodoListener, todoList[i]);
    }
  }

  const channel = yield call(createTodoListeners);

  try {
    while (true) {
      const { meta, payload: { key: todoId } } = yield take(channel);
      if (meta === 'add') {
        yield fork(createTodoListener, todoId);
      } else if (meta === 'remove') {
        // yield put(todoActions.onDeleteSuccess(todoId));
      }
    }
  } finally {
    if (yield cancelled()) {
      channel && channel.close();
    }
  }
}

function createTodoListeners(): any {
  return eventChannel(
    (emitter: any): any =>
      todoDB.createListeners(
        {
          startAt: 0,
        },
        emitter
      ),
    buffers.sliding(BUFFER_SLIDING_AMT)
  );
}

export function* createTodoListener(
  todoId: string
): any {
  const channel = eventChannel(
    (emitter: any): any => todoDB.watch(todoId, emitter),
    buffers.sliding(BUFFER_SLIDING_AMT)
  );
  todoListeners[todoId] = channel;

  try {
    while (true) {
      const { payload } = yield take(channel);
      yield put(todoActions.setTodo( payload ));
    }
  } finally {
    if (yield cancelled()) {
      channel && channel.close();
      todoListeners[todoId] = null;
    }
  }
}


export default [
  watchAddTodo,
  watchFetchTodos,
];
