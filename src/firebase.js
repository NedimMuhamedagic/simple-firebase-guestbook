/* eslint no-undef: 0 */

import firebase from 'firebase';

// TODO: [@NedimMuhamedagic] Move this to an .env file
const config = {
  apiKey: 'AIzaSyAVWv-PdImLKtzn_jadQZJmdwIfBP2mK3g',
  authDomain: 'simple-todo-79bec.firebaseapp.com',
  databaseURL: 'https://simple-todo-79bec.firebaseio.com',
  projectId: 'simple-todo-79bec',
  storageBucket: 'simple-todo-79bec.appspot.com',
  messagingSenderId: '527419872192',
};

const instance = firebase.initializeApp(config);

export default instance;

export const fireclass = firebase;
