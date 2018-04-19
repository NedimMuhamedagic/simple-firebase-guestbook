// @flow
import { APP,  type AppAction } from './actions';
type State = {
  loaded: boolean
};

const INITIAL_STATE = {
  loaded: false,
};

export default (state: Object = INITIAL_STATE, action: AppAction): State => {
  switch (action.type) {
  case APP.INIT:
    return {
      ...state,
      loaded: action.payload,
    };
  default:
    return state;
  }
};
