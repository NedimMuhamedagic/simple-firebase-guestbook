// @flow
import { TODO,  type TodoAction } from './actions';
type State = {
  value: string
};

const INITIAL_STATE = {
  value: '',
  todos: {},
};

export default (state: Object = INITIAL_STATE, action: TodoAction): State => {
  switch (action.type) {
  case TODO.SET_FORM_FIELD:
    return {
      ...state,
      value: action.payload,
    };
  case TODO.CLEAR_FORM_FIELD:
    return {
      ...state,
      value: '',
    };
  case TODO.SET_TODO:
    return {
      ...state,
      todos: {
        ...state.todos,
        [action.payload.key]: action.payload,
      },
    };
  default:
    return state;
  }
};
