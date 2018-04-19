// @flow
import { TODO,  type TodoAction } from './actions';
type State = {
  todos: Object
};

const INITIAL_STATE = {
  todos: {},
};

export default (state: Object = INITIAL_STATE, action: TodoAction): State => {
  switch (action.type) {
  case TODO.SET_TODO:
    return {
      ...state,
      todos: {
        ...state.todos,
        [action.payload.key]: action.payload,
      },
    };
  case TODO.DELETE_SUCCESS:
    const { [action.payload]: _deletedTodo, ...otherTodos } = state.todos;
    return {
      ...state,
      todos: otherTodos,
    };
  default:
    return state;
  }
};
