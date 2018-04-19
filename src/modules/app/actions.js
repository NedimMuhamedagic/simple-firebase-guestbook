// @flow

export const APP = {
  INIT: 'APP_INIT',
};

export type AppAction =
  | { type: typeof APP.INIT, payload: boolean };

export const app = {
  initApp: (payload: boolean): AppAction => ({
    type: APP.INIT,
    payload,
  }),
};
