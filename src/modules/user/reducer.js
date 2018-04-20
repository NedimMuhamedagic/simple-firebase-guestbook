// @flow
import { USER,  type UserAction } from './actions';
type State = {
  users: Object
};

const INITIAL_STATE = {
  users: {},
};

export default (state: Object = INITIAL_STATE, action: UserAction): State => {
  switch (action.type) {
  case USER.SET_USER:
    return {
      ...state,
      users: {
        ...state.users,
        [action.payload.key]: action.payload,
      },
    };
  case USER.DELETE_SUCCESS:
    const { [action.payload]: _deletedUser, ...otherUsers } = state.users;
    return {
      ...state,
      users: otherUsers,
    };
  default:
    return state;
  }
};
