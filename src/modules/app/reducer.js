// @flow
import { APP,  type AppAction } from './actions';
type State = {
  loaded: boolean,
  values: Object
};

const INITIAL_STATE = {
  loaded: false,
  values: {
    newTodo: {
      value: '',
    },
  },
};

export default (state: Object = INITIAL_STATE, action: AppAction): State => {
  switch (action.type) {
  case APP.INIT:
    return {
      ...state,
      loaded: action.payload,
    };
  case APP.SET_FORM_FIELD:
    return {
      ...state,
      values: {
        ...state.values,
        [action.payload.fieldId]: {
          value: action.payload.value,
        },
      },
    };
  case APP.CLEAR_FORM_FIELD:
    return {
      ...state,
      values: {
        ...state.values,
        [action.payload]: {
          value: '',
        },
      },
    };
  default:
    return state;
  }
};
