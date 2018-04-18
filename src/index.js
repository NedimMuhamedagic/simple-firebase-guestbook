// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const addNumbers = (numbers: Array<number>): number => {
  return 2;
}

addNumbers(1, 2, '3');

ReactDOM.render(
  <App />,
  (document.getElementById('root'): any)
  // TODO: [@NedimMuhamedagic]:
  // Add proper checkup to make sure an element
  // with id 'root' exists
);
registerServiceWorker();
