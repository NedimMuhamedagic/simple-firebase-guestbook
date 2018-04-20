// @flow
import { APP,  type AppAction } from './actions';
type State = {
  loaded: boolean,
  values: Object,
  user: string
};

const INITIAL_STATE = {
  loaded: false,
  user: '',
  values: {
    newUser: {
      value: '',
    },
  },
};

export default (state: Object = INITIAL_STATE, action: AppAction): State => {
  switch (action.type) {
  case APP.INIT:
    return {
      ...state,
      loaded: action.payload.loaded,
      user: action.payload.user,
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
  case APP.SET_ASSIGNED_USER:
    return {
      ...state,
      user: action.payload,
    };
  default:
    return state;
  }
};
