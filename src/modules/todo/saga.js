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

import { todoDB, updateRootDB } from '../../utils/firebase';
import { TODO, todo as todoActions } from './actions';
import { app as appActions } from '../app/actions';
import { APP } from '../app/actions';
import { BUFFER_SLIDING_AMT } from '../../utils/constants';

export const todoListeners = {};

const getTodos = (state: Object): Object => state.todoState.todos;

function* watchAddTodo(): Generator<*, *, *> {
  yield takeLatest(TODO.ADD_TODO, onAddTodo);
}

function* watchFetchTodos(): Generator<*, *, *> {
  yield takeLatest(APP.INIT, getTodosAndCreateListeners);
}

function* watchUpdateTodo(): Generator<*, *, *> {
  yield takeLatest(TODO.UPDATE_TODO, onUpdateTodo);
}

function* watchDeleteTodo(): Generator<*, *, *> {
  yield takeLatest(TODO.DELETE_TODO, onDeleteTodo);
}

function* onAddTodo({ payload }: { payload: string }): Saga<void> {
  const newTodoKey = todoDB.getNextKey();
  const newTodo = {
    done: false,
    content: payload,
    timestamp: Date.now(),
  };

  const updates = {
    [`todos/${ newTodoKey }`]: newTodo,
  };
  yield call(updateRootDB, { args: updates });
  yield put(appActions.clearFormField('newTodo'));
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
        yield put(todoActions.onDeleteSuccess(todoId));
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
      if ( payload ) {
        yield put(todoActions.setTodo( payload ));
      }
    }
  } finally {
    if (yield cancelled()) {
      channel && channel.close();
      todoListeners[todoId] = null;
    }
  }
}

function* onUpdateTodo({ payload }: { payload: Object }): any {
  const { todoId, content, done } = payload;
  const todos = yield select(getTodos);
  const currentTodo = todos[todoId];
  if ( !!content ) currentTodo.content = content;
  if ( typeof done !== 'undefined' ) currentTodo.done = done;
  if ( currentTodo ) {
    const updates = {
      [`${todoId}`]: currentTodo,
    };
    todoDB.update(null, updates);
  }
}

function* onDeleteTodo({ payload }: { payload: Object }): any {
  if ( payload ) {
    todoDB.delete(payload);
  }
}

export default [
  watchAddTodo,
  watchFetchTodos,
  watchUpdateTodo,
  watchDeleteTodo,
];
