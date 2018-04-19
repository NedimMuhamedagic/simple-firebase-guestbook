// @flow

export const TODO = {
  ADD_TODO: 'ADD_TODO',
  SET_TODO: 'SET_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  DELETE_TODO: 'DELETE_TODO',
  DELETE_SUCCESS: 'DELETE_SUCCESS',
};

export type TodoAction =
  | {
      type: typeof TODO.ADD_TODO
    }
  | {
      type: typeof TODO.SET_TODO,
      payload: Object
    }
  | {
      type: typeof TODO.UPDATE_TODO,
      payload: Object
    }
  | {
      type: typeof TODO.DELETE_TODO,
      payload: string
    }
  | {
      type: typeof TODO.DELETE_SUCCESS,
      payload: string
    };

export const todo = {
  addTodo: (content: string): TodoAction => ({
    type: TODO.ADD_TODO,
    payload: content,
  }),
  setTodo: (currentTodo: Object): TodoAction => ({
    type: TODO.SET_TODO,
    payload: currentTodo,
  }),
  updateTodo: (currentTodo: Object): TodoAction => ({
    type: TODO.UPDATE_TODO,
    payload: currentTodo,
  }),
  deleteTodo: (todoId: string): TodoAction => ({
    type: TODO.DELETE_TODO,
    payload: todoId,
  }),
  onDeleteSuccess: (todoId: string): TodoAction => ({
    type: TODO.DELETE_SUCCESS,
    payload: todoId,
  }),
};
