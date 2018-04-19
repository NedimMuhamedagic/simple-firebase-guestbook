// @flow

export const TODO = {
  SET_FORM_FIELD: 'SET_FORM_FIELD',
  CLEAR_FORM_FIELD: 'CLEAR_FORM_FIELD',
  ADD_TODO: 'ADD_TODO',
  SET_TODO: 'SET_TODO',
};

export type TodoAction =
  | {
      type: typeof TODO.ADD_TODO
    }
  | {
      type: typeof TODO.SET_FORM_FIELD,
      payload: string
    }
  | {
      type: typeof TODO.CLEAR_FORM_FIELD
    }
  | {
      type: typeof TODO.SET_TODO,
      payload: Object
    };

export const todo = {
  addTodo: (content: string): TodoAction => ({
    type: TODO.ADD_TODO,
    payload: content,
  }),
  clearFormField: (): TodoAction => ({
    type: TODO.CLEAR_FORM_FIELD,
  }),
  setFormField: (value: string): TodoAction => ({
    type: TODO.SET_FORM_FIELD,
    payload: value,
  }),
  setTodo: (currentTodo: Object): TodoAction => ({
    type: TODO.SET_TODO,
    payload: currentTodo,
  }),
};
