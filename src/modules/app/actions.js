// @flow

export const APP = {
  INIT: 'APP_INIT',
  SET_FORM_FIELD: 'SET_FORM_FIELD',
  CLEAR_FORM_FIELD: 'CLEAR_FORM_FIELD',
  SET_ASSIGNED_USER: 'SET_ASSIGNED_USER',
};

export type AppAction =
  | {
    type: typeof APP.INIT,
    payload: Object
    }
  | {
      type: typeof APP.SET_FORM_FIELD,
      payload: Object
    }
  | {
      type: typeof APP.CLEAR_FORM_FIELD,
      payload: string
    }
  | {
      type: typeof APP.SET_ASSIGNED_USER,
      payload: string
    };

export const app = {
  initApp: (payload: Object): AppAction => ({
    type: APP.INIT,
    payload,
  }),
  clearFormField: (fieldId: string): AppAction => ({
    type: APP.CLEAR_FORM_FIELD,
    payload: fieldId,
  }),
  setFormField: (value: string, fieldId: string): AppAction => ({
    type: APP.SET_FORM_FIELD,
    payload: { value, fieldId },
  }),
  setAssignedUser: (value: string): AppAction => ({
    type: APP.SET_ASSIGNED_USER,
    payload: value,
  }),
};
