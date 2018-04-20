// @flow

export const USER = {
  ADD_USER: 'ADD_USER',
  SET_USER: 'SET_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  DELETE_SUCCESS: 'DELETE_SUCCESS',
};

export type UserAction =
  | {
      type: typeof USER.ADD_USER
    }
  | {
      type: typeof USER.SET_USER,
      payload: Object
    }
  | {
      type: typeof USER.UPDATE_USER,
      payload: Object
    }
  | {
      type: typeof USER.DELETE_USER,
      payload: string
    }
  | {
      type: typeof USER.DELETE_SUCCESS,
      payload: string
    };

export const user = {
  addUser: (name: string): UserAction => ({
    type: USER.ADD_USER,
    payload: name,
  }),
  setUser: (currentUser: Object): UserAction => ({
    type: USER.SET_USER,
    payload: currentUser,
  }),
  updateUser: (currentUser: Object): UserAction => ({
    type: USER.UPDATE_USER,
    payload: currentUser,
  }),
  deleteUser: (userId: string): UserAction => ({
    type: USER.DELETE_USER,
    payload: userId,
  }),
  onDeleteSuccess: (userId: string): UserAction => ({
    type: USER.DELETE_SUCCESS,
    payload: userId,
  }),
};
